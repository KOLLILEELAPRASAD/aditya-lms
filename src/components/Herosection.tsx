/* File: components/HeroSection.tsx */

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HeroButtons } from "./HeroButtons";

export function HeroSection() {
  return (
    <section className="relative bg-background py-20 px-6 animate-fade-in  flex items-center justify-center overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-chart-1/30 blur-2xl animate-bounce-slow" />
      <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-chart-2/30 blur-2xl animate-bounce-slow animation-delay-200" />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-chart-3/30 blur-2xl animate-bounce-slow animation-delay-400" />

      <div className="max-w-7xl mx-auto text-center space-y-8 z-10">
        {/* Headline with Highlighted "future" */}
        <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
          Unlock the{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-primary">future</span>
            <span className="absolute inset-x-0 bottom-1 h-3 bg-primary/20 rounded-lg z-0" />
          </span>{" "}
          of education
        </h1>
        <h2 className="text-2xl text-muted-foreground">
          Revolutionize your learning with our cutting-edge LMS platform
        </h2>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          Experience education like never before. Access innovative courses,
          track your progress, and connect with a global community of learners.
        </p>
        <div className="flex gap-4 justify-center">
          <HeroButtons
            label="Start now"
            action="start"
            className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-blue-500 hover:to-primary hover:shadow-primary/50"
          />
          <HeroButtons
            label="Explore Now"
            action="explore"
            className="bg-white text-primary border border-primary hover:from-blue-500 hover:to-primary hover:shadow-primary/50"
          />
        </div>{" "}
        <Separator className="bg-border w-16 mx-auto" />
        <p className="text-sm text-muted-foreground">
          Join over 50,000 learners shaping the future of education
        </p>
        {/* Floating Cards */}
        <div className="relative mt-12">
          <Card className="absolute -left-20 top-0 bg-card/80 border border-border shadow-lg transform rotate-6 animate-float">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-chart-1/50" />
              <p className="text-sm text-card-foreground">
                Good morning, student!
              </p>
            </CardContent>
          </Card>
          <Card className="absolute -right-20 bottom-0 bg-card/80 border border-border shadow-lg transform -rotate-6 animate-float animation-delay-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-chart-2/50" />
              <p className="text-sm text-card-foreground">
                Your next lesson awaits
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
