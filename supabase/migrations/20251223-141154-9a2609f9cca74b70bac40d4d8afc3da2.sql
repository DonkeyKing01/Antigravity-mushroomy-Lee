-- Create edibility enum
CREATE TYPE edibility_type AS ENUM ('edible', 'toxic', 'deadly', 'medicinal', 'unknown');

-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_cn TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create species table (core table)
CREATE TABLE species (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_cn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_scientific TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  edibility edibility_type NOT NULL DEFAULT 'unknown',
  description TEXT NOT NULL,
  color_change TEXT,
  season TEXT[] NOT NULL DEFAULT '{}',
  habitat TEXT[] NOT NULL DEFAULT '{}',
  cap_shape TEXT,
  odor TEXT,
  spore_color TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create species images table
CREATE TABLE species_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id UUID NOT NULL REFERENCES species(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create similar species warnings table
CREATE TABLE similar_species (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id UUID NOT NULL REFERENCES species(id) ON DELETE CASCADE,
  similar_species_id UUID NOT NULL REFERENCES species(id) ON DELETE CASCADE,
  warning TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(species_id, similar_species_id)
);

-- Create anatomy data table
CREATE TABLE anatomy_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id UUID NOT NULL UNIQUE REFERENCES species(id) ON DELETE CASCADE,
  koh_reaction TEXT,
  spore_print TEXT,
  ring_type TEXT,
  gill_attachment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create ecology data table
CREATE TABLE ecology_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id UUID NOT NULL UNIQUE REFERENCES species(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL,
  host_trees TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create cooking notes table
CREATE TABLE cooking_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id UUID NOT NULL UNIQUE REFERENCES species(id) ON DELETE CASCADE,
  method TEXT NOT NULL,
  warning TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_species_category ON species(category_id);
CREATE INDEX idx_species_edibility ON species(edibility);
CREATE INDEX idx_species_name_cn ON species(name_cn);
CREATE INDEX idx_species_name_scientific ON species(name_scientific);
CREATE INDEX idx_species_images_species ON species_images(species_id);
CREATE INDEX idx_similar_species_species ON similar_species(species_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for species table
CREATE TRIGGER update_species_updated_at BEFORE UPDATE ON species
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE species IS '菌类物种核心数据表';
COMMENT ON TABLE categories IS '分类表';
COMMENT ON TABLE species_images IS '物种图片表';
COMMENT ON TABLE similar_species IS '相似种警示表';
COMMENT ON TABLE anatomy_data IS '解剖结构数据表';
COMMENT ON TABLE ecology_data IS '生态关系数据表';
COMMENT ON TABLE cooking_notes IS '烹饪笔记表';