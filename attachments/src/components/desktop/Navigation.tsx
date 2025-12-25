import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { LogIn, UserCircle, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import AuthModal from "./AuthModal";


const AuthSection = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  if (isAuthenticated && user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-3 px-3 py-2 hover:bg-card/50 transition-colors group"
        >
          <img
            src={user.avatar}
            alt={user.username}
            className="w-8 h-8 rounded-full border border-border"
          />
          <div className="text-left hidden md:block">
            <div className="text-meta text-foreground/60 leading-none mb-1">{user.username}</div>
            <div className="text-[10px] text-foreground/30 uppercase tracking-wider">Researcher</div>
          </div>
        </button>

        <AnimatePresence>
          {showUserMenu && (
            <>
              <div
                onClick={() => setShowUserMenu(false)}
                className="fixed inset-0 z-40"
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-56 bg-card border border-border z-50"
              >
                <div className="p-4 grid-line-b">
                  <div className="text-label text-foreground mb-1">{user.username}</div>
                  <div className="text-meta text-foreground/40">{user.email}</div>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate("/profile");
                    }}
                    className="w-full px-4 py-2 text-left text-meta text-foreground/60 hover:bg-background hover:text-foreground transition-colors flex items-center gap-3"
                  >
                    <UserIcon className="w-4 h-4" />
                    MY PROFILE
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left text-meta text-foreground/60 hover:bg-background hover:text-foreground transition-colors flex items-center gap-3"
                  >
                    <LogOut className="w-4 h-4" />
                    LOGOUT
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--aurora-cyan))] animate-pulse" />
        <span className="text-meta text-foreground/40">LIVE</span>
      </div>
      <div className="w-px h-6 bg-border" />
      <button
        onClick={() => setShowAuthModal(true)}
        className="flex items-center gap-2 px-4 py-2 text-meta text-foreground/60 hover:text-[hsl(var(--aurora-cyan))] transition-colors group"
      >
        <LogIn className="w-4 h-4" />
        <span>LOGIN</span>
      </button>
      <button
        onClick={() => setShowAuthModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--aurora-cyan)/0.1)] border border-[hsl(var(--aurora-cyan)/0.2)] text-meta text-[hsl(var(--aurora-cyan))] hover:bg-[hsl(var(--aurora-cyan)/0.2)] transition-colors"
      >
        <UserCircle className="w-4 h-4" />
        <span>REGISTER</span>
      </button>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

const navItems = [
  { path: "/", label: "DISCOVER", index: "00" },
  { path: "/archive", label: "ARCHIVE", index: "01" },
  { path: "/map", label: "MAP", index: "02" },
  { path: "/lab", label: "LAB", index: "03" },
  { path: "/recipes", label: "RECIPES", index: "04" },
  { path: "/news", label: "NEWS", index: "05" },
];

const Navigation = () => {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 grid-line-b bg-background/80 backdrop-blur-md"
    >
      <div className="w-full px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <span className="text-label text-foreground/60 group-hover:text-foreground transition-colors">
            MYCO
          </span>
          <span className="text-foreground/30">//</span>
          <span className="text-label text-foreground group-hover:text-[hsl(var(--aurora-cyan))] transition-colors">
            NEXUS
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative px-4 py-2 text-meta tracking-widest
                  transition-colors duration-300
                  ${isActive
                    ? "text-foreground"
                    : "text-foreground/40 hover:text-foreground/70"
                  }
                `}
              >
                <span className="text-foreground/20 mr-1">{item.index}</span>
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-4 right-4 h-px bg-[hsl(var(--aurora-cyan))]"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          <AuthSection />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
