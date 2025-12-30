import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[generate-recipe] ${step}${detailsStr}`);
};

interface RecipeRequest {
  speciesIds: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { speciesIds }: RecipeRequest = await req.json();
    logStep("Received request", { speciesIds });

    if (!speciesIds || speciesIds.length === 0) {
      throw new Error("至少需要选择一种食材");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch species details
    const { data: speciesData, error: speciesError } = await supabase
      .from("species")
      .select("*, cooking_notes(*)")
      .in("id", speciesIds);

    if (speciesError) throw speciesError;
    logStep("Fetched species data", { count: speciesData?.length });

    // Check for toxic species
    const toxicSpecies = speciesData?.filter(s => s.edibility === 'toxic' || s.edibility === 'deadly');
    if (toxicSpecies && toxicSpecies.length > 0) {
      return new Response(
        JSON.stringify({
          error: "dangerous_ingredients",
          message: `检测到有毒/致命物种：${toxicSpecies.map(s => s.name_cn).join('、')}。系统拒绝生成菜谱以保护用户安全。`,
          toxicSpecies: toxicSpecies.map(s => ({ id: s.id, name: s.name_cn, edibility: s.edibility }))
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Prepare prompt for AI
    const ingredientsList = speciesData?.map(s => 
      `${s.name_cn}（${s.name_scientific}）- 食用性：${s.edibility}，特点：${s.description}`
    ).join('\n');

    const existingMethods = speciesData?.map(s => 
      s.cooking_notes?.method || "未知"
    ).join('、');

    const safetyNotes = speciesData?.filter(s => s.cooking_notes?.warning)
      .map(s => `${s.name_cn}：${s.cooking_notes.warning}`)
      .join('\n');

    const prompt = `你是一位专业的菌类烹饪大师。请基于以下食用菌食材，生成一道创意菜谱。

## 食材列表
${ingredientsList}

## 已知烹饪方法参考
${existingMethods}

## 安全注意事项
${safetyNotes || "无特殊警告"}

## 要求
1. 菜名要有创意和吸引力
2. 评估难度等级（beginner/intermediate/advanced/master）
3. 提供详细的分步烹饪步骤（每步包含温度、时长）
4. 特别强调安全关键点（如需长时间烹饪的物种）
5. 估算烹饪总时长（分钟）
6. 建议人数份量

请以JSON格式返回，格式如下：
{
  "title": "菜名",
  "difficulty": "intermediate",
  "cookingTime": 30,
  "servings": 2,
  "description": "简短描述",
  "ingredients": [{"speciesId": "uuid", "quantity": "200克", "isMain": true}],
  "steps": [
    {"stepNumber": 1, "instruction": "步骤描述", "duration": 5, "temperature": "中火"}
  ],
  "safetyWarnings": [
    {"text": "警告内容", "isCritical": true}
  ],
  "safetyLevel": 4
}`;

    // Call SuperunAI
    const apiKey = Deno.env.get("SUPERUN_API_KEY");
    logStep("Calling SuperunAI");
    
    const aiResponse = await fetch("https://gateway.superun.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [{ 
          role: "user", 
          content: prompt 
        }],
        response_format: { type: "json_object" }
      })
    });

    const aiData = await aiResponse.json();
    logStep("AI response received");

    if (!aiData.choices || !aiData.choices[0]) {
      throw new Error("AI 响应格式错误");
    }

    const recipeData = JSON.parse(aiData.choices[0].message.content);
    logStep("Parsed recipe data", { title: recipeData.title });

    // Save to database
    const { data: recipe, error: recipeError } = await supabase
      .from("recipes")
      .insert({
        title: recipeData.title,
        difficulty: recipeData.difficulty,
        cooking_time: recipeData.cookingTime,
        servings: recipeData.servings,
        description: recipeData.description,
        safety_level: recipeData.safetyLevel,
        is_ai_generated: true
      })
      .select()
      .single();

    if (recipeError) throw recipeError;
    logStep("Recipe saved", { id: recipe.id });

    // Save ingredients
    if (recipeData.ingredients && recipeData.ingredients.length > 0) {
      const { error: ingredientsError } = await supabase
        .from("recipe_ingredients")
        .insert(
          recipeData.ingredients.map((ing: any) => ({
            recipe_id: recipe.id,
            species_id: ing.speciesId,
            quantity: ing.quantity,
            is_main_ingredient: ing.isMain
          }))
        );
      if (ingredientsError) throw ingredientsError;
      logStep("Ingredients saved");
    }

    // Save steps
    if (recipeData.steps && recipeData.steps.length > 0) {
      const { error: stepsError } = await supabase
        .from("recipe_steps")
        .insert(
          recipeData.steps.map((step: any) => ({
            recipe_id: recipe.id,
            step_number: step.stepNumber,
            instruction: step.instruction,
            duration: step.duration,
            temperature: step.temperature
          }))
        );
      if (stepsError) throw stepsError;
      logStep("Steps saved");
    }

    // Save safety warnings
    if (recipeData.safetyWarnings && recipeData.safetyWarnings.length > 0) {
      const { error: warningsError } = await supabase
        .from("recipe_safety_warnings")
        .insert(
          recipeData.safetyWarnings.map((warning: any) => ({
            recipe_id: recipe.id,
            warning_text: warning.text,
            is_critical: warning.isCritical
          }))
        );
      if (warningsError) throw warningsError;
      logStep("Warnings saved");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        recipeId: recipe.id,
        message: "菜谱生成成功"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
