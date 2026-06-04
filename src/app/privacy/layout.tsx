import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — HealthDeck",
  description:
    "How HealthDeck collects, uses, stores, and protects your wellness data when you connect Google Health.",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
