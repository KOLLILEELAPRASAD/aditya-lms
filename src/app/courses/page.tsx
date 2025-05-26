'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CourseCard } from '@/components/CourseCard';

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  videoUrl: string;
  learners: number;
  rating: number;
  category: string;
  level: string;
  isCertification: boolean;
  summary: string;
  interested?: boolean;
  recommended?: boolean;
  isCompleted?: boolean;
}

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');

  const courses: Course[] = [
    {
      id: 1,
      title: 'Python for Beginners',
      description: 'Learn Python programming from scratch with hands-on projects.',
      image: 'https://via.placeholder.com/300x150?text=Python+Course',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      learners: 12000,
      rating: 4.8,
      category: 'Technology',
      level: 'Beginner',
      isCertification: true,
      summary: 'This course covers Python basics, including variables, loops, and functions.',
      interested: true,
      recommended: true,
      isCompleted: true,
    },
    {
      id: 2,
      title: 'Advanced AI Techniques',
      description: 'Explore advanced AI concepts like neural networks and deep learning.',
      image: 'https://via.placeholder.com/300x150?text=AI+Course',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      learners: 8500,
      rating: 4.9,
      category: 'Technology',
      level: 'Advanced',
      isCertification: true,
      summary: 'Dive into AI with topics like neural networks, NLP, and computer vision.',
      interested: true,
      recommended: true,
      isCompleted: false,
    },
    {
      id: 3,
      title: 'Business Analytics',
      description: 'Master data analysis for business decision-making.',
      image: 'https://via.placeholder.com/300x150?text=Business+Analytics',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      learners: 9500,
      rating: 4.6,
      category: 'Business',
      level: 'Intermediate',
      isCertification: false,
      summary: 'Learn to analyze data and make informed business decisions.',
      recommended: true,
    },
    {
      id: 4,
      title: 'Web Development Bootcamp',
      description: 'Become a full-stack developer with this comprehensive bootcamp.',
      image: 'https://via.placeholder.com/300x150?text=Web+Development',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      learners: 15000,
      rating: 4.7,
      category: 'Technology',
      level: 'Intermediate',
      isCertification: true,
      summary: 'Covers HTML, CSS, JavaScript, and backend development.',
      isCompleted: true,
    },
    {
      id: 5,
      title: 'Digital Marketing',
      description: 'Learn the fundamentals of digital marketing and SEO.',
      image: 'https://via.placeholder.com/300x150?text=Digital+Marketing',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      learners: 7000,
      rating: 4.5,
      category: 'Business',
      level: 'Beginner',
      isCertification: false,
      summary: 'Understand SEO, social media marketing, and content strategies.',
    },
  ];

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || course.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || course.category === categoryFilter;
      const matchesLevel = levelFilter === 'All' || course.level === levelFilter;
      const matchesRating = ratingFilter === 'All' || (ratingFilter === '4+' && course.rating >= 4);
      return matchesSearch && matchesCategory && matchesLevel && matchesRating;
    });
  }, [search, categoryFilter, levelFilter, ratingFilter]);

  const interestedCourses = filteredCourses.filter((course) => course.interested);
  const recommendedCourses = filteredCourses.filter((course) => course.recommended);
  const certificationCourses = filteredCourses.filter((course) => course.isCertification);

  // Parallax Effect for 3D Elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const elements = document.querySelectorAll('[data-parallax]');
      elements.forEach((el) => {
        const element = el as HTMLElement;
        const speed = parseFloat(element.getAttribute('data-parallax') || '0.05');
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        element.style.transform = `translate(${x}px, ${y}px) rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50/30 py-12 px-6 overflow-hidden relative">
      {/* Background Effects */}
      {/* Subtle Shimmer Overlay */}
      <div
        className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent animate-shimmer"
        style={{ backgroundSize: '200% 200%' }}
      />

      {/* 3D Perspective Grid Lines */}
      <div
        className="absolute inset-0 perspective-1000 animate-fade-in-out"
        style={{ opacity: 0.2 }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.2)_1px,transparent_1px)] bg-[size:50px_50px] transform rotateX-60deg" />
      </div>

      {/* Glowing Particles with 3D Rotation */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary/40 animate-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            opacity: 0.5 + Math.random() * 0.5,
            animationDelay: `${i * 0.2}s`,
            animationDuration: `${5 + Math.random() * 5}s`,
            transform: `rotateZ(${Math.random() * 360}deg)`,
          }}
        />
      ))}

      {/* 3D Blurred Toy-Like Elements (Cubes, Spheres, Stars) */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`toy-${i}`}
          className="absolute backdrop-blur-sm opacity-30 animate-float perspective-1000"
          data-parallax="0.05"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${30 + Math.random() * 20}px`,
            height: `${30 + Math.random() * 20}px`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${4 + Math.random() * 3}s`,
            transform: `rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg)`,
          }}
        >
          {/* Different Shapes Based on Index */}
          {i % 3 === 0 ? (
            // Cube
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full"
              style={{
                filter: `drop-shadow(0 0 10px rgba(var(--primary), 0.5))`,
              }}
            >
              <path
                d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 2.83l6.55 3.28L12 11.17 5.45 8.11 12 4.83zm-8 5.34l6 3v7.33l-6-3v-7.33zm16 0v7.33l-6 3v-7.33l6-3z"
                fill={`hsl(var(--chart-${(i % 3) + 1}))`}
                fillOpacity="0.7"
              />
            </svg>
          ) : i % 3 === 1 ? (
            // Sphere
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full"
              style={{
                filter: `drop-shadow(0 0 10px rgba(var(--primary), 0.5))`,
              }}
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                fill={`hsl(var(--chart-${(i % 3) + 1}))`}
                fillOpacity="0.7"
              />
            </svg>
          ) : (
            // Star
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full"
              style={{
                filter: `drop-shadow(0 0 10px rgba(var(--primary), 0.5))`,
              }}
            >
              <path
                d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"
                fill={`hsl(var(--chart-${(i % 3) + 1}))`}
                fillOpacity="0.7"
              />
            </svg>
          )}
        </div>
      ))}

      {/* 3D Floating Particles (Larger Spheres) */}
      {[...Array(10)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute animate-float-slow perspective-1000"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${20 + Math.random() * 10}px`,
            height: `${20 + Math.random() * 10}px`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${6 + Math.random() * 4}s`,
            transform: `rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg)`,
            opacity: 0.4,
          }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <circle
              cx="12"
              cy="12"
              r="10"
              fill={`hsl(var(--chart-${(i % 3) + 1}))`}
              fillOpacity="0.5"
              style={{
                filter: `drop-shadow(0 0 8px rgba(var(--primary), 0.4))`,
              }}
            />
          </svg>
        </div>
      ))}

      {/* Heading and Description */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1
          className="text-5xl md:text-6xl font-bold font-sans text-primary animate-typewriter inline-block bg-clip-text"
          style={{ textShadow: '0 0 15px rgba(var(--primary), 0.6)' }}
        >
          Discover Your Learning Path
        </h1>
        <p
          className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto animate-fade-in"
          style={{ animationDelay: '1500ms' }}
        >
          Explore a wide range of courses tailored to your interests and career goals.<br />
          Start your journey today!
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="sticky top-0 z-20 py-8 px-6 mb-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 items-center">
          {/* Search Bar */}
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md bg-white/30 border-primary/50 text-foreground placeholder-muted-foreground focus:ring-primary focus:ring-2 transition-all duration-300 animate-float animate-glow-pulse rounded-radius-lg py-3 text-lg hover:shadow-lg"
            style={{ animationDelay: '0ms', boxShadow: '0 0 15px rgba(var(--primary), 0.3)' }}
          />

          {/* Filters */}
          <div className="flex gap-4 justify-center">
            <Select onValueChange={setCategoryFilter} defaultValue="All">
              <SelectTrigger className="bg-white/30 border-primary/50 text-foreground animate-float animate-glow-pulse rounded-radius-lg py-3 w-40 hover:shadow-lg" style={{ animationDelay: '200ms', boxShadow: '0 0 15px rgba(var(--primary), 0.3)' }}>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white border-primary/50 rounded-radius-md">
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setLevelFilter} defaultValue="All">
              <SelectTrigger className="bg-white/30 border-primary/50 text-foreground animate-float animate-glow-pulse rounded-radius-lg py-3 w-40 hover:shadow-lg" style={{ animationDelay: '400ms', boxShadow: '0 0 15px rgba(var(--primary), 0.3)' }}>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent className="bg-white border-primary/50 rounded-radius-md">
                <SelectItem value="All">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setRatingFilter} defaultValue="All">
              <SelectTrigger className="bg-white/30 border-primary/50 text-foreground animate-float animate-glow-pulse rounded-radius-lg py-3 w-40 hover:shadow-lg" style={{ animationDelay: '600ms', boxShadow: '0 0 15px rgba(var(--primary), 0.3)' }}>
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent className="bg-white border-primary/50 rounded-radius-md">
                <SelectItem value="All">All Ratings</SelectItem>
                <SelectItem value="4+">4+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Interested Courses Section */}
      <section className="mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <h2
              className="text-4xl font-bold text-foreground font-sans mb-8 animate-digital-fade bg-gradient-to-r from-primary to-primary bg-clip-text"
              style={{ textShadow: '0 0 15px rgba(var(--primary), 0.6)' }}
            >
              Interested Courses
            </h2>
          </div>
          {interestedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {interestedCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} animationDelay={index * 200} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No courses match your interests yet.</p>
          )}
        </div>
      </section>

      {/* Recommended Courses Section */}
      <section className="mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <h2
              className="text-4xl font-bold text-foreground font-sans mb-8 animate-digital-fade bg-gradient-to-r from-primary via to-primary bg-clip-text"
              style={{ textShadow: '0 0 15px rgba(var(--primary), 0.6)' }}
            >
              Recommended Courses
            </h2>
          </div>
          {recommendedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} animationDelay={index * 200} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No recommended courses available.</p>
          )}
        </div>
      </section>

      {/* All Courses Section */}
      <section className="mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <h2
              className="text-4xl font-bold text-foreground font-sans mb-8 animate-digital-fade bg-gradient-to-r from-primary via-primary bg-clip-text"
              style={{ textShadow: '0 0 15px rgba(var(--primary), 0.6)' }}
            >
              Courses
            </h2>
          </div>
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} animationDelay={index * 200} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No courses match your criteria.</p>
          )}
        </div>
      </section>

      {/* Certification Courses Section */}
      <section className="mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <h2
              className="text-4xl font-bold text-foreground font-sans mb-8 animate-digital-fade bg-gradient-to-r from-primary via-primary bg-clip-text"
              style={{ textShadow: '0 0 15px rgba(var(--primary), 0.6)' }}
            >
              Certification Courses
            </h2>
          </div>
          {certificationCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificationCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} animationDelay={index * 200} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No certification courses available.</p>
          )}
        </div>
      </section>
    </div>
  );
}