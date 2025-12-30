-- Create difficulty level enum
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced', 'master');

-- Create recipes table (AI generated recipes)
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  difficulty difficulty_level NOT NULL DEFAULT 'intermediate',
  cooking_time INTEGER NOT NULL, -- in minutes
  servings INTEGER DEFAULT 2,
  description TEXT,
  is_ai_generated BOOLEAN DEFAULT true,
  safety_level INTEGER DEFAULT 5, -- 1-5, 5 is safest
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create recipe_ingredients junction table (many-to-many)
CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  species_id UUID NOT NULL REFERENCES species(id) ON DELETE CASCADE,
  quantity TEXT, -- e.g., "200克", "适量"
  is_main_ingredient BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(recipe_id, species_id)
);

-- Create recipe_steps table
CREATE TABLE recipe_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  duration INTEGER, -- step duration in minutes
  temperature TEXT, -- e.g., "大火", "中火"
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(recipe_id, step_number)
);

-- Create recipe_safety_warnings table
CREATE TABLE recipe_safety_warnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  warning_text TEXT NOT NULL,
  is_critical BOOLEAN DEFAULT false, -- true for poison prevention keys
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_recipe_favorites (for future user system)
CREATE TABLE user_recipe_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID, -- will link to auth.users later
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(recipe_id, user_id)
);

-- Create indexes
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX idx_recipes_safety_level ON recipes(safety_level);
CREATE INDEX idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ingredients_species ON recipe_ingredients(species_id);
CREATE INDEX idx_recipe_steps_recipe ON recipe_steps(recipe_id);
CREATE INDEX idx_recipe_safety_warnings_recipe ON recipe_safety_warnings(recipe_id);

-- Create updated_at trigger for recipes
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE recipes IS 'AI生成的菜谱表';
COMMENT ON TABLE recipe_ingredients IS '菜谱食材关联表';
COMMENT ON TABLE recipe_steps IS '烹饪步骤表';
COMMENT ON TABLE recipe_safety_warnings IS '安全警告表';
COMMENT ON TABLE user_recipe_favorites IS '用户收藏表';