
import data from './likestagram.json';
import { PlaceHolderImages, type ImagePlaceholder } from './placeholder-images';

export type LikestagramUser = {
    id: string;
    username: string;
    avatarId: string;
    avatar?: ImagePlaceholder;
}

export type LikestagramPost = {
  id: string;
  userId: string;
  imageId: string;
  description: string;
  initialLikes: number;
  user: LikestagramUser;
  image?: ImagePlaceholder;
};

const users: LikestagramUser[] = data.users.map(user => {
    const avatar = PlaceHolderImages.find(img => img.id === user.avatarId);
    return { ...user, avatar };
});

export const LikestagramPosts: LikestagramPost[] = data.posts.map(post => {
    const user = users.find(u => u.id === post.userId);
    if (!user) {
        throw new Error(`Could not find user with id ${post.userId}`);
    }
    const image = PlaceHolderImages.find(img => img.id === post.imageId);
    return { ...post, user, image };
});
