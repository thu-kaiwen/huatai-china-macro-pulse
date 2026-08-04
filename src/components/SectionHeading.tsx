import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}

export function SectionHeading({ eyebrow, title, children }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      {eyebrow ? <p>{eyebrow}</p> : null}
      <h2>{title}</h2>
      {children ? <div className="section-heading-detail">{children}</div> : null}
    </div>
  );
}
