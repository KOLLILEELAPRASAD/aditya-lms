/* File: app/auth/login/page.tsx */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear error on input change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let formErrors = { email: '', password: '', confirmPassword: '' };
    let hasErrors = false;

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

    // Confirm Password validation
    if (!formData.confirmPassword) {
      formErrors.confirmPassword = 'Confirm Password is required';
      hasErrors = true;
    } else if (formData.confirmPassword !== formData.password) {
      formErrors.confirmPassword = 'Passwords do not match';
      hasErrors = true;
    }

    setErrors(formErrors);

    if (!hasErrors) {
      console.log('Form submitted successfully:', formData);
      // Add actual authentication logic here (e.g., API call)
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1 p-6 pt-20 flex items-center justify-center">
        <Card className="w-full max-w-md bg-background/90 border-border shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-center">
              <Lock className="h-6 w-6 mr-2 text-primary" />
              <span className="text-foreground">Sign In to Futuristic LMS</span>
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Please sign in to continue.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword" className="text-foreground">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 bg-background border-border text-foreground focus:ring-primary"
                  placeholder="Confirm your password"
                  aria-describedby="confirmPassword-error"
                />
                {errors.confirmPassword && (
                  <p
                    id="confirmPassword-error"
                    className="text-red-500 text-xs mt-1"
                    role="alert"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                aria-label="Sign In"
              >
                Sign In
              </Button>
            </form>

            {/* Additional Links */}
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Don’t have an account?{' '}
                <a
                  href="/auth/register"
                  className="text-primary hover:underline"
                >
                  Register here
                </a>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Forgot your password?{' '}
                <a
                  href="/auth/forgot-password"
                  className="text-primary hover:underline"
                >
                  Reset it
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}