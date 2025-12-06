"use client";

import Image from "next/image";
import { getRandomBackgroundString } from "../lib/string";
import { TextScramble } from "@/components/ui/text-scramble";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import npm from "@/assets/npm.png";
import { Input } from "@/components/ui/input";

import * as React from "react";
import {
  IconCheck,
  IconCopy,
  IconInfoCircle,
  IconStar,
} from "@tabler/icons-react";

// import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Response } from "@/lib/types";
import { ResultCard } from "@/components/ResultCard";

export default function Home() {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(true);

  const [value, setValue] = useState<string | null>(null);


  const [results, setResults] = useState<Response | null>(null);

  useEffect(() => {
    async function getResults() {
      const results = await fetch(
        `https://api.npms.io/v2/search?q=${encodeURIComponent(value)}&size=3`
      );

      const data = await results.json();

      setResults(data satisfies Response);
    }
    if (value) {
      getResults();
    }
  }, [value]);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [isCopied]);

  return (
    <div className="max-w-full pb-8">
      <div
        className={cn(
          "overflow-hidden absolute z-[-1] top-0 left-0 w-full wrap-anywhere transition-colors duration-200",
          trigger ? "text-[#C12127]" : "text-neutral-200"
        )}
      >
        <TextScramble
          as="span"
          trigger={trigger}
          speed={0.01}
          className="w-full "
          onScrambleComplete={() => {
            setTrigger(false);
          }}
        >
          {getRandomBackgroundString(12000)}
        </TextScramble>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-full h-dvh relative flex flex-col items-center justify-center">
        <AnimatePresence>
          {!trigger && (
            <>
              <motion.div
                animate={{ top: 0 }}
                initial={{ top: 50 }}
                className="text-black text-3xl absolute h-dvh flex flex-col justify-start py-12 items-center"
              >
                <motion.img
                  animate={{ opacity: 100 }}
                  initial={{ opacity: 0 }}
                  src={"/image.png"}
                  alt="npm logo"
                  className="w-md"
                />

                <div className=" bg-neutral-200 rounded-md w-full mt-8">
                  <div className="text-sm px-1.5 py-1 text-neutral-500">
                    Add Our MCP!
                  </div>
                  <InputGroup className="bg-white">
                    <InputGroupInput
                      value="https://npmthing.com/mcp"
                      readOnly
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        aria-label="Copy"
                        title="Copy"
                        size="icon-xs"
                        onClick={() => {
                          window.navigator.clipboard.writeText(
                            "https://npmthing.com/mcp"
                          );
                          setIsCopied(true);
                        }}
                      >
                        {isCopied ? <IconCheck /> : <IconCopy />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </div>

                <Input
                  placeholder="Search for a package..."
                  value={value || ""}
                  onChange={(e) => setValue(e.target.value)}
                  className="bg-white mt-4 py-6 selection:bg-[#C12127]/70"
                />

                {results && (
                  <>
                    {results.results.map((r) => (
                      <ResultCard key={r.package.name} result={r} />
                    ))}
                  </>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
