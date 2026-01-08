import ApplicationsTable from "@/app/admin/applications-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
         <div className="flex gap-2">
            <Button asChild>
                <Link href="/">Back to Home</Link>
            </Button>
             <Button asChild variant="outline">
                <Link href="/debug">Debug Page</Link>
            </Button>
         </div>
      </div>
      <p className="text-muted-foreground mb-8">
        View and manage all user applications in real-time. Changes will be reflected instantly.
      </p>
      <ApplicationsTable />
    </div>
  );
}
