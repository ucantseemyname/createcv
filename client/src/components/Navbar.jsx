import { useNavigate } from "react-router-dom";
import Logo from "./Logo.jsx";

const links = [
  { label: "ATS Check", href: "/analyze" },
  { label: "Features", href: "/#features" },
  { label: "Templates", href: "/#templates" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="transition hover:text-dark">
              {l.label}
            </a>
          ))}
        </nav>

        <button onClick={() => navigate("/build")} className="btn-primary !px-5 !py-2.5">
          Build My Resume
        </button>
      </div>
    </header>
  );
}
