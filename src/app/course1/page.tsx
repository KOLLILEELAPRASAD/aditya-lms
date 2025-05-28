/* File: app/course1/page.tsx */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  User,
  Settings,
  X,
  Menu,
  ChevronRight,
  Bell,
  Sun,
  Moon,
  List,
  Grid,
  Plus,
  Award,
  Trophy,
  Sparkles,
  CheckCircle,
  Download,
} from 'lucide-react';

// Profile Modal Component
const ProfileModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-lg border border-gray-300/50 rounded-lg p-6 w-full max-w-md shadow-xl shadow-gray-300/30">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">User Profile</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-violet-500 flex items-center justify-center text-white font-bold text-2xl">
            EA
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800">Enaya Ayat</h3>
            <p className="text-sm text-gray-500">enaya.ayat@example.com</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Role:</span> Student
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Joined:</span> January 2024
          </p>
        </div>
        <Button className="mt-4 w-full bg-gradient-to-r from-violet-500 to-violet-500 hover:from-violet-600 hover:to-fuchsia-600 text-white">
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

// HoverTooltip Component
const HoverTooltip = ({ children, text }: { children: React.ReactNode; text: string }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute hidden group-hover:block bg-gray-800/90 text-white text-xs rounded-lg py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap border border-gray-300/50">
        {text}
      </div>
    </div>
  );
};

// Define types for throttle function
type ThrottleFunction = (e: MouseEvent) => void;

export default function Course1Page() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Default to light theme for white background
  const [scheduleView, setScheduleView] = useState<'list' | 'calendar'>('list');
  const [isLoading, setIsLoading] = useState(true);
  // State for selected certificate
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  // States for modals in Profile Overview
  const [showCompletedCoursesModal, setShowCompletedCoursesModal] = useState(false);
  const [showPendingCoursesModal, setShowPendingCoursesModal] = useState(false);
  const [showCertificationsModal, setShowCertificationsModal] = useState(false);

  // Sample Data for Course1 Section
  const selectedCourses = [
    { id: 1, title: 'Advanced Python Programming', duration: '10 weeks', progress: 60, icon: '🐍' },
    { id: 2, title: 'UI/UX Design Principles', duration: '08 weeks', progress: 40, icon: '🎨' },
  ];

  const recommendedCourses = [
    { id: 1, title: 'Machine Learning Basics', duration: '12 weeks', icon: '🤖' },
    { id: 2, title: 'Data Visualization with D3.js', duration: '06 weeks', icon: '📊' },
  ];

  const certificationCourses = [
    { id: 1, title: 'Certified Python Developer', date: '2024-12-15', icon: '🏆' },
    { id: 2, title: 'UI/UX Design Certification', date: '2025-03-10', icon: '🏆' },
    { id: 3, title: 'AWS Cloud Practitioner', date: '2025-04-20', icon: '🏆' },
  ];

  // Sample Data for Completed Courses
  const completedCourses = [
    { id: 1, title: 'Introduction to JavaScript', duration: '06 weeks', completionDate: '2024-06-10', icon: '📜' },
    { id: 2, title: 'Web Development Fundamentals', duration: '08 weeks', completionDate: '2024-08-15', icon: '🌐' },
    { id: 3, title: 'Database Management', duration: '10 weeks', completionDate: '2024-10-20', icon: '🗄️' },
    { id: 4, title: 'Cybersecurity Basics', duration: '07 weeks', completionDate: '2024-11-05', icon: '🔒' },
    { id: 5, title: 'Digital Marketing', duration: '05 weeks', completionDate: '2024-12-01', icon: '📈' },
  ];

  // User Profile Stats
  const userStats = {
    completedCourses: completedCourses.length,
    pendingCourses: selectedCourses.length,
    certifications: certificationCourses.length,
    badges: [
      { id: 1, name: 'Python Master', icon: '🐍' },
      { id: 2, name: 'Design Pro', icon: '🎨' },
      { id: 3, name: 'Cloud Expert', icon: '☁️' },
    ],
  };

  // Map certifications to their respective course subjects
  const certificationSubjectMap: { [key: string]: string } = {
    'Certified Python Developer': 'Advanced Python Programming',
    'UI/UX Design Certification': 'UI/UX Design Principles',
    'AWS Cloud Practitioner': 'Cloud Computing',
  };

  // Simulate downloading a certificate in HD
  const handleDownloadCertificate = (certTitle: string) => {
    // In a real application, this would generate and download a high-quality PDF
    // For this example, we'll simulate a download with a mock URL
    const mockUrl = `https://example.com/certificates/${certTitle.replace(/\s+/g, '-').toLowerCase()}-hd.pdf`;
    const link = document.createElement('a');
    link.href = mockUrl;
    link.download = `${certTitle}-certificate-hd.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Throttled Parallax Effect
  const throttle = (func: ThrottleFunction, limit: number | undefined): ((e: MouseEvent) => void) => {
    let inThrottle: boolean = false;
    return (e: MouseEvent) => {
      if (!inThrottle) {
        func(e);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  const handleMouseMove = useCallback(
    throttle((e: MouseEvent) => {
      const elements = document.querySelectorAll('[data-parallax]');
      elements.forEach((el) => {
        const element = el as HTMLElement;
        const speed = parseFloat(element.getAttribute('data-parallax') || '0.03');
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        element.style.transform = `translate(${x}px, ${y}px)`;
      });
    }, 50),
    []
  );

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Get greeting based on time of day
  const getGreeting = (): string => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Handle card click for ripple effect
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.className =
      'absolute bg-violet-300/30 rounded-full animate-ripple pointer-events-none';
    card.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-800 text-lg">Loading Course Page...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 bg-white overflow-hidden relative`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(192,132,252,0.1)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1)_0%,transparent_60%)]" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(rgba(139,92,246,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.3)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Floating Particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-violet-300/40 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            opacity: 0.5 + Math.random() * 0.5,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${5 + Math.random() * 10}s`,
            boxShadow: '0 0 10px rgba(192, 132, 252, 0.6)',
          }}
        />
      ))}

      {/* Glowing Shapes */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`shape-${i}`}
          className="absolute backdrop-blur-sm opacity-30 animate-float"
          data-parallax={Math.random() * 0.05 + 0.01}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${40 + Math.random() * 60}px`,
            height: `${40 + Math.random() * 60}px`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${8 + Math.random() * 7}s`,
            transform: 'rotate(30deg)',
          }}
        >
          {i % 3 === 0 ? (
            <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-[0_0_10px_rgba(192,132,252,0.6)]">
              <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" fill="rgba(192, 132, 252, 0.5)" />
            </svg>
          ) : i % 3 === 1 ? (
            <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]">
              <circle cx="12" cy="12" r="10" fill="rgba(139, 92, 246, 0.5)" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-[0_0_10px_rgba(111,53,252,0.6)]">
              <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" fill="rgba(111, 53, 252, 0.5)" />
            </svg>
          )}
        </div>
      ))}

      {/* Profile Modal */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />

      {/* Completed Courses Modal */}
      {showCompletedCoursesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-lg border border-gray-300/50 rounded-lg p-6 w-full max-w-lg shadow-xl shadow-gray-300/30">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                Completed Courses
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowCompletedCoursesModal(false)} className="text-gray-600 hover:text-gray-800">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {completedCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 transition-all duration-200 shadow-sm"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center text-lg">
                      {course.icon}
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-sm text-gray-800">{course.title}</h4>
                      <p className="text-xs text-gray-600">Duration: {course.duration}</p>
                      <p className="text-xs text-gray-600">Completed on: {course.completionDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pending Courses Modal */}
      {showPendingCoursesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-lg border border-gray-300/50 rounded-lg p-6 w-full max-w-lg shadow-xl shadow-gray-300/30">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <ClipboardList className="h-6 w-6 mr-2 text-amber-600" />
                Pending Courses
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowPendingCoursesModal(false)} className="text-gray-600 hover:text-gray-800">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {selectedCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 transition-all duration-200 shadow-sm"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-amber-600/20 flex items-center justify-center text-lg">
                      {course.icon}
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-sm text-gray-800">{course.title}</h4>
                      <p className="text-xs text-gray-600">Duration: {course.duration}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Progress</span>
                      <span className="text-xs font-medium text-gray-800">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2 bg-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certifications Modal */}
      {showCertificationsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-lg border border-gray-300/50 rounded-lg p-6 w-full max-w-lg shadow-xl shadow-gray-300/30">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Award className="h-6 w-6 mr-2 text-violet-600" />
                Certifications
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowCertificationsModal(false)} className="text-gray-600 hover:text-gray-800">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {certificationCourses.map((cert) => (
                <div
                  key={cert.id}
                  className="p-4 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 transition-all duration-200 shadow-sm"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-lg">
                      {cert.icon}
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-sm text-gray-800">{cert.title}</h4>
                      <p className="text-xs text-gray-600">Completed on: {cert.date}</p>
                      <p className="text-xs text-gray-600">
                        Course Subject: {certificationSubjectMap[cert.title]}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownloadCertificate(cert.title)}
                    className="mt-2 bg-violet-500 hover:bg-violet-600 text-white text-xs flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download HD
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="flex">
        <aside
          className={`fixed inset-y-18 left-0 z-30 w-64 bg-white/90 backdrop-blur-lg border-r border-gray-300/50 shadow-lg shadow-gray-300/30 transition-all duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 `}
          role="navigation"
          aria-label="Sidebar Navigation"
        >
          <div className="flex items-center justify-between p-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-800 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-violet-500">
              <Sparkles className="h-6 w-6 mr-2 text-violet-400" />
              <span className="drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]">Learn</span>
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-600 hover:bg-gray-200"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close Sidebar"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="px-5 mb-6">
            <div
              className="flex items-center p-3 rounded-lg bg-gray-100/50 backdrop-blur-sm border border-gray-300/50 cursor-pointer hover:bg-gray-200/70 transition-colors duration-200"
              onClick={() => setIsProfileModalOpen(true)}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-500 flex items-center justify-center text-white font-bold">
                EA
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">Enaya Ayat</p>
              </div>
            </div>
          </div>

          <nav className="px-3">
            {[
              { name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, href: '/dashboard' },
              { name: 'Course', icon: <BookOpen className="h-5 w-5" />, href: '/course1', active: true },
              { name: 'Tasks', icon: <ClipboardList className="h-5 w-5" />, href: '/tasks' },
              { name: 'Profile', icon: <User className="h-5 w-5" />, href: '/profile' },
              { name: 'Settings', icon: <Settings className="h-5 w-5" />, href: '/settings' },
            ].map((item, index) => (
              <div key={item.name}>
                <Button
                  variant={item.active ? 'secondary' : 'ghost'}
                  className={`w-full justify-start mb-1 transition-all duration-200 ${
                    item.active
                      ? 'bg-violet-100/70 text-gray-800 hover:bg-violet-200/70'
                      : 'text-gray-600 hover:bg-gray-200/70 hover:text-gray-800 hover:scale-105'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    boxShadow: item.active ? '0 0 15px rgba(192, 132, 252, 0.2)' : 'none',
                  }}
                  asChild
                >
                  <a href={item.href} aria-label={`Navigate to ${item.name}`} className="group">
                    <div
                      className={`mr-3 ${
                        item.active ? 'text-violet-500' : 'text-gray-500 group-hover:text-violet-500'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span>{item.name}</span>
                    {item.active && <ChevronRight className="ml-auto h-4 w-4 text-violet-500" />}
                  </a>
                </Button>
                {index < 4 && <Separator className="my-2 bg-gray-300/50" />}
              </div>
            ))}
          </nav>
        </aside>

        {/* Sidebar Backdrop on Mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 ml-0 md:ml-64 p-6">
          {/* Top Navigation Bar */}
          <div className="flex justify-between items-center mb-8">
            {/* Hamburger Menu for Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-800 hover:bg-gray-200"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open Sidebar"
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Date & Time */}
            <div className="hidden md:flex flex-col">
              <h3 className="text-sm font-medium text-gray-800">
                {formatDate(currentTime)}
              </h3>
              <p className="text-xs text-gray-600">
                {formatTime(currentTime)}
              </p>
            </div>

            {/* Search, Notifications, Theme Toggle, and Avatar */}
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-4 pr-10 py-2 rounded-lg border border-gray-300/50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/50 placeholder-gray-500 bg-white/90 text-gray-800"
                />
                <span className="absolute right-3 top-2.5 text-gray-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </span>
              </div>

              <HoverTooltip text="">
                <div className="relative">
                  
                </div>
              </HoverTooltip>

              <HoverTooltip text={isDarkTheme ? '' : ''} children={undefined}>
                
              </HoverTooltip>

              <HoverTooltip text="">
                <div
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-violet-500 flex items-center justify-center text-white font-bold cursor-pointer"
                  onClick={() => setIsProfileModalOpen(true)}
                >
                  EA
                </div>
              </HoverTooltip>
            </div>
          </div>

          {/* Course1 Header */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h3 className="font-medium mb-2 text-violet-600">
                  {getGreeting()}
                </h3>
                <h1
                  className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(192,132,252,0.4)] bg-gradient-to-r from-gray-800 to-violet-500"
                >
                  Personalized Learning, Enaya
                </h1>
                <p className="mt-2 text-gray-600">
                  Explore your courses and track your achievements.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Selected Courses */}
              <Card
                className="relative overflow-hidden bg-white/90 backdrop-blur-lg border-gray-300/50 shadow-md shadow-gray-300/20  hover:ring-2 hover:ring-violet-300 transition-all duration-300 animate-fadeInUp text-gray-800"
                onClick={handleCardClick}
                style={{ animationDelay: '0ms' }}
              >
                {[...Array(5)].map((_, i) => (
                  <div
                    key={`card-particle-${i}`}
                    className="absolute rounded-full bg-violet-300/30 animate-float"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: `${1 + Math.random() * 3}px`,
                      height: `${1 + Math.random() * 3}px`,
                      opacity: 0.4 + Math.random() * 0.5,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${3 + Math.random() * 5}s`,
                    }}
                  />
                ))}
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-violet-600" />
                    Selected Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedCourses.map((course) => (
                      <div
                        key={course.id}
                        className="p-3 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 hover:scale-102 transition-all duration-200"
                      >
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center text-lg">
                            {course.icon}
                          </div>
                          <div className="ml-3 flex-1">
                            <h4 className="font-medium text-sm text-gray-800">
                              {course.title}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {course.duration}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600">
                              Progress
                            </span>
                            <span className="text-xs font-medium text-gray-800">
                              {course.progress}%
                            </span>
                          </div>
                          <Progress
                            value={course.progress}
                            className="h-1 bg-gray-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Courses */}
              <Card
                className="relative overflow-hidden bg-white/90 backdrop-blur-lg border-gray-300/50 shadow-md shadow-gray-300/20  hover:ring-2 hover:ring-violet-300 transition-all duration-300 animate-fadeInUp text-gray-800"
                onClick={handleCardClick}
                style={{ animationDelay: '100ms' }}
              >
                {[...Array(5)].map((_, i) => (
                  <div
                    key={`card-particle-${i}`}
                    className="absolute rounded-full bg-violet-300/30 animate-float"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: `${1 + Math.random() * 3}px`,
                      height: `${1 + Math.random() * 3}px`,
                      opacity: 0.4 + Math.random() * 0.5,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${3 + Math.random() * 5}s`,
                    }}
                  />
                ))}
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-violet-600" />
                    Recommended Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendedCourses.map((course) => (
                      <div
                        key={course.id}
                        className="p-3 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 hover:scale-102 transition-all duration-200"
                      >
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center text-lg">
                            {course.icon}
                          </div>
                          <div className="ml-3 flex-1">
                            <h4 className="font-medium text-sm text-gray-800">
                              {course.title}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {course.duration}
                            </p>
                          </div>
                        </div>
                        
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Certification Courses */}
              <Card
                className="relative overflow-hidden bg-white/90 backdrop-blur-lg border-gray-300/50 shadow-md shadow-gray-300/20  hover:ring-2 hover:ring-violet-300 transition-all duration-300 animate-fadeInUp text-gray-800"
                onClick={handleCardClick}
                style={{ animationDelay: '200ms' }}
              >
                {[...Array(5)].map((_, i) => (
                  <div
                    key={`card-particle-${i}`}
                    className="absolute rounded-full bg-violet-300/30 animate-float"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: `${1 + Math.random() * 3}px`,
                      height: `${1 + Math.random() * 3}px`,
                      opacity: 0.4 + Math.random() * 0.5,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${3 + Math.random() * 5}s`,
                    }}
                  />
                ))}
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-violet-600" />
                    Certification Courses ({certificationCourses.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedCertificate ? (
                      <div className="animate-fadeIn">
                        {/* Back Button */}
                        <button
                          onClick={() => setSelectedCertificate(null)}
                          className="mb-4 text-violet-600 hover:text-violet-800 flex items-center text-sm transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                          </svg>
                          Back to Certifications
                        </button>

                        {/* Certificate Details */}
                        <div className="p-4 rounded-lg bg-gray-100/50 border border-gray-300/50 shadow-sm">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-violet-600/20 flex items-center justify-center text-2xl">
                              🏆
                            </div>
                            <div className="ml-4">
                              <h4 className="font-medium text-lg text-gray-800">
                                {selectedCertificate.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Course Subject: {certificationSubjectMap[selectedCertificate.title]}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-800">Completed on:</span> {selectedCertificate.date}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-800">Awarded to:</span> Enaya Ayat
                            </p>
                          </div>
                          {/* Mock Certificate Preview */}
                          <div className="mt-4 p-4 bg-white border border-gray-300/50 rounded-lg shadow-inner">
                            <div className="flex justify-center mb-4">
                              <Award className="h-12 w-12 text-violet-600" />
                            </div>
                            <h5 className="text-center text-md font-semibold text-gray-800">
                              Certificate of Completion
                            </h5>
                            <p className="text-center text-sm text-gray-600 mt-2">
                              This certifies that Enaya Ayat has successfully completed the course
                              <span className="font-medium"> {certificationSubjectMap[selectedCertificate.title]}</span>.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      certificationCourses.map((cert) => (
                        <div
                          key={cert.id}
                          className="p-3 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 hover:scale-102 transition-all duration-200 cursor-pointer"
                          onClick={() => setSelectedCertificate(cert)}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center text-lg">
                              {cert.icon}
                            </div>
                            <div className="ml-3 flex-1">
                              <h4 className="font-medium text-sm text-gray-800">
                                {cert.title}
                              </h4>
                              <p className="text-xs text-gray-600">
                                Completed on {cert.date}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* User Profile & Stats */}
              <Card
                className="relative overflow-hidden bg-white/90 backdrop-blur-lg border-gray-300/50 shadow-md shadow-gray-300/20  hover:ring-2 hover:ring-violet-300 transition-all duration-300 animate-fadeInUp text-gray-800"
                onClick={handleCardClick}
                style={{ animationDelay: '300ms' }}
              >
                {[...Array(5)].map((_, i) => (
                  <div
                    key={`card-particle-${i}`}
                    className="absolute rounded-full bg-violet-300/30 animate-float"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: `${1 + Math.random() * 3}px`,
                      height: `${1 + Math.random() * 3}px`,
                      opacity: 0.4 + Math.random() * 0.5,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${3 + Math.random() * 5}s`,
                    }}
                  />
                ))}
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-violet-600" />
                    Profile Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* User Profile */}
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl">
                      EA
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Enaya Ayat
                      </h3>
                      <p className="text-sm text-gray-600">
                        enaya.ayat@example.com
                      </p>
                    </div>
                  </div>

                  {/* Stats Overview */}
                  <div className="space-y-4">
                    {/* Completed Courses */}
                    <div
                      className="p-3 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 hover:scale-102 transition-all duration-200 cursor-pointer"
                      onClick={() => setShowCompletedCoursesModal(true)}
                    >
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800">
                            Completed Courses
                          </h4>
                          <p className="text-xs text-gray-600">
                            {userStats.completedCourses} Courses
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pending Courses */}
                    <div
                      className="p-3 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 hover:scale-102 transition-all duration-200 cursor-pointer"
                      onClick={() => setShowPendingCoursesModal(true)}
                    >
                      <div className="flex items-center">
                        <ClipboardList className="h-5 w-5 mr-2 text-amber-600" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800">
                            Pending Courses
                          </h4>
                          <p className="text-xs text-gray-600">
                            {userStats.pendingCourses} Courses
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Certifications */}
                    <div
                      className="p-3 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 hover:scale-102 transition-all duration-200 cursor-pointer"
                      onClick={() => setShowCertificationsModal(true)}
                    >
                      <div className="flex items-center">
                        <Award className="h-5 w-5 mr-2 text-violet-600" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800">
                            Certifications
                          </h4>
                          <p className="text-xs text-gray-600">
                            {userStats.certifications} Certifications
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="p-3 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 hover:scale-102 transition-all duration-200">
                      <div className="flex items-center mb-2">
                        <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                        <h4 className="text-sm font-medium text-gray-800">
                          Badges Acquired
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {userStats.badges.map((badge) => (
                          <HoverTooltip key={badge.id} text={badge.name}>
                            <Badge className="bg-violet-500/80 text-xs flex items-center">
                              <span className="mr-1">{badge.icon}</span>
                              {badge.name}
                            </Badge>
                          </HoverTooltip>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions FAB */}
          <HoverTooltip text="Quick Actions">
            <div className="fixed bottom-6 right-6 z-40">
              <Button
                className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-500 to-violet-500 hover:from-violet-600 hover:to-fuchsia-600 text-white shadow-lg hover:scale-110 transition-all duration-200 flex items-center justify-center"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>
          </HoverTooltip>

          {/* Footer */}
          <footer className="mt-10 p-4 border-t border-gray-300">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} NeoLearn Education Platform. All rights reserved.
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Privacy Policy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Terms of Service
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Help Center
                </Button>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}