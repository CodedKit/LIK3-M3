
'use client';

import { useAuth } from '@/hooks/use-auth';

export const useLikes = () => {
  const { activeProfile, updateProfile } = useAuth();

  const getLikes = (postId: string) => {
    return activeProfile?.likes?.[postId];
  };

  const likePost = (postId: string, newLikeCount: number) => {
    if (activeProfile) {
      const newLikes = { ...activeProfile.likes, [postId]: newLikeCount };
      updateProfile(activeProfile.id, { likes: newLikes });
    }
  };

  return { getLikes, likePost };
};
