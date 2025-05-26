'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

interface CourseCardProps {
  course: Course;
  animationDelay: number;
}

export function CourseCard({ course, animationDelay }: CourseCardProps) {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Function to navigate to the course video page
  const handleViewCourse = () => {
    const slug = course.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    router.push(`/courses/${slug}/video`);
  };

  // Function to read the summary aloud using Web Speech API
  const readSummary = () => {
    if (isSpeaking) return;

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

  return (
    <Card
      className="bg-white/90 backdrop-blur-lg border-gray-300/50 shadow-md hover:shadow-lg transition-all duration-300 animate-fadeInUp"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <CardHeader>
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-40 object-cover rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="space-y-3">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {course.title}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge className="bg-violet-500/80 text-xs">{course.category}</Badge>
          <Badge className="bg-blue-500/80 text-xs">{course.level}</Badge>
          {course.isCertification && (
            <Badge className="bg-green-500/80 text-xs">Certification</Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">{course.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-gray-800">{course.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-800">{course.learners}</span>
          </div>
        </div>
        <div className="pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-gray-800">Summary</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={isSpeaking ? stopReading : readSummary}
              className="text-violet-600 hover:text-violet-800"
              aria-label={isSpeaking ? 'Stop reading the summary' : 'Read the summary aloud'}
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
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleViewCourse}
          className="w-full bg-gradient-to-r from-violet-500 to-violet-500 hover:from-violet-600 hover:to-fuchsia-600 text-white"
        >
          View Course
        </Button>
      </CardFooter>
    </Card>
  );
}