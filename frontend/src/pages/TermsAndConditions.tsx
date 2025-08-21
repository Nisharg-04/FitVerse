import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto p-8">
          <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
          
          <ScrollArea className="h-[70vh] pr-4">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using FitVerse, you accept and agree to be bound by the terms and 
                  provision of this agreement. Additionally, when using FitVerse's services, you shall 
                  be subject to any posted guidelines or rules applicable to such services.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. User Account</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To access certain features of FitVerse, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Promptly update any changes to your information</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Privacy Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your use of FitVerse is also governed by our Privacy Policy. Please review our 
                  Privacy Policy, which also governs the site and informs users of our data 
                  collection practices.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Users may post content, including but not limited to photos, profiles, and workout data. 
                  You agree that:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>You own or have rights to the content you post</li>
                  <li>Your content doesn't violate any third-party rights</li>
                  <li>Content must comply with our community guidelines</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Health Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  FitVerse provides fitness information and resources. However, this information is not 
                  medical advice. Consult healthcare professionals before starting any exercise program. 
                  You assume all risks associated with using our platform.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Subscription and Payments</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Some features require paid subscriptions. By subscribing:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>You authorize regular payments as per your chosen plan</li>
                  <li>Subscriptions auto-renew unless cancelled</li>
                  <li>Refunds are subject to our refund policy</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to terminate or suspend accounts for violations of these terms, 
                  illegal activities, or any other reason at our discretion. Users may terminate their 
                  accounts at any time.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  FitVerse reserves the right to modify these terms at any time. We will notify users 
                  of significant changes. Continued use after changes constitutes acceptance of new terms.
                </p>
              </section>

              <section className="mt-8 pt-8 border-t">
                <p className="text-sm text-muted-foreground">
                  Last updated: August 21, 2025
                </p>
              </section>
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default TermsAndConditions;
