import * as React from "react";
import { cn } from "@/lib/utils";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

const Alert = ({ className, children, ...props }: AlertProps) => {
  return (
    <div
      className={cn("p-4 border-l-4 bg-gray-100 text-gray-700", className)}
      {...props}
    >
      {children}
    </div>
  );
};

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  children: React.ReactNode;
}

const AlertDescription = ({ className, children, ...props }: AlertDescriptionProps) => {
  return (
    <p className={cn("text-sm", className)} {...props}>
      {children}
    </p>
  );
};

export { Alert, AlertDescription };