-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE species ENABLE ROW LEVEL SECURITY;
ALTER TABLE species_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE similar_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE anatomy_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecology_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooking_notes ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (anyone can SELECT)
CREATE POLICY "Public read access for categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Public read access for species"
  ON species FOR SELECT
  USING (true);

CREATE POLICY "Public read access for species_images"
  ON species_images FOR SELECT
  USING (true);

CREATE POLICY "Public read access for similar_species"
  ON similar_species FOR SELECT
  USING (true);

CREATE POLICY "Public read access for anatomy_data"
  ON anatomy_data FOR SELECT
  USING (true);

CREATE POLICY "Public read access for ecology_data"
  ON ecology_data FOR SELECT
  USING (true);

CREATE POLICY "Public read access for cooking_notes"
  ON cooking_notes FOR SELECT
  USING (true);