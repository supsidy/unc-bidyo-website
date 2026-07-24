import { useBookingModal } from "../context/BookingModalContext";

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com/UNCBidyo", icon: "facebook" },
  { name: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { name: "Twitter / X", href: "https://twitter.com", icon: "twitter" },
];

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "What We Offer", href: "#offer" },
  { label: "Meet the Team", href: "#team" },
  { label: "Highlights", href: "#highlights" },
];

// Minimal inline icons — no extra dependency needed.
function SocialIcon({ type }) {
  const common = "h-4 w-4 fill-current";
  switch (type) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path d="M13.5 22v-8.5H16l.5-3.5h-3V7.7c0-1 .3-1.7 1.8-1.7H16.6V2.8C16.3 2.8 15.3 2.7 14.1 2.7c-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4V13H9.9V22h3.6z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path d="M12 2.2c2.7 0 3 0 4.1.06 1.1.05 1.8.22 2.2.37.6.23 1 .5 1.4.9.4.4.67.8.9 1.4.16.4.33 1.1.37 2.2.06 1.1.06 1.4.06 4.1s0 3-.06 4.1c-.05 1.1-.22 1.8-.37 2.2-.23.6-.5 1-.9 1.4-.4.4-.8.67-1.4.9-.4.16-1.1.33-2.2.37-1.1.06-1.4.06-4.1.06s-3 0-4.1-.06c-1.1-.05-1.8-.22-2.2-.37-.6-.23-1-.5-1.4-.9-.4-.4-.67-.8-.9-1.4-.16-.4-.33-1.1-.37-2.2C2.2 15 2.2 14.7 2.2 12s0-3 .06-4.1c.05-1.1.22-1.8.37-2.2.23-.6.5-1 .9-1.4.4-.4.8-.67 1.4-.9.4-.16 1.1-.33 2.2-.37C9 2.2 9.3 2.2 12 2.2zm0 1.8c-2.65 0-2.96 0-4 .06-.87.04-1.34.18-1.65.3-.42.16-.72.36-1.03.67-.31.31-.5.6-.67 1.03-.12.31-.26.78-.3 1.65-.06 1.04-.06 1.35-.06 4s0 2.96.06 4c.04.87.18 1.34.3 1.65.16.42.36.72.67 1.03.31.31.6.5 1.03.67.31.12.78.26 1.65.3 1.04.06 1.35.06 4 .06s2.96 0 4-.06c.87-.04 1.34-.18 1.65-.3.42-.16.72-.36 1.03-.67.31-.31.5-.6.67-1.03.12-.31.26-.78.3-1.65.06-1.04.06-1.35.06-4s0-2.96-.06-4c-.04-.87-.18-1.34-.3-1.65-.16-.42-.36-.72-.67-1.03a2.9 2.9 0 0 0-1.03-.67c-.31-.12-.78-.26-1.65-.3-1.04-.06-1.35-.06-4-.06zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 1.8a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2zm5.1-2.9a1.14 1.14 0 1 1 0 2.28 1.14 1.14 0 0 1 0-2.28z" />
        </svg>
      );
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path d="M18.9 3H21.7l-6.1 7 7.2 9.5h-5.6l-4.4-5.8-5 5.8H4.9l6.5-7.5L4.5 3h5.7l4 5.3L18.9 3zm-1 15h1.6L7.2 4.9H5.5L17.9 18z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Footer() {
  const { openBooking } = useBookingModal();

  return (
    <footer className="bg-black/90">
      {/* Main footer content */}
      <div className="px-6 py-14 lg:px-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3">
              <img
                src="/images/bidyo-white.png"
                alt="UNC BIDYO logo"
                className="h-12 w-12 shrink-0 rounded-full object-cover"
              />
              <span className="font-display text-lg tracking-tight text-white">
                UNC BIDYO
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Est. 2023, The organization's mission is to capture and share the moments of every UNCean.
            </p>

            {/* Socials */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-white/70 transition hover:bg-bidyo-crimson hover:text-white"
                >
                  <SocialIcon type={social.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
              Quick Links
            </p>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 transition hover:text-bidyo-crimson"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
              Contact
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <a
                  href="mailto:unc.bidyo@example.com"
                  className="transition hover:text-bidyo-crimson"
                >
                  uncbidyoorg@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+639000000000"
                  className="transition hover:text-bidyo-crimson"
                >
                  +63 900 000 0000
                </a>
              </li>
              <li className="text-white/50">J. Hernandez Ave. Naga City, Camarines Sur, Philippines 4400</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-6 py-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} UNC BIDYO. All rights reserved.</p>
          <p>Non Scholae, Sed Vitae.</p>
        </div>
      </div>
    </footer>
  );
}
