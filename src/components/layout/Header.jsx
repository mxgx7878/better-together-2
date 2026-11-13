import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { BrandStripe, NAVY, LIME } from "../public/ui";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "What We Do", path: "/what-we-do" },
  { name: "Subscription", path: "/subscription" },
  { name: "Directory", path: "/business-directory" },
  { name: "Events", path: "/events" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const [menuPath, setMenuPath] = useState(pathname);

  // Close the mobile menu whenever the route changes.
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    if (isMenuOpen) setIsMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = ({ isActive }) =>
    `relative rounded-full px-3 py-2 text-[14px] font-semibold transition-colors ${
      isActive ? "text-[#14306B] bg-[#EEF2FA]" : "text-slate-600 hover:text-[#14306B]"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_6px_24px_rgba(20,48,107,0.08)]" : "border-b border-slate-100"
      }`}
    >
      <BrandStripe />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[76px] items-center justify-between gap-4">
          <Link to="/" className="flex flex-shrink-0 items-center" aria-label="Better Together Network home">
            <img
              src="/uploads/logo.png"
              alt="The Better Together Network - Reimagining Disabilities"
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} end={link.path === "/"} className={linkClass}>
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 xl:flex">
            <Link
              to="/login"
              className="rounded-full px-4 py-2 text-[14px] font-semibold text-slate-600 transition hover:text-[#14306B]"
            >
              Log in
            </Link>
            <Link
              to="/subscription"
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[14px] font-bold text-white shadow-sm transition hover:brightness-125"
              style={{ background: NAVY }}
            >
              Join free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 xl:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="max-h-[calc(100vh-80px)] overflow-y-auto border-t border-slate-100 bg-white xl:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 pb-6 pt-3 sm:px-6" aria-label="Mobile">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-[15px] font-semibold ${
                    isActive ? "bg-[#EEF2FA] text-[#14306B]" : "text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Link
                to="/login"
                className="rounded-full border-2 py-3 text-center text-sm font-bold"
                style={{ borderColor: NAVY, color: NAVY }}
              >
                Log in
              </Link>
              <Link
                to="/subscription"
                className="rounded-full py-3 text-center text-sm font-bold text-slate-900"
                style={{ background: LIME }}
              >
                Join free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
