"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition, useState } from "react";
import CompanyInfoForm, { companyInfoSchema } from "./forms/company-info-form";
import CarrierDetailsForm, { carrierDetailsSchema } from "./forms/carrier-details-form";
import { submitApplication } from "@/app/actions/application";

const formSchema = companyInfoSchema.merge(carrierDetailsSchema);

type ApplicationFormValues = z.infer<typeof formSchema>;

export default function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      carrierFullName: "",
      carrierCompanyName: "",
      mcNumber: "",
      dotNumber: "",
      phoneNumber: "",
      services: [],
    },
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = (values: ApplicationFormValues) => {
    if (step < 4) {
      nextStep();
      return;
    }
    startTransition(async () => {
      await submitApplication(values);
    });
  };

  return (
    <div>
      {step === 1 && <CompanyInfoForm form={form} onSubmit={onSubmit} />}
      {step === 2 && <CarrierDetailsForm form={form} onSubmit={onSubmit} onBack={prevStep} />}
    </div>
  );
}
