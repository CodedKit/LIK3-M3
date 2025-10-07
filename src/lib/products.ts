
import data from './products.json';
import { PlaceHolderImages, type ImagePlaceholder } from './placeholder-images';

export type Product = {
  id: string;
  name: string;
  price: number;
  imageId: string;
  image: ImagePlaceholder;
};

export const Products: Product[] = data.products.map(product => {
    const image = PlaceHolderImages.find(img => img.id === product.imageId);
    if (!image) {
        throw new Error(`Could not find image with id ${product.imageId}`);
    }
    return { ...product, image };
});
