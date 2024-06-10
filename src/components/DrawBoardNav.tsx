import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MODE } from "@/lib/type";

interface DrawBoardNavProps extends React.HTMLAttributes<HTMLDivElement> {
  mode: MODE;
}

const colorMappingForModes = {
  normal: "bg-teal-400",
  insert: "bg-blue-300",
  movement: "bg-violet-400",
  visual: "bg-orange-400",
};

export default function DrawBoardNav({
  mode,
  className,
  ...props
}: DrawBoardNavProps) {
  return (
    <div
      className={cn(
        "flex gap-10 px-4 py-4 border border-slate-200 rounded-lg bg-white/50 bg-opacity-10 backdrop-blur-none",
        className
      )}
      {...props}
    >
      <div className="flex gap-3 items-center">
        <Image src="logo.svg" width={30} height={10} alt="logo" />
        <p>KeeDraw</p>
      </div>
      <div
        className={cn(
          "relative flex py-2 px-3 rounded-full",
          colorMappingForModes[mode]
        )}
      >
        <p className="m-auto text-sm font-medium">{mode}</p>
      </div>
    </div>
  );
}
