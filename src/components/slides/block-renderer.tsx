"use client";

import { motion } from "motion/react";
import type { Block } from "@/lib/content/schema";
import { AnalogyBlock } from "./blocks/analogy-block";
import { CalloutBlock } from "./blocks/callout-block";
import { CardGridBlock } from "./blocks/card-grid-block";
import { CodeBlock } from "./blocks/code-block";
import { ComparisonBlock } from "./blocks/comparison-block";
import { FlipCardsBlock } from "./blocks/flip-cards-block";
import { HeadingBlock } from "./blocks/heading-block";
import { ImageBlock } from "./blocks/image-block";
import { Interactive3dBlock } from "./blocks/interactive-3d-block";
import { MiniCheckBlock } from "./blocks/mini-check-block";
import { StepsBlock } from "./blocks/steps-block";
import { SummaryBlock } from "./blocks/summary-block";
import { TextBlock } from "./blocks/text-block";
import { TimelineBlock } from "./blocks/timeline-block";
import { staggerContainer, staggerItem } from "./motion";

function renderBlock(block: Block, isFirst: boolean) {
  switch (block.type) {
    case "heading":
      return <HeadingBlock block={block} isFirst={isFirst} />;
    case "text":
      return <TextBlock block={block} />;
    case "card-grid":
      return <CardGridBlock block={block} />;
    case "callout":
      return <CalloutBlock block={block} />;
    case "code":
      return <CodeBlock block={block} />;
    case "image":
      return <ImageBlock block={block} />;
    case "comparison":
      return <ComparisonBlock block={block} />;
    case "steps":
      return <StepsBlock block={block} />;
    case "timeline":
      return <TimelineBlock block={block} />;
    case "flip-cards":
      return <FlipCardsBlock block={block} />;
    case "analogy":
      return <AnalogyBlock block={block} />;
    case "mini-check":
      return <MiniCheckBlock block={block} />;
    case "interactive-3d":
      return <Interactive3dBlock block={block} />;
    case "summary":
      return <SummaryBlock block={block} />;
  }
}

/** Renderiza os blocos de um slide com revelação em sequência. */
export function SlideBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
      {blocks.map((block, i) => (
        <motion.div key={i} variants={staggerItem}>
          {renderBlock(block, i === 0)}
        </motion.div>
      ))}
    </motion.div>
  );
}
