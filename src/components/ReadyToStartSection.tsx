'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Award, BarChart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Stat {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export function ReadyToStartSection() {
   const router = useRouter();
  
    const handleStartNowClick = () => {
      router.push('/courses');
    };
  
    const handleExploreNowClick = () => {
      router.push('/dashboard');
    };
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    // Auto-rotate through stat cards
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stats.length);
    }, 4000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const stats: Stat[] = [
    { 
      label: 'Active Students', 
      value: '50,000+', 
      icon: <BookOpen className="h-6 w-6" />,
      color: 'from-blue-600 to-blue-400'
    },
    { 
      label: 'Course Completion Rate', 
      value: '92%', 
      icon: <BarChart className="h-6 w-6" />,
      color: 'from-green-600 to-green-400'
    },
    { 
      label: 'Certified Graduates', 
      value: '25,000+', 
      icon: <Award className="h-6 w-6" />,
      color: 'from-amber-600 to-amber-400'
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-background via-slate-900/80 to-background py-24 px-6 min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Subtle Parallax Effect */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-800/10 via-transparent to-transparent"
        style={{ 
          transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`,
          transition: 'transform 0.2s ease-out'
        }}
      />

      {/* Light particles for subtle movement */}
      <div className="particle-container absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-gradient-to-r ${
              i % 3 === 0 ? 'from-blue-400 to-blue-500' : 
              i % 3 === 1 ? 'from-amber-400 to-amber-500' : 
              'from-green-400 to-green-500'
            } animate-float opacity-40 blur-sm`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animationDuration: `${15 + Math.random() * 20}s`,
              animationDelay: `${i * 0.3}s`,
              transform: `translateY(${Math.random() * 10 - 5}px)`
            }}
          />
        ))}
      </div>

      <div className={`max-w-6xl mx-auto text-center space-y-12 z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Professional Title */}
        <div className="relative">
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium uppercase tracking-wider text-violet-400 mb-2">Academic Excellence Platform</span>
            <h2 className="text-4xl lg:text-6xl font-bold text-black-700">
              Begin Your Academic 
              <span className="text-violet-600 ml-3 ">Journey</span>
            </h2>
            <div className="h-1 w-24 rounded-full bg-blue-500 mt-4"></div>
          </div>
        </div>

        {/* Professional Description */}
        <p className="text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
          Join a global community of learners and achieve your educational goals with our 
          <span className="relative inline-block mx-2 group cursor-pointer">
            <span className="text-white font-medium">personalized learning</span>
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            <span className="tooltip absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-48 z-20">
              Adaptive curriculum tailored to your learning style and pace
            </span>
          </span>
          platform designed by education experts.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
         <Button
            size="lg"
            className="group bg-gradient-to-r from-primary to-primary/80 hover:from-blue-500 hover:to-primary text-primary-foreground relative overflow-hidden px-8 py-6 text-base font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/50"
                        onClick={handleStartNowClick}

          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-ping absolute -left-4"></span>
                Explore Courses
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
          
          <Button
            size="lg"
            className="group bg-gradient-to-r from-primary to-primary/80 hover:from-blue-500 hover:to-primary text-primary-foreground relative overflow-hidden px-8 py-6 text-base font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/50"
            onClick={handleExploreNowClick}
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-ping absolute -left-4"></span>
                start exploring
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </div>

        {/* Statistics Cards - Professional and Clean */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className={`bg-slate-900/80 backdrop-blur-sm border-slate-700 transition-all duration-500 hover:shadow-md ${activeIndex === index ? 'border-l-4 border-l-blue-500' : ''}`}
              style={{
                transform: activeIndex === index ? 'scale(1.03)' : 'scale(1)'
              }}
            >
              <CardContent className="p-6 flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-gradient-to-r ${stat.color} text-white`}>
                  {stat.icon}
                </div>
                <p className={`text-3xl font-bold text-white mb-1`}>
                  {stat.value}
                </p>
                <p className="text-slate-300">{stat.label}</p>
                
                {/* Subtle highlight on hover */}
                <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-scan"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Educational Keywords */}
        <div className="mt-16 flex justify-center gap-8 text-sm text-slate-400 overflow-hidden">
          <div className="animate-marquee-slow whitespace-nowrap">
            <span className="mx-4">PERSONALIZED LEARNING</span>
            <span className="mx-4">ACADEMIC EXCELLENCE</span>
            <span className="mx-4">EXPERT INSTRUCTORS</span>
            <span className="mx-4">CERTIFICATION PROGRAMS</span>
            <span className="mx-4">GLOBAL COMMUNITY</span>
            <span className="mx-4">LIFELONG LEARNING</span>
          </div>
          <div className="absolute top-0 right-0 bg-gradient-to-l from-background to-transparent w-24 h-full"></div>
          <div className="absolute top-0 left-0 bg-gradient-to-r from-background to-transparent w-24 h-full"></div>
        </div>
      </div>

      {/* Refined styles */}
      <style jsx global>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        .animate-float {
          animation-name: float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-10px) translateX(5px); }
          66% { transform: translateY(10px) translateX(-5px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        
        .animate-scan {
          animation: scan 3s ease-in-out infinite;
        }
        
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-marquee-slow {
          animation: marquee 40s linear infinite;
        }
        
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        .tooltip {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(8px);
        }
      `}</style>
    </section>
  );
}