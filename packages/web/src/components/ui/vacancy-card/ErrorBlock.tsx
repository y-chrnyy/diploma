import React from "react";

interface ErrorBlockProps {
  title?: string;
  message: string;
}

const ErrorBlock: React.FC<ErrorBlockProps> = ({ title = "Ошибка", message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="bg-destructive/10 text-destructive rounded-md px-6 py-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-base">{message}</p>
      </div>
    </div>
  );
};

export default ErrorBlock; 