// filepath: components/ui/Panel.tsx
import { ComponentProps } from '@/types/design';

interface PanelProps extends ComponentProps {
  title?: string;
  collapsible?: boolean;
  collapsed?: boolean;
}

export function Panel({ 
  children, 
  className = '', 
  title,
  collapsible = false,
  collapsed = false 
}: PanelProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#27272a]">
          <h3 className="text-sm font-semibold text-[#fafafa] uppercase tracking-wider">
            {title}
          </h3>
          {collapsible && (
            <button className="text-[#71717a] hover:text-[#fafafa] transition-colors">
              {collapsed ? '+' : '−'}
            </button>
          )}
        </div>
      )}
      <div className={`${collapsed ? 'hidden' : ''}`}>
        {children}
      </div>
    </div>
  );
}