"use client";

import { Category } from "@prisma/client";
import { IconType } from "react-icons";
import { FaCss3Alt, FaHtml5, FaJava, FaNodeJs } from "react-icons/fa";
import { RiJavascriptFill } from "react-icons/ri";
import { TbBrandNextjs } from "react-icons/tb";
import { CategoryItem } from "./category-item";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  JavaScript: RiJavascriptFill,
  Java: FaJava,
  NextJS: TbBrandNextjs,
  NodeJs: FaNodeJs,
  HTML: FaHtml5,
  Css: FaCss3Alt,
};

export const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
};
