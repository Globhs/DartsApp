import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Users } from "lucide-react";

type Player = {
  id: string;
  name: string;
  type: "friend" | "guest";
};

type AddPlayerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPlayer: (player: Player) => void;
};

export const AddPlayerDialog = ({ open, onOpenChange, onAddPlayer }: AddPlayerDialogProps) => {
  const [guestName, setGuestName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  // Mock friends list - replace with actual data later
  const friends = [
    { id: "1", name: "Alice Johnson" },
    { id: "2", name: "Bob Smith" },
    { id: "3", name: "Charlie Brown" },
    { id: "4", name: "Diana Prince" },
  ];

  const handleAddGuest = () => {
    if (guestName.trim()) {
      onAddPlayer({
        id: `guest-${Date.now()}`,
        name: guestName,
        type: "guest",
      });
      setGuestName("");
      onOpenChange(false);
    }
  };

  const toggleFriend = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleAddFriends = () => {
    selectedFriends.forEach((friendId) => {
      const friend = friends.find((f) => f.id === friendId);
      if (friend) {
        onAddPlayer({
          id: `friend-${friendId}`,
          name: friend.name,
          type: "friend",
        });
      }
    });
    setSelectedFriends([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Players</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="friend" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="friend">
              <Users className="w-4 h-4 mr-2" />
              Friends
            </TabsTrigger>
            <TabsTrigger value="guest">
              <UserPlus className="w-4 h-4 mr-2" />
              Guest
            </TabsTrigger>
          </TabsList>
          <TabsContent value="friend" className="space-y-4">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {friends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => toggleFriend(friend.id)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedFriends.includes(friend.id)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold">
                        {friend.name.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium">{friend.name}</span>
                  </div>
                </button>
              ))}
            </div>
            <Button
              onClick={handleAddFriends}
              disabled={selectedFriends.length === 0}
              className="w-full"
            >
              Add {selectedFriends.length > 0 && `(${selectedFriends.length})`} Selected
            </Button>
          </TabsContent>
          <TabsContent value="guest" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guest-name">Guest Name</Label>
              <Input
                id="guest-name"
                placeholder="Enter guest name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddGuest();
                  }
                }}
              />
            </div>
            <Button onClick={handleAddGuest} disabled={!guestName.trim()} className="w-full">
              Add Guest
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
