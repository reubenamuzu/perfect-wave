"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  MessageCircle,
  LayoutDashboard,
  Home,
  ShoppingBag,
  Image,
  Star,
  MapPin,
  Phone,
  Layers,
  ChevronDown,
} from "lucide-react";
import { buildWhatsAppURL } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import PerfectWaveLogo from "@/components/shared/PerfectWaveLogo";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

const PRIMARY_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/frame-designer", label: "Frame Designer", icon: Layers },
  { href: "/gallery", label: "Gallery", icon: Image },
];

const MORE_LINKS = [
  { href: "/reviews", label: "Reviews", icon: Star },
  { href: "/track-order", label: "Track Order", icon: MapPin },
  { href: "/contact", label: "Contact", icon: Phone },
];

const ALL_NAV_LINKS = [...PRIMARY_LINKS, ...MORE_LINKS];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const moreIsActive = MORE_LINKS.some((l) => l.href === pathname);

  return (
    <header
      id="site-navbar"
      className={cn(
        "sticky top-0 z-40 w-full bg-white transition-all duration-300",
        scrolled
          ? "shadow-[0_2px_16px_rgba(27,108,168,0.08)]"
          : "border-b border-[#C8DFF0]",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" aria-label="PerfectWave Services home">
            <PerfectWaveLogo size="md" variant="dark" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                id={
                  link.href === "/frame-designer"
                    ? "frame-designer-link"
                    : undefined
                }
                className={cn(
                  "px-3.5 py-2 text-sm rounded-lg transition-colors",
                  pathname === link.href
                    ? "text-[#1B6CA8] bg-[#EAF3FB] font-medium"
                    : "text-[#5A7A99] hover:text-[#1B6CA8] hover:bg-[#F4F8FC] font-normal",
                )}
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {link.label}
              </Link>
            ))}

            {/* More dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "flex items-center gap-1 px-3.5 py-2 text-sm rounded-lg transition-colors outline-none",
                  moreIsActive
                    ? "text-[#1B6CA8] bg-[#EAF3FB] font-medium"
                    : "text-[#5A7A99] hover:text-[#1B6CA8] hover:bg-[#F4F8FC] font-normal",
                )}
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                More
                <ChevronDown className="w-3.5 h-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="min-w-[160px] rounded-xl border border-[#C8DFF0] shadow-lg p-1"
              >
                {MORE_LINKS.map((link) => (
                  <DropdownMenuItem
                    key={link.href}
                    className="p-0 focus:bg-transparent"
                  >
                    <Link
                      href={link.href}
                      id={
                        link.href === "/track-order"
                          ? "track-order-link"
                          : undefined
                      }
                      className={cn(
                        "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm",
                        pathname === link.href
                          ? "text-[#1B6CA8] bg-[#EAF3FB] font-medium"
                          : "text-[#5A7A99] hover:text-[#1B6CA8] hover:bg-[#F4F8FC]",
                      )}
                      style={{ fontFamily: "Outfit, sans-serif" }}
                    >
                      <link.icon className="w-4 h-4 shrink-0" />
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href={buildWhatsAppURL("Hello! I want to place an order.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Order on WhatsApp"
            >
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center bg-accent gap-2 border border-[#1B6CA8] text-[#1B6CA8] px-5 py-2 rounded-[10px] text-sm hover:bg-[#1B6CA8] hover:text-white transition-colors"
                style={{ fontFamily: "Outfit, sans-serif", fontWeight: 500 }}
              >
                <MessageCircle className="w-4 h-4" />
                Order Now
              </motion.button>
            </a>
            <Link href="/dashboard" aria-label="Admin Dashboard">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 border border-[#C8DFF0] text-[#5A7A99] px-5 py-2 rounded-[10px] text-sm hover:bg-[#EAF3FB] hover:text-[#1B6CA8] transition-colors"
                style={{ fontFamily: "Outfit, sans-serif", fontWeight: 500 }}
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin Dashboard
              </motion.button>
            </Link>
          </div>

          {/* Mobile — Sheet trigger */}
          <div className="lg:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger
                className="p-2 rounded-lg text-[#1A2E42] hover:bg-[#EAF3FB] transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </SheetTrigger>

              <SheetContent
                side="right"
                className="p-0 w-72 flex flex-col"
                style={{ borderLeft: "1px solid #C8DFF0" }}
              >
                {/* Sheet header */}
                <SheetHeader className="px-5 py-4 border-b border-[#C8DFF0]">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <Link href="/" onClick={() => setSheetOpen(false)}>
                    <PerfectWaveLogo size="sm" variant="dark" />
                  </Link>
                </SheetHeader>

                {/* Nav links */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                  <p
                    className="text-[10px] tracking-widest uppercase text-[#5A7A99] px-3 mb-2"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    Navigation
                  </p>
                  {ALL_NAV_LINKS.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setSheetOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                          isActive
                            ? "text-[#1B6CA8] font-medium"
                            : "text-[#5A7A99] hover:text-[#1B6CA8] hover:bg-[#F4F8FC]",
                        )}
                        style={
                          isActive
                            ? {
                                backgroundColor: "#EAF3FB",
                                borderLeft: "3px solid #1B6CA8",
                                fontFamily: "Outfit, sans-serif",
                              }
                            : { fontFamily: "Outfit, sans-serif" }
                        }
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {label}
                      </Link>
                    );
                  })}
                </nav>

                {/* Bottom CTAs */}
                <div className="px-4 py-4 space-y-2 border-t border-[#C8DFF0]">
                  <Link
                    href="/dashboard"
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center gap-2 w-full border border-[#C8DFF0] text-[#5A7A99] px-4 py-2.5 rounded-[10px] text-sm hover:bg-[#EAF3FB] hover:text-[#1B6CA8] transition-colors"
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                  <a
                    href={buildWhatsAppURL("Hello! I want to place an order.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center justify-center gap-2 w-full bg-[#1B6CA8] text-white px-4 py-2.5 rounded-[10px] text-sm hover:bg-[#0D4F82] transition-colors"
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Order on WhatsApp
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
