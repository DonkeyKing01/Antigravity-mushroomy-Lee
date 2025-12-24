export const categories = [
    { id: 'edible', label: 'Edible (食用)', color: '#4caf50' },
    { id: 'toxic', label: 'Toxic (有毒)', color: '#c24d2c' },
    { id: 'medicinal', label: 'Medicinal (药用)', color: '#2196f3' },
    { id: 'psychoactive', label: 'Psychoactive (致幻)', color: '#9c27b0' }
];

export const species = [
    {
        id: 1,
        name: 'Amanita Muscaria',
        latinName: 'Amanita muscaria',
        category: 'toxic',
        description: 'The iconic fly agaric, featuring a bright red cap with white spots.',
        image: '/images/Amanita Muscaria.jpg',
        habitat: 'Coniferous and deciduous woodlands',
        toxicity: 'High'
    },
    {
        id: 2,
        name: 'Chanterelle',
        latinName: 'Cantharellus cibarius',
        category: 'edible',
        description: 'Golden-yellow, funnel-shaped mushroom with a fruity smell.',
        image: '/images/Chanterelle.jpg',
        habitat: 'Mossy forests, often near oaks',
        toxicity: 'None'
    },
    {
        id: 3,
        name: 'Lion\'s Mane',
        latinName: 'Hericium erinaceus',
        category: 'medicinal',
        description: 'Large, white, shaggy mushroom resembling a lion\'s mane.',
        image: '/images/lions_mane.png',
        habitat: 'Hardwood logs (dead or dying trees)',
        toxicity: 'None'
    },
    {
        id: 4,
        name: 'Ghost Fungus',
        latinName: 'Omphalotus nidiformis',
        category: 'toxic',
        description: 'Bioluminescent mushroom that glows green in the dark.',
        image: '/images/Ghost Fungus.jpg',
        habitat: 'Dead trees (Australia/Tasmania)',
        toxicity: 'Moderate (Severe cramps)'
    },
    {
        id: 5,
        name: 'Morel',
        latinName: 'Morchella esculenta',
        category: 'edible',
        description: 'Distinctive honeycomb appearance. A highly prized culinary delicacy.',
        image: '/images/Morel.jpg',
        habitat: 'Moist woodlands, burnt forests',
        toxicity: 'None (Must be cooked)'
    },
    {
        id: 6,
        name: 'Porcini (Penny Bun)',
        latinName: 'Boletus edulis',
        category: 'edible',
        description: 'Large brown cap with pores instead of gills.',
        image: '/images/Porcini.jpg',
        habitat: 'Spruce, pine, and hardwood forests',
        toxicity: 'None'
    },
    {
        id: 7,
        name: 'Reishi (Lingzhi)',
        latinName: 'Ganoderma lucidum',
        category: 'medicinal',
        description: 'Red-varnished kidney-shaped cap. "Mushroom of Immortality".',
        image: '/images/reishi.png',
        habitat: 'Deciduous trees, especially maple',
        toxicity: 'None'
    },
    {
        id: 8,
        name: 'Blue Milk Mushroom',
        latinName: 'Lactarius indigo',
        category: 'edible',
        description: 'Striking blue color that oozes indigo "milk" when cut.',
        image: '/images/blue_milk_mushroom.jpg',
        habitat: 'Pine and oak forests',
        toxicity: 'None'
    },
    {
        id: 9,
        name: 'Death Cap',
        latinName: 'Amanita phalloides',
        category: 'toxic',
        description: 'Responsible for the majority of fatal mushroom poisonings.',
        image: '/images/death_cap.jpg',
        habitat: 'Under oaks and beeches',
        toxicity: 'Lethal (Destroys liver)'
    },
    {
        id: 10,
        name: 'Turkey Tail',
        latinName: 'Trametes versicolor',
        category: 'medicinal',
        description: 'Fan-shaped polypore with multi-colored concentric zones.',
        image: '/images/Turkey Tail.jpg',
        habitat: 'Dead logs and stumps',
        toxicity: 'None'
    },
    {
        id: 11,
        name: 'Oyster Mushroom',
        latinName: 'Pleurotus ostreatus',
        category: 'edible',
        description: 'Shell-shaped cap, commonly cultivated. Soft texture.',
        image: '/images/Oyster Mushroom.jpg',
        habitat: 'Deciduous trees (Beech, Oak)',
        toxicity: 'None'
    },
    {
        id: 12,
        name: 'Liberty Cap',
        latinName: 'Psilocybe semilanceata',
        category: 'psychoactive',
        description: 'Small, brown mushroom with a conical cap. Contains psilocybin.',
        image: 'https://zh.wikipedia.org/wiki/%E5%8D%8A%E8%A3%B8%E8%93%8B%E8%8F%87#/media/File:Psilocybe.semilanceata.Alan.jpg',
        habitat: 'Grasslands, wet pastures',
        toxicity: 'Psychoactive'
    },
    {
        id: 13,
        name: 'Bleeding Tooth',
        latinName: 'Hydnellum peckii',
        category: 'toxic',
        description: 'Exudes a bright red juice like blood droplets.',
        image: 'https://en.wikipedia.org/wiki/Hydnellum_peckii#/media/File:Hydnellum_peckii2.jpg',
        habitat: 'Coniferous forests',
        toxicity: 'Inedible (Bitter, not lethal)'
    },
    {
        id: 14,
        name: 'Chicken of the Woods',
        latinName: 'Laetiporus sulphureus',
        category: 'edible',
        description: 'Bright orange shelf fungus. Tastes like chicken.',
        image: 'https://en.wikipedia.org/wiki/Laetiporus#/media/File:Laetiporus_sulphureus_JPG01.jpg',
        habitat: 'Oak/Hardwood trunks',
        toxicity: 'None'
    },
    {
        id: 15,
        name: 'Shaggy Mane',
        latinName: 'Coprinus comatus',
        category: 'edible',
        description: 'Tall white cylinder cap with shaggy scales.',
        image: 'https://en.wikipedia.org/wiki/Coprinus_comatus#/media/File:Coprinus_comatus,_the_shaggy_ink_cap,_lawyer\'s_wig,_or_shaggy_mane_mushroom.jpg',
        habitat: 'Grasslands, disturbed soil',
        toxicity: 'None (Must eat young)'
    },
    {
        id: 16,
        name: 'Destroying Angel',
        latinName: 'Amanita virosa',
        category: 'toxic',
        description: 'Pure white and deadly toxic.',
        image: 'https://en.wikipedia.org/wiki/Destroying_angel#/media/File:Destroying_Angel.jpg',
        habitat: 'Mixed woodlands',
        toxicity: 'Lethal'
    },
    {
        id: 17,
        name: 'Amethyst Deceiver',
        latinName: 'Laccaria amethystina',
        category: 'edible',
        description: 'Vivid purple color which fades with age.',
        image: 'https://en.wikipedia.org/wiki/Laccaria_amethystina#/media/File:Laccaria_amethystina_LC0370.jpg',
        habitat: 'Leaf litter in forests',
        toxicity: 'None'
    },
    {
        id: 18,
        name: 'Enoki (Wild)',
        latinName: 'Flammulina velutipes',
        category: 'edible',
        description: 'Orange-brown caps (wild form), not the thin white store variety.',
        image: 'https://natures-restaurant-online.com/1280px-Flammulina_velutipes_on_Fagus_sylvatica.JPG',
        habitat: 'Dead wood (Winter)',
        toxicity: 'None'
    },
    {
        id: 19,
        name: 'Jack-o\'-lantern',
        latinName: 'Omphalotus olearius',
        category: 'toxic',
        description: 'Orange mushroom that grows in clumps. Bioluminescent.',
        image: 'https://en.wikipedia.org/wiki/Omphalotus_olearius#/media/File:Omphalotus_olearius.JPG',
        habitat: 'Deciduous stumps',
        toxicity: 'Severe GI distress'
    },
    {
        id: 20,
        name: 'Puffball',
        latinName: 'Lycoperdon perlatum',
        category: 'edible',
        description: 'Round white fruiting body covered in tiny spines.',
        image: 'https://en.wikipedia.org/wiki/Puffball#/media/File:Flaschenst%C3%A4ubling.jpg',
        habitat: 'Woodlands',
        toxicity: 'None (if pure white inside)'
    }
];
