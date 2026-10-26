import Image from "next/image";
import type { ImageBlock as ImageBlockData } from "@/lib/content/schema";

export function ImageBlock({ block }: { block: ImageBlockData }) {
  return (
    <figure className="overflow-hidden rounded-3xl border border-line bg-elev">
      <Image src={block.src} alt={block.alt} width={block.width} height={block.height} className="h-auto w-full" sizes="(min-width: 1024px) 900px, 100vw" />
      {block.caption && <figcaption className="px-5 py-3 text-sm text-muted">{block.caption}</figcaption>}
    </figure>
  );
}
