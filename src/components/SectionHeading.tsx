import type { ReactNode } from "react";

interface SectionHeadingProps {
  as?: "h1" | "h2";
  eyebrow?: string;
  id?: string;
  title: string;
  children?: ReactNode;
}

export function SectionHeading({ as: Heading = "h2", eyebrow, id, title, children }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      {eyebrow ? <p>{eyebrow}</p> : null}
      <Heading id={id}>{title}</Heading>
      {children ? <div className="section-heading-detail">{children}</div> : null}
    </div>
  );
}
