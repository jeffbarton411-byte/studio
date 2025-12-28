
"use client";

import { type UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext } from "react-hook-form";

const services = [
  {
    id: "dedicated-lane-setup",
    label: "Dedicated Lane Setup $502 Refundable after first successful load delivery",
  },
  {
    id: "twic-card-application",
    label: "TWIC Card Application $445 Same-day processing",
  },
  {
    id: "trailer-rental",
    label: "Trailer Rental (3 months) $500 Subject to availability",
  },
  {
    id: "factoring-setup",
    label: "Factoring Setup $420 Same-day registration",
  },
  {
    id: "insurance-assistance",
    label: "Insurance Assistance $399 Fast-track insurance quote & setup",
  },
] as const;


export const carrierDetailsSchema = z.object({
  carrierFullName: z.string().min(1, { message: "Carrier full name is required." }),
  carrierCompanyName: z.string().optional(),
  mcNumber: z.string().min(1, { message: "MC Number is required." }),
  dotNumber: z.string().min(1, { message: "DOT Number is required." }),
  phoneNumber: z.string().min(1, { message: "Phone number is required." }),
  services: z.array(z.string()).min(1, "You have to select at least one service."),
});

type CarrierDetailsFormValues = z.infer<typeof carrierDetailsSchema>;

interface CarrierDetailsFormProps {
}

export default function CarrierDetailsForm({}: CarrierDetailsFormProps) {
  const form = useFormContext();

  return (
    <>
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="carrierFullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carrier Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Carrier Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="carrierCompanyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name (if applicable)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Company Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="mcNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MC Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Carrier MC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dotNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DOT Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Carrier USDOT" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Phone Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        
        <div className="space-y-4">
            <h3 className="font-bold">Purpose of Agreement</h3>
            <p className="text-sm text-muted-foreground">This Agreement outlines the terms and conditions under which the Company provides setup and logistics services to the Client, including but not limited to:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Dedicated freight lanes</li>
                <li>Dispatch assistance</li>
                <li>Trailer rental</li>
                <li>TWIC card application support</li>
                <li>Commercial insurance setup</li>
                <li>Factoring registration</li>
            </ul>
            <p className="text-sm text-muted-foreground">Access to high-paying loads through partnered shippers including Amazon & government contracts</p>
        </div>

        <FormField
          control={form.control}
          name="services"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base font-bold">Select Services With Fees:</FormLabel>
              </div>
              {services.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="services"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value: string) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-sm">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
    </>
  );
}
