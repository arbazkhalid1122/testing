"use client";

import { cn, SVGPathEditor } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { defaultVariantData, svgVariants } from "./svgVariants";

type SvgVariantKey = keyof typeof svgVariants;

export type AnimatedLineArtProps = {
  duration?: number;
  delay?: number;
  variant: SvgVariantKey;
  className?: string;
  reverse?: boolean;
};

export function AnimatedLineArt({
  duration = 10,
  variant,
  className,
  reverse = false,
}: AnimatedLineArtProps) {
  const [totalLength, setTotalLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      setTotalLength(pathRef.current.getTotalLength());
    }
  }, []);
  const { d, stroke, strokeWidth, width, height, strokeLinecap } = {
    ...defaultVariantData,
    ...svgVariants[variant],
  };
  const classes = cn("h-auto w-screen lg:max-w-[50vw]", className);
  const path = reverse ? SVGPathEditor.reverse(d as string) : d;
  return (
    <svg
      className={cn(classes)}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        ref={pathRef}
        d={path}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={totalLength}
        strokeLinecap={strokeLinecap}
        initial={{ strokeDashoffset: totalLength }}
        whileInView={{ strokeDashoffset: [-totalLength, 0, totalLength] }}
        transition={{
          duration: duration,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
    </svg>
  );
}
