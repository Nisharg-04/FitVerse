import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Lock, Eye, Database, Bell, Trash, FileWarning } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto p-8">
          <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
            <Shield className="text-primary" />
            Privacy Policy
          </h1>
          
          <ScrollArea className="h-[70vh] pr-4">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Lock className="text-primary" />
                  Information We Collect
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We collect information to provide better services to our users:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Personal information (name, email, date of birth)</li>
                  <li>Fitness data (workouts, progress, goals)</li>
                  <li>Device information and usage statistics</li>
                  <li>Location data (with permission)</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Eye className="text-primary" />
                  How We Use Your Information
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Your information helps us provide and improve our services:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Personalize your fitness experience</li>
                  <li>Track your progress and achievements</li>
                  <li>Provide customer support</li>
                  <li>Send important updates and notifications</li>
                  <li>Improve our services and features</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Database className="text-primary" />
                  Data Storage and Security
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement strict security measures to protect your data:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>Encryption of sensitive information</li>
                  <li>Regular security audits</li>
                  <li>Secure data centers</li>
                  <li>Access controls and monitoring</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Bell className="text-primary" />
                  Communication Preferences
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  You can control how we communicate with you:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>Email notifications</li>
                  <li>Push notifications</li>
                  <li>Marketing communications</li>
                  <li>Newsletter subscriptions</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Trash className="text-primary" />
                  Data Deletion
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  You can request deletion of your account and associated data at any time. 
                  Some information may be retained for legal or business purposes. Contact our 
                  support team to initiate account deletion.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <FileWarning className="text-primary" />
                  Changes to Privacy Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this privacy policy periodically. We will notify you of any 
                  significant changes via email or app notification. Continued use of FitVerse 
                  after changes indicates acceptance of the updated policy.
                </p>
              </section>

              <section className="mt-8 pt-8 border-t">
                <p className="text-sm text-muted-foreground">
                  Last updated: August 21, 2025
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Contact us at privacy@fitverse.com for any privacy-related questions.
                </p>
              </section>
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
