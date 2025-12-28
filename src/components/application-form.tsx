"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition, useState, useMemo } from "react";
import CompanyInfoForm, { companyInfoSchema } from "./forms/company-info-form";
import CarrierDetailsForm, { carrierDetailsSchema } from "./forms/carrier-details-form";
import { submitApplication } from "@/app/actions/application";
import ApplicationStepper from "./application-stepper";

const fullSchema = companyInfoSchema.merge(carrierDetailsSchema);

type ApplicationFormValues = z.infer<typeof fullSchema>;

export default function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();

  const currentSchema = useMemo(() => {
    if (step === 2) {
      return carrierDetailsSchema;
    }
    return companyInfoSchema;
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
    },
    // Re-validate on step change
    context: { step },
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = (values: ApplicationFormValues) => {
    if (step === 1) {
      nextStep();
    } else {
      startTransition(async () => {
        // To submit the full form, we need to merge the data from all steps
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
        {step === 1 && <CompanyInfoForm form={form} onSubmit={onSubmit} />}
        {step === 2 && <CarrierDetailsForm form={form} onSubmit={form.handleSubmit(onSubmit)} onBack={prevStep} />}
      </div>
    </div>
  );
}
