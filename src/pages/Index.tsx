import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-8 max-w-2xl px-4">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
            <Target className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>
        <div>
          <h1 className="mb-4 text-5xl font-bold">DartScore</h1>
          <p className="text-xl text-muted-foreground">
            Your ultimate dart scoring companion
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/auth")}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
