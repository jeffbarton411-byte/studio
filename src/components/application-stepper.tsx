"use client";

import { Separator } from "@/components/ui/separator";
import React from "react";

const steps = [
  { step: 1, title: 'Company Info' },
  { step: 2, title: 'Carrier Details' },
  { step: 3, title: 'Payment' },
  { step: 4, title: 'Upload Documents' },
  { step: 5, title: 'Review & Submit' },
];

export default function ApplicationStepper({ currentStep = 1 }: { currentStep?: number }) {
  return (
    <div className="flex justify-between items-start mb-8 md:px-8 lg:px-16">
      {steps.map((item, index) => (
        <React.Fragment key={item.step}>
          <div className="flex flex-col items-center w-16 text-center">
            <div
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-base md:text-lg border-2 ${
                item.step <= currentStep ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-gray-300'
              }`}
            >
              {item.step}
            </div>
            <p className={`mt-2 text-[10px] md:text-sm font-medium leading-tight ${item.step <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>{item.title}</p>
          </div>
          {index < steps.length - 1 && (
            <Separator className={`flex-1 mt-4 mx-2 md:mx-4 ${index < currentStep - 1 ? 'bg-primary' : 'bg-gray-300'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
