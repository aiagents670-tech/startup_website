import AdminHeader from '@/components/admin/layout/AdminHeader';
import ServiceForm from '@/components/admin/services/ServiceForm';

export default function NewServicePage() {
  return (
    <>
      <AdminHeader title="Add Service" />
      <main className="flex-1 overflow-y-auto p-6">
        <ServiceForm />
      </main>
    </>
  );
}
