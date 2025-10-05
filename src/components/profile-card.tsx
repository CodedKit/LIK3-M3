import { Button } from '@/components/ui/button';

interface ProfileCardProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
}

export default function ProfileCard({ icon, label, onClick }: ProfileCardProps) {
  return (
    <Button
      variant="ghost"
      className="h-auto w-auto flex flex-col gap-2 text-center p-2 rounded-lg"
      onClick={onClick}
    >
      <div className="p-2">
          {icon}
      </div>
      {label}
    </Button>
  );
}
