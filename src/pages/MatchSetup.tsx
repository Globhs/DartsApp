import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users, User, Plus, X } from "lucide-react";
import { AddPlayerDialog } from "@/components/AddPlayerDialog";
import { TeamsView } from "@/components/TeamsView";

type Player = {
  id: string;
  name: string;
  type: "friend" | "guest";
};

const MatchSetup = () => {
  const navigate = useNavigate();
  const [gameType, setGameType] = useState<"singles" | "teams">("singles");
  const [players, setPlayers] = useState<Player[]>([]);
  const [addPlayerOpen, setAddPlayerOpen] = useState(false);
  
  // Game settings
  const [matchType, setMatchType] = useState<"best-of" | "first-to">("best-of");
  const [scoreType, setScoreType] = useState<"legs" | "sets">("legs");
  const [playTo, setPlayTo] = useState("501");
  const [customScore, setCustomScore] = useState("");
  const [startRule, setStartRule] = useState("straight-in");
  const [endRule, setEndRule] = useState("double-out");

  const handleAddPlayer = (player: Player) => {
    setPlayers([...players, player]);
  };

  const handleRemovePlayer = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  const handleStartGame = () => {
    const gameSettings = {
      gameType,
      matchType,
      scoreType,
      startScore: parseInt(playTo === "custom" ? customScore : playTo),
      startType: startRule,
      finishType: endRule,
    };
    
    navigate("/game-play", { 
      state: { 
        players, 
        settings: gameSettings 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/game-modes")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Match Setup</h1>
            <p className="text-muted-foreground">Configure your game</p>
          </div>
        </div>

        {/* Game Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Game Type</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={gameType} onValueChange={(v) => setGameType(v as "singles" | "teams")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="singles" id="singles" />
                <Label htmlFor="singles" className="flex items-center gap-2 cursor-pointer">
                  <User className="w-4 h-4" />
                  Single Players
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teams" id="teams" />
                <Label htmlFor="teams" className="flex items-center gap-2 cursor-pointer">
                  <Users className="w-4 h-4" />
                  Teams
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Players Section */}
        {gameType === "singles" ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Players</CardTitle>
              <Button size="sm" onClick={() => setAddPlayerOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Player
              </Button>
            </CardHeader>
            <CardContent>
              {players.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No players added yet</p>
              ) : (
                <div className="space-y-2">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {player.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-xs text-muted-foreground capitalize">{player.type}</div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePlayer(player.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <TeamsView players={players} onRemovePlayer={handleRemovePlayer} onAddPlayer={() => setAddPlayerOpen(true)} />
        )}

        {/* Game Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Game Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Match Type */}
            <div className="space-y-2">
              <Label>Match Type</Label>
              <RadioGroup value={matchType} onValueChange={(v) => setMatchType(v as "best-of" | "first-to")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="best-of" id="best-of" />
                  <Label htmlFor="best-of" className="cursor-pointer">Best of</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="first-to" id="first-to" />
                  <Label htmlFor="first-to" className="cursor-pointer">First to</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Score Type */}
            <div className="space-y-2">
              <Label>Score Type</Label>
              <RadioGroup value={scoreType} onValueChange={(v) => setScoreType(v as "legs" | "sets")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="legs" id="legs" />
                  <Label htmlFor="legs" className="cursor-pointer">Legs</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sets" id="sets" />
                  <Label htmlFor="sets" className="cursor-pointer">Sets</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Play To */}
            <div className="space-y-2">
              <Label>Play To</Label>
              <Select value={playTo} onValueChange={setPlayTo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="301">301</SelectItem>
                  <SelectItem value="501">501</SelectItem>
                  <SelectItem value="701">701</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              {playTo === "custom" && (
                <Input
                  type="number"
                  placeholder="Enter custom score"
                  value={customScore}
                  onChange={(e) => setCustomScore(e.target.value)}
                />
              )}
            </div>

            {/* Start Rule */}
            <div className="space-y-2">
              <Label>Start Rule</Label>
              <Select value={startRule} onValueChange={setStartRule}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="straight-in">Straight In</SelectItem>
                  <SelectItem value="double-in">Double In</SelectItem>
                  <SelectItem value="master-in">Master In</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* End Rule */}
            <div className="space-y-2">
              <Label>End Rule</Label>
              <Select value={endRule} onValueChange={setEndRule}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="double-out">Double Out</SelectItem>
                  <SelectItem value="master-out">Master Out</SelectItem>
                  <SelectItem value="straight-out">Straight Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Start Game Button */}
        <Button
          size="lg"
          className="w-full"
          disabled={players.length < 1}
          onClick={handleStartGame}
        >
          Start Game
        </Button>

        <AddPlayerDialog
          open={addPlayerOpen}
          onOpenChange={setAddPlayerOpen}
          onAddPlayer={handleAddPlayer}
        />
      </div>
    </div>
  );
};

export default MatchSetup;
