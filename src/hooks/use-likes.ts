
'use client';

import { useAuth } from '@/hooks/use-auth';

export const useLikes = () => {
  const { activeProfile, updateProfile } = useAuth();

  const getLikes = (postId: string) => {
    return activeProfile?.likes?.[postId];
  };

  const likePost = (postId: string) => {
    if (activeProfile) {
      const currentLikes = activeProfile.likes?.[postId] || 0;
      const newLikes = { ...activeProfile.likes, [postId]: currentLikes + 1 };
      updateProfile(activeProfile.id, { likes: newLikes });
    }
  };

  return { getLikes, likePost };
};
