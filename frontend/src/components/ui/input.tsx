import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorTxt?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const { error, errorTxt } = props;
    return (
      <>
        <input
          type={type}
          className={cn(
            "w-full disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && errorTxt ? (
          <div className="error">
            <p>{errorTxt}</p>
          </div>
        ) : null}
      </>
    );
  }
);
Input.displayName = "Input";

export { Input };
