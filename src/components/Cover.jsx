import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Cover({ src, alt = "", label, className, children }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const showImage = src && !failed;

  return (
    <div
      className={cn(
        "relative flex aspect-square items-center justify-center overflow-hidden rounded-tile",
        !showImage && "cover-placeholder",
        className
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        label && <span className="font-mono text-[10px] font-medium text-white/35">{label}</span>
      )}
      {children}
    </div>
  );
}
