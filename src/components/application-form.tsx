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

const fullSchema = companyInfoSchema.merge(carrierDetailsSchema).merge(paymentSchema).merge(documentUploadSchema).merge(reviewSchema);

type ApplicationFormValues = z.infer<typeof fullSchema>;

export default function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();

  const currentSchema = useMemo(() => {
    switch (step) {
      case 1:
        return companyInfoSchema;
      case 2:
        return carrierDetailsSchema;
      case 3:
        return paymentSchema;
      case 4:
        return documentUploadSchema;
      case 5:
        return reviewSchema;
      default:
        return companyInfoSchema;
    }
  }, [step]);


  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      companyName: "",
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
    context: { step },
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const processForm = (values: Partial<ApplicationFormValues>) => {
    if (step < 5) {
      nextStep();
    } else {
      startTransition(async () => {
        const allData = form.getValues();
        await submitApplication({ ...allData, ...values });
      });
    }
  };

  return (
    <div>
      <div className="p-8">
        <ApplicationStepper currentStep={step} />
      </div>
      <div className="p-8">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(processForm)} className="space-y-8">
                {step === 1 && <CompanyInfoForm />}
                {step === 2 && <CarrierDetailsForm onBack={prevStep} />}
                {step === 3 && <PaymentForm onBack={prevStep} />}
                {step === 4 && <DocumentUploadForm onBack={prevStep} />}
                {step === 5 && <ReviewForm onBack={prevStep} />}
            </form>
        </Form>
      </div>
    </div>
  );
}
