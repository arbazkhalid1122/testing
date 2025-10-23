import { CircleCheck, LucideProps } from "lucide-react";
import { ReactElement } from "react";

export const CircleCheckThemed = (rest: LucideProps): ReactElement => (
  <CircleCheck
    color="var(--color-white)"
    size={25}
    className="fill-primary shrink-0"
    {...rest}
  />
);
