// components/organisms/Header.tsx
import { MainNav } from "@/components/molecules/MainNav";
import { MobileNav } from "@/components/molecules/MobileNav";
// Örneğin kendi temalı butonumuz
import { Button } from "@/components/atoms/Button";

// Tek Sorumluluk Prensibi: Sadece genel menü yapısını (üst çerçeveyi) yönetir.
export const Header = () => {
    return (
        // Dış kontainer: Sabit üstte (fixed top), hafif gölgeli (shadow-sm)
        <header className="sticky top-0 z-40 w-full border-b bg-background shadow-sm">
            <div className="container flex h-16 items-center pr-gap-3 pl-gap-1">
                {/* Masaüstü Menü (Logo ve Linkler) - Tam genişlik */}
                <MainNav />
                
                {/* Mobil Menü - Sadece mobilde görünür */}
                <div className="md:hidden">
                    <MobileNav />
                </div>
            </div>
        </header>
    );
};