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
const LIKES_STORAGE_KEY = 'virtual-temptations-likes';

type LikesData = {
  [profileId: string]: {
    [postId: string]: number;
  };
};

export default function Likestagram() {
  const { activeProfile } = useUserProfileContext();
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    if (!activeProfile) return;

    try {
      const storedLikes = window.localStorage.getItem(LIKES_STORAGE_KEY);
      const likesData: LikesData = storedLikes ? JSON.parse(storedLikes) : {};
      const profileLikes = likesData[activeProfile.id] || {};
      const postLikes = profileLikes[POST_ID] || 0;
      setLikes(postLikes);
    } catch (error) {
      console.error('Failed to load likes from localStorage', error);
      setLikes(0);
    }
  }, [activeProfile]);

  const handleLike = useCallback(() => {
    if (!activeProfile) {
      console.error("handleLike called without an active profile.");
      return;
    }

    try {
      const storedLikes = window.localStorage.getItem(LIKES_STORAGE_KEY);
      const likesData: LikesData = storedLikes ? JSON.parse(storedLikes) : {};

      if (!likesData[activeProfile.id]) {
        likesData[activeProfile.id] = {};
      }

      const currentLikes = likesData[activeProfile.id][POST_ID] || 0;
      const newLikes = currentLikes + 1;

      likesData[activeProfile.id][POST_ID] = newLikes;
      window.localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likesData));
      setLikes(newLikes);
    } catch (error) {
      console.error('Failed to save likes to localStorage', error);
    }
  }, [activeProfile]);

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
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
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
