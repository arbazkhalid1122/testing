import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { H1, H3 } from "@/components/ui/Typography";

type FAQProps = {
  q: string;
  a: string;
};

const FAQData: FAQProps[] = [
  {
    q: "1.  What makes you different?",
    a: "We make it possible to send personalized postcards from anywhere in the world,  hence real-time postcards.  Looking to brighten a friend’s day?  We’re here.   Looking to send your mom something special so that it lands before you do?   We’re here.  Want to send your welita a photo of you in front of a cathedral?   We’re here.  Do you travel a lot and want to send your kids a cool pic of your  adventures, with a note?  We’re here.   We wanted a thoughtful way to be able to say you were on my mind, halfway  around the world.",
  },
  {
    q: "2.  Why can I only send one card at a time?",
    a: "Sending multiple cards at a time will come.  As we grow, so can your distribution list. :)",
  },
  {
    q: "3.  Why can I only upload landscape photos?",
    a: "Printing portraits will come. As we grow, so will your printing options.",
  },
  {
    q: "4.  Why can you only ship domestically?",
    a: "Have you ever tried to mail a postcard while aboard?  Yeah, same.",
  },
  {
    q: "5.  How long does it take to ship?",
    a: "All postcards will go out within 24-hours. Our distribution center is in the middle of  the U.S.",
  },
  {
    q: "6.  Why is there not an About Us section?",
    a: "Because this isn’t about us, it’s about you!   The idea for print your trip came to us organically.  We were in one of the coolest  countries in the world (Japan) and really wanted to send a postcard that was ours.  But  as you can imagine, we could not ship a postcard to the US, and ensure it landed before  we got home.  (We love a good surprise.)",
  },
  {
    q: "7.  Are my photos saved by PYT?",
    a: "If you purchase, pyt will keep your photo for 60 days.  If you upload but do not purchase, your photo will not be stored.",
  },
];

export const FAQ = () => {
  return (
    <div className="flex w-full flex-col items-center gap-10 p-5 font-quicksand mb-0 sm:mb-20">
      <div className="text-center">
        <H1>FAQ</H1>
        <H3 className="font-medium text-md">Frequently Asked Questions</H3>
      </div>

      <Accordion
        type="multiple"
        className="w-full max-w-[90vw] space-y-3 lg:max-w-[80rem]"
      >
        {FAQData.map((data, idx) => (
          <AccordionItem key={idx} value={`value-${idx + 1}`}>
            <AccordionTrigger className="font-semibold">{data.q}</AccordionTrigger>
            <AccordionContent>
              <p>{data.a}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
