import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const headingFont = localFont({
  src: "../public/fonts/font.woff2",
});

export const Logo = () => {
  return (
    <Link href="/">
      <div className="items-center gap-x-2 transition hover:opacity-75 md:flex">
        <Image src="/logo.svg" alt="Logo" height={30} width={30} />
        <p className={cn("text-xl text-neutral-700 ", headingFont.className)}>
          Evergreen
        </p>
      </div>
    </Link>
  );
};
