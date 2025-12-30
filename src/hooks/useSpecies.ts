// BACKEND DISABLED - Using mock data only
import { useQuery } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";
import { mockSpeciesData, Species } from "@/data/speciesData";
import { getAssetPath } from "@/utils/assetPath";

export interface SpeciesData {
  id: string;
  name_cn: string;
  name_en: string;
  name_scientific: string;
  category: {
    name_cn: string;
    name_en: string;
  } | null;
  edibility: "edible" | "toxic" | "deadly" | "medicinal" | "unknown";
  description: string;
  color_change: string | null;
  season: string[];
  habitat: string[];
  cap_shape: string;
  odor: string;
  spore_color: string;
  images: { image_url: string }[];
  similar_species: {
    similar_species_id: string;
    warning: string;
    similar_species: {
      name_cn: string;
      images: { image_url: string }[];
    };
  }[];
  anatomy_data: {
    koh_reaction: string | null;
    spore_print: string | null;
    ring_type: string | null;
    gill_attachment: string | null;
  } | null;
  ecology_data: {
    relationship: string;
    host_trees: string[];
  } | null;
  cooking_notes: {
    method: string;
    warning: string | null;
  } | null;
}

// Helper to transform image URLs - only transform local paths, not external URLs
const transformImageUrl = (url: string): string => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url; // External URL, don't modify
  }
  return getAssetPath(url);
};

// Transform mock data to match Supabase format
const transformMockData = (species: Species): SpeciesData => ({
  id: species.id,
  name_cn: species.nameCn,
  name_en: species.nameEn,
  name_scientific: species.nameScientific,
  category: {
    name_cn: species.category,
    name_en: species.category,
  },
  edibility: species.edibility,
  description: species.description,
  color_change: species.colorChange || null,
  season: species.season,
  habitat: species.habitat,
  cap_shape: species.capShape,
  odor: species.odor,
  spore_color: species.sporeColor,
  images: [{ image_url: transformImageUrl(species.imageUrl) }],
  similar_species: (species.similarSpecies || []).map((sim) => ({
    similar_species_id: sim.id,
    warning: sim.warning,
    similar_species: {
      name_cn: sim.name,
      images: [{ image_url: transformImageUrl(sim.imageUrl) }],
    },
  })),
  anatomy_data: species.anatomy ? {
    koh_reaction: species.anatomy.kohReaction || null,
    spore_print: species.anatomy.sporePrint || null,
    ring_type: species.anatomy.ringType || null,
    gill_attachment: species.anatomy.gillAttachment || null,
  } : null,
  ecology_data: species.ecology ? {
    relationship: species.ecology.relationship,
    host_trees: species.ecology.hostTrees,
  } : null,
  cooking_notes: species.cookingNotes ? {
    method: species.cookingNotes.method,
    warning: species.cookingNotes.warning || null,
  } : null,
});

export const useSpeciesList = (filters?: {
  edibility?: string;
  morphology?: string[];
  search?: string;
}) => {
  return useQuery({
    queryKey: ["species", "list", filters],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      let filteredData = mockSpeciesData.map(transformMockData);

      // Apply edibility filter
      if (filters?.edibility && filters.edibility !== "all") {
        filteredData = filteredData.filter(
          (species) => species.edibility === filters.edibility
        );
      }

      // Apply search filter
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(
          (species) =>
            species.name_cn.toLowerCase().includes(searchLower) ||
            species.name_en.toLowerCase().includes(searchLower) ||
            species.name_scientific.toLowerCase().includes(searchLower)
        );
      }

      // Note: morphology filter not implemented in mock data
      // Add morphology filtering logic here if needed

      return filteredData;
    },
  });
};

export const useSpeciesDetail = (id: string) => {
  return useQuery({
    queryKey: ["species", "detail", id],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));

      const species = mockSpeciesData.find((s) => s.id === id);

      if (!species) {
        throw new Error("Species not found");
      }

      return transformMockData(species);
    },
  });
};
