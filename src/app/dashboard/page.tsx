'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
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
  Calendar,
  TrendingUp,
  CheckCircle,
  X,
  Menu,
  ChevronRight,
  Bell,
  ArrowUp,
  Sparkles,
  Clock,
  AlertTriangle,
  Sun,
  Moon,
  List,
  Grid,
  Plus,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  ChartTooltip,
  Legend
);

// Define types for throttle function
type ThrottleFunction = (e: MouseEvent) => void;

// Define the Course interface
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

// Define interfaces for assignments, quizzes, and reports
interface Assignment {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  status: string;
}

interface AIQuiz {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  status: string;
}

interface AnalyticsReport {
  id: number;
  title: string;
  course: string;
  generatedDate: string;
  status: string;
}

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
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-400 flex items-center justify-center text-white font-bold text-2xl">
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

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [progressValue, setProgressValue] = useState<number>(0);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [scheduleView, setScheduleView] = useState<'list' | 'calendar'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [isTasksExpanded, setIsTasksExpanded] = useState(false);
  const [selectedTaskCategory, setSelectedTaskCategory] = useState<'Assignments' | 'AI Quiz' | 'Analytics Report' | null>(null);
  const router = useRouter();

  // Sample Data for Charts
  const progressData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Progress',
        data: [65, 75, 80, 90],
        borderColor: '#c084fc',
        backgroundColor: 'rgba(192, 132, 252, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#c084fc',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#c084fc',
        borderWidth: 3,
      },
    ],
  };

  const taskCompletionData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        label: 'Tasks',
        data: [12, 5, 3],
        backgroundColor: [
          'rgba(192, 132, 252, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(76, 29, 149, 0.7)',
        ],
        borderColor: '#c084fc',
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(192, 132, 252, 0.9)',
          'rgba(139, 92, 246, 0.9)',
          'rgba(76, 29, 149, 0.9)',
        ],
      },
    ],
  };

  // Sample Timetable Data
  const timetable = [
    { day: 'Monday', time: '10:00 AM', event: 'Python Basics', instructor: 'Dr. Smith' },
    { day: 'Tuesday', time: '2:00 PM', event: 'AI Techniques', instructor: 'Prof. Jones' },
    { day: 'Thursday', time: '11:00 AM', event: 'Business Analytics', instructor: 'Dr. Lee' },
  ];

  // Sample Tasks Data (Assignments, AI Quiz, Analytics Report)
  const assignments: Assignment[] = [
    { id: 1, title: 'Python Variables Assignment', course: 'Python Basics', dueDate: '2025-05-28', status: 'Pending' },
    { id: 2, title: 'Neural Networks Assignment', course: 'AI Techniques', dueDate: '2025-05-30', status: 'In Progress' },
    { id: 3, title: 'Data Analysis Assignment', course: 'Business Analytics', dueDate: '2025-06-01', status: 'Pending' },
  ];

  const aiQuizzes: AIQuiz[] = [
    { id: 1, title: 'Python Loops Quiz', course: 'Python Basics', dueDate: '2025-05-27', status: 'Pending' },
    { id: 2, title: 'Deep Learning Quiz', course: 'AI Techniques', dueDate: '2025-05-29', status: 'In Progress' },
    { id: 3, title: 'Analytics Basics Quiz', course: 'Business Analytics', dueDate: '2025-05-31', status: 'Pending' },
    { id: 4, title: 'Web Development Quiz', course: 'Web Development Bootcamp', dueDate: '2025-06-02', status: 'Pending' },
  ];

  const analyticsReports: AnalyticsReport[] = [
    { id: 1, title: 'Python Progress Report', course: 'Python Basics', generatedDate: '2025-05-20', status: 'Available' },
    { id: 2, title: 'AI Learning Report', course: 'AI Techniques', generatedDate: '2025-05-22', status: 'Available' },
    { id: 3, title: 'Business Analytics Report', course: 'Business Analytics', generatedDate: '2025-05-24', status: 'Available' },
  ];

  // Sample Courses Data (for My Courses section)
  const myCourses = [
    { id: 1, title: 'Python Basics', duration: '08 weeks', progress: 75, icon: '🐍' },
    { id: 2, title: 'AI Techniques', duration: '06 weeks', progress: 45, icon: '🤖' },
    { id: 3, title: 'Business Analytics', duration: '10 weeks', progress: 30, icon: '📊' },
  ];

  // Courses data from /courses/page.tsx
  const availableCourses: Course[] = [
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

  // Map myCourses titles to availableCourses titles for consistency
  const courseTitleMap: { [key: string]: string } = {
    'Python Basics': 'Python for Beginners',
    'AI Techniques': 'Advanced AI Techniques',
    'Business Analytics': 'Business Analytics',
  };

  // Filter tasks, quizzes, and reports based on user's enrolled courses
  const userCourseTitles = myCourses.map((course) => course.title);
  const userAssignments = assignments.filter((assignment) => userCourseTitles.includes(assignment.course));

  // Determine user's interested categories
  const enrolledAvailableCourses = availableCourses.filter((course) =>
    Object.values(courseTitleMap).includes(course.title)
  );
  const interestedCategories = enrolledAvailableCourses
    .filter((course) => course.interested)
    .map((course) => course.category);

  // Filter quizzes by both enrolled courses and interested categories
  const userAIQuizzes = aiQuizzes.filter((quiz) => {
    const isEnrolled = userCourseTitles.includes(quiz.course);
    if (!isEnrolled) return false;
    const mappedCourseTitle = courseTitleMap[quiz.course] || quiz.course;
    const course = availableCourses.find((c) => c.title === mappedCourseTitle);
    return course && interestedCategories.includes(course.category);
  });

  const userAnalyticsReports = analyticsReports.filter((report) => userCourseTitles.includes(report.course));

  // Helper function to convert title to slug
  const titleToSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, ''); // Remove special characters
  };

  // Function to find the video URL for a given event
  const findCourseVideoUrl = (eventName: string): string | null => {
    const standardizedEventName = eventName
      .toLowerCase()
      .replace('python basics', 'python for beginners')
      .replace('ai techniques', 'advanced ai techniques');

    const matchedCourse = availableCourses.find(
      (course) => course.title.toLowerCase() === standardizedEventName
    );

    if (matchedCourse) {
      const slug = titleToSlug(matchedCourse.title);
      return `/courses/${slug}/video`;
    }
    return null;
  };

  // Performance metrics
  const performanceMetrics = [
    { metric: 'Score or Grade', value: 90 },
    { metric: 'Performance', value: 85 },
    { metric: 'Time Spent', value: 72 },
  ];

  // Gradient colors for glowing effects
  const glowGradients = [
    'from-violet-400/20 via-fuchsia-400/10 to-purple-500/20',
    'from-violet-500/20 via-fuchsia-500/10 to-purple-600/20',
    'from-indigo-400/20 via-violet-400/10 to-purple-400/20',
  ];

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

  // Progress animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(90);
    }, 500);
    return () => clearTimeout(timer);
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

  // Status color mapping
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/80';
      case 'In Progress':
        return 'bg-blue-500/80';
      case 'Pending':
        return 'bg-amber-500/80';
      case 'Available':
        return 'bg-violet-500/80';
      default:
        return 'bg-gray-500/80';
    }
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

  // Handle Browse More Courses click
  const handleBrowseMoreCoursesClick = () => {
    router.push('/courses');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-800 text-lg">Loading Dashboard...</p>
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
            <h2 className="text-2xl font-bold tracking-tight text-gray-800 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-violet-400 ">
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
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-500  flex items-center justify-center text-white font-bold">
                EA
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">Enaya Ayat</p>
              </div>
            </div>
          </div>

          <nav className="px-3">
            {[
              { name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, href: '/dashboard', active: true },
              { name: 'Courses', icon: <BookOpen className="h-5 w-5" />, href: '/course1' },
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
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-800 hover:bg-gray-200"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open Sidebar"
            >
              <Menu className="h-6 w-6" />
            </Button>

            <div className="hidden md:flex flex-col">
              <h3 className="text-sm font-medium text-gray-800">
                {formatDate(currentTime)}
              </h3>
              <p className="text-xs text-gray-600">
                {formatTime(currentTime)}
              </p>
            </div>

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

          {/* Dashboard Header */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h3 className="font-medium mb-2 text-violet-600">
                  {getGreeting()}
                </h3>
                <h1
                  className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(192,132,252,0.4)] bg-gradient-to-r from-gray-800 to-violet-500"
                >
                  Welcome Back, Enaya
                </h1>
                <p className="mt-2 text-gray-600">
                  Your learning journey continues. You've got tasks waiting for you today.
                </p>
              </div>

              <div className="mt-4 sm:mt-0">
                <div
                  className="px-4 py-3 rounded-lg backdrop-blur-sm border border-gray-300/50 shadow-md bg-white/90"
                >
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-violet-600" />
                    <span className="text-sm font-medium text-gray-800">
                      Weekly Study Time
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-2xl font-bold text-gray-800">
                      46 Hrs
                    </span>
                    <span className="ml-2 text-xs flex items-center text-green-500">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      +12%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Overview */}
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
                    <TrendingUp className="h-5 w-5 mr-2 text-violet-600" />
                    Progress Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Line
                      data={progressData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: 'rgba(139, 92, 246, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            borderColor: 'rgba(192, 132, 252, 0.3)',
                            borderWidth: 1,
                            padding: 10,
                            displayColors: false,
                            callbacks: {
                              label: function (context) {
                                return `Score: ${context.parsed.y}%`;
                              },
                            },
                          },
                        },
                        scales: {
                          x: {
                            ticks: { color: '#4b5563' },
                            grid: { color: 'rgba(75, 85, 99, 0.2)' },
                          },
                          y: {
                            ticks: { color: '#4b5563' },
                            grid: { color: 'rgba(75, 85, 99, 0.1)'},
                            suggestedMin: 50,
                            suggestedMax: 100,
                          },
                        },
                        elements: {
                          point: {
                            radius: 4,
                            hoverRadius: 6,
                          },
                        },
                      }}
                    />
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4">
                    {performanceMetrics.map((metric, index) => (
                      <div
                        key={metric.metric}
                        className={`p-3 rounded-lg bg-gradient-to-br ${glowGradients[index]} backdrop-blur-sm border border-gray-300/50 hover:scale-105 transition-transform duration-200`}
                      >
                        <p className="text-xs mb-1 text-gray-600">
                          {metric.metric}
                        </p>
                        <div className="flex items-center justify-between">
                          <h4 className="text-xl font-bold text-gray-800">
                            {metric.value}%
                          </h4>
                          <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                        </div>
                        <Progress
                          value={metric.value}
                          className="mt-2 h-1 bg-gray-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tasks & Calendar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upcoming Tasks */}
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
                  <CardHeader className="pb-2 flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <ClipboardList className="h-5 w-5 mr-2 text-violet-600" />
                      Upcoming Tasks
                    </CardTitle>
                   
                  </CardHeader>
                  <CardContent>
                    
                      <div className="space-y-4 transition-all duration-300">
                        {/* Categories */}
                        {!selectedTaskCategory ? (
                          <div className="grid grid-cols-1 gap-3">
                            {['Assignments', 'AI Quiz', 'Analytics Report'].map((category) => (
                              <div
                                key={category}
                                className="p-4 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 hover:scale-102 transition-all duration-200 cursor-pointer shadow-sm"
                                onClick={() => setSelectedTaskCategory(category as 'Assignments' | 'AI Quiz' | 'Analytics Report')}
                              >
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-gray-800">{category}</h4>
                                  <Badge className="bg-violet-500/80 text-xs">
                                    {category === 'Assignments'
                                      ? userAssignments.length
                                      : category === 'AI Quiz'
                                      ? userAIQuizzes.length
                                      : userAnalyticsReports.length}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="animate-fadeIn">
                            {/* Back Button */}
                            <button
                              onClick={() => setSelectedTaskCategory(null)}
                              className="mb-4 text-violet-600 hover:text-violet-800 flex items-center text-sm transition-colors duration-200"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                              </svg>
                              Back to Categories
                            </button>

                            {/* Category Content */}
                            {selectedTaskCategory === 'Assignments' && (
                              <div className="space-y-3">
                                {userAssignments.length > 0 ? (
                                  userAssignments.map((assignment) => (
                                    <div
                                      key={assignment.id}
                                      className="p-4 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 hover:scale-102 transition-all duration-200 shadow-sm"
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-800">{assignment.title}</h4>
                                        <Badge className={`${getStatusColor(assignment.status)} text-xs`}>{assignment.status}</Badge>
                                      </div>
                                      <div className="flex justify-between text-xs text-gray-500">
                                        <span>Course: {assignment.course}</span>
                                        <span>Due: {assignment.dueDate}</span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-gray-600 text-sm">No assignments available for your enrolled courses.</p>
                                )}
                              </div>
                            )}

                            {selectedTaskCategory === 'AI Quiz' && (
                              <div className="space-y-3">
                                {userAIQuizzes.length > 0 ? (
                                  userAIQuizzes.map((quiz) => (
                                    <div
                                      key={quiz.id}
                                      className="p-4 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 hover:scale-102 transition-all duration-200 shadow-sm"
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-800">{quiz.title}</h4>
                                        <Badge className={`${getStatusColor(quiz.status)} text-xs`}>{quiz.status}</Badge>
                                      </div>
                                      <div className="flex justify-between text-xs text-gray-500">
                                        <span>Course: {quiz.course}</span>
                                        <span>Due: {quiz.dueDate}</span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-gray-600 text-sm">No quizzes available matching your interests and enrolled courses.</p>
                                )}
                              </div>
                            )}

                            {selectedTaskCategory === 'Analytics Report' && (
                              <div className="space-y-3">
                                {userAnalyticsReports.length > 0 ? (
                                  userAnalyticsReports.map((report) => (
                                    <div
                                      key={report.id}
                                      className="p-4 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 hover:scale-102 transition-all duration-200 shadow-sm"
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-800">{report.title}</h4>
                                        <Badge className={`${getStatusColor(report.status)} text-xs`}>{report.status}</Badge>
                                      </div>
                                      <div className="flex justify-between text-xs text-gray-500">
                                        <span>Course: {report.course}</span>
                                        <span>Generated: {report.generatedDate}</span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-gray-600 text-sm">No reports available for your enrolled courses.</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    
                      <p className="text-gray-600 text-sm"></p>
                    
                  </CardContent>
                </Card>

                {/* Weekly Schedule */}
                <Card
                  className="relative overflow-hidden bg-white/90 backdrop-blur-lg border-gray-300/50 shadow-md shadow-gray-300/20  hover:ring-2 hover:ring-violet-300 transition-all duration-300 animate-fadeInUp text-gray-800"
                  onClick={handleCardClick}
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
                  <CardHeader className="pb-2 flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-violet-600" />
                      Weekly Schedule
                    </CardTitle>
                    <HoverTooltip text={scheduleView === 'list' ? 'Switch to Calendar View' : 'Switch to List View'}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-600 hover:text-gray-800"
                        onClick={() => setScheduleView(scheduleView === 'list' ? 'calendar' : 'list')}
                      >
                        {scheduleView === 'list' ? <Grid className="h-5 w-5" /> : <List className="h-5 w-5" />}
                      </Button>
                    </HoverTooltip>
                  </CardHeader>
                  <CardContent>
                    {scheduleView === 'list' ? (
                      <div className="space-y-3">
                        {timetable.map((entry, index) => {
                          const videoUrl = findCourseVideoUrl(entry.event);
                          return (
                            <div
                              key={index}
                              className={`p-3 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 hover:scale-102 transition-all duration-200 ${
                                videoUrl ? 'cursor-pointer' : 'cursor-default'
                              }`}
                              onClick={() => {
                                if (videoUrl) {
                                  router.push(videoUrl);
                                } else {
                                  alert(`No video available for ${entry.event}`);
                                }
                              }}
                              role={videoUrl ? 'button' : undefined}
                              tabIndex={videoUrl ? 0 : undefined}
                              onKeyDown={(e) => {
                                if (videoUrl && (e.key === 'Enter' || e.key === ' ')) {
                                  router.push(videoUrl);
                                }
                              }}
                              aria-label={videoUrl ? `Go to ${entry.event} course video` : undefined}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-gray-800">{entry.event}</h4>
                                <Badge className="bg-violet-500/80 text-xs">{entry.day}</Badge>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">{entry.time}</span>
                                <span className="text-violet-600">{entry.instructor}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-7 gap-2 text-center">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                          <div key={day} className="text-xs font-medium text-gray-500">
                            {day}
                          </div>
                        ))}
                        {[...Array(7)].map((_, idx) => {
                          const event = timetable.find(
                            (e) => e.day === ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][idx]
                          );
                          const videoUrl = event ? findCourseVideoUrl(event.event) : null;
                          return (
                            <div
                              key={idx}
                              className={`p-2 rounded-lg ${
                                event && videoUrl
                                  ? 'bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 cursor-pointer'
                                  : 'bg-transparent cursor-default'
                              } transition-all duration-200`}
                              onClick={() => {
                                if (videoUrl) {
                                  router.push(videoUrl);
                                } else if (event) {
                                  alert(`No video available for ${event.event}`);
                                }
                              }}
                              role={event && videoUrl ? 'button' : undefined}
                              tabIndex={event && videoUrl ? 0 : undefined}
                              onKeyDown={(e) => {
                                if (event && videoUrl && (e.key === 'Enter' || e.key === ' ')) {
                                  router.push(videoUrl);
                                }
                              }}
                              aria-label={event && videoUrl ? `Go to ${event.event} course video` : undefined}
                            >
                              {event ? (
                                <div className="text-xs">
                                  <p className="text-gray-800">{event.event}</p>
                                  <p className="text-gray-500">{event.time}</p>
                                </div>
                              ) : (
                                <div className="h-10"></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Overall Progress */}
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
                    <CheckCircle className="h-5 w-5 mr-2 text-violet-600" />
                    Overall Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-6">
                    <div className="relative h-40 w-40">
                      <svg
                        className="h-full w-full drop-shadow-[0_0_10px_rgba(192,132,252,0.4)]"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          className="stroke-gray-300"
                          strokeWidth="10"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          className="stroke-violet-400"
                          strokeWidth="10"
                          strokeDasharray="282.6"
                          strokeDashoffset="127.17"
                          strokeLinecap="round"
                        />
                        <text
                          x="50"
                          y="50"
                          dominantBaseline="middle"
                          textAnchor="middle"
                          className="text-2xl font-bold fill-gray-800"
                        >
                          55%
                        </text>
                      </svg>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-600">
                    You're making steady progress! Keep going.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Task Completion */}
              <Card
                className="relative overflow-hidden bg-white/90 backdrop-blur-lg border-gray-300/50 shadow-md shadow-gray-300/20  hover:ring-2 hover:ring-violet-300 transition-all duration-300 animate-fadeInUp text-gray-800"
                onClick={handleCardClick}
                style={{ animationDelay: '400ms' }}
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
                    <CheckCircle className="h-5 w-5 mr-2 text-violet-600" />
                    Task Completion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center">
                    <Bar
                      data={taskCompletionData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: 'rgba(139, 92, 246, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            borderColor: 'rgba(192, 132, 252, 0.3)',
                            borderWidth: 1,
                            padding: 10,
                          },
                        },
                        scales: {
                          x: {
                            ticks: { color: '#4b5563', font: { size: 10 } },
                            grid: { display: false },
                          },
                          y: {
                            ticks: { color: '#4b5563', font: { size: 10 } },
                            grid: { color: 'rgba(75, 85, 99, 0.1)'},
                          },
                        },
                      }}
                    />
                  </div>

                  <div className="mt-2 grid grid-cols-3 gap-3">
                    {[
                      { label: 'Completed', value: '12', color: 'bg-gradient-to-r from-violet-500 to-violet-500' },
                      { label: 'In Progress', value: '5', color: 'bg-gradient-to-r from-violet-400 to-violet-400' },
                      { label: 'Pending', value: '3', color: 'bg-gradient-to-r from-violet-300 to-violet-300' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:scale-105 transition-transform duration-200"
                      >
                        <div className={`w-full h-1 ${item.color} rounded-full mb-2`}></div>
                        <span className="text-xl font-bold text-gray-800">
                          {item.value}
                        </span>
                        <span className="text-xs text-gray-600">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-gradient-to-br from-gray-100/70 to-gray-200/70  hover:scale-105 transition-all duration-300 animate-fadeInUp backdrop-blur-sm border border-gray-300/50">
                    <div className="flex items-center">
                      <div className="relative h-16 w-16">
                        <svg className="h-full w-full"  viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            className="stroke-gray-300"
                            strokeWidth="3"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            className="stroke-violet-400"
                            strokeWidth="3"
                            strokeDasharray="100"
                            strokeDashoffset="40"
                            strokeLinecap="round"
                          />
                          <text
                            x="18"
                            y="18"
                            dominantBaseline="middle"
                            textAnchor="middle"
                            className="fill-gray-800 text-xs font-bold"
                          >
                            60%
                          </text>
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-800">
                          Overall Progress
                        </h4>
                        <p className="text-xs text-gray-600">
                          You're doing great! Keep it up.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* My Courses */}
              <Card
                className="relative overflow-hidden bg-white/90 backdrop-blur-lg border-gray-300/50 shadow-md shadow-gray-300/20  hover:ring-2 hover:ring-violet-300 transition-all duration-300 animate-fadeInUp text-gray-800"
                onClick={handleCardClick}
                style={{ animationDelay: '500ms' }}
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
                    My Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myCourses.map((course) => (
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

                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-violet-500 to-violet-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-none hover:scale-105 transition-transform duration-200"
                    onClick={handleBrowseMoreCoursesClick}
                  >
                    Browse More Courses
                  </Button>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card
                className="relative overflow-hidden bg-white/90 backdrop-blur-lg border-gray-300/50 shadow-md shadow-gray-300/20  hover:ring-2 hover:ring-violet-300 transition-all duration-300 animate-fadeInUp text-gray-800"
                onClick={handleCardClick}
                style={{ animationDelay: '600ms' }}
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
                    <Bell className="h-5 w-5 mr-2 text-violet-600" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        icon: <CheckCircle className="h-4 w-4" />,
                        color: 'text-green-500',
                        bgColor: 'bg-green-500/20',
                        message: 'Assignment successfully submitted',
                        time: '2 hours ago',
                      },
                      {
                        icon: <AlertTriangle className="h-4 w-4" />,
                        color: 'text-amber-500',
                        bgColor: 'bg-amber-500/20',
                        message: 'Course deadline approaching',
                        time: '1 day ago',
                      },
                      {
                        icon: <BookOpen className="h-4 w-4" />,
                        color: 'text-violet-500',
                        bgColor: 'bg-violet-500/20',
                        message: 'New course materials available',
                        time: '3 days ago',
                      },
                    ].map((notification, index) => (
                      <div
                        key={index}
                        className="flex items-start p-3 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 hover:scale-102 transition-all duration-200"
                      >
                        <div className={`${notification.bgColor} p-2 rounded-full ${notification.color}`}>
                          {notification.icon}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm text-gray-800">
                            {notification.message}
                          </p>
                          <span className="text-xs text-gray-600">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    ))}
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