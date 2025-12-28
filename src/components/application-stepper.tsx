"use client";

import { Separator } from "@/components/ui/separator";
import React from "react";

const steps = [
  { step: 1, title: 'Company Info' },
  { step: 2, title: 'Carrier Details' },
  { step: 3, title: 'Payment' },
  { step: 4, title: 'Review & Submit' },
];

export default function ApplicationStepper({ currentStep = 1 }: { currentStep?: number }) {
  return (
    <div className="flex justify-between items-center mb-8 px-4 md:px-16">
      {steps.map((item, index) => (
        <React.Fragment key={item.step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 ${
                item.step <= currentStep ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-gray-300'
              }`}
            >
              {item.step}
            </div>
            <p className={`mt-2 text-sm font-medium text-center ${item.step <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>{item.title}</p>
          </div>
          {index < steps.length - 1 && <Separator className={`flex-1 max-w-xs ${index < currentStep - 1 ? 'bg-primary' : 'bg-gray-300'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}
