import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trophy, Target, Clock, BarChart } from "lucide-react";

const GameModes = () => {
  const navigate = useNavigate();

  const gameModes = [
    {
      id: "match",
      title: "Match",
      description: "Play a competitive match with custom rules",
      icon: Trophy,
      available: true,
    },
    {
      id: "checkout-121",
      title: "121 Checkout",
      description: "Practice your checkout skills",
      icon: Target,
      available: false,
    },
    {
      id: "around-clock",
      title: "Around the Clock",
      description: "Doubles training exercise",
      icon: Clock,
      available: false,
    },
    {
      id: "score-training",
      title: "Score Training",
      description: "Improve your scoring ability",
      icon: BarChart,
      available: false,
    },
    {
      id: "singles-training",
      title: "Singles Training",
      description: "Focus on single numbers",
      icon: Target,
      available: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Game Modes</h1>
            <p className="text-muted-foreground">Select your game type</p>
          </div>
        </div>

        {/* Game Modes Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {gameModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Card
                key={mode.id}
                className={!mode.available ? "opacity-50" : "cursor-pointer hover:border-primary transition-colors"}
                onClick={() => mode.available && navigate(`/match-setup`)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{mode.title}</CardTitle>
                  </div>
                  <CardDescription>{mode.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {mode.available ? (
                    <Button className="w-full">Play Now</Button>
                  ) : (
                    <Button className="w-full" disabled>
                      Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameModes;
