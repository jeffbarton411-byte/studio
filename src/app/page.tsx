import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Edit3, Send, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full">
      <section className="w-full py-20 md:py-32 bg-card border-b">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  Streamline Your Agreements with FormFlow Pro
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Easily create, manage, and track applications with our intuitive multi-step form builder. Get started in minutes.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="font-semibold">
                  <Link href="/apply">Start Your Application</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-semibold">
                  <Link href="/admin">Admin Dashboard</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md p-8 bg-background rounded-2xl shadow-2xl">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-20"></div>
                  <div className="relative p-6 bg-card rounded-xl">
                    <h3 className="text-2xl font-bold text-center font-headline">Example Form Snippet</h3>
                    <p className="text-sm text-center text-muted-foreground mb-4">A peek into our clean interface.</p>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Edit3 className="w-5 h-5 text-primary"/>
                        </div>
                        <span className="font-medium">Personal Information</span>
                      </div>
                      <div className="flex items-center space-x-2">
                         <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-muted-foreground"/>
                        </div>
                        <span className="font-medium text-muted-foreground">Terms & Conditions</span>
                      </div>
                       <div className="flex items-center space-x-2">
                         <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Send className="w-5 h-5 text-muted-foreground"/>
                        </div>
                        <span className="font-medium text-muted-foreground">Submit & Track</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">How It Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform simplifies the entire application lifecycle, from submission to completion.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Edit3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl">1. Fill Out the Form</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Users complete a simple, multi-step form, providing all necessary information in a structured way.</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Send className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl">2. Submit & Track</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Upon submission, a unique tracking ID is generated, and a confirmation email with a PDF summary is sent.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl">3. Admin Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Admins review submissions, update statuses, and manage the entire application workflow from a centralized dashboard.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
