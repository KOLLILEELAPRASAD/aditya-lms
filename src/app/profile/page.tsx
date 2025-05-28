'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  Sparkles,
  Edit,
  Award,
  Calendar,
  Upload,
} from 'lucide-react';

// Profile Modal Component (for sidebar user profile view)
const ProfileModal = ({ isOpen, onClose, userData }: { isOpen: boolean; onClose: () => void; userData: UserData }) => {
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
          {userData.profileImage ? (
            <img
              src={userData.profileImage}
              alt="User Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-violet-400 shadow-md"
            />
          ) : (
            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-br ${userData.avatarColor} flex items-center justify-center text-white font-bold text-2xl`}
            >
              {userData.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
            </div>
          )}
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800">{userData.name}</h3>
            <p className="text-sm text-gray-500">{userData.email}</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Role:</span> {userData.role}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Joined:</span> {userData.joined}
          </p>
        </div>
        <Button className="mt-4 w-full bg-gradient-to-r from-violet-500 to-violet-500 hover:from-violet-600 hover:to-fuchsia-600 text-white">
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

// Edit Profile Modal Component
const EditProfileModal = ({
  isOpen,
  onClose,
  userData,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData;
  onSave: (updatedData: UserData) => void;
}) => {
  const [formData, setFormData] = useState(userData);
  const [avatarColor, setAvatarColor] = useState(userData.avatarColor);
  const [profileImage, setProfileImage] = useState<string | undefined>(userData.profileImage);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onSave({ ...formData, avatarColor, profileImage });
    onClose();
  };

  if (!isOpen) return null;

  const avatarColors = [
    'from-violet-400 to-fuchsia-600',
    'from-blue-400 to-indigo-600',
    'from-green-400 to-teal-600',
    'from-red-400 to-pink-600',
    'from-yellow-400 to-orange-600',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-lg border border-gray-300/50 rounded-lg p-6 w-full max-w-md shadow-xl shadow-gray-300/30">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-4">
          {/* Profile Image Upload */}
          <div>
            <Label className="text-gray-800">Profile Image</Label>
            <div className="flex items-center mt-2">
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile Preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-violet-400 shadow-md"
                  />
                ) : (
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-2xl border-2 border-violet-400 shadow-md`}
                  >
                    {formData.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                  </div>
                )}
                <label
                  htmlFor="profile-image-upload"
                  className="absolute bottom-0 right-0 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-violet-600 transition-colors"
                >
                  <Upload className="w-4 h-4 text-white" />
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="ml-4 text-sm text-gray-600">
                Upload a new profile picture or keep the default avatar.
              </div>
            </div>
          </div>
          {/* Avatar Color Selection (shown only if no profile image) */}
          {!profileImage && (
            <div>
              <Label className="text-gray-800">Avatar Color</Label>
              <div className="flex items-center mt-2">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-2xl mr-4`}
                >
                  {formData.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                </div>
                <div className="flex space-x-2">
                  {avatarColors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} ${avatarColor === color ? 'ring-2 ring-violet-500' : ''}`}
                      onClick={() => setAvatarColor(color)}
                      aria-label={`Select avatar color ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-gray-800">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 bg-gray-100/50 text-gray-800 border-gray-300/50 focus:ring-violet-400"
            />
          </div>
          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-gray-800">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 bg-gray-100/50 text-gray-800 border-gray-300/50 focus:ring-violet-400"
            />
          </div>
          {/* Role */}
          <div>
            <Label htmlFor="role" className="text-gray-800">Role</Label>
            <Input
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 bg-gray-100/50 text-gray-800 border-gray-300/50 focus:ring-violet-400"
            />
          </div>
          {/* Joined Date */}
          <div>
            <Label htmlFor="joined" className="text-gray-800">Joined Date</Label>
            <Input
              id="joined"
              name="joined"
              value={formData.joined}
              onChange={handleChange}
              className="mt-1 bg-gray-100/50 text-gray-800 border-gray-300/50 focus:ring-violet-400"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose} className="text-gray-600 border-gray-300 hover:bg-gray-200">
            Cancel
          </Button>
          <Button
            className="bg-gradient-to-r from-violet-500 to-violet-500 hover:from-violet-600 hover:to-fuchsia-600 text-white"
            onClick={handleSubmit}
          >
            Save
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

// User Data Type
type UserData = {
  name: string;
  email: string;
  role: string;
  joined: string;
  avatarColor: string;
  profileImage?: string;
};

// Activity Type
type Activity = {
  id: number;
  description: string;
  date: string;
};

// Achievement Type
type Achievement = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
};

// Custom SVG Donut Chart for Academic Progress with Tooltip
const AcademicProgressChart = ({ academicProgress, isDarkTheme }: { academicProgress: number; isDarkTheme: boolean }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const size = 160; // SVG size (width and height)
  const strokeWidth = 14; // Thickness of the ring
  const radius = (size - strokeWidth) / 2; // Radius of the ring
  const circumference = 2 * Math.PI * radius; // Circumference of the ring
  const strokeDashoffset = circumference - (academicProgress / 100) * circumference; // Offset for progress

  return (
    <div
      className="relative w-40 h-40"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      tabIndex={0}
      role="img"
      aria-label={`Academic progress chart showing ${academicProgress}% completion`}
    >
      <svg width={size} height={size} className="transform rotate-[-90deg]">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#D1D5DB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#A855F7"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-800">
          {academicProgress}%
        </span>
      </div>
      {showTooltip && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 bg-gray-800/90 text-white text-xs rounded-lg py-1 px-2 border border-gray-300/50">
          Academic Progress: {academicProgress}%
        </div>
      )}
    </div>
  );
};

// Custom SVG Line Chart for Attendance with Tooltips
const AttendanceChart = ({ attendanceData, isDarkTheme }: { attendanceData: { month: string; percentage: number }[]; isDarkTheme: boolean }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; month: string; percentage: number } | null>(null);
  const width = 300; // SVG width
  const height = 120; // SVG height
  const padding = 20; // Padding for axes
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Normalize data
  const maxPercentage = 100;
  const minPercentage = 0;
  const points = attendanceData.map((data, index) => {
    const x = padding + (index / (attendanceData.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((data.percentage - minPercentage) / (maxPercentage - minPercentage)) * chartHeight;
    return { x, y, month: data.month, percentage: data.percentage };
  });

  // Create the path for the line
  const pathData = points
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      return `L ${point.x} ${point.y}`;
    })
    .join(' ');

  // Create a smooth curve using quadratic Bezier curves
  let smoothPathData = '';
  for (let i = 0; i < points.length; i++) {
    if (i === 0) {
      smoothPathData += `M ${points[i].x} ${points[i].y}`;
    } else {
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2;
      smoothPathData += ` Q ${prev.x} ${prev.y}, ${midX} ${(prev.y + curr.y) / 2} T ${curr.x} ${curr.y}`;
    }
  }

  // Create the fill path for the area under the line
  const fillPathData = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  const handleMouseOver = (point: { x: number; y: number; month: string; percentage: number }) => {
    setTooltip(point);
  };

  const handleMouseOut = () => {
    setTooltip(null);
  };

  return (
    <div className="w-full h-40 relative">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* Grid Lines (Y-Axis) */}
        {[0, 25, 50, 75, 100].map((value) => {
          const y = padding + chartHeight - ((value - minPercentage) / (maxPercentage - minPercentage)) * chartHeight;
          return (
            <line
              key={value}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="rgba(0, 0, 0, 0.1)"
              strokeWidth="1"
            />
          );
        })}
        {/* Y-Axis Labels */}
        {[0, 25, 50, 75, 100].map((value) => {
          const y = padding + chartHeight - ((value - minPercentage) / (maxPercentage - minPercentage)) * chartHeight;
          return (
            <text
              key={value}
              x={padding - 5}
              y={y + 4}
              fontSize="10"
              fill="#374151"
              textAnchor="end"
            >
              {value}
            </text>
          );
        })}
        {/* X-Axis Labels */}
        {attendanceData.map((data, index) => {
          const x = padding + (index / (attendanceData.length - 1)) * chartWidth;
          return (
            <text
              key={data.month}
              x={x}
              y={height - padding + 15}
              fontSize="10"
              fill="#374151"
              textAnchor="middle"
            >
              {data.month}
            </text>
          );
        })}
        {/* Area Fill */}
        <path d={fillPathData} fill="rgba(168, 85, 247, 0.2)" />
        {/* Line Path */}
        <path d={smoothPathData} fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" />
        {/* Data Points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="#A855F7"
            className="hover:scale-150 transition-transform duration-200 cursor-pointer"
            onMouseOver={() => handleMouseOver(point)}
            onMouseOut={handleMouseOut}
            onFocus={() => handleMouseOver(point)}
            onBlur={handleMouseOut}
            tabIndex={0}
            role="img"
            aria-label={`Attendance for ${point.month}: ${point.percentage}%`}
          />
        ))}
      </svg>
      {tooltip && (
        <div
          className="absolute bg-gray-800/90 text-white text-xs rounded-lg py-1 px-2 border border-gray-300/50"
          style={{ top: tooltip.y - 40, left: tooltip.x, transform: 'translateX(-50%)' }}
        >
          {tooltip.month}: {tooltip.percentage}%
        </div>
      )}
    </div>
  );
};

// Activity Timeline Component
const ActivityTimeline = ({ activities, isDarkTheme }: { activities: Activity[]; isDarkTheme: boolean }) => {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div
          key={activity.id}
          className="flex items-start animate-fadeInUp"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm text-gray-800">
              {activity.description}
            </p>
            <p className="text-xs text-gray-600">
              {activity.date}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Activity Timeline Skeleton
const ActivityTimelineSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
          </div>
          <div className="ml-4 flex-1">
            <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse mb-2"></div>
            <div className="h-3 w-1/2 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Achievements Component
const Achievements = ({ achievements, isDarkTheme }: { achievements: Achievement[]; isDarkTheme: boolean }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {achievements.map((achievement, index) => (
        <div
          key={achievement.id}
          className="flex items-center p-3 rounded-lg bg-gray-100/50 border border-gray-300/50 animate-fadeInUp"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white">
            {achievement.icon}
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-semibold text-gray-800">
              {achievement.title}
            </h4>
            <p className="text-xs text-gray-600">
              {achievement.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Achievements Skeleton
const AchievementsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="flex items-center p-3 rounded-lg bg-gray-300/30 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <div className="ml-3 flex-1">
            <div className="h-4 w-1/2 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 w-3/4 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function ProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Default to light theme for white background
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActivityLoading, setIsActivityLoading] = useState(true);
  const [isAchievementsLoading, setIsAchievementsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    name: 'Enaya Ayat',
    email: 'enaya.ayat@example.com',
    role: 'Student',
    joined: 'January 2024',
    avatarColor: 'from-violet-500 to-violet-500',
  });

  // Academic Progress (for Donut Chart)
  const academicProgress = 78; // Example percentage

  // Monthly Attendance Data (for Line Chart)
  const attendanceData = [
    { month: 'Jan', percentage: 90 },
    { month: 'Feb', percentage: 85 },
    { month: 'Mar', percentage: 88 },
    { month: 'Apr', percentage: 92 },
    { month: 'May', percentage: 80 },
  ];

  // Recent Activities (for Timeline)
  const activities: Activity[] = [
    { id: 1, description: 'Completed "Introduction to Programming" course', date: 'May 18, 2025' },
    { id: 2, description: 'Submitted assignment for "Data Structures"', date: 'May 15, 2025' },
    { id: 3, description: 'Attended webinar on "AI in Education"', date: 'May 10, 2025' },
  ];

  // Achievements (for Badges)
  const achievements: Achievement[] = [
    {
      id: 1,
      title: 'Top Performer',
      description: 'Achieved 90%+ in all courses',
      icon: <Award className="h-5 w-5" />,
    },
    {
      id: 2,
      title: 'Consistent Learner',
      description: 'Completed 5 courses in a row',
      icon: <Award className="h-5 w-5" />,
    },
    {
      id: 3,
      title: 'Active Participant',
      description: 'Attended 10+ webinars',
      icon: <Award className="h-5 w-5" />,
    },
    {
      id: 4,
      title: 'Quick Learner',
      description: 'Finished a course in under a week',
      icon: <Award className="h-5 w-5" />,
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

  // Simulate loading state for the page
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Simulate loading state for activities and achievements
  useEffect(() => {
    const activityTimer = setTimeout(() => {
      setIsActivityLoading(false);
    }, 1000);
    const achievementsTimer = setTimeout(() => {
      setIsAchievementsLoading(false);
    }, 1200);
    return () => {
      clearTimeout(activityTimer);
      clearTimeout(achievementsTimer);
    };
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

  // Handle Save Profile
  const handleSaveProfile = (updatedData: UserData) => {
    setUserData(updatedData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-800 text-lg">Loading Profile Page...</p>
        </div>
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

      {/* Profile Modal (for sidebar) */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} userData={userData} />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={userData}
        onSave={handleSaveProfile}
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

          {/* User Profile in Sidebar */}
          <div className="px-5 mb-6">
            <button
              className="flex items-center p-3 rounded-lg bg-gray-100/50 backdrop-blur-sm border border-gray-300/50 cursor-pointer hover:bg-gray-200/70 transition-colors duration-200 w-full text-left"
              onClick={() => setIsProfileModalOpen(true)}
              aria-label="View User Profile"
            >
              {userData.profileImage ? (
                <img
                  src={userData.profileImage}
                  alt="User Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-violet-400 shadow-md"
                />
              ) : (
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${userData.avatarColor} flex items-center justify-center text-white font-bold`}
                >
                  {userData.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                </div>
              )}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{userData.name}</p>
              </div>
            </button>
          </div>

          <nav className="px-3">
            {[
              { name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, href: '/dashboard' },
              { name: 'Course', icon: <BookOpen className="h-5 w-5" />, href: '/course1' },
              { name: 'Tasks', icon: <ClipboardList className="h-5 w-5" />, href: '/tasks' },
              { name: 'Profile', icon: <User className="h-5 w-5" />, href: '/profile', active: true },
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
                  aria-label="Search"
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

              <HoverTooltip text="View Profile">
                <button
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold cursor-pointer"
                  onClick={() => setIsProfileModalOpen(true)}
                  aria-label="View Profile"
                >
                  {userData.profileImage ? (
                    <img
                      src={userData.profileImage}
                      alt="User Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-violet-400 shadow-md"
                    />
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${userData.avatarColor} flex items-center justify-center text-white font-bold`}
                    >
                      {userData.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                    </div>
                  )}
                </button>
              </HoverTooltip>
            </div>
          </div>

          {/* Profile Header */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h3 className="text-sm font-medium mb-2 text-violet-600">
                  {getGreeting()}
                </h3>
                <h1
                  className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(192,132,252,0.4)] bg-gradient-to-r from-gray-800 to-violet-500"
                >
                  Your Profile, {userData.name}
                </h1>
                <p className="mt-2 text-gray-600">
                  Manage your personal information and track your academic progress.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: User Info and Activity Timeline */}
            <div className="lg:col-span-2 space-y-6">
              {/* User Info Card */}
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
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-violet-600" />
                      Student Information
                    </CardTitle>
                    <Button
                      className="bg-gradient-to-r from-violet-500 to-violet-500 hover:from-violet-600 hover:to-fuchsia-600 text-white"
                      onClick={() => setIsEditModalOpen(true)}
                      aria-label="Edit Profile"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    {userData.profileImage ? (
                      <img
                        src={userData.profileImage}
                        alt="User Profile"
                        className="w-16 h-16 rounded-full object-cover border-2 border-violet-400 shadow-md"
                      />
                    ) : (
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${userData.avatarColor} flex items-center justify-center text-white font-bold text-2xl`}
                      >
                        {userData.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                      </div>
                    )}
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {userData.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {userData.email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">Role:</span>{' '}
                      {userData.role}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">
                        Joined:
                      </span>{' '}
                      {userData.joined}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Timeline Card */}
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
                    <Calendar className="h-5 w-5 mr-2 text-violet-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isActivityLoading ? (
                    <ActivityTimelineSkeleton />
                  ) : (
                    <ActivityTimeline activities={activities} isDarkTheme={isDarkTheme} />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Charts and Achievements */}
            <div className="space-y-6">
              {/* Academic Progress Donut Chart */}
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
                    <Sparkles className="h-5 w-5 mr-2 text-violet-600" />
                    Academic Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <AcademicProgressChart academicProgress={academicProgress} isDarkTheme={isDarkTheme} />
                  <p className="mt-2 text-sm text-gray-600">
                    Overall Academic Performance
                  </p>
                </CardContent>
              </Card>

              {/* Attendance Line Chart */}
              <Card
                className="relative overflow-hidden bg-white/90 backdrop-blur-lg border-gray-300/50 shadow-md shadow-gray-300/20 hover:ring-2 hover:ring-violet-300 transition-all duration-300 animate-fadeInUp text-gray-800"
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
                    <Clock className="h-5 w-5 mr-2 text-violet-600" />
                    Monthly Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AttendanceChart attendanceData={attendanceData} isDarkTheme={isDarkTheme} />
                </CardContent>
              </Card>

              {/* Achievements Card */}
              <Card
                className="relative overflow-hidden bg-white/90 backdrop-blur-lg  border-gray-300/50 shadow-md shadow-gray-300/20  hover:ring-2 hover:ring-violet-300 transition-all duration-300 animate-fadeInUp text-gray-800 "
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
                    <Award className="h-5 w-5 mr-2 text-violet-600" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isAchievementsLoading ? (
                    <AchievementsSkeleton />
                  ) : (
                    <Achievements achievements={achievements} isDarkTheme={isDarkTheme} />
                  )}
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
                  aria-label="Privacy Policy"
                >
                  Privacy Policy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800"
                  aria-label="Terms of Service"
                >
                  Terms of Service
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800"
                  aria-label="Help Center"
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