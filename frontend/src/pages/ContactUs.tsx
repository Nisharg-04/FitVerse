import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactUs = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement contact form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
        variant: "default",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about FitVerse? We're here to help! Send us a message
            and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Visit Us</h3>
                  <p className="text-muted-foreground">
                    BVM Engineering College
                    <br />
                    Vallabh Vidyanagar, Anand - 388 120
                    <br />
                    Gujarat, India
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="text-muted-foreground">
                    fitverse.team@gmail.com
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="text-muted-foreground">
                    +91 83205 22371
                    <br />
                    +91 95125 15257
                    <br />
                    +91 94265 68151
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="p-8 lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Map Section */}
        <div className="mt-16 ">
          <Card className="p-4 h-[400px] overflow-hidden">
            {/* Embed BVM Engineering College location */}
            <iframe
              src="https://www.google.com/maps?q=BVM+Engineering+College+Vallabh+Vidyanagar+Anand+Gujarat+India&output=embed"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="FitVerse Location - BVM Engineering College"
            />

            {/* Fallback link in case the embed is blocked or fails to load */}
            {/* <div className="mt-2 text-sm text-muted-foreground">
              <a
                href="https://www.google.com/maps?q=BVM+Engineering+College+Vallabh+Vidyanagar+Anand+Gujarat+India"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Open in Google Maps
              </a>
            </div> */}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
