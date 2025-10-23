"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { logoFull as Logo } from "@/assets";
import { HamburgerButton } from "../animations/elements/HamburgerButton";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { LinkButton } from "./Button";
import { AnimatePresence, easeInOut, easeOut, motion } from "framer-motion";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "How It Works",
    href: "/how-it-works",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "FAQ",
    href: "/faq",
  },
  {
    label: "Blogs",
    href: "/blogs",
  },
];

export function Nav({ className }: { className?: string }) {
  const [navVisible, setNavVisible] = useState(true);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [buttonState, setButtonState] = useState<"open" | "closed">("closed");
  const hamburgerMenuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const pathName = usePathname();

  useOnClickOutside(
    [
      hamburgerMenuRef as React.RefObject<HTMLDivElement>,
      navRef as React.RefObject<HTMLDivElement>,
    ],
    () => setButtonState("closed"),
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 20) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isMobileDevice = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setIsMobile(isMobileDevice);
  }, [isMobileDevice]);

  return (
    <nav
      ref={navRef}
      className={cn(
        "sticky left-auto right-auto top-0 z-30 flex w-full justify-center overflow-visible",
        className, pathName === "/" ? "h-0" : "h-fit"
      )}
    >
      <div className={cn("bg-background h-fit w-full rounded-full px-9 py-4 mx-4 mt-4 shadow-[0px_0px_25px] shadow-black/20 max-w-[80rem] transition-all duration-300  z-30", !navVisible &&
        "translate-y-[-120%] hover:translate-y-0 active:translate-y-0")}>
        <ul className="flex h-full items-center justify-between space-x-4 transition-all duration-200">
          <li>
            <Link href="/">
              <Image src={Logo} alt="Print Your Trip Logo" />
            </Link>
          </li>
          {isMobile === null
            ? null
            : isMobile === false && (
              <>
                <li className="flex h-full items-center">
                  <ul className="flex h-full items-center space-x-4 font-semibold text-xl">
                    {navItems.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className={
                            pathName === item.href
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <LinkButton href={process.env.NEXT_PUBLIC_APP_URL || ""}>Create My Postcard</LinkButton>
                </li>
              </>
            )}
          {isMobile && (
            <li className="flex h-10 items-center">
              <HamburgerButton
                state={buttonState}
                handleOnClick={() =>
                  setButtonState((prev) =>
                    prev === "open" ? "closed" : "open",
                  )
                }
              />
              <AnimatePresence mode="wait">
                {buttonState === "open" && (
                  <HamburgerMenu
                    pathName={pathName}
                    ref={hamburgerMenuRef as React.RefObject<HTMLDivElement>}
                  />
                )}
              </AnimatePresence>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

function HamburgerMenu({
  ref,
  pathName,
}: {
  ref: React.RefObject<HTMLDivElement>;
  pathName: string;
}) {
  const listVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.25, ease: easeOut },
    },
  };

  return (
    <div ref={ref} className="top-30 fixed right-6 z-50">
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.25, ease: easeInOut }}
        className="bg-background border-border w-64 rounded-2xl border px-6 py-4 shadow-2xl"
      >
        <motion.ul
          className="flex flex-col gap-4"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {navItems.map((item) => (
            <motion.li key={item.label} variants={itemVariants}>
              <Link
                href={item.href}
                className={cn(
                  "hover:bg-accent hover:text-accent-foreground block w-full rounded-lg px-3 py-2 text-lg font-medium transition-colors",
                  pathName === item.href
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            </motion.li>
          ))}
          <motion.li variants={itemVariants}>
            <LinkButton href={process.env.NEXT_PUBLIC_APP_URL || ""} className="w-full">
              Create My Postcard
            </LinkButton>
          </motion.li>
        </motion.ul>
      </motion.div>
    </div>
  );
}
