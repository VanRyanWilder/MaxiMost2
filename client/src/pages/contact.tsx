import { 
  Mail, 
  MessageSquare, 
  Phone, 
  Send, 
  HelpCircle 
} from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate sending message
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible!",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <PageContainer title="Contact Us">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        
        {/* Main contact info card */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                <span>Email Us</span>
              </CardTitle>
              <CardDescription>Our primary contact method</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-primary">cs@maximost.com</p>
              <p className="text-sm text-muted-foreground mt-1">
                We typically respond within 24-48 hours
              </p>
              <Button 
                className="mt-4 w-full"
                variant="outline"
                asChild
              >
                <a href="mailto:cs@maximost.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Now
                </a>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-500" />
                <span>Community Support</span>
              </CardTitle>
              <CardDescription>Join our community channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Connect with other users and our team in our community forums and social media channels.
              </p>
              <div className="flex flex-col gap-2 mt-4">
                <Button variant="outline" className="justify-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4 text-blue-600"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  Facebook Community
                </Button>
                <Button variant="outline" className="justify-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4 text-blue-400"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                  Twitter
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-amber-500" />
                <span>Help Center</span>
              </CardTitle>
              <CardDescription>Find answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Browse our knowledge base for tutorials, guides, and answers to frequently asked questions.
              </p>
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  Visit Help Center
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Contact form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
            <CardDescription>
              Have a question or feedback? We'd love to hear from you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Your email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="How can we help you?" 
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)} 
                  required
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Quick answers to common questions about our service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">What is MaxiMost?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  MaxiMost is a holistic self-development platform focused on helping you build high-impact habits with scientifically proven methods. Our approach emphasizes doing the things that give you the "most bang for your buck" in terms of health, wellness, and life optimization.
                </p>
              </div>
              <div>
                <h3 className="font-medium">How do I get the most out of MaxiMost?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  For best results, we recommend focusing on one habit at a time, prioritizing the highest-impact habits for your goals, and tracking consistently each day. The platform is designed to help you identify which habits will give you the maximum return on your effort.
                </p>
              </div>
              <div>
                <h3 className="font-medium">What's the science behind MaxiMost?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  MaxiMost draws from behavioral psychology, neuroscience, and habit formation research. We curate evidence-based strategies from scientific literature and incorporate insights from leading experts in health, performance, and behavior change.
                </p>
              </div>
              <div>
                <h3 className="font-medium">How can I cancel my subscription?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You can manage your subscription from your account settings page. If you need assistance, please email us at cs@maximost.com and we'll be happy to help you.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}