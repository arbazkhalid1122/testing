"use client";

import { SVGPathEditor } from "@/lib/utils";
import { motion, SVGMotionProps, useInView } from "framer-motion";
import React, { useRef } from "react";

const arrowPaths: Record<string, SVGMotionProps<SVGPathElement>> = {
  variant1: {
    d: "M63.5546 0.609337C49.4123 60.7705 17.3524 168.61 2.25073 118.677C-16.6263 56.2611 143.655 115.031 97.0171 215.272",
    stroke: "black",
    strokeWidth: 2,
    width: 106,
    height: 216,
  },
  variant2: {
    d: "M72 1C27.3333 44 -41.9 132 38.5 140C139 150 273.5 55.5 332 88.5C378.8 114.9 398.167 141.833 402 152",
    stroke: "black",
    strokeWidth: 2,
    width: 403,
    height: 153,
  },
  variant3: {
    d: "M78.2858 64.4924C78.2858 64.4924 71.2534 50.7626 64.0935 44.3187C50.543 32.1233 21.8583 12.7071 19.4566 30.6537C17.3677 46.2632 34.3652 53.6627 44.6302 48.0065C56.4905 41.4712 36.0466 22.9032 23.6404 12.7749C12.3124 3.52685 0.259371 1.04829 0.259371 1.04829",
    stroke: "black",
    strokeWidth: 2,
    width: 80,
    height: 65,
  },
};

export type AnimatedArrowProps = {
  variant?: "variant1" | "variant2" | "variant3";
  duration?: number;
  delay?: number;
  reverse?: boolean;
  className?: string;
};

export function AnimatedArrow({
  variant = "variant1",
  duration = 1.5,
  delay = 0,
  reverse = false,
  className,
}: AnimatedArrowProps) {
  const { d, stroke, strokeWidth, width, height } = arrowPaths[variant];
  const path = reverse ? SVGPathEditor.reverse(d as string) : d;
  const maskId = variant + "_mask_id";

  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" }); 
  // 👆 false = trigger every time it enters

  return (
    <svg
      ref={ref}
      className={className}
      width={width as number}
      height={height as number}
      viewBox={`0 0 ${(width as number) + 3} ${(height as number) + 3}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <defs>
        <mask id={maskId}>
          <motion.path
            d={path}
            stroke="white"
            strokeWidth={5}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{
              duration,
              delay,
              ease: "linear",
            }}
          />
        </mask>
      </defs>

      {/* Arrow head following path */}
      <polygon points="0,0 -10,5 -10,-5" fill="black">
        <animateMotion
          rotate="auto"
          dur={`${duration}s`}
          begin={isInView ? "0s" : "indefinite"}
          fill="freeze"
        >
          <mpath href={"#" + variant} />
        </animateMotion>
      </polygon>

      <motion.path
        d={path}
        stroke={stroke}
        strokeWidth={strokeWidth}
        id={variant}
        fill="none"
        strokeDasharray="5 5"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
