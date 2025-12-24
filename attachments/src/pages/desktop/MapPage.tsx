import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Layers,
  MapPin,
  Users,
  TrendingUp,
  Plus,
  X,
  Thermometer,
  Droplets,
  AlertTriangle,
  Radio,
  Circle,
} from "lucide-react";
import FungalMap from "@/components/desktop/FungalMap";
import Navigation from "@/components/desktop/Navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Mock data
// Consolidated mock data and interfaces
interface Node {
  id: number;
  x: number;
  y: number; // percentage 0-100
  type: 'colony' | 'spore' | 'user';
  size: number;
  nourishment: number;
  author: string;
  species: string;
  pulseOffset: number;
  location: { lat: number; lng: number };
}

interface Pulse {
  targetX: number;
  targetY: number;
  progress: number;
}

const MOCK_MESSAGES = [
  "Found a huge colony here!",
  "Is this edible?",
  "Beautiful bioluminescence.",
  "Spores spreading fast.",
  "Need identification help.",
  "Conditions optimal.",
  "Verified observation.",
  "Connecting hyphae...",
  "Amazing texture.",
  "Habitat confirmed."
];

const mockRegions = [
  { id: "yunnan", name: "Yunnan", x: 30, y: 60, heat: 95, posts: 127, humidity: 85, temp: 22, risk: "high" },
  { id: "sichuan", name: "Sichuan", x: 45, y: 45, heat: 78, posts: 89, humidity: 75, temp: 18, risk: "medium" },
  { id: "guizhou", name: "Guizhou", x: 38, y: 55, heat: 62, posts: 54, humidity: 80, temp: 20, risk: "medium" },
  { id: "guangxi", name: "Guangxi", x: 42, y: 72, heat: 45, posts: 31, humidity: 70, temp: 25, risk: "low" },
  { id: "tibet", name: "Tibet", x: 15, y: 35, heat: 12, posts: 8, humidity: 40, temp: 12, risk: "low" },
];

const mockTopRegions = [
  { rank: 1, name: "Kunming", posts: 99, trend: "+23%" },
  { rank: 2, name: "Mt Emei", posts: 84, trend: "+18%" },
  { rank: 3, name: "Chuxiong", posts: 67, trend: "+12%" },
  { rank: 4, name: "Dali", posts: 52, trend: "+8%" },
  { rank: 5, name: "Lijiang", posts: 48, trend: "+5%" },
];

const mockTopSpecies = [
  { rank: 1, name: "Lanmaoa asiatica", count: 234, risk: "Cook Well" },
  { rank: 2, name: "Matsutake", count: 189, risk: "Safe" },
  { rank: 3, name: "Chanterelle", count: 156, risk: "Safe" },
  { rank: 4, name: "Porcini", count: 142, risk: "Safe" },
  { rank: 5, name: "Morel", count: 128, risk: "Safe" },
];

const MapPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [layerEnv, setLayerEnv] = useState(true);
  const [layerSpecies, setLayerSpecies] = useState(true);
  const [layerSignals, setLayerSignals] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState(mockRegions[0]);

  // FungalMap State Lifted
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [status, setStatus] = useState("Monitoring Network");
  const [comments, setComments] = useState<Record<number, { author: string; text: string }[]>>({});
  const [userConnections, setUserConnections] = useState<Set<number>>(new Set());
  const [nourishPulses, setNourishPulses] = useState<Pulse[]>([]);
  const [replyMode, setReplyMode] = useState(false);

  // Initial Data Generation
  useEffect(() => {
    const CONTINENT_ZONES = [
      { name: 'North America', xMin: 10, xMax: 30, yMin: 15, yMax: 40 },
      { name: 'South America', xMin: 22, xMax: 32, yMin: 45, yMax: 75 },
      { name: 'Europe', xMin: 46, xMax: 56, yMin: 15, yMax: 30 },
      { name: 'Africa', xMin: 46, xMax: 60, yMin: 35, yMax: 65 },
      { name: 'Asia', xMin: 60, xMax: 90, yMin: 15, yMax: 45 },
      { name: 'Australia', xMin: 80, xMax: 92, yMin: 60, yMax: 80 }
    ];

    const initialNodes: Node[] = Array.from({ length: 80 }, (_, i) => {
      const zone = CONTINENT_ZONES[Math.floor(Math.random() * CONTINENT_ZONES.length)];
      // Add some randomness to distribution within zones, and occasional "ocean drift" (5% chance)
      const isDrift = Math.random() < 0.05;

      let x, y;
      if (isDrift) {
        x = Math.random() * 90 + 5;
        y = Math.random() * 80 + 10;
      } else {
        x = zone.xMin + Math.random() * (zone.xMax - zone.xMin);
        y = zone.yMin + Math.random() * (zone.yMax - zone.yMin);
      }

      return {
        id: i,
        x,
        y,
        type: Math.random() > 0.8 ? 'colony' : 'spore',
        size: Math.random() * 4 + 3,
        nourishment: Math.floor(Math.random() * 10),
        author: `Observer_${Math.floor(Math.random() * 1000)}`,
        species: ['Amanita', 'Mycena', 'Cantharellus', 'Russula'][Math.floor(Math.random() * 4)],
        pulseOffset: Math.random() * Math.PI * 2,
        location: { lat: 34 + Math.random(), lng: -118 + Math.random() } // Note: lat/lng is just meta-data, rendering uses x/y
      };
    });
    setNodes(initialNodes);

    const initialComments: Record<number, { author: string; text: string }[]> = {};
    initialNodes.forEach(n => {
      if (Math.random() > 0.7) {
        initialComments[n.id] = [{
          author: `User_${Math.floor(Math.random() * 100)}`,
          text: MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)]
        }];
      }
    });
    setComments(initialComments);
  }, []);

  const handleRegionClick = (region: any) => {
    setSelectedRegion(region);
    toast.success(`Focused on ${region.name}`);
  };

  return (
    <div className="h-screen bg-background overflow-hidden">
      <Navigation />

      {/* Main Map Container */}
      <div className="relative h-full pt-16">
        {/* Left Sidebar - Control Panel */}
        <aside className="absolute left-0 top-16 bottom-0 w-80 bg-background/80 backdrop-blur-md grid-line-r z-20 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Search */}
            <div>
              <h3 className="text-meta text-foreground/40 mb-3">Global Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Region or species..."
                  className="w-full bg-card border border-border pl-10 pr-3 py-2 text-label text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[hsl(var(--aurora-cyan))]"
                />
              </div>
            </div>

            {/* Layer Controls */}
            <div>
              <h3 className="text-meta text-foreground/40 mb-3 flex items-center gap-2">
                <Layers className="w-3 h-3 text-[hsl(var(--aurora-cyan))]" />
                Layer Control
              </h3>
              <div className="space-y-3">
                <LayerToggle
                  label="Environment"
                  sublabel="Temp/Humidity Heat"
                  checked={layerEnv}
                  onChange={setLayerEnv}
                />
                <LayerToggle
                  label="Species"
                  sublabel="Distribution Heat"
                  checked={layerSpecies}
                  onChange={setLayerSpecies}
                />
                <LayerToggle
                  label="Signals"
                  sublabel="User Posts"
                  checked={layerSignals}
                  onChange={setLayerSignals}
                />
              </div>
            </div>

            {/* Current Region Dashboard */}
            <div className="p-4 bg-card grid-line">
              <h3 className="text-meta text-foreground/40 mb-4">Region Dashboard</h3>

              <div className="mb-4">
                <span className="text-label text-foreground">{selectedRegion.name}</span>
                <span className="text-meta text-foreground/30 block mt-1">
                  {selectedRegion.posts} Signals
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-meta text-foreground/40 flex items-center gap-2">
                    <Droplets className="w-3 h-3" />
                    Humidity
                  </span>
                  <span className="text-label text-[hsl(var(--aurora-cyan))]">
                    {selectedRegion.humidity}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-meta text-foreground/40 flex items-center gap-2">
                    <Thermometer className="w-3 h-3" />
                    Temp
                  </span>
                  <span className="text-label text-foreground">
                    {selectedRegion.temp}°C
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-meta text-foreground/40 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" />
                    Risk Level
                  </span>
                  <span className={`text-label ${selectedRegion.risk === "high"
                    ? "text-[hsl(var(--aurora-magenta))]"
                    : selectedRegion.risk === "medium"
                      ? "text-[hsl(var(--aurora-gold))]"
                      : "text-[hsl(var(--aurora-cyan))]"
                    }`}>
                    {selectedRegion.risk === "high" ? "High" : selectedRegion.risk === "medium" ? "Med" : "Low"}
                  </span>
                </div>

                <div className="pt-3 mt-3 grid-line-t">
                  <span className="text-meta text-foreground/30">Habitability Index</span>
                  <div className="h-2 bg-foreground/10 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[hsl(var(--aurora-cyan))] to-[hsl(var(--aurora-purple))]"
                      style={{ width: `${selectedRegion.humidity}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Sidebar - Rankings & Monitoring */}
        <aside className="absolute right-0 top-16 bottom-0 w-80 bg-background/80 backdrop-blur-md grid-line-l z-20 overflow-y-auto">
          <Tabs defaultValue="hot" className="h-full">
            <TabsList className="w-full grid grid-cols-2 bg-card/50 p-1 m-4">
              <TabsTrigger value="hot" className="text-meta data-[state=active]:bg-background">
                Trending
              </TabsTrigger>
              <TabsTrigger value="users" className="text-meta data-[state=active]:bg-background">
                Contacts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hot" className="px-6 pb-6 space-y-6 mt-0">
              {/* Top Regions */}
              <div>
                <h3 className="text-meta text-foreground/40 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" />
                  TOP 5 REGIONS
                </h3>
                <div className="space-y-2">
                  {mockTopRegions.map((region) => (
                    <button
                      key={region.rank}
                      onClick={() => {
                        const targetRegion = mockRegions.find(r => r.name.includes(region.name));
                        if (targetRegion) handleRegionClick(targetRegion);
                      }}
                      className="w-full p-3 bg-card hover:bg-card/70 grid-line flex items-center gap-3 transition-colors text-left"
                    >
                      <span className="text-xl font-display text-foreground/30 w-8">
                        {String(region.rank).padStart(2, "0")}
                      </span>
                      <div className="flex-1">
                        <span className="text-label text-foreground block">
                          {region.name}
                        </span>
                        <span className="text-meta text-foreground/40">
                          {region.posts} Signals
                        </span>
                      </div>
                      <span className="text-meta text-[hsl(var(--aurora-cyan))]">
                        {region.trend}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Top Species */}
              <div>
                <h3 className="text-meta text-foreground/40 mb-3">
                  Top Weekly Species
                </h3>
                <div className="space-y-2">
                  {mockTopSpecies.map((species) => (
                    <div
                      key={species.rank}
                      className="p-3 bg-card grid-line flex items-center gap-3"
                    >
                      <span className="text-xl font-display italic text-foreground/30 w-8">
                        {String(species.rank).padStart(2, "0")}
                      </span>
                      <div className="flex-1">
                        <span className="text-label text-foreground block">
                          {species.name}
                        </span>
                        <span className={`text-meta ${species.risk.includes("危险") || species.risk.includes("充分")
                          ? "text-[hsl(var(--aurora-magenta))]"
                          : "text-foreground/40"
                          }`}>
                          {species.risk}
                        </span>
                      </div>
                      <span className="text-meta text-foreground/30">
                        {species.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users" className="px-6 pb-6 mt-0">
              {/* Network Monitoring List (Moved from FungalMap left panel) */}
              <div className="p-4 border-b border-border mb-4">
                <div className="flex items-center gap-2 text-[hsl(var(--aurora-cyan))] text-xs tracking-widest mb-2 font-mono uppercase">
                  <div className="w-2 h-2 bg-current rounded-full shadow-[0_0_10px_currentColor]" />
                  {status}
                </div>
                <h2 className="text-xl font-display text-foreground">Network Activity</h2>
              </div>

              <div className="space-y-2">
                {nodes.slice(-10).reverse().map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="w-full p-3 bg-card hover:bg-card/70 grid-line flex items-center gap-3 transition-colors text-left"
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${node.nourishment > 5 ? 'bg-[hsl(var(--aurora-magenta))]' : 'bg-[hsl(var(--aurora-cyan))]'}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-label text-foreground">
                          {node.author}
                        </span>
                      </div>
                      <span className="text-meta text-foreground/40">
                        found {node.species}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Center Canvas: FungalMap */}
        <div className="absolute top-16 bottom-0 left-80 right-80 bg-background/50 border-x border-border">
          <FungalMap
            nodes={nodes}
            setNodes={setNodes}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            comments={comments}
            setComments={setComments}
            userConnections={userConnections}
            setUserConnections={setUserConnections}
            nourishPulses={nourishPulses}
            setNourishPulses={setNourishPulses}
            setStatus={setStatus}
            replyMode={replyMode}
            setReplyMode={setReplyMode}
          />
        </div>
      </div>
    </div>
  );
};

interface LayerToggleProps {
  label: string;
  sublabel: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const LayerToggle = ({ label, sublabel, checked, onChange }: LayerToggleProps) => {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full p-3 bg-card hover:bg-card/70 grid-line flex items-center justify-between transition-colors text-left"
    >
      <div>
        <span className="text-label text-foreground block">{label}</span>
        <span className="text-meta text-foreground/40">{sublabel}</span>
      </div>
      <div
        className={`w-10 h-5 rounded-full transition-colors ${checked ? "bg-[hsl(var(--aurora-cyan))]" : "bg-foreground/20"
          }`}
      >
        <motion.div
          animate={{ x: checked ? 20 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 rounded-full bg-background"
        />
      </div>
    </button>
  );
};

export default MapPage;
