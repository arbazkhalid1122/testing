import Image from "next/image";
import { Envelope1 } from "./icons/Envelope1";
import { Facebook } from "./icons/Facebook";
import { Instagram } from "./icons/Instagram";
import { Tiktok } from "./icons/Tiktok";
import { logo } from "@/assets";
import Link from "next/link";

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "How it works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
    { name: "Blog", href: "/blogs" },
  ];
  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: <Instagram className="cursor-pointer hover:opacity-80" />,
    },
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: <Facebook className="cursor-pointer hover:opacity-80" />,
    },
    {
      name: "TikTok",
      href: "https://tiktok.com",
      icon: <Tiktok className="cursor-pointer hover:opacity-80" />,
    },
  ];
  return (
    <footer className="bg-[#EEF1E7] flex flex-col items-center">
      <div className="flex flex-col w-full p-7 justify-between max-w-[80rem] space-y-8 md:flex-row md:items-center">
        <div className="space-y-10">
          <div className="flex w-full justify-center">
            <Image src={logo} className="max-w-[20rem]" alt="Logo" />
          </div>
          <Link
            href="mailto:support@printyourtrip.com"
            className="font-quicksand flex items-center gap-x-4 hover:underline"
          >
            <Envelope1 className="h-8 w-8 cursor-pointer hover:opacity-80" />
            support@printyourtrip.com
          </Link>
        </div>
        <div className="space-y-5">
          <div>
            <span className="block text-3xl font-semibold">Quick Links</span>
            <div className="flex flex-col text-xl mt-2">
              {quickLinks.map((link) => (
                <div key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-gray-700"
                  >
                    {link.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          {/* <div>
            <span className="text-3xl font-semibold">Out Social</span>
            <div className="flex space-x-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="h-10 w-10 cursor-pointer object-contain hover:opacity-80"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div> */}
        </div>
      </div>

      <div className="bg-[#FFFCF2] w-full flex flex-col items-center">
        <div className="max-w-[80rem] w-full">
        <div className="font-quicksand flex flex-col items-center justify-start gap-3 p-5 text-center text-lg font-semibold  md:flex-row md:gap-6">
          <span>Copyright © PYT- Real-Time Postcards</span>
          <div className="flex gap-4 text-base">
            <Link href="/privacy-policy" className="hover:underline text-muted-foreground hover:text-gray-700">
              Privacy Policy
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link href="/terms-and-conditions" className="hover:underline text-muted-foreground hover:text-gray-700">
              Terms & Conditions
            </Link>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
