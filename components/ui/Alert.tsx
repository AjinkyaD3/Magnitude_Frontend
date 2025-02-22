import * as React from "react";
import { cn } from "@/lib/utils";

const Alert = ({ className, children, ...props }) => {
  return (
    <div
      className={cn("p-4 border-l-4 bg-gray-100 text-gray-700", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const AlertDescription = ({ className, children, ...props }) => {
  return (
    <p className={cn("text-sm", className)} {...props}>
      {children}
    </p>
  );
};

export { Alert, AlertDescription };
