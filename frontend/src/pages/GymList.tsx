import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import {
  Loader2,
  Plus,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Dumbbell,
} from "lucide-react";

interface Gym {
  _id: string;
  name: string;
  addressLine: string;
  city: string;
  state: string;
  contactNumber: string;
  contactEmail: string;
  perHourPrice: number;
  features: string;
  images?: string[];
  approved?: boolean;
}

export default function GymList() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        if (!user?._id) {
          toast({
            title: "Error",
            description: "User not authenticated",
            variant: "destructive",
          });
          return;
        }

        const data = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/gym/findGymByOwner`,
          { ownerId: user._id },
          { withCredentials: true }
        );

        console.log("Gym Data by Owner:", data.data);

        if (data.data && Array.isArray(data.data.data)) {
          setGyms(data.data.data);
        } else {
          setGyms([]);
        }
      } catch (error: unknown) {
        const errorMessage =
          error && typeof error === "object" && "data" in error
            ? (error.data as { message?: string })?.message
            : "Failed to fetch gyms";

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        console.error("Error fetching gyms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, [user?._id, toast]);

  const handleGymSelect = (gymId: string) => {
    navigate(`/gymdashboard/${gymId}`);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Gyms</h1>
        <Button onClick={() => navigate("/add-new-gym")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Gym
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : gyms.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              You haven't added any gyms yet.
            </p>
            <Button onClick={() => navigate("/add-new-gym")}>
              Add Your First Gym
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gyms.map((gym) => (
            <Card
              key={gym._id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleGymSelect(gym._id)}
            >
              {/* Gym Image */}
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
                {gym.images && gym.images.length > 0 ? (
                  <img
                    src={gym.images[0]}
                    alt={gym.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Dumbbell className="h-16 w-16 text-white opacity-50" />
                  </div>
                )}
              </div>

              {/* Gym Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-xl font-bold">{gym.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {gym.city}, {gym.state}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{gym.addressLine}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{gym.contactNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{gym.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>₹{gym.perHourPrice}/hour</span>
                  </div>
                </div>

                {/* Approval Status */}
                {gym.approved !== undefined && (
                  <div className="pt-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        gym.approved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {gym.approved ? "Approved" : "Pending Approval"}
                    </span>
                  </div>
                )}

                {/* Select Button */}
                <Button
                  className="w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGymSelect(gym._id);
                  }}
                >
                  View Dashboard
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
