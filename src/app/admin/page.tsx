import { getApplications } from "@/app/actions/application";
import ApplicationsTable from "@/components/admin/applications-table";

export default async function AdminPage() {
  const applications = await getApplications();

  // Since Firestore Timestamps are not directly serializable for client components,
  // we convert them to a serializable format (ISO string).
  const serializableApplications = applications.map(app => ({
    ...app,
    createdAt: app.createdAt.toDate().toISOString(),
  }));

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 font-headline">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        View and manage all user applications. You can change the status of each application from the actions menu.
      </p>
      <ApplicationsTable initialApplications={serializableApplications} />
    </div>
  );
}
