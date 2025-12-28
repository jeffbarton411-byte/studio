
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition, useState, type ReactNode } from "react";
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
import { useToast } from "./ui/use-toast";

const fullSchema = companyInfoSchema
  .merge(carrierDetailsSchema)
  .merge(paymentSchema)
  .merge(documentUploadSchema)
  .merge(reviewSchema);

type ApplicationFormValues = z.infer<typeof fullSchema>;

// Helper function to get field names from a Zod schema
const getStepFields = (step: number): (keyof ApplicationFormValues)[] => {
    switch (step) {
        case 1:
            return Object.keys(companyInfoSchema.shape) as (keyof ApplicationFormValues)[];
        case 2:
            return Object.keys(carrierDetailsSchema.shape) as (keyof ApplicationFormValues)[];
        case 3:
            return Object.keys(paymentSchema.shape) as (keyof ApplicationFormValues)[];
        case 4:
            return Object.keys(documentUploadSchema.shape) as (keyof ApplicationFormValues)[];
        case 5:
            return Object.keys(reviewSchema.shape) as (keyof ApplicationFormValues)[];
        default:
            return [];
    }
};

export default function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(fullSchema),
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
      howYouGetPaid: "",
    },
    mode: "onChange",
  });

  const nextStep = async () => {
    const fieldsToValidate = getStepFields(step);
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => prev + 1);
    } else {
        toast({
            title: "Incomplete Step",
            description: "Please fill out all required fields before proceeding.",
            variant: "destructive",
        });
    }
  };
  const prevStep = () => setStep((prev) => prev - 1);

  const processForm = (values: ApplicationFormValues) => {
    startTransition(async () => {
      const result = await submitApplication(values);
      if (result?.error) {
        toast({
          title: "Submission Error",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  const onSubmit = form.handleSubmit(processForm);


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
    return (
      <div className="flex justify-between">
        <Button type="button" size="lg" variant="outline" onClick={prevStep} disabled={step === 1}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        {step < 5 ? (
          <Button type="button" size="lg" onClick={nextStep}>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        )}
      </div>
    );
  };


  return (
    <div>
      <div className="p-8">
        <ApplicationStepper currentStep={step} />
      </div>
      <div className="p-8">
        <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-8">
                <StepContent />
                <FormButtons />
            </form>
        </Form>
      </div>
    </div>
  );
}
