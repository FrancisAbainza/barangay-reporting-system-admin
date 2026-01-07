import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatType = {
  title: string;
  value: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
  color: string;
  bgColor: string;
}

export default function StatCard({stat}: {stat: StatType}) {
  return (
    <Card key={stat.title}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
        <div className={`rounded-full p-2 ${stat.bgColor}`}>
          <stat.icon className={`h-4 w-4 ${stat.color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.value}</div>
        <p className="text-xs text-muted-foreground">{stat.description}</p>
      </CardContent>
    </Card>
  );
}