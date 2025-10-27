import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const Stats = () => {
  const navigate = useNavigate();

  const stats = [
    {
      name: "180s Hit",
      value: 23,
    },
    {
      name: "Win/Loss Record",
      avg: "67%",
      best: "10 wins",
      worst: "5 losses",
    },
    {
      name: "3 Dart Average",
      avg: "45.2",
      best: "68.4",
      worst: "32.1",
    },
    {
      name: "First 9 Average",
      avg: "52.8",
      best: "75.2",
      worst: "38.6",
    },
    {
      name: "Checkout Rate",
      avg: "38%",
      best: "65%",
      worst: "22%",
    },
    {
      name: "Checkouts",
      avg: "42",
      best: "87",
      worst: "18",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Statistics</h1>
            <p className="text-muted-foreground">Your performance overview</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{stat.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {stat.name === "180s Hit" ? (
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">{stat.value}</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">AVG</div>
                      <div className="text-2xl font-bold text-primary">{stat.avg}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">BEST</div>
                      <div className="text-2xl font-bold text-secondary">{stat.best}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">WORST</div>
                      <div className="text-2xl font-bold text-muted-foreground">{stat.worst}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
