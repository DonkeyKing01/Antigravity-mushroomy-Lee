export interface Species {
  id: string;
  nameCn: string;
  nameEn: string;
  nameScientific: string;
  category: string;
  edibility: "edible" | "toxic" | "deadly" | "medicinal" | "unknown";
  description: string;
  imageUrl: string;
  colorChange?: string; // 变色特征
  season: string[];
  habitat: string[];
  capShape: string;
  odor: string;
  sporeColor: string;
  similarSpecies?: {
    id: string;
    name: string;
    warning: string;
    imageUrl: string;
  }[];
  anatomy?: {
    kohReaction?: string;
    sporePrint?: string;
    ringType?: string;
    gillAttachment?: string;
  };
  ecology?: {
    relationship: string;
    hostTrees: string[];
  };
  cookingNotes?: {
    method: string;
    warning?: string;
  };
}

export const mockSpeciesData: Species[] = [
  {
    id: "1",
    nameCn: "Blue Staining Boletus",
    nameEn: "Lanmaoa asiatica",
    nameScientific: "Lanmaoa asiatica",
    category: "Boletales",
    edibility: "edible",
    description: "A precious edible fungus unique to Yunnan. It turns blue immediately upon touch and must be fully cooked before consumption.",
    imageUrl: "/images/species/Blue Staining Boletus.png",
    colorChange: "Turns blue on touch",
    season: ["Summer", "Autumn"],
    habitat: ["Mixed Coniferous Broad-leaved Forest", "Pine Forest"],
    capShape: "Hemispherical to Flat",
    odor: "Mild Fungus Scent",
    sporeColor: "Olive Brown",
    similarSpecies: [
      {
        id: "2",
        name: "Satan's Bolete",
        warning: "Hallucinogenic if undercooked",
        imageUrl: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=400&auto=format"
      }
    ],
    anatomy: {
      kohReaction: "Turns Red",
      sporePrint: "Olive Brown",
      ringType: "No Ring",
      gillAttachment: "Adnate"
    },
    ecology: {
      relationship: "Ectomycorrhizal",
      hostTrees: ["Yunnan Pine", "Armand Pine", "Oak"]
    },
    cookingNotes: {
      method: "Stir-fry",
      warning: "⚠️ Must be stir-fried thoroughly for at least 15 minutes, otherwise it may cause neurological discomfort."
    }
  },
  {
    id: "3",
    nameCn: "Chanterelle",
    nameEn: "Golden Chanterelle",
    nameScientific: "Cantharellus cibarius",
    category: "Cantharellaceae",
    edibility: "edible",
    description: "A golden-yellow delicious edible fungus with a unique apricot aroma.",
    imageUrl: "/images/species/Chanterelle.jpg",
    season: ["Summer", "Autumn"],
    habitat: ["Mixed Forest", "Beech Forest"],
    capShape: "Funnel-shaped",
    odor: "Apricot Aroma",
    sporeColor: "White to Pale Yellow",
    anatomy: {
      sporePrint: "White",
      gillAttachment: "Decurrent"
    },
    ecology: {
      relationship: "Ectomycorrhizal",
      hostTrees: ["Pine", "Oak", "Beech"]
    },
    cookingNotes: {
      method: "Stir-fry, Soup"
    }
  },
  {
    id: "4",
    nameCn: "Matsutake",
    nameEn: "Pine Mushroom",
    nameScientific: "Tricholoma matsutake",
    category: "Tricholomataceae",
    edibility: "edible",
    description: "A world-class rare edible fungus with a unique aroma and high nutritional value.",
    imageUrl: "/images/species/matsutake.png",
    season: ["Autumn"],
    habitat: ["Coniferous Forest", "Pine Forest"],
    capShape: "Hemispherical to Flat",
    odor: "Strong Pine Scent",
    sporeColor: "White",
    anatomy: {
      sporePrint: "White",
      ringType: "Membranous Ring",
      gillAttachment: "Adnexed"
    },
    ecology: {
      relationship: "Ectomycorrhizal",
      hostTrees: ["Red Pine", "Hemlock", "Spruce"]
    },
    cookingNotes: {
      method: "Sashimi, Charcoal Grilled, Soup",
      warning: "Best consumed fresh. Drying may diminish its unique aroma."
    }
  },
  {
    id: "5",
    nameCn: "Fly Agaric",
    nameEn: "Fly Amanita",
    nameScientific: "Amanita muscaria",
    category: "Amanitaceae",
    edibility: "toxic",
    description: "Iconic red-capped white-spotted poisonous mushroom containing hallucinogenic toxins. Strictly forbidden to eat.",
    imageUrl: "/images/species/Amanita Muscaria.jpg",
    season: ["Summer", "Autumn"],
    habitat: ["Coniferous Forest", "Birch Forest"],
    capShape: "Hemispherical to Flat",
    odor: "Slightly Unpleasant",
    sporeColor: "White",
    similarSpecies: [
      {
        id: "6",
        name: "Caesar's Mushroom",
        warning: "Highly Toxic",
        imageUrl: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=400&auto=format"
      }
    ],
    anatomy: {
      sporePrint: "White",
      ringType: "Membranous Ring",
      gillAttachment: "Free"
    },
    ecology: {
      relationship: "Ectomycorrhizal",
      hostTrees: ["Birch", "Pine", "Spruce", "Fir"]
    },
    cookingNotes: {
      method: "Do Not Eat",
      warning: "⚠️ Contains ibotenic acid and muscimol, can cause hallucinations, vomiting, and nervous system damage."
    }
  },
  {
    id: "7",
    nameCn: "Morel",
    nameEn: "True Morel",
    nameScientific: "Morchella esculenta",
    category: "Morchellaceae",
    edibility: "edible",
    description: "Precious edible fungus with honeycomb-like cap, one of the four famous mushrooms in the world.",
    imageUrl: "/images/species/Morel.jpg",
    season: ["Spring"],
    habitat: ["Broad-leaved Forest", "River Bank", "Burned Area"],
    capShape: "Honeycomb",
    odor: "Pleasant",
    sporeColor: "Pale Yellow",
    anatomy: {
      sporePrint: "Pale Yellow to Cream",
      ringType: "No Ring",
      gillAttachment: "Honeycomb ridges (no true gills)"
    },
    ecology: {
      relationship: "Saprophytic",
      hostTrees: ["Various Broad-leaved Trees"]
    },
    cookingNotes: {
      method: "Soup, Stir-fry",
      warning: "⚠️ Must be cooked, never eat raw."
    }
  },
  {
    id: "8",
    nameCn: "Reishi",
    nameEn: "Lingzhi",
    nameScientific: "Ganoderma lucidum",
    category: "Ganodermataceae",
    edibility: "medicinal",
    description: "Traditional Chinese medicine material, known for strengthening the body and prolonging life.",
    imageUrl: "/images/species/reishi.png",
    season: ["All Year"],
    habitat: ["Broad-leaved Forest", "Decaying Wood"],
    capShape: "Fan to Kidney Shaped",
    odor: "Slightly Bitter",
    sporeColor: "Brown",
    anatomy: {
      sporePrint: "Brown",
      gillAttachment: "Pores (polypore)"
    },
    ecology: {
      relationship: "Wood-decaying",
      hostTrees: ["Oak", "Birch", "Willow"]
    },
    cookingNotes: {
      method: "Decoction, Tea, Soup"
    }
  },
  {
    id: "9",
    nameCn: "Death Cap",
    nameEn: "Death Cup",
    nameScientific: "Amanita phalloides",
    category: "Amanitaceae",
    edibility: "deadly",
    description: "One of the most poisonous mushrooms in the world, containing deadly amatoxins.",
    imageUrl: "/images/species/death_cap.jpg",
    season: ["Summer", "Autumn"],
    habitat: ["Broad-leaved Forest", "Mixed Forest"],
    capShape: "Hemispherical to Flat",
    odor: "First Odorless",
    sporeColor: "White",
    similarSpecies: [
      {
        id: "10",
        name: "Straw Mushroom",
        warning: "Easily confused, requires professional identification",
        imageUrl: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=400&auto=format"
      }
    ],
    anatomy: {
      sporePrint: "White",
      ringType: "Membranous Ring",
      gillAttachment: "Free"
    },
    ecology: {
      relationship: "Ectomycorrhizal",
      hostTrees: ["Oak", "Beech", "Chestnut", "Hazel"]
    },
    cookingNotes: {
      method: "Do Not Eat",
      warning: "⚠️ Deadly Toxic! Contains alpha-amanitin, extremely high mortality rate, no specific antidote."
    }
  },
  {
    id: "10",
    nameCn: "Turkey Tail",
    nameEn: "Turkey Tail",
    nameScientific: "Trametes versicolor",
    category: "Polyporaceae",
    edibility: "medicinal",
    description: "A common polypore mushroom found throughout the world, known for its layered, colorful cap resembling a turkey's tail.",
    imageUrl: "/images/species/Turkey Tail.jpg",
    season: ["All Year"],
    habitat: ["Decaying Wood", "Mixed Forest"],
    capShape: "Fan to Kidney Shaped",
    odor: "Mild",
    sporeColor: "White",
    anatomy: {
      sporePrint: "White",
      gillAttachment: "Pores (polypore)"
    },
    ecology: {
      relationship: "Saprophytic",
      hostTrees: ["Oak", "Beech", "Maple"]
    },
    cookingNotes: {
      method: "Tea, Decoction, Extract",
      warning: "Too tough to eat directly. Best used for medicinal teas and extracts."
    }
  },
  {
    id: "11",
    nameCn: "Porcini",
    nameEn: "King Bolete",
    nameScientific: "Boletus edulis",
    category: "Boletales",
    edibility: "edible",
    description: "One of the most prized edible mushrooms, known for its meaty texture and nutty flavor.",
    imageUrl: "/images/species/Porcini.jpg",
    season: ["Summer", "Autumn"],
    habitat: ["Coniferous Forest", "Broad-leaved Forest"],
    capShape: "Hemispherical to Flat",
    odor: "Nutty",
    sporeColor: "Olive Brown",
    anatomy: {
      sporePrint: "Olive Brown",
      ringType: "No Ring",
      gillAttachment: "Pores (bolete)"
    },
    ecology: {
      relationship: "Ectomycorrhizal",
      hostTrees: ["Spruce", "Pine", "Chestnut", "Beech"]
    },
    cookingNotes: {
      method: "Grilled, Risotto, Dried"
    }
  },
  {
    id: "12",
    nameCn: "Oyster Mushroom",
    nameEn: "Pearl Oyster",
    nameScientific: "Pleurotus ostreatus",
    category: "Pleurotaceae",
    edibility: "edible",
    description: "A common edible mushroom with a mild flavor and a faint scent of anise.",
    imageUrl: "/images/species/Oyster Mushroom.jpg",
    season: ["Autumn", "Winter"],
    habitat: ["Decaying Wood", "Broad-leaved Forest"],
    capShape: "Fan to Kidney Shaped",
    odor: "Anise-like",
    sporeColor: "White to Lilac Gray",
    anatomy: {
      sporePrint: "White to Lilac Gray",
      gillAttachment: "Decurrent"
    },
    ecology: {
      relationship: "Saprophytic",
      hostTrees: ["Beech", "Aspen", "Oak", "Various Hardwoods"]
    },
    cookingNotes: {
      method: "Sautéed, Stir-fry"
    }
  },
  {
    id: "13",
    nameCn: "Blue Milk Mushroom",
    nameEn: "Indigo Milk Cap",
    nameScientific: "Lactarius indigo",
    category: "Russulaceae",
    edibility: "edible",
    description: "A striking blue mushroom that exudes a blue milky juice when cut.",
    imageUrl: "/images/species/blue_milk_mushroom.jpg",
    season: ["Summer", "Autumn"],
    habitat: ["Coniferous Forest", "Mixed Forest"],
    capShape: "Funnel-shaped",
    odor: "Mild",
    sporeColor: "Cream",
    colorChange: "Exudes blue milk when cut",
    anatomy: {
      sporePrint: "Cream to Pale Yellow",
      gillAttachment: "Adnate to Slightly Decurrent"
    },
    ecology: {
      relationship: "Ectomycorrhizal",
      hostTrees: ["Pine", "Oak"]
    },
    cookingNotes: {
      method: "Grilled, Sautéed",
      warning: "The blue color fades when cooked."
    }
  },
  {
    id: "14",
    nameCn: "Ghost Fungus (Variant A)",
    nameEn: "Ghost Fungus",
    nameScientific: "Omphalotus nidiformis",
    category: "Omphalotaceae",
    edibility: "toxic",
    description: "A bioluminescent mushroom that glows pale green in the dark. Highly toxic if consumed.",
    imageUrl: "/images/species/Ghost Fungus.jpg",
    season: ["Autumn", "Winter"],
    habitat: ["Decaying Wood", "Broad-leaved Forest"],
    capShape: "Fan to Kidney Shaped",
    odor: "Mild",
    sporeColor: "White",
    colorChange: "Bioluminescent (Glows in dark)",
    anatomy: {
      sporePrint: "White to Cream",
      gillAttachment: "Decurrent"
    },
    ecology: {
      relationship: "Saprophytic",
      hostTrees: ["Eucalyptus", "Various Dead Hardwoods"]
    },
    cookingNotes: {
      method: "Do Not Eat",
      warning: "⚠️ Highly toxic! Causes severe cramps, vomiting, and diarrhea. Often confused with oyster mushrooms."
    }
  },
  {
    id: "15",
    nameCn: "Ghost Fungus (Variant B)",
    nameEn: "Ghost Fungus",
    nameScientific: "Omphalotus nidiformis",
    category: "Omphalotaceae",
    edibility: "toxic",
    description: "Another specimen of the bioluminescent ghost fungus, showing different growth patterns.",
    imageUrl: "/images/species/ghost_fungus.png",
    season: ["Autumn", "Winter"],
    habitat: ["Decaying Wood", "Broad-leaved Forest"],
    capShape: "Fan to Kidney Shaped",
    odor: "Mild",
    sporeColor: "White",
    colorChange: "Bioluminescent (Glows in dark)",
    anatomy: {
      sporePrint: "White to Cream",
      gillAttachment: "Decurrent"
    },
    ecology: {
      relationship: "Saprophytic",
      hostTrees: ["Eucalyptus", "Various Dead Hardwoods"]
    },
    cookingNotes: {
      method: "Do Not Eat",
      warning: "⚠️ Highly toxic! Causes severe cramps, vomiting, and diarrhea. Often confused with oyster mushrooms."
    }
  },
  {
    id: "16",
    nameCn: "Lion's Mane",
    nameEn: "Lion's Mane",
    nameScientific: "Hericium erinaceus",
    category: "Hericiaceae",
    edibility: "edible",
    description: "A unique mushroom with cascading white spines, known for its seafood-like flavor and cognitive benefits.",
    imageUrl: "/images/species/lions_mane.png",
    season: ["Late Summer", "Autumn"],
    habitat: ["Decaying Wood", "Broad-leaved Forest"],
    capShape: "Cushion-like with Hanging Spines",
    odor: "Mild, Seafood-like",
    sporeColor: "White",
    anatomy: {
      sporePrint: "White",
      gillAttachment: "Spines (no gills)"
    },
    ecology: {
      relationship: "Saprophytic/Parasitic",
      hostTrees: ["Oak", "Beech", "Maple", "Walnut"]
    },
    cookingNotes: {
      method: "Pan-fried, Seared",
      warning: "Known for potential cognitive and nerve health benefits."
    }
  }
];
