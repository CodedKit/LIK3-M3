
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/context/user-profile-context';
import { Trash2 } from 'lucide-react';

interface ProfileCardProps {
  profile: Pick<UserProfile, 'id' | 'username' | 'avatarUrl'>;
  onClick: (profile: Pick<UserProfile, 'id' | 'username' | 'avatarUrl'>) => void;
  onDelete: (event: React.MouseEvent, profileId: string) => void;
  className?: string;
}

export default function ProfileCard({ profile, onClick, onDelete, className }: ProfileCardProps) {
  return (
    <div
      onClick={() => onClick(profile)}
      className={cn(
        "relative group flex h-auto flex-col items-center gap-1 rounded-lg text-center transition-all duration-200 overflow-visible p-2 w-[144px]",
        "cursor-pointer hover:ring-1 hover:ring-border",
        className
      )}
    >
      <div className="w-full aspect-square">
        <Avatar className="h-full w-full rounded-lg">
          <AvatarImage src={profile.avatarUrl} alt={profile.username} />
          <AvatarFallback>{profile.username.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      <p className="mt-4 text-lg font-headline text-primary-foreground">{profile.username}</p>
      <Button
        variant="outline"
        size="icon"
        className="absolute -bottom-11 left-1/2 -translate-x-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => onDelete(e, profile.id)}
      >
        <Trash2 className="text-destructive h-4 w-4" />
      </Button>
    </div>
  );
}
