
"use client";

import { useState, useEffect } from "react";
import * as z from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormContext } from "react-hook-form";

export const paymentSchema = z.object({
  paymentMethod: z.string().min(1, { message: "Please select a payment option." }),
});

interface PaymentFormProps {
}

export default function PaymentForm({}: PaymentFormProps) {
    const form = useFormContext();
    const [formattedDate, setFormattedDate] = useState<string>("");

    useEffect(() => {
        // Set date on client only to avoid hydration mismatch
        setFormattedDate(new Date().toLocaleDateString());
    }, []);
  
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
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="chime" />
                    </FormControl>
                    <FormLabel className="font-normal">Chime</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="crypto" />
                    </FormControl>
                    <FormLabel className="font-normal">Cryptocurrency</FormLabel>
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
        <div className="space-y-1 rounded-lg bg-white/5 p-4 border border-white/10 glass">
            <h3 className="font-bold text-white">Dispatch/Service Provider Representative</h3>
            <p className="text-sm text-white/90">{form.getValues('companyName')}</p>
            {formattedDate && (
                <p className="text-sm text-muted-foreground">Date: {formattedDate}</p>
            )}
        </div>
      </div>
    </>
  );
}
