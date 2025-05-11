import * as React from "react";
import { cn } from "@/lib/utils.ts";

interface HeartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isFavorite?: boolean;
  className?: string;
}

export const HeartButton: React.FC<HeartButtonProps> = ({
  isFavorite = false,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center size-10 rounded-full focus:outline-none",
        isFavorite 
          ? "text-red-500 hover:text-red-600"
          : "text-gray-400 hover:text-gray-600",
        className
      )}
      {...props}
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill={isFavorite ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M20.8401 4.61C20.3294 4.099 19.7229 3.69364 19.0555 3.41708C18.388 3.14052 17.6726 2.99817 16.9501 2.99817C16.2276 2.99817 15.5122 3.14052 14.8448 3.41708C14.1773 3.69364 13.5709 4.099 13.0601 4.61L12.0001 5.67L10.9401 4.61C9.90843 3.57831 8.50915 2.9989 7.05012 2.9989C5.59109 2.9989 4.19181 3.57831 3.16012 4.61C2.12843 5.64169 1.54902 7.04097 1.54902 8.5C1.54902 9.95903 2.12843 11.3583 3.16012 12.39L4.22012 13.45L12.0001 21.23L19.7801 13.45L20.8401 12.39C21.3511 11.8792 21.7565 11.2728 22.033 10.6053C22.3096 9.93789 22.4519 9.22248 22.4519 8.5C22.4519 7.77752 22.3096 7.0621 22.033 6.39464C21.7565 5.72718 21.3511 5.12075 20.8401 4.61Z" />
      </svg>
    </button>
  );
}; 