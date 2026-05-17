import ApplicationForm from "@/components/application-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React from "react";
import Image from "next/image";

export default function ApplyPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 flex-1">
      <div className="text-center mb-12 space-y-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative h-16 w-48 md:h-20 md:w-64">
            <Image 
              src="/logomm.png" 
              alt="drive4mmm logo" 
              fill 
              className="object-contain"
              priority
            />
          </div>
          <Badge variant="outline" className="border-primary/50 text-primary animate-pulse">
            New Opportunities for 2024
          </Badge>
        </div>
        <h1 className="text-5xl font-bold tracking-tighter font-headline bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-400 sr-only">
          drive4mmm
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Elite Trucking Service Agreement — Dedicated Lanes & Logistics Setup
        </p>
      </div>

      <Card className="max-w-4xl mx-auto glass subtle-glow border-white/5 overflow-hidden transition-all hover:border-white/10">
        <CardHeader className="bg-white/[0.02] border-b border-white/5 py-8">
           <p className="text-center text-sm text-muted-foreground uppercase tracking-widest font-medium">
             Agreement Effective: {currentDate}
           </p>
           <p className="text-center text-xs text-muted-foreground mt-2">
             Partnered with Elite Shippers & Government Contracts
           </p>
        </CardHeader>
        <CardContent className="p-0">
          <ApplicationForm />
        </CardContent>
      </Card>
    </div>
  );
}
