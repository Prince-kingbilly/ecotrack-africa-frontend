import { Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-display text-xl font-bold mb-3">
              <Leaf className="w-5 h-5" />
              EcoTrack Africa
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Smart, community-powered environmental management across Africa. Together, we protect our planet.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Waste Management</li>
              <li>Tree Planting Tracker</li>
              <li>Pollution Reporting</li>
              <li>Country Dashboard</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">Get Involved</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Report an Issue</li>
              <li>Join a Community</li>
              <li>Partner With Us</li>
              <li>Contact Support</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm text-primary-foreground/50">
          © 2026 EcoTrack Africa. Protecting Africa's Environment, One Report at a Time.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
