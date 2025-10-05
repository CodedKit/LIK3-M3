import { Button } from '@/components/ui/button';

interface AppIconProps {
  name: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export default function AppIcon({ name, icon, onClick }: AppIconProps) {
  return (
    <Button
      variant="ghost"
      className="flex h-28 w-24 flex-col items-center justify-start gap-2 rounded-lg p-2 transition-colors hover:bg-white/10"
      onClick={onClick}
    >
      <div className="flex h-16 w-16 items-center justify-center">
        {icon}
      </div>
      <p className="w-full truncate text-center text-sm text-primary-foreground">
        {name}
      </p>
    </Button>
  );
}
