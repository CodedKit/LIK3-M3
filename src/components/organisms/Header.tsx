import { MainNav } from "@/components/molecules/MainNav";
import { MobileNav } from "@/components/molecules/MobileNav";

// Tek Sorumluluk Prensibi: Sadece genel menü yapısını (üst çerçeveyi) yönetir.
export const Header = () => {
    return (
        // Dış kontainer: Sabit üstte (fixed top), hafif gölgeli (shadow-sm)
        <header className="sticky top-0 z-40 w-full border-b bg-background shadow-sm">
            <div className="container flex h-10 items-center justify-between pr-gap-3 pl-gap-1 gap-4">
                <MainNav />
                <MobileNav />
            </div>
        </header>
    );
};