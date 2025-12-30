-- Enable RLS on new tables
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_safety_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recipe_favorites ENABLE ROW LEVEL SECURITY;

-- Public read access for recipes
CREATE POLICY "Public read access for recipes"
  ON recipes FOR SELECT
  USING (true);

CREATE POLICY "Public read access for recipe_ingredients"
  ON recipe_ingredients FOR SELECT
  USING (true);

CREATE POLICY "Public read access for recipe_steps"
  ON recipe_steps FOR SELECT
  USING (true);

CREATE POLICY "Public read access for recipe_safety_warnings"
  ON recipe_safety_warnings FOR SELECT
  USING (true);

-- Public insert for AI generated recipes (anyone can generate)
CREATE POLICY "Anyone can create recipes"
  ON recipes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can create recipe_ingredients"
  ON recipe_ingredients FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can create recipe_steps"
  ON recipe_steps FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can create recipe_safety_warnings"
  ON recipe_safety_warnings FOR INSERT
  WITH CHECK (true);