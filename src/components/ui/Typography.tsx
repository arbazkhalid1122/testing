import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type HeadingProps = {
  children: ReactNode;
  className?: string;
};

const H1 = ({ children, className }: HeadingProps) => {
  return (
    <h1 className={cn("font-league-spartan text-4xl font-semibold", className)}>
      {children}
    </h1>
  );
};

const H2 = ({ children, className }: HeadingProps) => {
  return (
    <h2
      className={cn(
        "font-quicksand flex flex-col gap-5 text-xl font-semibold",
        className,
      )}
    >
      {children}
    </h2>
  );
};

const H3 = ({ children, className }: HeadingProps) => {
  return (
    <h3 className={cn("font-quicksand text-lg font-normal", className)}>
      {children}
    </h3>
  );
};

export { H1, H2, H3 };
