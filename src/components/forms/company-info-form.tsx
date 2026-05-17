"use client";

import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useFormContext } from "react-hook-form";

export const companyInfoSchema = z.object({
  companyName: z.string({ required_error: "Please select a company." }),
});

type CompanyInfoFormValues = z.infer<typeof companyInfoSchema>;

interface CompanyInfoFormProps {
}

export default function CompanyInfoForm({ }: CompanyInfoFormProps) {
  const form = useFormContext();
  const [selectedCompany, setSelectedCompany] = useState(form.getValues('companyName') || "");
  const isPending = form.formState.isSubmitting;
  
  const today = new Date();

  return (
    <>
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Dispatch Company Name:</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value);
                setSelectedCompany(value);
              }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="North Star Shipping LLC">North Star Shipping LLC</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground pt-1">(Hereinafter referred to as the {selectedCompany || "selected company"})</p>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedCompany && (
          <div className="space-y-4 rounded-lg bg-white/5 p-6 border border-white/10 glass">
            <h3 className="font-bold text-white">Dispatch/Service Provider Representative</h3>
            <p className="text-sm text-white/90">{selectedCompany}</p>
            <p className="text-sm text-muted-foreground">Date: {format(today, "yyyy-MM-dd")}</p>
          </div>
        )}
    </>
  );
}
