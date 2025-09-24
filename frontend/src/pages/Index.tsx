import React, { useState, useEffect, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Dumbbell,
  Target,
  TrendingUp,
  Users,
  MapPin,
  ShoppingBag,
  Apple,
  Bell,
  Star,
  ArrowRight,
  Play,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LazySection,
  SuspenseWrapper,
  LazyGlobeSection,
  LazyTimelineSection,
  LazyGeminiEffect,
  LazyFooter,
  LazyEarlySection,
  GlobeSuspenseWrapper,
} from "@/components/ui/LazyComponents";
import LoadingAnimation from "@/components/ui/LoadingAnimation";
import PerformanceMonitor from "@/components/ui/PerformanceMonitor";
import { isLowEndDevice } from "@/lib/optimizations";
import GlobeSection from "@/components/sections/GlobeSection";
import TimelineSection from "@/components/sections/TimelineSection";
import Footer from "@/components/layout/Footer";
import GoogleGeminiEffectDemo from "@/components/ui/google-gemini-effect-demo";
import GoogleFitConnectButton from "../components/GoogleFitConnectButton";
import CameraFeed from "../components/CameraFeed";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const lowEndDevice = typeof window !== "undefined" ? isLowEndDevice() : false;

  // Shorter animation durations for better performance
  const animationDuration = prefersReducedMotion || lowEndDevice ? 0 : 0.4;
  const animationDelay = prefersReducedMotion || lowEndDevice ? 0 : 0.1;

  useEffect(() => {
    // Simulate loading the essential content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Shorter loading time

    return () => clearTimeout(timer);
  }, []);

  // Preload critical images
  useEffect(() => {
    const preloadImages = ["/fitverse-logo.png"];

    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const features = [
    {
      icon: MapPin,
      title: "Find Gyms Nearby",
      description: "Discover and check-in to gyms with QR codes",
      color: "text-primary",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your fitness journey with detailed analytics",
      color: "text-success",
    },
    {
      icon: Apple,
      title: "Meal Planning",
      description: "AI-powered nutrition analysis and meal suggestions",
      color: "text-warning",
    },
    {
      icon: ShoppingBag,
      title: "Fitness Store",
      description: "Shop supplements, equipment, and gear",
      color: "text-secondary",
    },
  ];

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "1000+", label: "Partner Gyms" },
    { number: "10M+", label: "Workouts Tracked" },
    { number: "4.9★", label: "App Rating" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      content:
        "FitVerse transformed my fitness journey. The gym finder and meal planner are game-changers!",
      avatar: "👩‍💼",
    },
    {
      name: "Mike Chen",
      role: "Personal Trainer",
      content:
        "My clients love tracking their progress on FitVerse. The analytics are incredibly detailed.",
      avatar: "👨‍🏫",
    },
    {
      name: "Emma Davis",
      role: "Yoga Instructor",
      content:
        "The community features and workout tracking keep me motivated every day.",
      avatar: "🧘‍♀️",
    },
  ];

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Development Performance Monitor */}
      <PerformanceMonitor />

      <div>
        <h1>REMOVE IT</h1>
        <GoogleFitConnectButton />
      </div>
      {/* Next-Level Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Content */}
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: -20 }
              }
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: animationDuration, ease: "easeOut" }}
              className="space-y-8 z-10"
            >
              {/* Badge with Animation */}
              <motion.div
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 10 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: animationDuration,
                  delay: animationDelay,
                }}
                className="inline-block"
              >
                <Badge className="mb-8 px-8 py-4 text-base font-bold bg-gradient-to-r from-primary/15 to-secondary/15 border border-primary/30 backdrop-blur-sm hover:from-primary/25 hover:to-secondary/25 transition-all duration-300">
                  <Star className="w-5 h-5 text-yellow-500 mr-3" />
                  Voted #1 Fitness Platform 2025
                </Badge>
              </motion.div>

              {/* Main Headline with Simplified Animation */}
              <div className="space-y-4">
                <motion.h1
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: animationDuration,
                    delay: animationDelay * 2,
                  }}
                  className="text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight"
                >
                  <span className="block text-foreground">UNLEASH</span>
                  <span className="block bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
                    YOUR POWER
                  </span>
                </motion.h1>

                {/* Dynamic Feature Pills - Simplified */}
                <motion.div
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 10 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: animationDuration,
                    delay: animationDelay * 3,
                  }}
                  className="flex flex-wrap items-center gap-4 text-lg md:text-xl text-muted-foreground font-semibold"
                >
                  {[
                    { icon: TrendingUp, text: "AI Coaching", color: "success" },
                    { icon: Target, text: "Smart Goals", color: "primary" },
                    { icon: Users, text: "Community", color: "secondary" },
                  ].map((item, index) => (
                    <div
                      key={item.text}
                      className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm rounded-full border border-border/50"
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          item.color === "success"
                            ? "bg-success"
                            : item.color === "primary"
                            ? "bg-primary"
                            : "bg-secondary"
                        }`}
                      />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Enhanced Description */}
              <motion.div
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 10 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: animationDuration,
                  delay: animationDelay * 4,
                }}
                className="space-y-4"
              >
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl">
                  Transform your fitness journey with our revolutionary
                  AI-powered platform. Join over{" "}
                  <span className="text-primary font-bold">50,000+</span>{" "}
                  athletes achieving extraordinary results.
                </p>

                {/* Social Proof Avatars - Simplified */}
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary border-2 border-background flex items-center justify-center text-white font-bold"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="ml-2 font-semibold">
                        4.9/5 from 10,000+ reviews
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced CTA Buttons */}
              <motion.div
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 10 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: animationDuration,
                  delay: animationDelay * 5,
                }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register" className="flex-1">
                    <Button
                      size="lg"
                      className="w-full h-16 text-xl font-bold bg-gradient-to-r from-primary via-secondary to-success hover:from-primary/90 hover:via-secondary/90 hover:to-success/90 shadow-2xl hover:shadow-3xl transition-all duration-300 group relative overflow-hidden"
                    >
                      <Dumbbell className="mr-4 h-7 w-7 group-hover:rotate-12 transition-transform duration-300" />
                      Start Free Trial
                      <ArrowRight className="ml-4 h-7 w-7 group-hover:translate-x-2 transition-transform duration-300" />
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="lg"
                    className="h-16 text-xl font-semibold border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 group backdrop-blur-sm"
                  >
                    <Play className="mr-4 h-7 w-7 group-hover:scale-125 transition-transform duration-300" />
                    Watch Demo
                  </Button>
                </div>

                {/* Enhanced Stats Row - Simplified */}
                <div className="grid grid-cols-3 gap-8 pt-8">
                  {[
                    { number: "50K+", label: "Active Users", color: "primary" },
                    { number: "1M+", label: "Workouts", color: "success" },
                    { number: "4.9★", label: "App Rating", color: "secondary" },
                  ].map((stat, index) => (
                    <div
                      key={stat.label}
                      className="text-center group cursor-pointer"
                    >
                      <div
                        className={`text-3xl md:text-4xl font-black mb-2 ${
                          stat.color === "primary"
                            ? "text-primary"
                            : stat.color === "success"
                            ? "text-success"
                            : "text-secondary"
                        }`}
                      >
                        {stat.number}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual - Enhanced Dashboard - Simplified */}
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.9 }
              }
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: animationDuration * 1.5,
                delay: animationDelay * 2,
              }}
              className="relative hidden lg:block"
            >
              {/* Main Dashboard Container */}
              <div className="relative z-10 bg-gradient-to-br from-background/90 via-background/70 to-background/50 backdrop-blur-xl rounded-3xl p-8 border border-border/20 shadow-2xl">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                      <img
                        src="/fitverse-logo.png"
                        alt="FitVerse"
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">Today's Session</h3>
                      <p className="text-muted-foreground">
                        Upper Body • 52 min
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-success/20 text-success border-success/20 px-4 py-2">
                    <div className="w-2 h-2 bg-success rounded-full mr-2" />
                    Live
                  </Badge>
                </div>

                {/* Enhanced Progress Ring */}
                <div className="flex items-center justify-center mb-8">
                  <div className="relative">
                    <div className="w-40 h-40">
                      <svg
                        className="w-40 h-40 transform -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          className="text-muted/20"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray="283"
                          strokeDashoffset="85"
                          className="text-primary drop-shadow-lg"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-black text-primary mb-1">
                            70%
                          </div>
                          <div className="text-sm text-muted-foreground font-medium">
                            Complete
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-6">
                  {[
                    {
                      icon: TrendingUp,
                      value: "420",
                      label: "Calories",
                      color: "success",
                    },
                    {
                      icon: Target,
                      value: "15",
                      label: "Exercises",
                      color: "primary",
                    },
                    {
                      icon: Users,
                      value: "12.3k",
                      label: "Steps",
                      color: "secondary",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className={`text-center p-4 rounded-2xl border transition-all duration-300 hover:scale-105 cursor-pointer ${
                        stat.color === "success"
                          ? "bg-success/10 border-success/20 hover:bg-success/20"
                          : stat.color === "primary"
                          ? "bg-primary/10 border-primary/20 hover:bg-primary/20"
                          : "bg-secondary/10 border-secondary/20 hover:bg-secondary/20"
                      }`}
                    >
                      <stat.icon
                        className={`w-6 h-6 mx-auto mb-3 ${
                          stat.color === "success"
                            ? "text-success"
                            : stat.color === "primary"
                            ? "text-primary"
                            : "text-secondary"
                        }`}
                      />
                      <div
                        className={`text-2xl font-bold mb-1 ${
                          stat.color === "success"
                            ? "text-success"
                            : stat.color === "primary"
                            ? "text-primary"
                            : "text-secondary"
                        }`}
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Elements - Static instead of animated for better performance */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-2xl">
                <Target className="w-10 h-10 text-white" />
              </div>

              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-success to-primary rounded-2xl flex items-center justify-center shadow-2xl">
                <TrendingUp className="w-12 h-12 text-white" />
              </div>

              <div className="absolute top-1/2 -right-10 w-16 h-16 bg-gradient-to-br from-secondary to-success rounded-full flex items-center justify-center shadow-xl">
                <Bell className="w-8 h-8 text-white" />
              </div>

              <div className="absolute top-10 -left-6 w-18 h-18 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Apple className="w-9 h-9 text-white" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Simplified Background Effects */}
        <div className="absolute inset-0 -z-10">
          {/* Static gradient for better performance */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.1)_0%,transparent_50%),radial-gradient(circle_at_70%_30%,rgba(255,119,198,0.1)_0%,transparent_50%),radial-gradient(circle_at_40%_80%,rgba(119,198,255,0.1)_0%,transparent_50%)]" />

          {/* Static orbs instead of animated */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-success/20 to-primary/20 rounded-full blur-3xl opacity-20" />

          {/* Particle Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)]" />
        </div>
      </section>

      {/* Stats Section - Optimized */}
      <LazySection>
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                    {stat.number}
                  </div>
                  <p className="text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Features Section - Optimized */}
      <LazySection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Everything you need for
                <span className="text-gradient"> fitness success</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From gym discovery to nutrition tracking, FitVerse provides all
                the tools you need to achieve your fitness goals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={feature.title}>
                  <Card className="fitness-card h-full group hover:scale-105 transition-transform duration-300">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <feature.icon className={`h-8 w-8 ${feature.color}`} />
                      </div>
                      <h3 className="text-xl font-bold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Testimonials Section - Optimized */}
      <LazySection>
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Loved by{" "}
                <span className="text-gradient">fitness enthusiasts</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                See what our community has to say about their FitVerse
                experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.name}>
                  <Card className="fitness-card h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 text-warning fill-current"
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-6 italic">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-2xl mr-4">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* CTA Section - Optimized */}
      <LazySection>
        <section className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to transform your
                <span className="text-gradient"> fitness journey?</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of fitness enthusiasts who are already achieving
                their goals with FitVerse.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="btn-hero group">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Background Elements - Static for better performance */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
          </div>
        </section>
      </LazySection>

      {/* Lazy-loaded complex sections with early preloading */}
      <LazyEarlySection preloadMargin="1200px" renderMargin="400px">
        <GlobeSuspenseWrapper>
          <LazyGlobeSection />
        </GlobeSuspenseWrapper>
      </LazyEarlySection>

      <LazySection>
        <SuspenseWrapper>
          <LazyTimelineSection />
        </SuspenseWrapper>
      </LazySection>

      <LazySection>
        <SuspenseWrapper>
          <LazyGeminiEffect />
        </SuspenseWrapper>
      </LazySection>

      {/* Footer */}
      <SuspenseWrapper>
        <LazyFooter />
      </SuspenseWrapper>
    </div>
  );
};

export default Index;
