/* File: app/tasks/page.tsx */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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
  Clock,
  AlertTriangle,
  Play,
  Pause,
  Sparkles,
  ArrowLeft,
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

// Quiz Start Confirmation Modal
const QuizStartModal = ({ isOpen, onClose, onConfirm, quizTitle }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; quizTitle: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-lg border border-gray-300/50 rounded-lg p-6 w-full max-w-md shadow-xl shadow-gray-300/30">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Start Quiz</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-gray-600 mb-4">
          Are you ready to start the <span className="font-semibold text-gray-800">{quizTitle}</span>? You will have 15 minutes to complete the quiz.
        </p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} className="text-gray-600 border-gray-300 hover:bg-gray-200">
            Cancel
          </Button>
          <Button
            className="bg-gradient-to-r from-violet-500 to-violet-500 hover:from-violet-600 hover:to-fuchsia-600 text-white"
            onClick={onConfirm}
          >
            Start
          </Button>
        </div>
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

// Quiz Question Type
type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
};

// Quiz Type
type Quiz = {
  id: number;
  title: string;
  course: string;
  questions: number;
  duration: string;
  mcqs: QuizQuestion[];
};

export default function TasksPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizTime, setQuizTime] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Sample Task Data
  const dailyTasks = [
    { id: 1, title: 'Complete Python Assignment', due: 'Today, 5:00 PM', priority: 'High', course: 'Advanced Python Programming' },
    { id: 2, title: 'Read UI/UX Chapter 3', due: 'Today, 8:00 PM', priority: 'Medium', course: 'UI/UX Design Principles' },
  ];

  const weeklyTasks = [
    { id: 1, title: 'Submit Python Project', due: 'May 23, 2025', priority: 'High', course: 'Advanced Python Programming' },
    { id: 2, title: 'Design Wireframe', due: 'May 24, 2025', priority: 'Medium', course: 'UI/UX Design Principles' },
    { id: 3, title: 'Review Python Concepts', due: 'May 25, 2025', priority: 'Low', course: 'Advanced Python Programming' },
  ];

  const monthlyTasks = [
    { id: 1, title: 'Prepare for Python Certification', due: 'June 10, 2025', priority: 'High', course: 'Advanced Python Programming' },
    { id: 2, title: 'Complete UI/UX Portfolio', due: 'June 15, 2025', priority: 'Medium', course: 'UI/UX Design Principles' },
  ];

  // Sample Quiz Data with MCQs
  const quizzes: Quiz[] = [
    {
      id: 1,
      title: 'Python Programming Quiz',
      course: 'Advanced Python Programming',
      questions: 3,
      duration: '15 mins',
      mcqs: [
        {
          id: 1,
          question: 'What is the output of print(2 ** 3)?',
          options: ['6', '8', '9', '12'],
          correctAnswer: '8',
        },
        {
          id: 2,
          question: 'Which keyword is used to define a function in Python?',
          options: ['func', 'define', 'def', 'function'],
          correctAnswer: 'def',
        },
        {
          id: 3,
          question: 'What does the len() function do?',
          options: ['Returns the length of an object', 'Converts a string to lowercase', 'Loops through a list', 'None of the above'],
          correctAnswer: 'Returns the length of an object',
        },
      ],
    },
    {
      id: 2,
      title: 'UI/UX Design Quiz',
      course: 'UI/UX Design Principles',
      questions: 3,
      duration: '10 mins',
      mcqs: [
        {
          id: 1,
          question: 'What does UX stand for?',
          options: ['User Experience', 'User Extension', 'User Execution', 'User Exploration'],
          correctAnswer: 'User Experience',
        },
        {
          id: 2,
          question: 'Which principle emphasizes simplicity in design?',
          options: ['Contrast', 'Minimalism', 'Alignment', 'Repetition'],
          correctAnswer: 'Minimalism',
        },
        {
          id: 3,
          question: 'What is a wireframe used for?',
          options: ['Final design', 'Layout planning', 'Color selection', 'Animation creation'],
          correctAnswer: 'Layout planning',
        },
      ],
    },
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

  // Quiz Timer Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && !quizCompleted) {
      timer = setInterval(() => {
        setQuizTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted]);

  const formatQuizTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStartQuizClick = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsQuizModalOpen(true);
  };

  const confirmStartQuiz = () => {
    setQuizStarted(true);
    setQuizTime(0);
    setQuizCompleted(false);
    setUserAnswers({});
    setQuizScore(null);
    setIsQuizModalOpen(false);
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    console.log(`handleAnswerChange called - questionId: ${questionId}, answer: ${answer}`);
    setUserAnswers((prev) => {
      const updatedAnswers = { ...prev, [questionId]: answer };
      console.log('Updated userAnswers:', updatedAnswers);
      return updatedAnswers;
    });
  };

  const submitQuiz = () => {
    console.log('submitQuiz called');
    if (!selectedQuiz) {
      console.log('No selected quiz');
      return;
    }

    let score = 0;
    selectedQuiz.mcqs.forEach((question) => {
      if (userAnswers[question.id] === question.correctAnswer) {
        score += 1;
      }
    });

    console.log('Calculated score:', score);
    setQuizScore(score);
    setQuizStarted(false);
    setQuizCompleted(true);
    console.log('State updated - quizScore:', score, 'quizStarted:', false, 'quizCompleted:', true);
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setQuizStarted(false);
    setQuizCompleted(false);
    setQuizTime(0);
    setUserAnswers({});
    setQuizScore(null);
  };

  const reattemptQuiz = () => {
    if (!selectedQuiz) return;
    setQuizStarted(true);
    setQuizTime(0);
    setQuizCompleted(false);
    setUserAnswers({});
    setQuizScore(null);
  };

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

  // Priority color mapping
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/80';
      case 'Medium':
        return 'bg-orange-500/80';
      case 'Low':
        return 'bg-green-500/80';
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

  // Log state for debugging rendering issues
  console.log('Render - Current State:', {
    isLoading,
    quizStarted,
    quizCompleted,
    selectedQuiz: selectedQuiz ? selectedQuiz.title : null,
    quizScore,
    userAnswers,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-800 text-lg">Loading Tasks Page...</p>
        </div>
      </div>
    );
  }

  // Quiz Display
  if (quizStarted && selectedQuiz) {
    return (
      <div className="min-h-screen transition-colors duration-300 bg-white overflow-hidden relative">
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

        <main className="flex-1 p-6">
          {/* Timer and Quiz Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {selectedQuiz.title}
            </h1>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-violet-600" />
              <span className="text-lg text-gray-800">
                Time: {formatQuizTime(quizTime)}
              </span>
            </div>
          </div>

          {/* Quiz Questions */}
          <div className="space-y-6">
            {selectedQuiz.mcqs.map((question) => (
              <Card
                key={question.id}
                className="bg-white/90 backdrop-blur-lg border-gray-300/50 shadow-md shadow-gray-300/20 text-gray-800"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{question.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={userAnswers[question.id] || ''}
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                  >
                    {question.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem
                          value={option}
                          id={`${question.id}-${index}`}
                          onClick={() => handleAnswerChange(question.id, option)}
                        />
                        <Label htmlFor={`${question.id}-${index}`} className="text-sm text-gray-800">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <button
              className={`px-4 py-2 rounded text-white ${
                !selectedQuiz || Object.keys(userAnswers).length !== selectedQuiz.mcqs.length
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-500 to-violet-500 hover:from-violet-600 hover:to-fuchsia-600'
              }`}
              onClick={() => {
                if (!selectedQuiz) {
                  console.log('Cannot submit: selectedQuiz is null');
                  return;
                }
                console.log('Submit Quiz button clicked');
                console.log('Current userAnswers:', userAnswers);
                console.log('Number of questions:', selectedQuiz.mcqs.length);
                console.log('Is button disabled:', Object.keys(userAnswers).length !== selectedQuiz.mcqs.length);
                submitQuiz();
              }}
              disabled={!selectedQuiz || Object.keys(userAnswers).length !== selectedQuiz.mcqs.length}
            >
              Submit Quiz
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Quiz Result Display
  if (quizCompleted && selectedQuiz && quizScore !== null) {
    return (
      <div className="min-h-screen transition-colors duration-300 bg-white overflow-hidden relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(192,132,252,0.1)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1)_0%,transparent_60%)]" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[linear-gradient(rgba(139,92,246,0.3)_1px,transparent_1px),linear_gradient(90deg,rgba(139,92,246,0.3)_1px,transparent_1px)] bg-[size:40px_40px]" />
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

        <main className="flex-1 p-6 flex items-center justify-center relative">
          {/* Back Arrow */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-6 left-6 text-gray-800 hover:bg-gray-200"
            onClick={resetQuiz}
            aria-label="Back to Tasks"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>

          <Card className="bg-white/90 backdrop-blur-lg border-gray-300/50 shadow-md shadow-gray-300/20 text-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl">Quiz Results</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <h2 className="text-xl mb-4">{selectedQuiz.title}</h2>
              <p className="text-lg mb-2">
                Your Score: {quizScore} / {selectedQuiz.mcqs.length}
              </p>
              <p className="text-sm mb-4">
                Time Taken: {formatQuizTime(quizTime)}
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  className="text-gray-600 border-gray-300 hover:bg-gray-200"
                  onClick={resetQuiz}
                >
                  Back to Tasks
                </Button>
                <Button
                  className="bg-gradient-to-r from-violet-500 to-violet-500 hover:from-violet-600 hover:to-fuchsia-600 text-white"
                  onClick={reattemptQuiz}
                >
                  Reattempt Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-white overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(192,132,252,0.1)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1)_0%,transparent_60%)]" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(rgba(139,92,246,0.3)_1px,transparent_1px),linear_gradient(90deg,rgba(139,92,246,0.3)_1px,transparent_1px)] bg-[size:40px_40px]" />
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

      {/* Quiz Start Confirmation Modal */}
      <QuizStartModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onConfirm={confirmStartQuiz}
        quizTitle={selectedQuiz?.title || ''}
      />

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
              { name: 'Course', icon: <BookOpen className="h-5 w-5" />, href: '/course1' },
              { name: 'Tasks', icon: <ClipboardList className="h-5 w-5" />, href: '/tasks', active: true },
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

              <HoverTooltip text="Notifications">
                <div className="relative">
                 
                </div>
              </HoverTooltip>

              <HoverTooltip text={isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'} children={undefined}>
                
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

          {/* Tasks Header */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h3 className="text-sm font-medium mb-2 text-violet-600">
                  {getGreeting()}
                </h3>
                <h1
                  className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(192,132,252,0.4)] bg-gradient-to-r from-gray-800 to-violet-500"
                >
                  Your Tasks, Enaya
                </h1>
                <p className="mt-2 text-gray-600">
                  Stay on top of your learning goals with daily, weekly, and monthly tasks.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Daily Tasks */}
              <Card
                className="relative overflow-hidden bg-white/90 backdrop-blur-lg border-gray-300/50 shadow-md shadow-gray-300/20 hover:scale-105 hover:ring-2 hover:ring-violet-300 transition-all duration-300 animate-fadeInUp text-gray-800"
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
                    <ClipboardList className="h-5 w-5 mr-2 text-violet-600" />
                    Today’s Tasks ({dailyTasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dailyTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 hover:scale-102 transition-all duration-200"
                      >
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center">
                            <ClipboardList className="h-5 w-5 text-violet-600" />
                          </div>
                          <div className="ml-3 flex-1">
                            <h4 className="font-medium text-sm text-gray-800">
                              {task.title}
                            </h4>
                            <p className="text-xs text-gray-600">
                              Due: {task.due} | Course: {task.course}
                            </p>
                          </div>
                          <Badge className={`${getPriorityColor(task.priority)} text-xs`}>{task.priority}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Tasks */}
              <Card
                className="relative overflow-hidden bg-white/90 backdrop-blur-lg border-gray-300/50 shadow-md shadow-gray-300/20 hover:scale-105 hover:ring-2 hover:ring-violet-300 transition-all duration-300 animate-fadeInUp text-gray-800"
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
                    <ClipboardList className="h-5 w-5 mr-2 text-violet-600" />
                    This Week’s Tasks ({weeklyTasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 hover:scale-102 transition-all duration-200"
                      >
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center">
                            <ClipboardList className="h-5 w-5 text-violet-600" />
                          </div>
                          <div className="ml-3 flex-1">
                            <h4 className="font-medium text-sm text-gray-800">
                              {task.title}
                            </h4>
                            <p className="text-xs text-gray-600">
                              Due: {task.due} | Course: {task.course}
                            </p>
                          </div>
                          <Badge className={`${getPriorityColor(task.priority)} text-xs`}>{task.priority}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Tasks */}
              <Card
                className="relative overflow-hidden bg-white/90 backdrop-blur-lg border-gray-300/50 shadow-md shadow-gray-300/20 hover:scale-105 hover:ring-2 hover:ring-violet-300 transition-all duration-300 animate-fadeInUp text-gray-800"
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
                    <ClipboardList className="h-5 w-5 mr-2 text-violet-600" />
                    This Month’s Tasks ({monthlyTasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 hover:scale-102 transition-all duration-200"
                      >
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center">
                            <ClipboardList className="h-5 w-5 text-violet-600" />
                          </div>
                          <div className="ml-3 flex-1">
                            <h4 className="font-medium text-sm text-gray-800">
                              {task.title}
                            </h4>
                            <p className="text-xs text-gray-600">
                              Due: {task.due} | Course: {task.course}
                            </p>
                          </div>
                          <Badge className={`${getPriorityColor(task.priority)} text-xs`}>{task.priority}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quiz Section */}
              <Card
                className="relative overflow-hidden bg-white/90 backdrop-blur-lg border-gray-300/50 shadow-md shadow-gray-300/20 hover:scale-105 hover:ring-2 hover:ring-violet-300 transition-all duration-300 animate-fadeInUp text-gray-800"
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
                    <BookOpen className="h-5 w-5 mr-2 text-violet-600" />
                    Weekly Quiz (Every Sunday)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quizzes.map((quiz) => (
                      <div
                        key={quiz.id}
                        className="p-3 rounded-lg bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/70 hover:scale-102 transition-all duration-200"
                      >
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-violet-600" />
                          </div>
                          <div className="ml-3 flex-1">
                            <h4 className="font-medium text-sm text-gray-800">
                              {quiz.title}
                            </h4>
                            <p className="text-xs text-gray-600">
                              Course: {quiz.course} | {quiz.questions} Questions | Duration: {quiz.duration}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-violet-600" />
                            <span className="text-xs text-gray-800">
                              {quizCompleted ? 'Completed' : quizStarted ? formatQuizTime(quizTime) : 'Not Started'}
                            </span>
                          </div>
                          {quizCompleted ? (
                            <Badge className="bg-green-500/80 text-xs">Completed</Badge>
                          ) : quizStarted ? (
                            <Button
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                              onClick={submitQuiz}
                            >
                              Finish Quiz
                            </Button>
                          ) : (
                            <Button
                              className="bg-gradient-to-r from-violet-500 to-violet-500 hover:from-violet-600 hover:to-fuchsia-600 text-white"
                              onClick={() => handleStartQuizClick(quiz)}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Start Quiz
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

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