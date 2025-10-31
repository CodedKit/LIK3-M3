// Typography utility component that uses the new font system
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import React from "react";

const typographyVariants = cva("", {
    variants: {
        variant: {
            // Design system'den gelen preset
            "body-sm": "font-sans text-custom-sm font-normal leading-5 tracking-none",
            // Diğer variant'lar
            "body-base": "font-body text-base font-normal leading-6",
            "headline-lg": "font-headline text-2xl font-semibold leading-8",
            "headline-xl": "font-headline text-3xl font-bold leading-10",
            "code-sm": "font-code text-sm font-normal leading-5",
        },
    },
    defaultVariants: {
        variant: "body-base",
    },
});

export interface TypographyProps
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
    as?: keyof JSX.IntrinsicElements;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
    ({ className, variant, as: Component = "p", ...props }, ref) => {
        return (
            <Component
                className={cn(typographyVariants({ variant }), className)}
                ref={ref}
                {...props}
            />
        );
    }
);
Typography.displayName = "Typography";

export { Typography, typographyVariants };