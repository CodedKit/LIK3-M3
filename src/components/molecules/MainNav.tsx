// components/molecules/MainNav.tsx
import { NavLink } from "@/components/atoms/NavLink";
import Link from "next/link"; // Logo linki için
import { usePathname } from "next/navigation"; // Aktif linki belirlemek için

// Sadece bir görsel düzenleyici (layout) olarak çalışır.
export const MainNav = () => {
    const pathname = usePathname(); // Next.js'ten gelen hook

    // Link verisi (SOLID: Dış bağımlılıkları yönetmek için Type kullanın)
    const navItems = [
        { href: "/", label: "Anasayfa" },
        { href: "/hizmetler", label: "Hizmetler" },
        { href: "/fiyatlandirma", label: "Fiyatlandırma" },
        { href: "/iletisim", label: "İletişim" },
    ];

    return (
        <div className="hidden md:flex items-center space-x-4">
            {/* Navigasyon Linkleri */}
            <nav className="flex space-x-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        isActive={pathname === item.href}
                    />
                ))}
            </nav>

            <nav className="flex space-x-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        isActive={pathname === item.href}
                    />
                ))}
            </nav>

            <nav className="flex space-x-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        isActive={pathname === item.href}
                    />
                ))}
            </nav>
        </div>
    );
};