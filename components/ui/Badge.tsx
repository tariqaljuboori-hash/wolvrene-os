// filepath: components/ui/Badge.tsx
import { ComponentProps } from '@/types/design';

interface BadgeProps extends ComponentProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'gold';
}

export function Badge({ 
  children, 
  className = '', 
  variant = 'default' 
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-[#27272a] text-[#a1a1aa]',
    success: 'bg-[#22c55e]/20 text-[#22c55e]',
    warning: 'bg-[#eab308]/20 text-[#eab308]',
    error: 'bg-[#ef4444]/20 text-[#ef4444]',
    info: 'bg-[#3b82f6]/20 text-[#3b82f6]',
    gold: 'bg-[rgba(212,168,83,0.15)] text-[#d4a853]',
  };

  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
      ${variantStyles[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
}