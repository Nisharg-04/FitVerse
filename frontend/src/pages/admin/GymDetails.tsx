import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  DollarSign,
  Dumbbell,
  Star,
  Users,
} from "lucide-react";
import axios from "axios";

interface GymDetails {
  _id: string;
  name: string;
  address: {
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  location: {
    coordinates: [number, number];
  };
  contactNumber: string;
  email: string;
  description: string;
  monthlyFee: number;
  facilities: string[];
  timing: {
    opening: string;
    closing: string;
  };
  ownerId: {
    name: string;
    email: string;
  };
  isVerified: boolean;
  rating: number;
  memberCount: number;
  images: string[];
}

const GymDetails = () => {
  const { gymId } = useParams<{ gymId: string }>();
  const [gym, setGym] = useState<GymDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGymDetails = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/gym/${gymId}`,
          {
            withCredentials: true,
          }
        );
        console.log("Fetched gym details:", data.data);
        setGym(data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching gym details:", err);
        setError("Failed to fetch gym details");
      } finally {
        setLoading(false);
      }
    };

    if (gymId) {
      fetchGymDetails();
    }
  }, [gymId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !gym) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Error</h2>
          <p className="text-muted-foreground">{error || "Gym not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
              {gym.name}
            </h1>
            <p className="text-muted-foreground flex items-center mt-2">
              <MapPin className="h-4 w-4 mr-2" />
              {gym.address.addressLine}, {gym.address.city}, {gym.address.state}{" "}
              - {gym.address.pincode}
            </p>
          </div>
          <Badge variant={gym.isVerified ? "success" : "destructive"}>
            {gym.isVerified ? "Verified" : "Not Verified"}
          </Badge>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {gym.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${gym.name} - ${index + 1}`}
                      className="rounded-lg object-cover w-full h-48"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {gym.facilities || "Visit and explore facilities"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Contact */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Timing</span>
                  </div>
                  <span>6:00 AM - 10:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Per hour Fee</span>
                  </div>
                  <span>₹{gym.perHourPrice}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Rating</span>
                  </div>
                  <span>{gym.rating}/5</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{gym.contactNumber}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{gym.contactEmail}</span>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Owner Information</p>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p>{gym.ownerId.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {gym.ownerId.email}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymDetails;
