"use client";

import { Separator } from "@/components/ui/separator";
import React from "react";
import { cn } from "@/lib/utils";

const steps = [
  { step: 1, title: 'Identity' },
  { step: 2, title: 'Fleet' },
  { step: 3, title: 'Billing' },
  { step: 4, title: 'Docs' },
  { step: 5, title: 'Finish' },
];

export default function ApplicationStepper({ currentStep = 1 }: { currentStep?: number }) {
  return (
    <div className="flex justify-between items-center mb-12 max-w-2xl mx-auto">
      {steps.map((item, index) => {
        const isActive = item.step === currentStep;
        const isCompleted = item.step < currentStep;

        return (
          <React.Fragment key={item.step}>
            <div className="flex flex-col items-center group relative">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 z-10",
                  isActive && "bg-primary border-primary text-primary-foreground scale-110 subtle-glow",
                  isCompleted && "bg-primary/20 border-primary text-primary",
                  !isActive && !isCompleted && "bg-muted border-white/10 text-muted-foreground"
                )}
              >
                {isCompleted ? "✓" : item.step}
              </div>
              <p className={cn(
                "absolute -bottom-7 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 relative overflow-hidden bg-white/10">
                <div 
                  className={cn(
                    "absolute inset-0 bg-primary transition-all duration-500",
                    isCompleted ? "translate-x-0" : "-translate-x-full"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
