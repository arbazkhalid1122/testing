import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { LinkButton } from "./Button";
import { cn } from "@/lib/utils";

export type blogPostType = {
  id: number;
  image_url: StaticImport | string;
  title: string;
  description: string;
  tags: string[];
  link_to_post: string;
};

function BlogCard({
  props,
  className,
}: {
  props: blogPostType;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-[30rem] w-full overflow-clip rounded-md text-white group",
        className,
      )}
      role="article"
      aria-label={`Blog post: ${props.title}`}
    >
      <Image
        src={props.image_url}
        className="absolute h-full w-full object-cover group-hover:scale-110 transition duration-300 ease-out"
        alt={props.title + "Image"}
      />
      <div className="relative z-10 flex h-full w-full flex-col justify-end gap-2 p-3">
        <p className="text-3xl">{props.title}</p>
        <p className="text-sm">{props.description}</p>
        <div className="flex flex-wrap gap-2 text-black">
          {props.tags.map((tag, idx) => (
            <div key={idx} className="rounded-md bg-white px-4 py-1 text-sm">
              {tag}
            </div>
          ))}
        </div>
        <LinkButton href={props.link_to_post} aria-label={`Read more about ${props.title}`}>
          Read More
        </LinkButton>
      </div>
    </div>
  );
}

export default BlogCard;
