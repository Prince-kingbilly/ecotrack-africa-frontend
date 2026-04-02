import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Report", path: "/report" },
  { label: "Tree Tracker", path: "/trees" },
  { label: "About", path: "/about" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <Leaf className="w-6 h-6" />
          EcoTrack Africa
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? "default" : "ghost"}
                size="sm"
              >
                {item.label}
              </Button>
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/report">
                <Button variant="hero" size="sm" className="ml-2">
                  Report Issue
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="ml-1">
                <LogOut className="w-4 h-4 mr-1" />
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="ml-2">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button variant="hero" size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 animate-fade-in">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            {user ? (
              <Button variant="ghost" className="w-full justify-start" onClick={() => { handleSignOut(); setMobileOpen(false); }}>
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </Button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Log in</Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)}>
                  <Button variant="hero" className="w-full">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
