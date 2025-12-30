import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="grid-line-t">
      <div className="grid grid-cols-12">
        {/* Logo & Info */}
        <div className="col-span-4 grid-line-r p-8">
          <div className="mb-6">
            <span className="text-label text-foreground/60">MYCO</span>
            <span className="text-foreground/30 mx-2">//</span>
            <span className="text-label text-foreground">NEXUS</span>
          </div>
          <p className="text-meta text-foreground/40 leading-relaxed max-w-xs">
            Digital gateway to the fungal world. Connect chaos, discover creation.
          </p>
          <div className="mt-8 text-meta text-foreground/30">
            © 2024 MYCO NEXUS. ALL RIGHTS RESERVED.
          </div>
        </div>

        {/* Navigation */}
        <div className="col-span-3 grid-line-r p-8">
          <h4 className="text-meta text-foreground/30 mb-4">NAVIGATION</h4>
          <nav className="space-y-3">
            {["DISCOVER", "ARCHIVE", "MAP COMMUNITY", "INTERACTIVE LAB", "RECIPES"].map((item) => (
              <a
                key={item}
                href="#"
                className="block text-label text-foreground/50 hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        {/* Resources */}
        <div className="col-span-3 grid-line-r p-8">
          <h4 className="text-meta text-foreground/30 mb-4">RESOURCES</h4>
          <nav className="space-y-3">
            {["API DOCS", "CONTRIBUTE", "DATA SOURCES", "PRIVACY", "TERMS"].map((item) => (
              <a
                key={item}
                href="#"
                className="block text-label text-foreground/50 hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        {/* Status */}
        <div className="col-span-2 p-8">
          <h4 className="text-meta text-foreground/30 mb-4">SYSTEM STATUS</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--aurora-cyan))]" />
              <span className="text-meta text-foreground/50">API OPERATIONAL</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--aurora-cyan))]" />
              <span className="text-meta text-foreground/50">DB SYNCED</span>
            </div>
            <div className="text-meta text-foreground/30 mt-6">
              UPTIME: 99.98%
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="grid-line-t px-8 py-4 flex items-center justify-between">
        <span className="text-meta text-foreground/20">
          BUILT WITH OBSESSION
        </span>
        <span className="text-meta text-foreground/20">
          V.2024.12
        </span>
      </div>
    </footer>
  );
};

export default Footer;
