import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="flex flex-col items-center text-center max-w-lg">
        <ShieldAlert className="h-20 w-20 text-destructive mb-6" />
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Sorry, you don't have permission to access this page. Please contact
          your administrator if you believe this is a mistake.
        </p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button onClick={() => navigate("/")} className="bg-primary">
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
