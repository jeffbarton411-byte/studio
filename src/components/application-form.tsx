
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition, useState, useMemo } from "react";
import CompanyInfoForm, { companyInfoSchema } from "./forms/company-info-form";
import CarrierDetailsForm, { carrierDetailsSchema } from "./forms/carrier-details-form";
import { submitApplication } from "@/app/actions/application";
import ApplicationStepper from "./application-stepper";
import PaymentForm, { paymentSchema } from "./forms/payment-form";
import DocumentUploadForm, { documentUploadSchema } from "./forms/document-upload-form";
import ReviewForm, { reviewSchema } from "./forms/review-form";
import { Form } from "./ui/form";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

const fullSchema = companyInfoSchema.merge(carrierDetailsSchema).merge(paymentSchema).merge(documentUploadSchema).merge(reviewSchema);

type ApplicationFormValues = z.infer<typeof fullSchema>;

export default function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();

  const schemas = [
    companyInfoSchema,
    carrierDetailsSchema,
    paymentSchema,
    documentUploadSchema,
    reviewSchema
  ];

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(schemas[step - 1]),
    defaultValues: {
      companyName: "North Star Shipping LLC",
      carrierFullName: "",
      carrierCompanyName: "",
      mcNumber: "",
      dotNumber: "",
      phoneNumber: "",
      services: [],
      paymentMethod: "",
      insuranceCopy: "",
      factoringDocuments: "",
      signature: "",
      printName: "",
      date: new Date().toISOString().split("T")[0],
      email: "",
      howYouGetPaid: ""
    },
    mode: "onChange",
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const processForm = (values: ApplicationFormValues) => {
    startTransition(async () => {
      await submitApplication(values);
    });
  };

  const StepContent = () => {
    switch (step) {
      case 1:
        return <CompanyInfoForm />;
      case 2:
        return <CarrierDetailsForm />;
      case 3:
        return <PaymentForm />;
      case 4:
        return <DocumentUploadForm />;
      case 5:
        return <ReviewForm />;
      default:
        return null;
    }
  };

  const FormButtons = () => {
    if (step === 1) {
      return (
        <div className="flex justify-end">
          <Button type="button" size="lg" onClick={form.handleSubmit(nextStep)}>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    }
    if (step > 1 && step < 5) {
      return (
        <div className="flex justify-between">
          <Button type="button" size="lg" variant="outline" onClick={prevStep}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button type="button" size="lg" onClick={form.handleSubmit(nextStep)}>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    }
    if (step === 5) {
      return (
        <div className="flex justify-between mt-8">
          <Button type="button" size="lg" variant="outline" onClick={prevStep}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </div>
      );
    }
    return null;
  };


  return (
    <div>
      <div className="p-8">
        <ApplicationStepper currentStep={step} />
      </div>
      <div className="p-8">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(processForm)} className="space-y-8">
                <StepContent />
                <FormButtons />
            </form>
        </Form>
      </div>
    </div>
  );
}
