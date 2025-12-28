"use client";

import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
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

export const companyInfoSchema = z.object({
  companyName: z.string({ required_error: "Please select a company." }),
});

type CompanyInfoFormValues = z.infer<typeof companyInfoSchema>;

interface CompanyInfoFormProps {
  form: UseFormReturn<any>;
  onSubmit: (values: CompanyInfoFormValues) => void;
}

export default function CompanyInfoForm({ form, onSubmit }: CompanyInfoFormProps) {
  const [selectedCompany, setSelectedCompany] = useState(form.getValues('companyName') || "");
  const isPending = form.formState.isSubmitting;
  
  const today = new Date();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="North Star Shipping LLC">North Star Shipping LLC</SelectItem>
                  <SelectItem value="South Pole Logistics">South Pole Logistics</SelectItem>
                  <SelectItem value="East Horizon Transport">East Horizon Transport</SelectItem>
                  <SelectItem value="West Wind Haulers">West Wind Haulers</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground pt-1">(Hereinafter referred to as the {selectedCompany || "selected company"})</p>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedCompany && (
          <div className="space-y-4 rounded-lg bg-gray-50 p-4 border">
            <h3 className="font-bold">Dispatch/Service Provider Representative</h3>
            <p className="text-sm">{selectedCompany}</p>
            <p className="text-sm">Date: {format(today, "yyyy-MM-dd")}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
