
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Products } from '@/lib/products';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserProfileContext } from '@/context/user-profile-context';

export default function EhmazonApp() {
  const { toast } = useToast();
  const { addXp } = useUserProfileContext();

  const handleAddToCart = (productName: string) => {
    addXp(25);
    toast({
      title: "Added to Cart (+25 XP)",
      description: `${productName} has been added to your cart.`,
    });
  };

  return (
    <div className="h-full w-full bg-background p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary-foreground font-headline">ehmazon</h1>
        <p className="text-muted-foreground">spend. consume. repeat.</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
                <div className="relative aspect-square w-full">
                    <Image
                        src={product.image.imageUrl}
                        alt={product.image.description}
                        fill
                        className="rounded-md object-cover"
                        data-ai-hint={product.image.imageHint}
                    />
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <p className="text-primary font-semibold text-lg mt-2">${product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleAddToCart(product.name)}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
