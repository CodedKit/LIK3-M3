
'use client';

import LikestagramPost from './likestagram-post';
import { LikestagramPosts } from '@/lib/likestagram';

export default function Likestagram() {
  return (
    <div className="h-full w-full bg-background p-4 flex flex-col items-center gap-8 overflow-y-auto">
      {LikestagramPosts.map(post => (
        <LikestagramPost key={post.id} post={post} />
      ))}
    </div>
  );
}
