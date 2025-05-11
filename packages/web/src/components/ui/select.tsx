"use client"

import * as React from "react"
import { cn } from "@/lib/utils.ts"

interface SelectContextValue {
  value?: string;
  onChange?: (value: string) => void;
}

const SelectContext = React.createContext<SelectContextValue>({});

interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ children, value, onChange, className }, ref) => {
    return (
      <SelectContext.Provider value={{ value, onChange }}>
        <div ref={ref} className={cn("relative w-full", className)}>
          {children}
        </div>
      </SelectContext.Provider>
    );
  }
);

Select.displayName = "Select";

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
  placeholder?: string;
}

const SelectTrigger = React.forwardRef<HTMLSelectElement, SelectTriggerProps>(
  ({ children, className, placeholder }, ref) => {
    const { value, onChange } = React.useContext(SelectContext);

    return (
      <select
        ref={ref}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    );
  }
);

SelectTrigger.displayName = "SelectTrigger";

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const SelectItem = React.forwardRef<HTMLOptionElement, SelectItemProps>(
  ({ value, children, className, ...props }, ref) => {
    return (
      <option ref={ref} value={value} className={className} {...props}>
        {children}
      </option>
    );
  }
);

SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectItem };
