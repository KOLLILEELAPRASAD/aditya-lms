'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, PlayCircle, Volume2, VolumeX } from 'lucide-react';

// Define the Course interface (same as in app/courses/page.tsx and app/dashboard/page.tsx)
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

// Sample courses data (same as in app/courses/page.tsx and app/dashboard/page.tsx)
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

// Helper function to convert title to slug (same as in app/dashboard/page.tsx)
const titleToSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, ''); // Remove special characters
};

// Props type for dynamic route params
interface VideoPageProps {
  params: {
    slug: string;
  };
}

export default function VideoPage({ params }: VideoPageProps) {
  const { slug } = params;
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Find the course based on the slug
    const foundCourse = courses.find(
      (c) => titleToSlug(c.title) === slug
    );
    if (foundCourse) {
      setCourse(foundCourse);
    }
    setIsLoading(false);
  }, [slug]);

  // Function to read the summary aloud using Web Speech API
  const readSummary = () => {
    if (!course || isSpeaking) return;

    const utterance = new SpeechSynthesisUtterance(course.summary);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Event handlers for speech
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Function to stop reading the summary
  const stopReading = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-800 text-lg">Loading Video...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Card className="bg-white/90 backdrop-blur-lg border-gray-300/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-800">Course Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">The course you are looking for does not exist.</p>
            <Button
              onClick={() => router.push('/courses')}
              className="bg-gradient-to-r from-violet-500 to-violet-500 hover:from-violet-600 hover:to-fuchsia-600 text-white"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => router.push('/courses')}
          className="mb-6 bg-gradient-to-r from-violet-500 to-violet-500 hover:from-violet-600 hover:to-fuchsia-600 text-white"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Courses
        </Button>

        {/* Course Video Card */}
        <Card className="bg-white/90 backdrop-blur-lg border-gray-300/50 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <PlayCircle className="h-6 w-6 mr-2 text-violet-600" />
              {course.title} - Video Lesson
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Player */}
              <div className="lg:col-span-2">
                <div className="relative aspect-video">
                  <video
                    controls
                    className="w-full rounded-lg shadow-lg"
                    src={course.videoUrl}
                    poster={course.image}
                  >
                    <source src={course.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Summary Section */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">About This Lesson</h3>
                    <p className="text-gray-600 mt-2">{course.description}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-medium text-gray-800">Summary</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={isSpeaking ? stopReading : readSummary}
                        className="text-violet-600 hover:text-violet-800"
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="h-5 w-5 mr-2" />
                            Stop Reading
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-5 w-5 mr-2" />
                            Read Summary
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{course.summary}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}