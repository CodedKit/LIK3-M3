
import { PlaceHolderImages, type ImagePlaceholder } from './placeholder-images';
import chronoSmartwatch from './products/chrono-smartwatch.json';
import noiseAwayHeadphones from './products/noise-away-headphones.json';
import skyHighDrone from './products/sky-high-drone.json';
import virtusphereVr from './products/virtusphere-vr.json';

export type Product = {
  id: string;
  name: string;
  price: number;
  imageId: string;
  image: ImagePlaceholder;
};

const productData = [
    chronoSmartwatch,
    noiseAwayHeadphones,
    skyHighDrone,
    virtusphereVr,
];

export const Products: Product[] = productData.map(product => {
    const image = PlaceHolderImages.find(img => img.id === product.imageId);
    if (!image) {
        throw new Error(`Could not find image with id ${product.imageId}`);
    }
    return { ...product, image };
});
