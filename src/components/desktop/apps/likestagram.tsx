
'use client';

import LikestagramPost from './likestagram-post';
import { LikestagramPosts, type LikestagramUser } from '@/lib/likestagram';

interface LikestagramProps {
  onViewProfile: (user: LikestagramUser) => void;
}

export default function Likestagram({ onViewProfile }: LikestagramProps) {
  return (
    <div className="h-full w-full bg-background p-4 flex flex-col items-center gap-8 overflow-y-auto">
      {LikestagramPosts.map(post => (
        <LikestagramPost key={post.id} post={post} onViewProfile={onViewProfile} />
      ))}
    </div>
  );
}
