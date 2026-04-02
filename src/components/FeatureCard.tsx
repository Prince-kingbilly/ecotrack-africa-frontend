import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <div
      className="group bg-card rounded-lg p-6 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent text-primary mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-display text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
