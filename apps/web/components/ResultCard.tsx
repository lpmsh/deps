"use client";

import { Response } from "@/lib/types";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ResultCard({
  result,
}: {
  result: Response["results"][number];
}) {
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getDocs() {
      setIsLoading(true);
      const branches = ["main", "master", "development"];

      let content;

      for (const branch of branches) {
        const response = await fetch(
          `https://raw.githubusercontent.com/${result.package.links.repository
            ?.split("://")[1]
            .split("/")
            .slice(1)
            .join("/")}/refs/heads/${branch}/README.md`
        );

        if (response.ok) {
          content = await response.text();
          break;
        }
      }

      setMarkdownContent(content?.slice(900, 1700) || "");
      setIsLoading(false);
    }

    getDocs();
  }, [result]);

  return (
    <motion.div className=" text-black mt-8 py-2 px-3 text-base bg-white rounded-md w-xl border border-input">
      <div className="font-semibold text-lg mb-2">{result.package.name}</div>
      {result && (
        <Link
          target={"_blank"}
          href={result?.package.links.repository || "https://github.com"}
          className="flex items-center gap-x-2 mb-4 hover:underline w-fit"
        >
          <svg
            className="size-4"
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>GitHub</title>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          <div>
            {result.package.links.repository
              ?.split("://")[1]
              .split("/")
              .slice(1)
              .join("/")}
          </div>
        </Link>
      )}

      {isLoading ? (
        <div className="text-gray-500 italic">Loading documentation...</div>
      ) : markdownContent ? (
        <div className="prose prose-sm max-w-none mt-4 border-t pt-4 overflow-hidden w-full wrap-anywhere">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownContent}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="text-gray-500 italic">No documentation available</div>
      )}
    </motion.div>
  );
}
