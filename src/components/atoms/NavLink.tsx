// components/atoms/NavLink.tsx
// Next.js Link ve kendi temalı Button'umuzu kullanıyoruz.
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

interface NavLinkProps {
    href: string;
    label: string;
    isActive: boolean; // Aktif sayfa durumunu yönetmek için OCP'ye uygun prop
}

export const NavLink = ({ href, label, isActive }: NavLinkProps) => {
    // Stil kararları: Aktif linki Figma'ya uygun şekilde vurguluyoruz.
    const activeStyles = isActive
        ? "bg-muted text-sidebar-ring font-semibold" // Vurgulu stil
        : "text-foreground hover:bg-muted"; // Varsayılan stil

    return (
        <Button asChild variant="ghost" className={cn(
            "p-2 h-auto",
            // Design system typography preset
            "font-sans text-custom-sm font-normal leading-5 tracking-none",
            activeStyles
        )}>
            <Link href={href}>
                {label}
            </Link>
        </Button>
    );
};