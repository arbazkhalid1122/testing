import {
  easeInOut,
  easeOut,
  motion,
  TargetAndTransition,
  Variants,
} from "motion/react";

type MenuButtonProps = {
  state: "open" | "closed";
  handleOnClick: () => void;
};

export function HamburgerButton({
  state,
  handleOnClick,
}: MenuButtonProps): React.JSX.Element {
  const pathVariants: Variants[] = [
    {
      open: {
        d: "M10.3333 33L33.3333 10",
        pathLength: 1,
        opacity: 1,
        transition: { delay: 0.2, duration: 0.2, ease: easeInOut },
      },
      closed: {
        d: "M19.7083 12.5417 34.0417 12.5417",
        pathLength: 1,
        opacity: 1,
        transition: { duration: 0.2, ease: easeInOut },
      },
    },
    {
      open: {
        pathLength: 0,
        opacity: 0,
        transition: { duration: 0.2, ease: easeInOut },
      },
      closed: {
        d: "M8.95834 21.5H34.0417",
        pathLength: 1,
        opacity: 1,
        transition: { delay: 0.1, duration: 0.2, ease: easeInOut },
      },
    },
    {
      open: {
        d: "M10 10L33 33",
        pathLength: 1,
        opacity: 1,
        transition: { delay: 0.2, duration: 0.2, ease: easeInOut },
      },
      closed: {
        d: "M19.7083 30.4583 34.0417 30.4583",
        pathLength: 1,
        opacity: 1,
        transition: { duration: 0.2, ease: easeInOut },
      },
    },
  ];

  const rectPathVariants: Variants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      strokeLinecap: "round",
      transition: { duration: 0.3, ease: easeOut },
    },
  };

  const svgVariants: Variants = {
    open: {
      scale: 0.8,
      transition: { duration: 0.5, ease: easeOut },
    },
    closed: {
      scale: 1,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  return (
    <button 
      onClick={() => handleOnClick()} 
      className="focus:outline-none"
      aria-label={state === "open" ? "Close menu" : "Open menu"}
      aria-expanded={state === "open"}
    >
      <motion.svg
        width="50"
        height="50"
        viewBox="-3 -3 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial="hidden"
        animate="visible"
      >
        <motion.path
          d="M10 0.5H33C38.2467 0.5 42.5 4.7533 42.5 10V33C42.5 38.2467 38.2467 42.5 33 42.5H10C4.7533 42.5 0.5 38.2467 0.5 33V10C0.5 4.7533 4.7533 0.5 10 0.5Z"
          stroke="black"
          strokeWidth={1.5}
          variants={rectPathVariants}
        />
        <motion.g initial={state} animate={state} variants={svgVariants}>
          {pathVariants.map((variant, index) => (
            <motion.path
              key={index}
              d={(variant[state] as TargetAndTransition).d as string}
              initial={{ pathLength: 0, opacity: 0 }}
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={variant}
              animate={variant[state] as TargetAndTransition}
            />
          ))}
        </motion.g>
      </motion.svg>
    </button>
  );
}
