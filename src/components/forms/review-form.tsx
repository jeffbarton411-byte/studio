"use client";

import { useFormContext } from "react-hook-form";
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
import { ArrowLeft, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Eye } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";

export const reviewSchema = z.object({
  signature: z.string().min(1, "Signature is required."),
  printName: z.string().min(1, "Printed name is required."),
  date: z.string().min(1, "Date is required."),
  email: z.string().email("Invalid email address."),
  howYouGetPaid: z.string().min(1, "Please select a payment method."),
});

interface ReviewFormProps {
  onBack: () => void;
}

const ReviewItem = ({ label, value }: { label: string; value?: string | string[] }) => (
  <div className="flex justify-between items-center py-2">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-sm font-medium text-right">{Array.isArray(value) ? value.join(', ') : (value || 'N/A')}</p>
  </div>
);

const DocumentPreviewItem = ({ label, url }: { label: string; url?: string }) => (
    <div className="flex justify-between items-center py-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      {url ? (
        <Button variant="ghost" size="sm" asChild>
          <Link href={url} target="_blank" rel="noopener noreferrer">
            <Eye className="mr-2 h-4 w-4" /> View Document
          </Link>
        </Button>
      ) : (
        <p className="text-sm font-medium">Not provided</p>
      )}
    </div>
  );

export default function ReviewForm({ onBack }: ReviewFormProps) {
  const form = useFormContext();
  const isPending = form.formState.isSubmitting;
  const allData = form.getValues();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold">Final Submission</h3>
        <p className="text-sm text-muted-foreground">Please fill out the details for step 5.</p>
      </div>

      <div className="space-y-4">
        <div>
            <h4 className="font-semibold">Term and Termination</h4>
            <p className="text-xs text-muted-foreground">This agreement becomes effective upon payment and remains active until the completion of the contracted services. Either party may terminate in writing at any time. Refund terms apply as per Section 4.</p>
        </div>
        <div>
            <h4 className="font-semibold">Entire Agreement</h4>
            <p className="text-xs text-muted-foreground">This Agreement contains the entire understanding between both parties and supersedes all prior agreements, written or oral.</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <FormField
          control={form.control}
          name="signature"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Signature</FormLabel>
              <FormControl>
                <Input placeholder="Enter your signature" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="printName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Print Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your printed name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date?.toISOString().split("T")[0])}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

       <FormField
          control={form.control}
          name="howYouGetPaid"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="font-semibold">How you get paid</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="factoring" />
                    </FormControl>
                    <FormLabel className="font-normal">Factoring</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ach" />
                    </FormControl>
                    <FormLabel className="font-normal">ACH DIRECT DEPOSIT METHOD</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      
      <Separator />

      <div className="space-y-6">
        <div>
            <h3 className="text-lg font-bold">Review Your Information</h3>
            <p className="text-sm text-muted-foreground">Please review all the information you provided before submitting the form.</p>
        </div>

        <div className="space-y-4">
            {/* Company Info */}
            <div className="p-4 border rounded-lg">
                <h4 className="font-bold mb-2">Company Information</h4>
                <ReviewItem label="Dispatch Company" value={allData.companyName} />
            </div>

            {/* Carrier Details */}
            <div className="p-4 border rounded-lg">
                <h4 className="font-bold mb-2">Carrier Details</h4>
                <ReviewItem label="Carrier Full Name" value={allData.carrierFullName} />
                <Separator className="my-1" />
                <ReviewItem label="Company Name" value={allData.carrierCompanyName} />
                 <Separator className="my-1" />
                <ReviewItem label="MC Number" value={allData.mcNumber} />
                 <Separator className="my-1" />
                <ReviewItem label="DOT Number" value={allData.dotNumber} />
                 <Separator className="my-1" />
                <ReviewItem label="Phone Number" value={allData.phoneNumber} />
                 <Separator className="my-1" />
                <ReviewItem label="Selected Services" value={allData.services} />
            </div>

            {/* Payment Details */}
            <div className="p-4 border rounded-lg">
                <h4 className="font-bold mb-2">Payment Details</h4>
                <ReviewItem label="Payment Option" value={allData.paymentMethod} />
            </div>

            {/* Document Uploads */}
            <div className="p-4 border rounded-lg">
                <h4 className="font-bold mb-2">Uploaded Documents</h4>
                <DocumentPreviewItem label="Copy of Insurance" url={allData.insuranceCopy} />
                <Separator className="my-1" />
                <DocumentPreviewItem label="Factoring Documents" url={allData.factoringDocuments} />
            </div>

             {/* Final Submission */}
            <div className="p-4 border rounded-lg">
                <h4 className="font-bold mb-2">Final Submission</h4>
                <ReviewItem label="Signature" value={allData.signature} />
                <Separator className="my-1" />
                <ReviewItem label="Print Name" value={allData.printName} />
                <Separator className="my-1" />
                <ReviewItem label="Email" value={allData.email} />
            </div>

        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button type="button" size="lg" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting Application...
            </>
          ) : (
            <>
              Submit Application
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
