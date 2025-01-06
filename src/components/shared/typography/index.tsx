import React from "react";

import { cn } from "@/lib/utils";

type TypographyProps = {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "p"
  className?: string;
  children: React.ReactNode;
};

const Typography = ({
  variant = "p",
  className,
  children,
}: TypographyProps) => {
  const variantStyles = {
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
    p: "leading-7 [&:not(:first-child)]:mt-6",
  };

  const Component = variant as keyof JSX.IntrinsicElements;

  return (
    <Component className={cn(variantStyles[variant], className)}>
      {children}
    </Component>
  );
};

export default Typography;
