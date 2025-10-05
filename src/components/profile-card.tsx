import { cn } from '@/lib/utils';

interface ProfileCardProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export default function ProfileCard({ children, onClick, className }: ProfileCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "h-auto w-auto flex flex-col gap-1 text-center p-2 rounded-lg cursor-pointer transition-colors hover:bg-white/10",
        className
      )}
    >
      {children}
    </div>
  );
}
