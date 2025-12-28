
"use client";

import { useState } from "react";
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
import { ArrowRight, ArrowLeft, Loader2, Upload, CheckCircle, AlertCircle, Eye, File as FileIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { getCloudinarySignature } from "@/app/actions/cloudinary";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import Image from "next/image";

export const documentUploadSchema = z.object({
  insuranceCopy: z.string().optional(),
  factoringDocuments: z.string().optional(),
});

interface DocumentUploadFormProps {
  onBack: () => void;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

const FileUpload = ({ name, label }: { name: "insuranceCopy" | "factoringDocuments", label: string }) => {
  const { control, setValue, watch } = useFormContext();
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();
  
  const uploadedUrl = watch(name);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setFileName(file.name);

    try {
      const { signature, timestamp } = await getCloudinarySignature();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setValue(name, data.secure_url, { shouldValidate: true });
        setStatus("success");
        toast({ title: "Success", description: `${label} uploaded successfully.` });
      } else {
        setStatus("error");
        toast({ title: "Error", description: `Failed to upload ${label}.`, variant: "destructive" });
      }
    } catch (error) {
      console.error("Upload failed", error);
      setStatus("error");
      toast({ title: "Error", description: `An error occurred while uploading ${label}.`, variant: "destructive" });
    }
  };

  const getStatusIcon = () => {
    switch (status) {
        case "uploading": return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
        case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
        case "error": return <AlertCircle className="h-4 w-4 text-destructive" />;
        default: return <Upload className="h-4 w-4 text-muted-foreground" />;
    }
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                id={name}
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileUpload}
                disabled={status === "uploading"}
                accept="image/*,application/pdf"
              />
              <div className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background flex items-center justify-between">
                <span className="text-muted-foreground text-sm truncate">
                  {fileName || "Select a file..."}
                </span>
                {getStatusIcon()}
              </div>
            </div>
          </FormControl>
          <FormMessage />
          {uploadedUrl && (
            <div className="mt-2 p-2 border rounded-md bg-muted/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Preview:</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={uploadedUrl} target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" /> View Document
                  </Link>
                </Button>
              </div>
               {uploadedUrl.match(/\.(jpeg|jpg|gif|png|webp|avif)$/) != null ? (
                <Image src={uploadedUrl} alt="Preview" width={100} height={100} className="mt-2 rounded-md object-cover" />
              ) : (
                <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                  <FileIcon className="h-4 w-4" />
                  <span>No visual preview available for this file type.</span>
                </div>
              )}
            </div>
          )}
        </FormItem>
      )}
    />
  );
};


export default function DocumentUploadForm({ onBack }: DocumentUploadFormProps) {
  const form = useFormContext();
  const isPending = form.formState.isSubmitting;

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold">Upload Documents</h3>
          <p className="text-sm text-muted-foreground">
            Please upload the required documents. Accepted formats: PDF, JPG, PNG.
          </p>
        </div>
        <div className="space-y-4">
            <FileUpload name="insuranceCopy" label="Copy of Insurance" />
            <FileUpload name="factoringDocuments" label="Factoring Documents" />
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
              Processing...
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
