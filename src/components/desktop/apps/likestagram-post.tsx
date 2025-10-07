
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserProfileContext } from '@/context/user-profile-context';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const POST_ID = 'post-1';

type FloatingHeart = {
  id: number;
};

interface LikestagramPostProps {
  postImage: ImagePlaceholder | undefined;
}

export default function LikestagramPost({ postImage }: LikestagramPostProps) {
  const { activeProfile, addXp, updateProfile } = useUserProfileContext();
  const [likes, setLikes] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    if (activeProfile?.likes) {
      setLikes(activeProfile.likes[POST_ID] || 0);
    }
  }, [activeProfile]);

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

    const currentLikes = activeProfile.likes?.[POST_ID] || 0;
    const newLikesCount = currentLikes + 1;

    const newLikesData = {
        ...activeProfile.likes,
        [POST_ID]: newLikesCount
    };

    updateProfile(activeProfile.id, { likes: newLikesData });

    if (addXp) {
      addXp(10);
    }
  }, [activeProfile, addXp, updateProfile]);

  const isLiked = likes > 0;

  return (
    <div className="relative">
      <Card className="w-full max-w-sm">
        <CardContent className="p-4">
          {postImage && (
            <div className="aspect-square relative mb-4">
              <Image
                src={postImage.imageUrl}
                alt="Post"
                fill
                className="rounded-lg object-cover"
              />
            </div>
          )}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleLike}>
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
        </CardContent>
      </Card>
      {floatingHearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-5 -left-6 flex items-center animate-like-animation pointer-events-none"
        >
          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
          <span className="ml-1 text-sm font-bold text-red-500">+1</span>
        </div>
      ))}
    </div>
  );
}
