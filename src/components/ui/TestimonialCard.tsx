import { Star } from "../icons/Star";
import { H2, H3 } from "./Typography";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import React from "react";

export type TestimonialCardType = {
  profilePhoto: StaticImport;
  name: string;
  testimonial: string;
  idx: any;
};

export const TestimonialCard = (props: TestimonialCardType) => {
  const { idx } = props;
  return (
    <div className="flex w-full max-w-[25rem] flex-col items-center pt-[6rem] text-center">
      <div className="relative flex flex-col gap-5 rounded-2xl bg-background p-10 drop-shadow-[0_0_25px_rgba(0,0,0,0.25)] transition duration-100 ease-in hover:scale-105">

        {/* Profile image + stars container */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex items-center justify-center">
          <Image
            className="relative z-10 max-h-32 w-auto rounded-full ring-4 ring-background"
            src={props.profilePhoto}
            alt="Testimonial Image"
          />
          {/* Stars floating around image */}
          <Star
            className={`
    absolute 
    sm:-top-14 sm:-left-6 top-12 -left-9 
    ${idx === 2 ? "h-3" : "h-8"} 
     opacity-70
  `}
            empty={idx === 0}
            fill="#BDC9A0"
          />

          <Star
            className={`
    absolute 
    sm:-top-6 sm:right-0 top-25 -right-15
    ${idx === 0 ? "h-3" : idx === 1 ? "h-5" : idx === 2 ? "h-8" : idx === 3 ? "h-5" : "h-6"} 
    text-green-400 opacity-50
  `}
            empty={idx === 1}
            fill="#739573"
          />

        </div>

        {/* Content */}
        <H2 className="mt-4">{props.name}</H2>
        <div className="flex justify-center">
          <Star className="h-6 " fill="#FCD13B" />
          <Star className="h-6 " fill="#FCD13B" />
          <Star className="h-6 " fill="#FCD13B" />
          <Star className="h-6 " fill="#FCD13B" />
          <Star className="h-6 " fill="#FCD13B" />
        </div>
        <H3 className="leading-6">{props.testimonial}</H3>
      </div>
    </div>
  );
};
