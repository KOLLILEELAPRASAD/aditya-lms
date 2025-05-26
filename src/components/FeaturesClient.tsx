'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface FeaturesClientProps {
  features: Feature[];
}

export default function FeaturesClient({ features }: FeaturesClientProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const Particles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full opacity-30 bg-primary"
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
    <div className="relative z-10">
      <Particles />

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

              <div
                className={`w-16 h-16 mb-6 rounded-lg flex items-center justify-center text-2xl ${feature.color} shadow-lg`}
              >
                <span className="text-white text-3xl">{feature.icon}</span>
              </div>

              <h3 className="text-xl font-bold mb-3 text-primary">{feature.title}</h3>
              <p className="text-muted-foreground mb-6">{feature.description}</p>

              <div
                className={`flex items-center text-sm font-medium transition-all duration-300 ${
                  hoveredIndex === index ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <span>Learn more</span>
                <ArrowRight
                  className={`ml-2 h-4 w-4 transition-all duration-300 ${
                    hoveredIndex === index ? 'translate-x-1' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
