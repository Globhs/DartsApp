import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, BarChart3, Play, LogOut } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  // Mock user data - replace with actual user data later
  const user = {
    name: "John Doe",
    email: "john@example.com",
    stats: {
      gamesPlayed: 156,
      winRate: 67,
      avg3Dart: 45.2,
    },
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              <Target className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">DartScore</h1>
              <p className="text-sm text-muted-foreground">Track your game</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{user.stats.gamesPlayed}</div>
                <div className="text-xs text-muted-foreground">Games Played</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{user.stats.winRate}%</div>
                <div className="text-xs text-muted-foreground">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{user.stats.avg3Dart}</div>
                <div className="text-xs text-muted-foreground">3 Dart Avg</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid gap-4">
          <Button
            size="lg"
            className="h-24 text-lg font-semibold"
            onClick={() => navigate("/game-modes")}
          >
            <Play className="w-6 h-6 mr-2" />
            Start Local Game
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-24 text-lg font-semibold"
            onClick={() => navigate("/stats")}
          >
            <BarChart3 className="w-6 h-6 mr-2" />
            View Statistics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
