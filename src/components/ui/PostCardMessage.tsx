type UIPostCardMessageType = {
  children: string;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>;

export const UIPostCardMessage = ({
  children,
  ...rest
}: UIPostCardMessageType) => {
  return (
    <p className="font-premium-ultra-84" {...rest}>
      {children}
    </p>
  );
};
