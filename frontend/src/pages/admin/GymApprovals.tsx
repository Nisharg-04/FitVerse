import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, MapPin, Phone, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface PendingGym {
  _id: string;
  name: string;
  address: {
    addressLine: string;
    city: string;
    state: string;
  };
  contactNumber: string;
  email: string;
  ownerId: {
    name: string;
    email: string;
  };
  createdAt: string;
}

const GymApprovals = () => {
  const navigate = useNavigate();
  const [pendingGyms, setPendingGyms] = useState<PendingGym[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingGyms = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/admin/pending-gym-requests",
        {
          withCredentials: true,
        }
      );
      console.log("Fetched pending gyms:", data);
      setPendingGyms(data.data);
    } catch (error) {
      console.error("Error fetching pending gyms:", error);
      toast.error("Failed to fetch pending gym requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingGyms();
  }, []);

  const handleGymStatus = async (gymId: string, isVerified: number) => {
    navigate("/admin/gym-approvals");
    try {
      await axios.post(
        "/admin/set-gym-status",
        {
          gymId,
          isVerified,
          reasonForRejection:
            isVerified === 0
              ? "Your gym application does not meet our current requirements. Please ensure all information is accurate and complete."
              : undefined,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(
        isVerified === 1 ? "Gym approved successfully" : "Gym rejected"
      );
      if (isVerified === 1) {
        navigate("/admin/gym-approvals", { replace: true });
      }
      // Refresh the list
      fetchPendingGyms();
    } catch (error) {
      console.error("Error updating gym status:", error);
      toast.error("Failed to update gym status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  console.log("Pending gyms:", pendingGyms);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
            Gym Approval Requests
          </CardTitle>
          <CardDescription>
            Review and manage pending gym registration requests
          </CardDescription>
        </CardHeader>
      </Card>
      ;
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingGyms.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-8">
            No pending gym requests to review
          </div>
        ) : (
          pendingGyms.map((gym) => (
            <Card key={gym._id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{gym.name}</CardTitle>
                <CardDescription>
                  <Badge variant="outline" className="mt-1">
                    Pending Review
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p>{gym.address.addressLine}</p>
                      <p>{`${gym.address.city}, ${gym.address.state}`}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{gym.contactNumber}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{gym.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      {/* <p><span className="font-medium">Owner:</span> {gym.owner?.name}</p>
                      <p className="text-muted-foreground">{gym.owner?.email}</p> */}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button
                      className="flex-1 bg-success hover:bg-success/90"
                      onClick={() => handleGymStatus(gym._id, 1)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleGymStatus(gym._id, 2)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default GymApprovals;
