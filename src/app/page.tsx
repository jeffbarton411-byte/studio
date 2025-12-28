import ApplicationForm from "@/components/application-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";

const steps = [
  { step: 1, title: 'Company Info', active: true },
  { step: 2, title: 'Carrier Details', active: false },
  { step: 3, title: 'Payment', active: false },
  { step: 4, title: 'Review & Submit', active: false },
];

function ApplicationStepper() {
  return (
    <div className="flex justify-between items-center mb-8 px-4 md:px-16">
      {steps.map((item, index) => (
        <React.Fragment key={item.step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 ${
                item.active ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-gray-300'
              }`}
            >
              {item.step}
            </div>
            <p className={`mt-2 text-sm font-medium text-center ${item.active ? 'text-primary' : 'text-muted-foreground'}`}>{item.title}</p>
          </div>
          {index < steps.length - 1 && <Separator className="flex-1 max-w-xs bg-gray-300" />}
        </React.Fragment>
      ))}
    </div>
  );
}


export default function ApplyPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 flex-1 bg-gray-50">
      <div className="text-center mb-10">
        <div className="flex justify-center items-center mb-4">
          <Image src="https://i.imgur.com/Puhj54j.png" alt="Redwood Logo" width={200} height={50} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">TRUCKING SERVICE AGREEMENT</h1>
        <p className="text-muted-foreground">(Dedicated Lanes, Dispatch, Trailer Rental, and Setup Services)</p>
      </div>

      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
           <p className="text-center text-sm text-muted-foreground pt-6">This Agreement is made and entered into on {currentDate}, by and between: Redwood</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-8">
            <ApplicationStepper />
          </div>
          <Separator />
          <div className="p-8">
            <ApplicationForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
