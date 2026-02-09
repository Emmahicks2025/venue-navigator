import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo = ({ className, size = 'md' }: LogoProps) => {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-lg' },
    md: { icon: 'w-8 h-8', text: 'text-xl lg:text-2xl' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl lg:text-3xl' },
  };

  return (
    <div className={cn('flex items-center gap-2 group', className)}>
      {/* Orbit Icon */}
      <div className="relative">
        <svg
          viewBox="0 0 40 40"
          className={cn(sizes[size].icon, 'transition-transform group-hover:scale-110')}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer orbit ring */}
          <ellipse
            cx="20"
            cy="20"
            rx="17"
            ry="8"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
            transform="rotate(-20 20 20)"
          />
          {/* Inner orbit ring */}
          <ellipse
            cx="20"
            cy="20"
            rx="14"
            ry="6"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-primary/60"
            transform="rotate(25 20 20)"
          />
          {/* Center ticket/planet */}
          <circle
            cx="20"
            cy="20"
            r="6"
            className="fill-primary"
          />
          {/* Ticket cutout detail */}
          <circle cx="20" cy="20" r="2" className="fill-background" />
          {/* Orbiting dot */}
          <circle
            cx="35"
            cy="16"
            r="2.5"
            className="fill-accent"
          />
        </svg>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {/* Text */}
      <span className={cn('font-display font-bold tracking-tight', sizes[size].text)}>
        <span className="text-primary">Tix</span>
        <span className="text-foreground">Orbit</span>
      </span>
    </div>
  );
};
