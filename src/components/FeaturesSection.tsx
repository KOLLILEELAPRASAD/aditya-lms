// app/components/FeaturesSection.tsx
import { Sparkles } from 'lucide-react';
import FeaturesClient from './FeaturesClient';

const features = [
  {
    title: 'Interactive Courses',
    description:
      'Engage with dynamic lessons that adapt to your pace and learning style, offering personalized challenges and achievements.',
    icon: '🎮',
    color: 'bg-gradient-to-br from-violet-500 to-purple-700 ',
  },
  {
    title: 'AI Assistant',
    description:
      'Get real-time guidance with our intelligent AI tutor available 24/7, helping you overcome obstacles and deepening your understanding.',
    icon: '🤖',
    color: 'bg-gradient-to-br from-cyan-500 to-blue-700',
  },
  {
    title: 'Expert Instruction',
    description:
      'Learn directly from industry veterans with years of experience, bringing real-world insights and cutting-edge knowledge to every lesson.',
    icon: '👩‍🏫',
    color: 'bg-gradient-to-br from-amber-500 to-orange-700',
  },
  {
    title: 'Comprehensive Resources',
    description:
      'Access our extensive library of materials including videos, quizzes, code samples, and community forums to accelerate your learning journey.',
    icon: '📚',
    color: 'bg-gradient-to-br from-emerald-500 to-green-700',
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative bg-gradient-to-b from-background via-background/95 to-background/90 py-24 px-6 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary/5 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Platform Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary font-sans tracking-tight">
            Powerful Learning <span className="text-primary">Experience</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg md:text-xl">
            Discover the tools and resources designed to accelerate your growth and transform the way you learn.
          </p>
        </div>

        {/* Client Component */}
        <FeaturesClient features={features} />
      </div>

      
    </section>
  );
}
