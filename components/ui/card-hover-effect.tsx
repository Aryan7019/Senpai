"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Only show glow on the hovered card */}
          {hoveredIndex === idx && (
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-primary/30 to-primary/50 rounded-xl blur-lg opacity-75 animate-pulse" />
          )}
          
          <Card isHovered={hoveredIndex === idx}>
            <CardIcon>{item.icon}</CardIcon>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
  isHovered,
}: {
  className?: string;
  children: React.ReactNode;
  isHovered?: boolean;
}) => {
  return (
    <div
      className={cn(
        "rounded-xl h-full w-full p-8 overflow-hidden bg-black border relative z-20 transition-all duration-300",
        isHovered ? "border-primary/50 shadow-lg shadow-primary/20" : "border-white/10",
        className
      )}
    >
      <div className="relative z-50">
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};

export const CardIcon = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "w-14 h-14 rounded bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-300 group-hover:scale-110 group-hover:rotate-6",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h3
      className={cn(
        "text-xl font-bold text-white group-hover:text-primary transition-colors duration-300",
        className
      )}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300",
        className
      )}
    >
      {children}
    </p>
  );
};
