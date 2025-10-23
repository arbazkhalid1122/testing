import Image from "next/image";
import { LinkButton } from "./ui/Button";
import { heroImage as image } from "@/assets";
import { H1, H2 } from "./ui/Typography";
import { AnimatedLineArt } from "./animations/background/LineArt";

export default function Hero() {
  return (
    <section className="hero-section bg-accent relative flex min-h-screen w-full flex-col items-center gap-2 overflow-x-hidden rounded-b-[3rem] p-5 pt-30">
      <div className="flex h-full max-w-[80rem] grid-cols-2 flex-col items-center justify-center gap-10 md:grid">
        <div className="flex flex-col gap-5">
          <H1 className="text-[35px] md:text-[56px] leading-none">
            Turn Your Travel Pics into Postcards – Mailed for You!
          </H1>
          <H2 className="font-[600]">
            No stamps. No post office. No hassle. <br />
          </H2>
          <H2 className="font-[500]">
            Upload a photo, add a message & the address, and we&apos;ll do the
            rest.
          </H2>
          <LinkButton
            href={process.env.NEXT_PUBLIC_APP_URL || ""}
            className="pt-[18px] pb-[16px] px-[26px] text-[1.375rem] font-medium h-[3.375rem] w-[14.5rem]"
            aria-label="Start creating your postcard"
          >
            Create My Postcard
          </LinkButton>
        </div>

        <Image
          src={image}
          className="relative z-10 scale-115 hero-image"
          alt="Example of a personalized postcard created from travel photos"
          width={600}
          height={400}
          priority
          fetchPriority="high"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={90}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
      </div>

      <AnimatedLineArt
        className="absolute bottom-0 -right-25 sm:-right-40 z-0 w-auto h-auto overflow-hidden"
        variant="tower"
        aria-hidden="true"
      />
    </section>
  );
}
