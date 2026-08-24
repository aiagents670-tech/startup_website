import AdminHeader from '@/components/admin/layout/AdminHeader';
import TestimonialForm from '@/components/admin/testimonials/TestimonialForm';

export default function NewTestimonialPage() {
  return (<><AdminHeader title="Add Testimonial" /><main className="flex-1 overflow-y-auto p-6"><TestimonialForm /></main></>);
}
