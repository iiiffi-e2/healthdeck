import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — HealthDeck",
  description:
    "Terms and conditions for using HealthDeck, including Google Health integration, acceptable use, and disclaimers.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
