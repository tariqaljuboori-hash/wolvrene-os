// filepath: components/ui/Button.tsx
import { ComponentProps } from '@/types/design';

interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick 
}: ButtonProps) {
  const variantStyles = {
    primary: 'bg-[#d4a853] text-[#0a0a0b] hover:bg-[#e5bc6a] font-semibold',
    secondary: 'bg-[#27272a] text-[#fafafa] border border-[#3f3f46] hover:bg-[#3f3f46]',
    ghost: 'bg-transparent text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a]',
    danger: 'bg-[#ef4444] text-white hover:bg-[#dc2626]',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-md font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}