import { H1, H2 } from "./ui/Typography";
import { blogPostsData } from "./blogsPostData";
import BlogCard from "./ui/BlogCard";

function RecommendedBlogs(props: { recommended: boolean }) {
  return (
    <div className="flex w-full flex-col items-center gap-2 text-center p-5">
      <H1>{!props.recommended ? "Blogs" : "Similar Articles"}</H1>
     <H2 className="text-[14px] md:text-[18px] font-medium w-[90%] md:w-[60%] text-center md:text-left">
  {!props.recommended
    ? "Read about the fun and interesting stories of how people sent postcards!"
    : "The amazing stories we get to be a part of"}
</H2>

      <div className="grid w-full max-w-[80rem] grid-cols-1 gap-4 md:grid-cols-2 md:p-5 lg:grid-cols-3">
        {blogPostsData.slice(0, 3).map((item, idx) => (
          <BlogCard key={idx} props={item} />
        ))}
      </div>
    </div>
  );
}

export default RecommendedBlogs;
