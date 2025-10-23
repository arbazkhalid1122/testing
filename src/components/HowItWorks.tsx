'use client'
import Image, { StaticImageData } from "next/image";
import { howItWorksImage1 as image1, howItWorksImage2 as image2, howItWorksImage3 as image3 } from "@/assets";
import Image1 from "@/assets/images/Visit.svg";
import {
  AnimatedArrow,
  AnimatedArrowProps,
} from "./animations/elements/AnimatedArrow";
import { H1, H2, H3 } from "./ui/Typography";
import { LinkButton } from "./ui/Button";
import { cn } from "@/lib/utils";
import { AnimatedLineArt, AnimatedLineArtProps } from "./animations/background/LineArt";
import { useState } from "react";

type stepType = {
  id: number;
  title: string;
  subTitle: string;
  image: StaticImageData;
  animatedLineArtProps?: AnimatedLineArtProps;
  nextArrowProps?: AnimatedArrowProps;
};

const steps: stepType[] = [
  {
    id: 1,
    title: "Snap & Upload",
    subTitle:
      "Pick a fave travel pic (yes, even that one where your hair is a mess).",
    image: Image1,
    nextArrowProps: {
      variant: "variant1",
    },
  },
  {
    id: 2,
    title: "Add a Message & the Address",
    subTitle: '"Greetings from the North Pole" or something more believable.',
    image: image2,
    animatedLineArtProps: {
      variant: "monument",
      className: "absolute -left-10 sm:left-auto sm:right-0 -top-40 w-28 sm:w-50 max-h-full",
    },
    nextArrowProps: {
      variant: "variant2",
    },
  },
  {
    id: 3,
    title: "We Print & Mail It",
    subTitle: "Grandma's fridge-worthy postcard, incoming!",
    image: image3,
    animatedLineArtProps: {
      variant: "burjKhalifa",
      className: "absolute left-0 -translate-x-[40%] max-h-full"
    }
  },
];

export const HowItWorks = () => {
  return (
    <section className="relative my-5 flex w-full flex-col items-center gap-10 p-5 overflow-clip">
      <AnimatedLineArt
        variant="statueOfLiberty"
        className="w-50 md:w-100 h-auto mb-2 absolute flex top-0 sm:-left-30  -left-20" // 👈 small on mobile, slightly bigger on desktop
      />
      <div className="text-center py-10">
        <H1>How It Works</H1>
        <H2 className="mt-4">
          Because core memories shouldn&lsquo;t live on your phone forever.
        </H2>
      </div>
      <div className="flex flex-col w-full">
        {steps.map((step, idx) => (
          <Step key={idx} {...step} />
        ))}
      </div>

      <LinkButton href={process.env.NEXT_PUBLIC_APP_URL || ""} className="items-center p-5 text-xl">
        <span>Start Sending!</span>
      </LinkButton>
    </section>
  );
};

const Step = ({
  id,
  title,
  subTitle,
  image,
  animatedLineArtProps,
  nextArrowProps,
}: stepType) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <div className="relative flex flex-col items-center">
      {animatedLineArtProps && <AnimatedLineArt {...animatedLineArtProps} />}
      <div
        className={cn(
          "flex h-full w-full max-w-[80rem] flex-col justify-between gap-10",
          `${id % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`
        )}
      >
        <div className="flex flex-1 w-full justify-center">
          <div className="flex flex-col items-start justify-center gap-3 text-start w-fit">
            <H2>Step {id}</H2>
            <H1>{title}</H1>
            <H3>{subTitle}</H3>
          </div>
        </div>

        <div className="flex flex-1 mt-10 w-full justify-center md:w-auto relative">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md animate-pulse">
              <div className="text-gray-400">Loading...</div>
            </div>
          )}
          {imageError ? (
            <div className="flex items-center justify-center w-[40rem] h-[30rem] bg-gray-100 rounded-md border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📷</div>
                <div>Image failed to load</div>
              </div>
            </div>
          ) : (
            <Image
              className={`drop-shadow-black/50 w-[40rem] ${id == 3 ? "" : "-rotate-4"} rounded-md drop-shadow-2xl transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              src={image}
              alt={`Step ${id} - ${title}`}
              width={640}
              height={480}
              loading={id === 1 ? "eager" : "lazy"}
              priority={id === 1}
              quality={85}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40rem"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
        </div>
      </div>
      <div className={`max-w-[70rem] w-full flex ${id === 1 ? "justify-end" : id === 2 ? "justify-start" : "justify-center"}`}>
        {nextArrowProps && (
          <AnimatedArrow
            className="max-w-[80rem]"
            {...nextArrowProps}
          />
        )}
      </div>
    </div>

  );
};
