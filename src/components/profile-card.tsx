import { cn } from '@/lib/utils';

interface ProfileCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function ProfileCard({ children, onClick, className }: ProfileCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative group flex h-auto flex-col items-center gap-1 rounded-lg text-center transition-colors overflow-visible p-2",
        onClick && "cursor-pointer hover:bg-white/10",
        className
      )}
    >
      {children}
    </div>
  );
}
