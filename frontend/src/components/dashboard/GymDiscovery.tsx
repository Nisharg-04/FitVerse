import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Clock,
  Dumbbell,
  QrCode,
  Search,
  Filter,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import DeliveryMap from "../../pages/DeliveryMap";
import axios from "axios";

interface GymData {
  _id: string;
  name: string;
  location: {
    coordinates: [number, number];
  };
  distance: number;
  rating: number;
  reviewCount: number;
  operatingHours: string;
  services: string[];
  monthlyFee: number;
}

interface FormattedGym {
  id: string;
  name: string;
  distance: string;
  rating: number;
  reviews: number;
  hours: string;
  services: string[];
  price: string;
  image: string;
}

const GymDiscovery = () => {
  const navigate = useNavigate();
  const [nearbyGyms, setNearbyGyms] = useState<FormattedGym[]>([
    {
      id: "1",
      name: "PowerHouse Fitness",
      distance: "0.3 km",
      rating: 4.8,
      reviews: 124,
      hours: "5:00 AM - 11:00 PM",
      services: ["Cardio", "Strength", "Swimming", "Yoga"],
      price: "₹2000/month",
      image: "/gym-placeholder.jpg",
    },
    {
      id: "2",
      name: "FitZone Gym",
      distance: "0.7 km",
      rating: 4.6,
      reviews: 89,
      hours: "6:00 AM - 10:00 PM",
      services: ["Cardio", "Strength", "Group Classes"],
      price: "₹1500/month",
      image: "/gym-placeholder.jpg",
    },
    {
      id: "3",
      name: "Elite Fitness Club",
      distance: "1.2 km",
      rating: 4.9,
      reviews: 256,
      hours: "24/7",
      services: ["Cardio", "Strength", "Swimming", "Spa"],
      price: "₹3500/month",
      image: "/gym-placeholder.jpg",
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNearbyGyms = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:8000/api/gym/nearby-gyms",
          {
            longitude: 72.92299183119165,
            latitude: 22.550397327332604,
            radius: 2,
          }
        );

        const formattedGyms = data.data.slice(0, 3).map((gym) => ({
          id: gym._id,
          name: gym.name,
          distance: `0.3 km`,
          rating: gym.rating || 4.5,
          reviews: gym.reviewCount || 0,
          hours: gym.operatingHours || "24/7",
          services: gym.services || ["Cardio", "Strength"],
          price: `₹${gym.monthlyFee}/month`,
          image: "/gym-placeholder.jpg",
        }));
        console.log("Fetched gyms:", formattedGyms);
        console.log("Fetched gyms:", formattedGyms);
        setNearbyGyms(formattedGyms);
      } catch (error) {
        console.error("Error fetching nearby gyms:", error);
        // Default gyms are already set in the initial state
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyGyms();
  }, []);

  return (
    <div className="w-full h-full rounded-2xl p-6 bg-gradient-to-br from-background via-background/95 to-background/90 border border-border/50">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
              Gym Discovery
            </h2>
            <p className="text-muted-foreground">
              Find and check-in to gyms nearby
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-secondary">
            <QrCode className="h-4 w-4 mr-2" />
            QR Check-In
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search gyms..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Gym Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            nearbyGyms.map((gym, index) => (
              <motion.div
                key={gym.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="fitness-card hover:scale-105 transition-all duration-300">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg flex items-center justify-center">
                      <Dumbbell className="h-16 w-16 text-primary/60" />
                    </div>
                    <Badge className="absolute top-2 right-2 bg-success">
                      {gym.distance} away
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-lg">{gym.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span>{gym.rating}</span>
                          </div>
                          <span>({gym.reviews} reviews)</span>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {gym.hours}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {gym.services.map((service) => (
                          <Badge
                            key={service}
                            variant="secondary"
                            className="text-xs"
                          >
                            {service}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-primary/20 hover:bg-primary/5 transition-colors"
                          onClick={() => navigate(`/gym/${gym.id}`)}
                        >
                          <span className="flex items-center gap-1">
                            More Details
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                        >
                          Check In
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Map Placeholder */}
        <Card className="fitness-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Map View</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-border/50">
              <DeliveryMap height={100} width={100} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GymDiscovery;
