import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
  return (
    <Card className={`relative overflow-hidden ${color} text-white`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>{icon}</div>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
        <p className="text-sm opacity-90">{label}</p>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-10">
        <div className="text-8xl transform rotate-12">{icon}</div>
      </div>
    </Card>
  );
};
