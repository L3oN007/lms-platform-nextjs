"use client";
import qs from "query-string";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const SearchBar = () => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 1000);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      {
        skipNull: true,
        skipEmptyString: true,
      },
    );
    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname]);
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-md pl-9 focus-visible:ring-slate-100 md:w-[400px]"
        placeholder="Search for a course..."
      />
    </div>
  );
};
