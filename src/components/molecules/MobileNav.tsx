// components/molecules/MobileNav.tsx
"use client"; // Sheet bileşenleri state kullandığı için 'use client' gereklidir.

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/atoms/Button";
import { Menu } from "lucide-react"; // Hamburger ikonu
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const mobileNavItems = [
    { href: "/", label: "Label" },
    { href: "/", label: "Label" },
    { href: "/", label: "Label" },
    { href: "/", label: "Label" },
    { href: "/", label: "Label" },
    { href: "/", label: "Label" },
];

export const MobileNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div >
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                {/* Tetikleyici: Hamburger Butonu */}
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Menüyü Aç">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>

                {/* Menü İçeriği: Sol veya Sağdan Açılan Çekmece */}
                <SheetContent side="left" className="w-[300px]">
                    <nav className="flex flex-col space-y-4 pt-6">
                        {mobileNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-lg font-medium transition-colors ",
                                    // Aktif link stili
                                    pathname === item.href ? "text-blue-600" : "text-foreground/60"
                                )}
                                onClick={() => setIsOpen(false)} // Tıkladıktan sonra menüyü kapat
                            >
                                {item.label}
                            </Link>
                        ))}
                        {/* ... Buraya Giriş/Kaydol butonu eklenebilir. */}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    );
};