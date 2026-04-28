// filepath: components/ui/Card.tsx
import { ComponentProps } from '@/types/design';

interface CardProps extends ComponentProps {
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'md' 
}: CardProps) {
  const variantStyles = {
    default: 'bg-[#111113] border border-[#27272a]',
    elevated: 'bg-[#1f1f23] border border-[#27272a] shadow-lg',
    bordered: 'bg-transparent border-2 border-[#27272a]',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div className={`rounded-lg ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
}