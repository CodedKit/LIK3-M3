
'use client';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import LikestagramPost from './likestagram-post';


export default function Likestagram() {
  const postImage = PlaceHolderImages.find(img => img.id === 'user-avatar-1');

  return (
    <div className="h-full w-full bg-background p-4 flex justify-center items-start">
      <LikestagramPost postImage={postImage} />
    </div>
  );
}
