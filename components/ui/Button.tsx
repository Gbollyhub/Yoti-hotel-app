import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const STYLES = {
  primary:
    "rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:opacity-90 disabled:opacity-50",
  secondary:
    "rounded-full border border-black/10 px-6 py-3 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/15 dark:hover:bg-white/[.06] disabled:opacity-50",
};

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  variant?: "primary" | "secondary";
  href?: string;
  children: ReactNode;
  className?: string;
};

export function Button({ variant = "primary", href, children, className = "", ...props }: ButtonProps) {
  const classes = `${STYLES[variant]} ${className}`.trim();
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
