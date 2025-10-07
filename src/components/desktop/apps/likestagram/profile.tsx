
'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LikestagramPosts, type LikestagramUser } from '@/lib/likestagram';

interface LikestagramProfileAppProps {
    user: LikestagramUser | null;
}

export default function LikestagramProfileApp({ user }: LikestagramProfileAppProps) {
    if (!user) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>User not found.</p>
            </div>
        );
    }

    const userPosts = LikestagramPosts.filter(post => post.userId === user.id);
    const postCount = userPosts.length;
    // Dummy data for followers and following
    const followers = Math.floor(Math.random() * 1000);
    const following = Math.floor(Math.random() * 500);

    return (
        <div className="p-4">
            <header className="flex items-center gap-8 mb-8">
                {user.avatar && (
                    <Avatar className="h-24 w-24 md:h-36 md:w-36">
                        <AvatarImage src={user.avatar.imageUrl} alt={user.username} />
                        <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <div className="space-y-3">
                    <h1 className="text-2xl font-semibold">{user.username}</h1>
                    <div className="flex gap-6 text-sm">
                        <span><span className="font-bold">{postCount}</span> posts</span>
                        <span><span className="font-bold">{followers}</span> followers</span>
                        <span><span className="font-bold">{following}</span> following</span>
                    </div>
                    <div>
                        {/* Placeholder for user bio */}
                        <p className="text-sm text-muted-foreground">Just a placeholder bio, enjoying the virtual life!</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-3 gap-1">
                {userPosts.map(post => (
                    <Card key={post.id} className="aspect-square relative overflow-hidden">
                         {post.image && (
                            <Image 
                                src={post.image.imageUrl} 
                                alt={post.description}
                                fill
                                className="object-cover"
                            />
                         )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
