/* File: app/settings/page.tsx */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
  AlertTriangle,
  Sparkles,
  Trash2,
  LogOut,
} from 'lucide-react';

// Profile Modal Component (Reused from TasksPage)
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

// Delete Account Confirmation Modal
const DeleteAccountModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-lg border border-gray-300/50 rounded-lg p-6 w-full max-w-md shadow-xl shadow-gray-300/30">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Delete Account</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete your account? This action cannot be undone, and all your data will be permanently removed.
        </p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} className="text-gray-600 border-gray-300 hover:bg-gray-200">
            Cancel
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={onConfirm}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

// HoverTooltip Component (Reused from TasksPage)
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

// Define types for throttle function (Reused from TasksPage)
type ThrottleFunction = (e: MouseEvent) => void;

export default function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [inAppNotifications, setInAppNotifications] = useState(true);

  // Account Settings State
  const [userName, setUserName] = useState('Enaya Ayat');
  const [userEmail, setUserEmail] = useState('enaya.ayat@example.com');
  const [password, setPassword] = useState('');

  // Privacy Settings State
  const [shareData, setShareData] = useState(false);
  const [showActivity, setShowActivity] = useState(true);

  // Throttled Parallax Effect (Reused from TasksPage)
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

  // Update current time (Reused from TasksPage)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate loading state (Reused from TasksPage)
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

  // Format date (Reused from TasksPage)
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time (Reused from TasksPage)
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Get greeting based on time of day (Reused from TasksPage)
  const getGreeting = (): string => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Handle card click for ripple effect (Reused from TasksPage)
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

  // Handle Save Changes (Simulated)
  const handleSaveChanges = () => {
    console.log('Saving settings...', {
      emailNotifications,
      pushNotifications,
      inAppNotifications,
      isDarkTheme,
      userName,
      userEmail,
      password: password ? 'Updated' : 'Not changed',
      shareData,
      showActivity,
    });
    alert('Settings saved successfully!');
  };

  // Handle Delete Account (Simulated)
  const handleDeleteAccount = () => {
    console.log('Account deletion requested');
    setIsDeleteModalOpen(false);
    alert('Account deleted successfully! (Simulated)');
    // In a real app, redirect to login page or clear session
  };

  // Handle Sign Out of All Devices (Simulated)
  const handleSignOutAll = () => {
    console.log('Signing out of all devices');
    alert('Signed out of all devices successfully! (Simulated)');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-800 text-lg">Loading Settings Page...</p>
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

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />

      {/* Sidebar (Reused from TasksPage) */}
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
              { name: 'Tasks', icon: <ClipboardList className="h-5 w-5" />, href: '/tasks' },
              { name: 'Profile', icon: <User className="h-5 w-5" />, href: '/profile' },
              { name: 'Settings', icon: <Settings className="h-5 w-5" />, href: '/settings', active: true },
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

          {/* Settings Header */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h3 className="text-sm font-medium mb-2 text-violet-600">
                  {getGreeting()}
                </h3>
                <h1
                  className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(192,132,252,0.4)] bg-gradient-to-r from-gray-800 to-violet-500"
                >
                  Settings, Enaya
                </h1>
                <p className="mt-2 text-gray-600">
                  Customize your preferences and manage your account settings.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="space-y-6">
            {/* Notification Settings */}
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
                  <Bell className="h-5 w-5 mr-2 text-violet-600" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-800">Email Notifications</Label>
                      <p className="text-xs text-gray-600">Receive email notifications for tasks and quizzes.</p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-800">Push Notifications</Label>
                      <p className="text-xs text-gray-600">Receive push notifications on your device.</p>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-800">In-App Notifications</Label>
                      <p className="text-xs text-gray-600">Receive notifications within the app.</p>
                    </div>
                    <Switch
                      checked={inAppNotifications}
                      onCheckedChange={setInAppNotifications}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Theme Preferences */}
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
                  <Sun className="h-5 w-5 mr-2 text-violet-600" />
                  Theme Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-800">Dark Theme</Label>
                    <p className="text-xs text-gray-600">Switch between light and dark theme.</p>
                  </div>
                  <Switch
                    checked={isDarkTheme}
                    onCheckedChange={setIsDarkTheme}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
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
                  <User className="h-5 w-5 mr-2 text-violet-600" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-800">Name</Label>
                    <Input
                      id="name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-800">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium text-gray-800">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
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
                  <AlertTriangle className="h-5 w-5 mr-2 text-violet-600" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-800">Share Data</Label>
                      <p className="text-xs text-gray-600">Allow sharing of your data for analytics purposes.</p>
                    </div>
                    <Switch
                      checked={shareData}
                      onCheckedChange={setShareData}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-800">Show Activity</Label>
                      <p className="text-xs text-gray-600">Make your activity visible to others.</p>
                    </div>
                    <Switch
                      checked={showActivity}
                      onCheckedChange={setShowActivity}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      className="bg-gradient-to-r from-violet-500 to-violet-500 hover:from-violet-600 hover:to-fuchsia-600 text-white"
                      onClick={handleSignOutAll}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out of All Devices
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Changes Button */}
            <div className="flex justify-end">
              <Button
                className="bg-gradient-to-r from-violet-500 to-violet-500 hover:from-violet-600 hover:to-fuchsia-600 text-white"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
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