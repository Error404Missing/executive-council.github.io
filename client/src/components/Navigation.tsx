import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import {
  Menu,
  X,
  Home,
  Calendar,
  Users,
  Trophy,
  Ban,
  Crown,
  HelpCircle,
  FileText,
  Mail,
  Shield,
  LogOut,
  User,
} from "lucide-react";
import { SiDiscord } from "react-icons/si";

const DISCORD_INVITE = "https://discord.gg/your-invite-link";

const navItems = [
  { href: "/", label: "მთავარი", icon: Home },
  { href: "/schedule", label: "განრიგი", icon: Calendar },
  { href: "/teams", label: "გუნდები", icon: Users },
  { href: "/results", label: "შედეგები", icon: Trophy },
  { href: "/blocked", label: "დაბლოკილი", icon: Ban },
  { href: "/vip", label: "VIP", icon: Crown },
  { href: "/help", label: "დახმარება", icon: HelpCircle },
  { href: "/rules", label: "წესები", icon: FileText },
  { href: "/contact", label: "კონტაქტი", icon: Mail },
];

export function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-md bg-primary/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">
              PUBG Scrim
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={`gap-2 ${isActive ? "text-primary" : ""}`}
                    data-testid={`nav-link-${item.href.replace("/", "") || "home"}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-[#5865F2] hover:text-[#5865F2]"
              data-testid="button-discord"
            >
              <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                <SiDiscord className="w-5 h-5" />
              </a>
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full"
                    data-testid="button-user-menu"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={user?.profileImageUrl || undefined}
                        alt={user?.firstName || "User"}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {user?.firstName?.[0] || user?.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {isAdmin && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Shield className="w-2.5 h-2.5 text-primary-foreground" />
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">
                      {user?.firstName || "მომხმარებელი"}
                    </p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="w-4 h-4" />
                      პროფილი
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                        <Shield className="w-4 h-4" />
                        ადმინ პანელი
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/api/logout" className="flex items-center gap-2 cursor-pointer text-destructive">
                      <LogOut className="w-4 h-4" />
                      გასვლა
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild data-testid="button-login">
                <a href="/api/login">შესვლა</a>
              </Button>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-background border-border p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-md bg-primary/20 flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-xl font-bold">PUBG Scrim</span>
                    </div>
                  </div>
                  <nav className="flex-1 overflow-y-auto p-4">
                    <div className="flex flex-col gap-1">
                      {navItems.map((item, index) => {
                        const isActive = location === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Button
                              variant={isActive ? "secondary" : "ghost"}
                              className={`w-full justify-start gap-3 animate-fade-in-up stagger-${(index % 5) + 1} ${
                                isActive ? "text-primary" : ""
                              }`}
                              data-testid={`mobile-nav-link-${item.href.replace("/", "") || "home"}`}
                            >
                              <item.icon className="w-5 h-5" />
                              {item.label}
                            </Button>
                          </Link>
                        );
                      })}
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                          <Button
                            variant={location === "/admin" ? "secondary" : "ghost"}
                            className="w-full justify-start gap-3 text-primary"
                            data-testid="mobile-nav-link-admin"
                          >
                            <Shield className="w-5 h-5" />
                            ადმინ პანელი
                          </Button>
                        </Link>
                      )}
                    </div>
                  </nav>
                  <div className="p-4 border-t border-border">
                    <Button
                      variant="outline"
                      className="w-full gap-2 text-[#5865F2] border-[#5865F2]/30"
                      asChild
                    >
                      <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                        <SiDiscord className="w-5 h-5" />
                        Discord
                      </a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
