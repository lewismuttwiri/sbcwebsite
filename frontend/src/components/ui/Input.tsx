import { InputHTMLAttributes, forwardRef } from 'react';
import { IconType } from 'react-icons';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: IconType;
  error?: string;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <input
            ref={ref}
            className={`appearance-none relative block w-full px-10 py-3 border ${
              error ? 'border-red-500' : 'border-gray-300'
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
