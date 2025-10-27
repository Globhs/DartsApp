import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X, ArrowRight, ArrowLeft } from "lucide-react";

type Player = {
  id: string;
  name: string;
  type: "friend" | "guest";
};

type TeamsViewProps = {
  players: Player[];
  onRemovePlayer: (id: string) => void;
  onAddPlayer: () => void;
};

export const TeamsView = ({ players, onRemovePlayer, onAddPlayer }: TeamsViewProps) => {
  const [team1, setTeam1] = useState<Player[]>([]);
  const [team2, setTeam2] = useState<Player[]>([]);

  // Distribute new players automatically
  const unassignedPlayers = players.filter(
    (p) => !team1.find((t) => t.id === p.id) && !team2.find((t) => t.id === p.id)
  );

  // Auto-assign unassigned players to balance teams
  if (unassignedPlayers.length > 0) {
    const newTeam1 = [...team1];
    const newTeam2 = [...team2];
    
    unassignedPlayers.forEach((player) => {
      if (newTeam1.length <= newTeam2.length) {
        newTeam1.push(player);
      } else {
        newTeam2.push(player);
      }
    });
    
    setTeam1(newTeam1);
    setTeam2(newTeam2);
  }

  const moveToTeam2 = (player: Player) => {
    setTeam1(team1.filter((p) => p.id !== player.id));
    setTeam2([...team2, player]);
  };

  const moveToTeam1 = (player: Player) => {
    setTeam2(team2.filter((p) => p.id !== player.id));
    setTeam1([...team1, player]);
  };

  const handleRemove = (id: string) => {
    setTeam1(team1.filter((p) => p.id !== id));
    setTeam2(team2.filter((p) => p.id !== id));
    onRemovePlayer(id);
  };

  const renderPlayerCard = (player: Player, team: 1 | 2) => (
    <div
      key={player.id}
      className="flex items-center justify-between p-3 rounded-lg bg-muted"
    >
      <div className="flex items-center gap-3 flex-1">
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
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => (team === 1 ? moveToTeam2(player) : moveToTeam1(player))}
        >
          {team === 1 ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleRemove(player.id)}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Team 1</CardTitle>
          <Button size="sm" onClick={onAddPlayer}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </CardHeader>
        <CardContent>
          {team1.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No players in team 1</p>
          ) : (
            <div className="space-y-2">
              {team1.map((player) => renderPlayerCard(player, 1))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Team 2</CardTitle>
          <Button size="sm" onClick={onAddPlayer}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </CardHeader>
        <CardContent>
          {team2.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No players in team 2</p>
          ) : (
            <div className="space-y-2">
              {team2.map((player) => renderPlayerCard(player, 2))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
