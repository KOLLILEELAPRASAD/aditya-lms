/* File: app/auth/register/page.tsx */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    year: '',
    interests: [] as string[],
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    year: '',
    interests: '',
  });

  const courses = [
    'Web Development',
    'Artificial Intelligence',
    'Data Science',
    'Cybersecurity',
    'Mobile App Development',
    'Cloud Computing',
    'Game Development',
    'Machine Learning',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleInterestChange = (course: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, course]
        : prev.interests.filter((item) => item !== course),
    }));
    setErrors((prev) => ({ ...prev, interests: '' }));
  };

  const handleYearChange = (value: string) => {
    setFormData((prev) => ({ ...prev, year: value }));
    setErrors((prev) => ({ ...prev, year: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let formErrors = {
      name: '',
      phone: '',
      email: '',
      password: '',
      year: '',
      interests: '',
    };
    let hasErrors = false;

    // Name validation
    if (!formData.name.trim()) {
      formErrors.name = 'Name is required';
      hasErrors = true;
    }

    // Phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone) {
      formErrors.phone = 'Phone number is required';
      hasErrors = true;
    } else if (!phoneRegex.test(formData.phone)) {
      formErrors.phone = 'Please enter a valid 10-digit phone number';
      hasErrors = true;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      formErrors.email = 'Email is required';
      hasErrors = true;
    } else if (!emailRegex.test(formData.email)) {
      formErrors.email = 'Please enter a valid email address';
      hasErrors = true;
    }

    // Password validation
    if (!formData.password) {
      formErrors.password = 'Password is required';
      hasErrors = true;
    } else if (formData.password.length < 8) {
      formErrors.password = 'Password must be at least 8 characters long';
      hasErrors = true;
    }

    // Year validation
    if (!formData.year) {
      formErrors.year = 'Please select your year of study';
      hasErrors = true;
    }

    // Interests validation
    if (formData.interests.length === 0) {
      formErrors.interests = 'Please select at least one course of interest';
      hasErrors = true;
    }

    setErrors(formErrors);

    if (!hasErrors) {
      console.log('Registration form submitted:', formData);
      // Add actual registration logic here (e.g., API call)
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1 p-6 pt-7 flex items-center justify-center">
        <Card className="w-full max-w-md bg-background/90 border-border shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-center">
              <User className="h-6 w-6 mr-2 text-primary" />
              <span className="text-foreground">Register for Futuristic LMS</span>
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Create your account to start learning.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-foreground">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 bg-background border-border text-foreground focus:ring-primary"
                  placeholder="Enter your name"
                  aria-describedby="name-error"
                />
                {errors.name && (
                  <p
                    id="name-error"
                    className="text-red-500 text-xs mt-1"
                    role="alert"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phone" className="text-foreground">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 bg-background border-border text-foreground focus:ring-primary"
                  placeholder="Enter your phone number"
                  aria-describedby="phone-error"
                />
                {errors.phone && (
                  <p
                    id="phone-error"
                    className="text-red-500 text-xs mt-1"
                    role="alert"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 bg-background border-border text-foreground focus:ring-primary"
                  placeholder="Enter your email"
                  aria-describedby="email-error"
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="text-red-500 text-xs mt-1"
                    role="alert"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 bg-background border-border text-foreground focus:ring-primary"
                  placeholder="Enter your password"
                  aria-describedby="password-error"
                />
                {errors.password && (
                  <p
                    id="password-error"
                    className="text-red-500 text-xs mt-1"
                    role="alert"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Year of Study (Radio Buttons) */}
              <div>
                <Label className="text-foreground">Which year are you studying?</Label>
                <RadioGroup
                  value={formData.year}
                  onValueChange={handleYearChange}
                  className="mt-2 flex flex-wrap gap-4"
                >
                  {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((year) => (
                    <div key={year} className="flex items-center space-x-2">
                      <RadioGroupItem value={year} id={year.toLowerCase().replace(' ', '-')} />
                      <Label
                        htmlFor={year.toLowerCase().replace(' ', '-')}
                        className="text-foreground"
                      >
                        {year}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.year && (
                  <p className="text-red-500 text-xs mt-1" role="alert">
                    {errors.year}
                  </p>
                )}
              </div>

              {/* Interests (Checkboxes) */}
              <div>
                <Label className="text-foreground">Which one are you interested in?</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {courses.map((course) => (
                    <div key={course} className="flex items-center space-x-2">
                      <Checkbox
                        id={course.toLowerCase().replace(' ', '-')}
                        checked={formData.interests.includes(course)}
                        onCheckedChange={(checked) =>
                          handleInterestChange(course, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={course.toLowerCase().replace(' ', '-')}
                        className="text-foreground"
                      >
                        {course}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.interests && (
                  <p className="text-red-500 text-xs mt-1" role="alert">
                    {errors.interests}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                aria-label="Register"
              >
                Register
              </Button>
            </form>

            {/* Additional Links */}
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <a href="/auth/login" className="text-primary hover:underline">
                  Sign in here
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}