import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Clock, Dumbbell, QrCode, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const GymDiscovery = () => {
  const nearbyGyms = [
    {
      id: 1,
      name: "PowerHouse Fitness",
      distance: "0.3 km",
      rating: 4.8,
      reviews: 124,
      hours: "5:00 AM - 11:00 PM",
      services: ["Cardio", "Strength", "Swimming", "Yoga"],
      price: "₹2000/month",
      image: "/gym-placeholder.jpg"
    },
    {
      id: 2,
      name: "FitZone Gym",
      distance: "0.7 km",
      rating: 4.6,
      reviews: 89,
      hours: "6:00 AM - 10:00 PM",
      services: ["Cardio", "Strength", "Group Classes"],
      price: "₹1500/month",
      image: "/gym-placeholder.jpg"
    },
    {
      id: 3,
      name: "Elite Fitness Club",
      distance: "1.2 km",
      rating: 4.9,
      reviews: 256,
      hours: "24/7",
      services: ["Cardio", "Strength", "Swimming", "Spa", "Personal Training"],
      price: "₹3500/month",
      image: "/gym-placeholder.jpg"
    }
  ];

  return (
    <div className="w-full h-full rounded-2xl p-6 bg-gradient-to-br from-background via-background/95 to-background/90 border border-border/50">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
              Gym Discovery
            </h2>
            <p className="text-muted-foreground">Find and check-in to gyms nearby</p>
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
          {nearbyGyms.map((gym, index) => (
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
                        <Badge key={service} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold text-primary">{gym.price}</span>
                      <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                        Check In
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
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
            <div className="h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Interactive Map Coming Soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GymDiscovery;
