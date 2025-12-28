import ApplicationForm from "@/components/application-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const steps = [
  { step: 1, title: 'Personal Details', active: true },
  { step: 2, title: 'Agreement', active: false },
  { step: 3, title: 'Submit', active: false },
];

function ApplicationStepper() {
  return (
    <div className="flex justify-between items-center mb-8">
      {steps.map((item, index) => (
        <>
          <div key={item.step} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                item.active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {item.step}
            </div>
            <p className={`mt-2 text-sm font-medium ${item.active ? 'text-primary' : 'text-muted-foreground'}`}>{item.title}</p>
          </div>
          {index < steps.length - 1 && <Separator className="flex-1 max-w-xs bg-border" />}
        </>
      ))}
    </div>
  );
}


export default function ApplyPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 flex-1">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <ApplicationStepper />
          <CardTitle className="font-headline text-3xl text-center">Start Your Application</CardTitle>
          <CardDescription className="text-center">Please fill out your personal details below. This is the first step in our streamlined process.</CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationForm />
        </CardContent>
      </Card>
    </div>
  );
}
