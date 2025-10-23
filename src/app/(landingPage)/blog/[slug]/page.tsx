import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/BreadCrumb";
import { H1, H2 } from "@/components/ui/Typography";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { ReactElement } from "react";
import { blogImage1 as image } from "@/assets";
import MockBlog from "@/components/MockBlog";
import RecommendedBlogs from "@/components/RecommendedBlogs";

type dynamicBlogDataType = {
  slugId: string;
  title: string;
  titleImage: StaticImport | string;
  tags: string[];
  content: ReactElement | string;
};

const dynamicBlogData: dynamicBlogDataType[] = [
  {
    slugId: "1",
    title: "Title Of Latest Blog",
    titleImage: image,
    tags: ["Tag #1", "Tag #1", "Tag #1"],
    content: <MockBlog />,
  },
];

async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = dynamicBlogData.find((item) => item.slugId === slug);
  if (!blog) return <NoBlogFound />;
  return (
    <div className="flex w-full justify-center p-10">
      <div className="gap-15 flex w-full max-w-[80rem] flex-col">
        <Image
          className="h-[30rem] w-full rounded-md object-cover"
          src={blog.titleImage}
          alt="Title Image"
        />
        <div className="flex flex-col gap-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/blogs">Blog</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{blog.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <H2>{blog.title}</H2>
          <div className="flex gap-5">
            {blog.tags.map((tag, idx) => (
              <div
                key={idx}
                className="bg-background w-fit rounded-sm px-5 py-1 text-sm shadow-sm shadow-black/20"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
        <div className="font-normal">{blog.content}</div>
        <RecommendedBlogs recommended />
      </div>
    </div>
  );
}

const NoBlogFound = () => {
  return (
    <H1 className="flex h-[50vh] w-full items-center justify-center px-10 text-center">
      No Blog Found!
    </H1>
  );
};

export default BlogPage;
