import type { Metadata } from 'next';
import AboutHero from '@/components/about/AboutHero';
import AboutStory from '@/components/about/AboutStory';
import AboutTimeline from '@/components/about/AboutTimeline';
import ContactCTA from '@/components/home/ContactCTA';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about TechVision — our story, mission, values, team, and the journey that made us a leading IT services company serving 300+ clients globally.',
  openGraph: {
    title: 'About TechVision',
    description: 'Our story, mission, and the team behind 500+ successful projects.',
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutTimeline />
      <ContactCTA />
    </>
  );
}
