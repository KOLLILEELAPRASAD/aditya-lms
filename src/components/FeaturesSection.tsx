
'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: string;
  color: string;
}

export default function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const features: Feature[] = [
    {
      title: 'Interactive Courses',
      description: 'Engage with dynamic lessons that adapt to your pace and learning style, offering personalized challenges and achievements.',
      icon: '🎮',
      color: 'bg-gradient-to-br from-violet-500 to-purple-700 ',
    },
    {
      title: 'AI Assistant',
      description: 'Get real-time guidance with our intelligent AI tutor available 24/7, helping you overcome obstacles and deepening your understanding.',
      icon: '🤖',
      color: 'bg-gradient-to-br from-cyan-500 to-blue-700',
    },
    {
      title: 'Expert Instruction',
      description: 'Learn directly from industry veterans with years of experience, bringing real-world insights and cutting-edge knowledge to every lesson.',
      icon: '👩‍🏫',
      color: 'bg-gradient-to-br from-amber-500 to-orange-700',
    },
    {
      title: 'Comprehensive Resources',
      description: 'Access our extensive library of materials including videos, quizzes, code samples, and community forums to accelerate your learning journey.',
      icon: '📚',
      color: 'bg-gradient-to-br from-emerald-500 to-green-700',
    },
  ];

  // Custom particle effect component
  const Particles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 rounded-full opacity-30 bg-primary`}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );

  return (
    <section className="relative bg-gradient-to-b from-background via-background/95 to-background/90 py-24 px-6 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5" />
      <Particles />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group animate-fade-in-up`}
              style={{ animationDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div 
                className={`relative h-full rounded-xl p-6 transition-all duration-300 
                ${hoveredIndex === index ? 'bg-card/90 border border-primary/20 shadow-lg transform scale-105' : 'bg-card/60 border border-border'}
                `}
              >
                {hoveredIndex === index && (
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-primary via-transparent to-transparent" />
                  </div>
                )}
                
                {/* Icon */}
                <div className={`w-16 h-16 mb-6 rounded-lg flex items-center justify-center text-2xl ${feature.color} shadow-lg`}>
                  <span className="text-white text-3xl">{feature.icon}</span>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-primary">{feature.title}</h3>
                <p className="text-muted-foreground mb-6">{feature.description}</p>
                
                {/* Learn more link */}
                <div className={`flex items-center text-sm font-medium transition-all duration-300 ${hoveredIndex === index ? 'text-primary' : 'text-muted-foreground'}`}>
                  <span>Learn more</span>
                  <ArrowRight className={`ml-2 h-4 w-4 transition-all duration-300 ${hoveredIndex === index ? 'translate-x-1' : ''}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="mt-20 text-center animate-fade-in" style={{ animationDelay: '800ms' }}>
          
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-100vh) translateX(30px); opacity: 0; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </section>
  );
}