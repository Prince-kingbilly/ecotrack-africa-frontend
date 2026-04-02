import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  color?: "green" | "amber" | "sky" | "earth";
}

const colorMap = {
  green: "bg-accent text-accent-foreground",
  amber: "bg-secondary/15 text-secondary",
  sky: "bg-eco-sky/10 text-eco-sky",
  earth: "bg-eco-earth/10 text-eco-earth",
};

const StatCard = ({ icon, value, label, color = "green" }: StatCardProps) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-soft animate-scale-in">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="font-display text-3xl font-bold text-foreground animate-count-up">
        {value}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
};

export default StatCard;
