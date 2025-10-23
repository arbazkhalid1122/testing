import { H1, H2, H3 } from "./ui/Typography";
import { LinkButton } from "./ui/Button";
import { applePay, epson, aws, stripe } from "@/assets";
import Image from "next/image";
import { TestimonialCard, TestimonialCardType } from "./ui/TestimonialCard";
import { CircleCheckThemed } from "./icons/CircleCheckThemed";
import { profilePhoto1, profilePhoto2, profilePhoto3, pricingImage as imageCollage } from "@/assets";

const testimonialProps: TestimonialCardType[] = [
  {
    profilePhoto: profilePhoto1,
    name: "Emily W.",
    testimonial:
      "Took me 30 seconds to send a postcard. My grandma thinks I’m a genius!",
    idx: 0,
  },
  {
    profilePhoto: profilePhoto2,
    name: "Jake M.",
    testimonial: "Way easier than dealing with stamps. 10/10 would send again",
    idx: 1,
  },
  {
    profilePhoto: profilePhoto3,
    name: "Olivia P.",
    testimonial: "The quality? Chef’s kiss. The convenience? Unmatched.",
    idx: 2,
  },
];

export const Pricing = () => {
  return (
    <div className="flex flex-col items-center p-5">
      <div className="max-w-[80rem] gap-5">
        <div className="flex grid-cols-2 flex-col items-center md:grid">
          <Image className="" src={imageCollage} alt="Image Collage" />
          <div className="flex flex-col gap-5 mt-20 sm:mt-0">
            <H1>Why Print Your Trip?</H1>
            <H2 className="font-medium text-md">
              Because your travel stories deserve more than a text message.
            </H2>
            <ul className="font-quicksand text-md flex flex-col gap-5">
              <li className="flex gap-3">
                <CircleCheckThemed />
                <p>
                  <span className="font-bold">Effortless –</span> Takes less
                  time than choosing a travel filter.
                </p>
              </li>
              <li className="flex gap-3">
                <CircleCheckThemed />
                <p>
                  <span className="font-bold">Premium Prints –</span> Because if
                  we don&apos;t print them for you, who will?
                </p>
              </li>
              <li className="flex gap-3">
                <CircleCheckThemed />
                <p>
                  <span className="font-bold">Order from Anywhere. –</span> Even
                  if you’re sending from a treehouse in Bali.
                </p>
              </li>
              <li className="flex gap-3">
                <CircleCheckThemed />
                <p>
                  <span className="font-bold">Totally Secure –</span> Pay with
                  Apple Pay, Stripe & more (so your bank doesn’t freak out).
                </p>
              </li>
            </ul>
            <LinkButton href={process.env.NEXT_PUBLIC_APP_URL || ""} className="items-center p-5 text-xl">
              $10 Send Now!
            </LinkButton>
          </div>
        </div>
        <TechnologyPartners />
        <Testimonials />
      </div>
    </div>
  );
};


const TechnologyPartners = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center py-10">
      <H1 className="text-[35px] md:text-[42px] font-semibold">Technology Partners</H1>
      <div className="flex w-full flex-col md:flex-row items-center justify-center md:justify-between p-6 md:p-20 gap-[4rem]">
        <Image src={applePay} alt="Apple Pay Logo" />
        <Image src={epson} alt="Epson Logo" />
        <Image src={aws} alt="AWS Logo" />
        <Image src={stripe} alt="Stripe Logo" />
      </div>
    </div>
  );
};


const Testimonials = () => {
  return (
    <div className="flex relative flex-col items-center gap-10 py-10">
      <div className="flex flex-col text-center">
        <H1
          className="
    text-center
    text-3xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl
    max-w-[100%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%]
    mx-auto
  "
        >
          Real Reviews from Real People – Not Just Our Moms
        </H1>
        <H3 className="text-base">Postcards that actually make people smile.</H3>
      </div>
      <div className="flex w-full max-w-[80rem] flex-col flex-wrap items-center justify-around gap-3 md:flex-row">
        {testimonialProps.map((testimonialProp, idx) => (
          <TestimonialCard
            key={idx}
            profilePhoto={testimonialProp.profilePhoto}
            name={testimonialProp.name}
            testimonial={testimonialProp.testimonial}
            idx={testimonialProp.idx}
          />
        ))}
      </div>
    </div>
  );
};
