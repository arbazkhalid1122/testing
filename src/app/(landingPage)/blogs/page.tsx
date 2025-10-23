import { blogPostsData } from "@/components/blogsPostData";
import BlogCard from "@/components/ui/BlogCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/Pagination";
import { H1, H2 } from "@/components/ui/Typography";

const BlogsPage = () => {
  return (
    <div className="flex w-full flex-col items-center gap-10 p-10">
      <div className="text-center">
        <H1> Blogs </H1>
        <H2> The amazing stroies we get to be a part of</H2>
      </div>
      <div className="grid w-full max-w-[80rem] grid-cols-1 gap-4 md:grid-cols-2 md:p-20 lg:grid-cols-3">
        {blogPostsData.map((post, idx) => (
          <BlogCard
            key={idx}
            props={post}
            className={idx === 0 ? "col-span-full" : ""}
          />
        ))}
      </div>
      <PaginationDiv />
    </div>
  );
};

function PaginationDiv() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default BlogsPage;
