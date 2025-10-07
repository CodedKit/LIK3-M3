
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserProfileContext } from '@/context/user-profile-context';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const POST_ID = 'post-1';

export default function Likestagram() {
  const { activeProfile, addXp, updateProfile } = useUserProfileContext();
  const [likes, setLikes] = useState(0);

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

  const postImage = PlaceHolderImages.find(img => img.id === 'user-avatar-1');
  const isLiked = likes > 0;

  return (
    <div className="h-full w-full bg-background p-4 flex justify-center items-start">
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
    </div>
  );
}
