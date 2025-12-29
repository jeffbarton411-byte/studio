import ApplicationForm from "@/components/application-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";

export default function ApplyPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 flex-1 bg-gray-50">
      <div className="text-center mb-10">
        <div className="flex justify-center items-center mb-4">
          <Image src="/logo.png" alt="Redwood Logo" width={200} height={50} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">TRUCKING SERVICE AGREEMENT</h1>
        <p className="text-muted-foreground">(Dedicated Lanes, Dispatch, Trailer Rental, and Setup Services)</p>
      </div>

      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
           <p className="text-center text-sm text-muted-foreground pt-6">This Agreement is made and entered into on {currentDate}, by and between: Redwood</p>
        </CardHeader>
        <CardContent className="p-0">
          <ApplicationForm />
        </CardContent>
      </Card>
    </div>
  );
}
