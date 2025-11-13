import { Card } from "@/components/ui/card";
import { WaveEffect } from "@/components/ui/wave-effect";
import { motion } from "framer-motion";
import { Activity, Award, Heart, Target, Users } from "lucide-react";

const AboutUs = () => {
  const slogans = [
    "Get Fit, Feel Confident",
    "Transform Your Life",
    "Strength in Community",
    "Your Fitness Journey Starts Here",
    "FitVerse - Your Digital Fitness Partner",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Wave Animation */}
      <section className="relative h-[70vh] overflow-hidden bg-gradient-to-b from-black to-primary/20">
        <div className="absolute inset-0 w-full h-full z-20 bg-black/50" />
        <WaveEffect className="h-full absolute inset-0" />
        <div className="absolute inset-0 z-30 flex items-center justify-center text-white">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-white">
                Get Fit, Feel Confident
              </h1>
              <p className="mt-6 text-xl font-light max-w-2xl mx-auto">
                Welcome to FitVerse, where technology meets fitness to create a
                community of motivated individuals striving for their best
                selves.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                At FitVerse, we're committed to democratizing fitness by
                providing accessible, intelligent, and personalized solutions
                that empower individuals to take control of their health
                journey.
              </p>
            </Card>
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                We envision a world where everyone has the tools, knowledge, and
                support they need to achieve their fitness goals, fostering a
                global community of healthy, confident individuals.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <Heart className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-3">Passion</h3>
              <p className="text-muted-foreground">
                We're passionate about fitness and helping others achieve their
                goals
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <Activity className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-muted-foreground">
                Constantly evolving and improving our technology for better
                results
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-3">Community</h3>
              <p className="text-muted-foreground">
                Building a supportive network of fitness enthusiasts
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <Target className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-3">Results</h3>
              <p className="text-muted-foreground">
                Committed to helping you achieve measurable progress
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <img
                  src="/nisharg.jpg"
                  alt="Nisharg Soni"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nisharg Soni</h3>
              <p className="text-primary mb-2">Developer &amp; Co-founder</p>
              <p className="text-muted-foreground">
                Full-stack developer focused on building delightful fitness
                experiences
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <img
                  src="/ayush.jpg"
                  alt="Ayush Sarvaiya"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ayush Sarvaiya</h3>
              <p className="text-primary mb-2">Developer &amp; Co-founder</p>
              <p className="text-muted-foreground">
                Passionate about frontend UX and performance optimizations
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <img
                  src="/dakshil.jpg"
                  alt="Dakshil Gorasiya"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dakshil Gorasiya</h3>
              <p className="text-primary mb-2">Developer &amp; Co-founder</p>
              <p className="text-muted-foreground">
                Focused on backend services, integrations, and reliability
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Join Us Banner */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Join the FitVerse Community
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start your fitness journey today and become part of a community that
            supports and motivates each other to achieve their fitness goals.
          </p>
          <Award className="w-16 h-16 mx-auto opacity-50" />
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
