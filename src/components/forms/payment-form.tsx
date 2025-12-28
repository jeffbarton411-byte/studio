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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

export const paymentSchema = z.object({
  paymentMethod: z.string().min(1, { message: "Please select a payment option." }),
});

interface PaymentFormProps {
  onBack: () => void;
}

export default function PaymentForm({ onBack }: PaymentFormProps) {
    const form = useFormContext();
    const isPending = form.formState.isSubmitting;
  
    return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold">Payment Terms</h3>
          <p className="text-sm text-muted-foreground">Payment is due prior to service activation.</p>
        </div>

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="font-semibold">Select Payment Option:</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="zelle" />
                    </FormControl>
                    <FormLabel className="font-normal">ZELLE TRANSFER</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="wire" />
                    </FormControl>
                    <FormLabel className="font-normal">Wire Transfer</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="paypal" />
                    </FormControl>
                    <FormLabel className="font-normal">PAYPAL</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-xs text-muted-foreground">Payments may be processed via third-party accounts to enable same-day service. A digital receipt will be issued upon payment.</p>
      </div>
      
      <div className="space-y-6 mt-8">
        <div>
          <h3 className="text-lg font-bold">Refund Policy</h3>
          <p className="text-sm text-muted-foreground">
            The $502 dedicated lane setup fee is refundable after the Client completes their first delivery arranged by the Company.
            Other service fees are non-refundable once service begins, as these are time-sensitive administrative tasks. Refunds will be
            issued via the original payment method within 5-7 business days, if applicable.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold">Client Responsibilities</h3>
            <p className="text-sm text-muted-foreground">The Client agrees to:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                <li>Provide accurate legal business and driver information</li>
                <li>Maintain active authority (MC/DOT) and valid insurance, unless Company is assisting with setup</li>
                <li>Communicate in a timely and professional manner</li>
                <li>Not engage in fraud, chargebacks, or misrepresentation</li>
            </ul>
        </div>
        <div>
            <h3 className="text-lg font-bold">No Employer-Employee Relationship</h3>
            <p className="text-sm text-muted-foreground">This Agreement does not create an employment relationship. The Client is an independent carrier and assumes all responsibility for tax, insurance, regulatory compliance, and FMCSA obligations.</p>
        </div>
        <div>
            <h3 className="text-lg font-bold">Authorized Communication Only</h3>
            <p className="text-sm text-muted-foreground">If contacted by any unauthorized third party, the Client must verify with the Company before sending payments or documents.</p>
        </div>
        <div>
            <h3 className="text-lg font-bold">Limitation of Liability</h3>
            <p className="text-sm text-muted-foreground">The Company is not liable for:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                <li>Any loss of income due to delays, market rates, or missed loads</li>
                <li>Legal or regulatory penalties due to false or missing information provided by the Client</li>
                <li>Broker cancellations or third-party payment processing delays</li>
            </ul>
        </div>
        <div className="space-y-1 rounded-lg bg-gray-50 p-4 border">
            <h3 className="font-bold">Dispatch/Service Provider Representative</h3>
            <p className="text-sm">{form.getValues('companyName')}</p>
            <p className="text-sm">Date: {new Date().toLocaleDateString()}</p>
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
    </>
  );
}
