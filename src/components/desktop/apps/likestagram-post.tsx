
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserProfileContext } from '@/context/user-profile-context';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardFooter, CardDescription } from '@/components/ui/card';
import { type LikestagramPost as PostData, type LikestagramUser } from '@/lib/likestagram';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { eventManager } from '@/lib/event-manager';

type FloatingHeart = {
  id: number;
};

interface LikestagramPostProps {
  post: PostData;
  onViewProfile: (user: LikestagramUser) => void;
}

export default function LikestagramPost({ post, onViewProfile }: LikestagramPostProps) {
  const { activeProfile, addXp, updateProfile } = useUserProfileContext();
  const [likes, setLikes] = useState(post.initialLikes);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    if (activeProfile?.likes) {
      setLikes(activeProfile.likes[post.id] || post.initialLikes);
    }
  }, [activeProfile, post.id, post.initialLikes]);

  const handleLike = useCallback(() => {
    if (!activeProfile) {
      console.error("handleLike called without an active profile.");
      return;
    }

    const newHeartId = Date.now();
    setFloatingHearts((currentHearts) => [...currentHearts, { id: newHeartId }]);
    setTimeout(() => {
        setFloatingHearts((currentHearts) => currentHearts.filter(h => h.id !== newHeartId));
    }, 1000);

    const currentLikes = activeProfile.likes?.[post.id] || post.initialLikes;
    const newLikeCount = currentLikes + 1;

    const newLikesData = {
        ...activeProfile.likes,
        [post.id]: newLikeCount
    };

    updateProfile(activeProfile.id, { likes: newLikesData });

    // Emit the event for the new architecture
    eventManager.emit('postLiked', {
      postId: post.id,
      author: post.user.username,
      newLikeCount: newLikeCount,
    });

    if (addXp) {
      addXp(10);
    }
  }, [activeProfile, addXp, updateProfile, post.id, post.user.username, post.initialLikes]);

  const isLiked = activeProfile?.likes?.[post.id] ? (activeProfile.likes[post.id] > post.initialLikes) : false;

  return (
    <div className="relative">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
          <button onClick={() => onViewProfile(post.user)} className="flex items-center gap-3">
            {post.user.avatar && (
                 <Avatar className="h-10 w-10">
                    <AvatarImage src={post.user.avatar.imageUrl} alt={post.user.username} />
                    <AvatarFallback>{post.user.username.charAt(0)}</AvatarFallback>
                </Avatar>
            )}
            <div className="font-semibold text-primary-foreground">{post.user.username}</div>
          </button>
        </CardHeader>
        <CardContent className="p-0">
          {post.image && (
            <div className="aspect-square relative">
              <Image
                src={post.image.imageUrl}
                alt="Post"
                fill
                className="object-cover"
                data-ai-hint={post.image.imageHint}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleLike} className="-ml-2">
                <Heart
                    className={cn(
                    'h-6 w-6',
                    isLiked
                        ? 'text-red-500 fill-red-500'
                        : 'text-primary-foreground'
                    )}
                />
                </Button>
                <p className="text-sm font-medium text-primary-foreground">
                {likes} {likes === 1 ? 'like' : 'likes'}
                </p>
            </div>
            <CardDescription>
                <button onClick={() => onViewProfile(post.user)} className="font-bold text-primary-foreground mr-2">{post.user.username}</button>
                {post.description}
            </CardDescription>
        </CardFooter>
      </Card>
      {floatingHearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-16 -left-6 flex items-center animate-like-animation pointer-events-none"
        >
          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
          <span className="ml-1 text-sm font-bold text-red-500">+1</span>
        </div>
      ))}
    </div>
  );
}
