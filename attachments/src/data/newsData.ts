export interface NewsItem {
    id: string;
    title: string;
    date: string;
    category: string;
    image: string;
    description: string;
    author: string;
    content: string;
}

export const newsData: NewsItem[] = [
    {
        id: "1",
        title: "Bio-luminescent Mycelium Networks Discovered in Deep Caves",
        date: "DEC 24, 2025",
        category: "Discovery",
        image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop",
        description: "Researchers have identified a rare strain of mycelium that emits a steady cyan glow, facilitating subterranean navigation for certain cave-dwelling species.",
        author: "Dr. Elena Moss",
        content: `
      <p>Researchers exploring the deepest reaches of the karst cave systems in Southeast Asia have reported a breakthrough discovery: a vast, interconnected network of bio-luminescent mycelium. Unlike previously known luminous fungi, this strain, tentatively named <i>Mycena Astraeus</i>, emits a consistent cyan glow that pulses in rhythm with subterranean air currents.</p>
      
      <p>The discovery was made by a joint expedition featuring mycologists and speleologists. "The sight was ethereal," says Dr. Elena Moss, lead researcher on the project. "An entire cavern floor carpeted in soft, neon light. It wasn't just beautiful; it appeared to be a functional navigation system for the endemic cave fauna."</p>
      
      <h3>The Mechanism of Light</h3>
      <p>Initial analysis suggests that the luminescence is triggered by chemical reactions involving luciferase enzymes, much like fireflies. However, the scale of this network is unprecedented. Preliminary sensors indicate the mycelium spans several kilometers, linking disparate cave ecosystems through a "glowing highway" of fungal threads.</p>
      
      <h3>Ecological Implications</h3>
      <p>This discovery provides new insights into how life thrives in total darkness. The mycelium acts as a primary producer in an ecosystem devoid of sunlight, potentially supporting a complex food web of blind insects and crustaceans. Further research is planned to understand if the light pulses are a form of communication between colonies.</p>
    `
    },
    {
        id: "2",
        title: "Sustainable Architecture: Building with Mushroom Bricks",
        date: "DEC 22, 2025",
        category: "Technology",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop",
        description: "A new startup is utilizing the structural integrity of fungal hyphae to create carbon-negative construction materials that are stronger than traditional concrete.",
        author: "Marcus Thorne",
        content: `
      <p>As the construction industry seeks carbon-neutral alternatives to concrete and steel, the answer might lie beneath our feet. MycoBuild, a biotechnology startup, has successfully demonstrated the use of fungal hyphae to create structural bricks that are not only sustainable but also possess remarkable insulating properties.</p>
      
      <h3>From Agricultural Waste to Bricks</h3>
      <p>The process involves inoculating agricultural waste—such as hemp husks or corn stalks—with specific mushroom spores. Within days, the mycelium binds the substrate into a dense, solid mass. The material is then heat-treated to stop growth and solidify the structure.</p>
      
      <h3>Performance Metrics</h3>
      <p>According to structural engineer Marcus Thorne, "Myco-bricks have a high strength-to-weight ratio and are naturally fire-resistant. They outperform traditional expanded polystyrene in thermal insulation and have a negative carbon footprint, as they sequester carbon during the growth phase."</p>
      
      <p>The first prototype structure, a small community pavilion, is currently under construction and is expected to be completed by early next year.</p>
    `
    },
    {
        id: "3",
        title: "AI-Driven Fungal Identification App Surpasses Human Accuracy",
        date: "DEC 21, 2025",
        category: "Innovation",
        image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1200&auto=format&fit=crop",
        description: "Using deep learning models trained on millions of field samples, the MycoNexus AI can now identify over 50,000 species with 99.8% accuracy.",
        author: "Network Core",
        content: `
      <p>The MycoNexus Network has officially launched its version 4.0 identification engine, marking a significant milestone in digital mycology. In a controlled field test, the AI-driven application achieved a 99.8% identification accuracy rate, outperforming a panel of expert mycologists in the field.</p>
      
      <h3>Deep Learning in the Dirt</h3>
      <p>The engine utilizes a sophisticated multi-modal deep learning model trained on over 100 million verified field samples. Unlike previous iterations, version 4.0 analyzes more than just visual data; it considers geological location, climate history, and even microscopic spore patterns via phone-attachable macro lenses.</p>
      
      <h3>Citizen Science Empowered</h3>
      <p>This tool is designed to empower citizen scientists and amateur foragers. By providing instant, high-accuracy identification, MycoNexus aims to reduce accidental poisonings and accelerate the mapping of global fungal biodiversity in the face of rapid climate change.</p>
    `
    },
    {
        id: "4",
        title: "Global Spore Dispersal Patterns Shift Due to Climate Change",
        date: "DEC 19, 2025",
        category: "Environmental",
        image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200&auto=format&fit=crop",
        description: "A multi-year study reveals how changing wind currents and temperature fluctuations are pushing traditionally tropical fungal species into temperate zones.",
        author: "Prof. Silas Vane",
        content: `
      <p>A comprehensive study published this week in the Journal of Fungal Ecology has highlighted a dramatic shift in how mushroom spores are traveling across the planet. Rising global temperatures and shifting atmospheric currents are literal "winds of change" for the fungal kingdom.</p>
      
      <h3>Migration to the Poles</h3>
      <p>Tracking data from the MycoNexus global sensor array shows that species traditionally restricted to tropical and equatorial regions are now appearing in temperate and even sub-arctic zones. "We are seeing a massive northward migration," says Prof. Silas Vane, the study's lead author.</p>
      
      <h3>Ecological Disruptions</h3>
      <p>This migration isn't without its risks. Invasive fungal species can disrupt local symbiotic relationships between native fungi and forest trees. These shifts could have cascading effects on forest health and agriculture worldwide, necessitating a global monitoring strategy.</p>
    `
    }
];
