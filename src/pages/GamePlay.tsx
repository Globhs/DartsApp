import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Player = {
  id: string;
  name: string;
  type: "friend" | "guest";
  score: number;
  dartsThrown: number;
  lastScore: number;
  total: number;
};

type Multiplier = "single" | "double" | "triple";

type Dart = {
  number: number;
  multiplier: Multiplier;
  display: string;
};

export default function GamePlay() {
  const location = useLocation();
  const navigate = useNavigate();
  const { players: initialPlayers, settings } = location.state || {};

  const [players, setPlayers] = useState<Player[]>(
    initialPlayers?.map((p: any) => ({
      ...p,
      score: settings?.startScore || 501,
      dartsThrown: 0,
      lastScore: 0,
      total: 0,
    })) || []
  );
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [multiplier, setMultiplier] = useState<Multiplier>("single");
  const [currentDarts, setCurrentDarts] = useState<Dart[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [showBustConfirm, setShowBustConfirm] = useState(false);

  useEffect(() => {
    if (!initialPlayers || players.length === 0) {
      navigate("/match-setup");
    }
  }, [initialPlayers, players, navigate]);

  const calculateDartValue = (number: number, mult: Multiplier): number => {
    if (number === 25) return mult === "double" ? 50 : 25;
    return number * (mult === "single" ? 1 : mult === "double" ? 2 : 3);
  };

  const handleNumberClick = (number: number) => {
    if (currentDarts.length >= 3 || winner) return;

    const value = calculateDartValue(number, multiplier);
    const display =
      multiplier === "single"
        ? `${number}`
        : multiplier === "double"
        ? `D${number}`
        : `T${number}`;

    const newDarts = [...currentDarts, { number, multiplier, display }];
    setCurrentDarts(newDarts);

    // Check for bust on first dart
    if (newDarts.length === 1) {
      const currentPlayer = players[currentPlayerIndex];
      const newScore = currentPlayer.score - value;
      const requiresDouble = settings?.finishType === "double" || settings?.finishType === "master";
      
      if (newScore < 0 || (newScore === 0 && requiresDouble && multiplier !== "double")) {
        setShowBustConfirm(true);
      }
    }

    // Auto-submit when all 3 darts are entered
    if (newDarts.length === 3) {
      setTimeout(() => {
        submitDartsWithArray(newDarts);
      }, 100);
    }
  };

  const handleMiss = () => {
    if (currentDarts.length >= 3 || winner) return;
    setCurrentDarts([...currentDarts, { number: 0, multiplier: "single", display: "Miss" }]);
  };

  const handleBull = () => {
    if (multiplier === "triple") {
      toast({
        title: "Invalid",
        description: "Bull cannot be tripled",
        variant: "destructive",
      });
      return;
    }
    handleNumberClick(25);
  };

  const removeLastDart = () => {
    if (currentDarts.length > 0) {
      setCurrentDarts(currentDarts.slice(0, -1));
    }
  };

  const confirmBust = () => {
    setShowBustConfirm(false);
    setCurrentDarts([]);
    nextPlayer();
  };

  const submitDartsWithArray = (darts: Dart[]) => {
    if (darts.length === 0 || winner) return;

    const currentPlayer = players[currentPlayerIndex];
    const totalScore = darts.reduce((sum, dart) => sum + calculateDartValue(dart.number, dart.multiplier), 0);
    const newScore = currentPlayer.score - totalScore;
    const requiresDouble = settings?.finishType === "double" || settings?.finishType === "master";

    // Check for bust
    if (newScore < 0 || (newScore === 0 && requiresDouble && darts[darts.length - 1].multiplier !== "double")) {
      toast({
        title: "Bust!",
        description: `${currentPlayer.name} busted with ${totalScore}`,
        variant: "destructive",
      });
      setCurrentDarts([]);
      nextPlayer();
      return;
    }

    // Check for win
    if (newScore === 0) {
      setWinner(currentPlayer);
      toast({
        title: "🎯 Winner!",
        description: `${currentPlayer.name} wins the match!`,
      });
      return;
    }

    // Update player stats
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = {
      ...currentPlayer,
      score: newScore,
      lastScore: totalScore,
      dartsThrown: currentPlayer.dartsThrown + darts.length,
      total: currentPlayer.total + totalScore,
    };
    setPlayers(updatedPlayers);
    setCurrentDarts([]);
    nextPlayer();
  };

  const nextPlayer = () => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    setMultiplier("single");
  };

  const calculate3DartAvg = (player: Player) => {
    if (player.dartsThrown === 0) return "0.00";
    return ((player.total / player.dartsThrown) * 3).toFixed(2);
  };

  if (winner) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
            <CardTitle className="text-3xl">🎉 Winner!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-2xl font-bold text-primary">{winner.name}</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>3-Dart Average: {calculate3DartAvg(winner)}</p>
              <p>Darts Thrown: {winner.dartsThrown}</p>
            </div>
            <Button onClick={() => navigate("/home")} className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/match-setup")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Match</h1>
        </div>

        {/* Player Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((player, idx) => (
            <Card key={player.id} className={idx === currentPlayerIndex ? "ring-2 ring-primary" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{player.name}</CardTitle>
                  {idx === currentPlayerIndex && <Badge>Current</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-4xl font-bold text-primary">{player.score}</div>
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div>
                    <div className="font-semibold">3-Dart Avg</div>
                    <div>{calculate3DartAvg(player)}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Last Score</div>
                    <div>{player.lastScore}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Darts</div>
                    <div>{player.dartsThrown}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current Turn */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {currentPlayer?.name}'s Turn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Darts Display */}
            <div className="flex justify-center gap-4">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className="w-20 h-20 rounded-lg border-2 border-muted flex items-center justify-center text-lg font-bold"
                >
                  {currentDarts[idx]?.display || "-"}
                </div>
              ))}
            </div>

            {showBustConfirm && (
              <div className="text-center space-y-2">
                <p className="text-destructive font-semibold">Bust on first dart detected!</p>
                <Button onClick={confirmBust} variant="destructive">
                  Confirm Bust
                </Button>
              </div>
            )}

            {/* Multiplier Toggle */}
            <div className="flex justify-center gap-2">
              <Button
                variant={multiplier === "single" ? "default" : "outline"}
                onClick={() => setMultiplier("single")}
              >
                Single
              </Button>
              <Button
                variant={multiplier === "double" ? "default" : "outline"}
                onClick={() => setMultiplier("double")}
              >
                Double
              </Button>
              <Button
                variant={multiplier === "triple" ? "default" : "outline"}
                onClick={() => setMultiplier("triple")}
              >
                Triple
              </Button>
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  onClick={() => handleNumberClick(num)}
                  disabled={currentDarts.length >= 3 || showBustConfirm}
                  className="h-14"
                >
                  {num}
                </Button>
              ))}
            </div>

            {/* Special Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={handleBull}
                disabled={currentDarts.length >= 3 || showBustConfirm}
              >
                Bull (25)
              </Button>
              <Button
                variant="outline"
                onClick={handleMiss}
                disabled={currentDarts.length >= 3 || showBustConfirm}
              >
                Miss
              </Button>
              <Button
                variant="outline"
                onClick={removeLastDart}
                disabled={currentDarts.length === 0 || showBustConfirm}
              >
                Undo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
