import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPTransport } from "@hono/mcp";
import { Hono } from "hono";
import { z } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { NPMResponse } from "./lib/types";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";
import TurndownService from "turndown";
import util from "util";

const openrouter = createOpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

console.log("ROUTER KEY: ", process.env.OPEN_ROUTER_API_KEY);

import { openai } from "@ai-sdk/openai";
import { exa } from "./lib/exa";
import { writeFile, writeFileSync } from "fs";

const app = new Hono();

// Your MCP server implementation
const mcpServer = new McpServer({
  name: "my-mcp-server",
  version: "1.0.0",
});

mcpServer.registerTool(
  "get_package_docs",
  {
    description:
      "Fetches documentation for an npm package. Use this anytime a user asks about an npm package in order to fetch information about it.",
    inputSchema: {
      name: z.string().describe("The name of the npm package"),
      prompt: z
        .string()
        .describe(
          "The action or prompt the user is trying to perform with the given npm package. (ex. 'follow the getting started docs for arctic')"
        ),
    },
  },
  async ({ name, prompt }, extra): Promise<CallToolResult> => {
    try {
      const res = await fetch(`https://registry.npmjs.org/${name}`);

      const data = (await res.json()) as NPMResponse;

      const branches = ["main", "master", "development"];

      let content;

      for (const branch of branches) {
        const response = await fetch(
          `https://raw.githubusercontent.com/${Object.values(data.versions)
            .at(-1)
            ?.repository.url?.split("://")?.[1]
            ?.split("/")
            .slice(1)
            .join("/")
            .replace(".git", "")}/refs/heads/${branch}/README.md`
        );

        if (response.ok) {
          const text = await response.text();

          content = new TurndownService().turndown(text);

          break;
        }
      }

      let tags: string[] = [];
      let homepageUrl = data.homepage;
      const useAiToFindHomepage = homepageUrl.includes("github.com");

      if (useAiToFindHomepage) {
        const homepage = generateObject({
          model: openrouter.chat("mistralai/mixtral-8x7b-instruct"),
          schema: z.object({
            websiteUrl: z.string(),
          }),
          prompt: `Using the following readme, see if you can find the repository's homepage/documentation website. It should be contained in the readme. If it's not, return nothing.
          <readme>
           ${content}
          </readme>
          `,
        });
        const tagsreq = generateObject({
          model: openrouter.chat("mistralai/mixtral-8x7b-instruct"),
          schema: z.object({
            tags: z.array(z.string()),
          }),
          prompt: `Using the following user prompt for an action they want to perform with an npm package, create tags for the package's documentation site. (ex. if the user wants to get started with a package you might return the tags "getting started" or "installation" to be used in searching the package's docs site for those things. Limit to 5 items) Do not include the package name anywhere in the tags since the search will already be performed on the package's docs site.          
          <user_prompt>
            ${prompt}
          </user_prompt>
          `,
        });

        const [homepageRes, tagsRes] = await Promise.all([homepage, tagsreq]);

        homepageUrl = homepageRes.object.websiteUrl || data.homepage;
        tags = tagsRes.object.tags;
      }

      const results = await exa.getContents([homepageUrl], {
        subpages: 5,
        subpageTarget: tags,
      });

      const resultsFormatted = {};

      resultsFormatted[results.results[0].url] = results.results[0].text;

      results.results[0]?.subpages.forEach(
        (s) => (resultsFormatted[s.url] = s.text)
      );

      return {
        content: [
          {
            type: "text",
            text: Object.entries(resultsFormatted).map(([url, text]) => `${url} - ${text}\n\n`).join("")
          },
        ],
      };
    } catch (e) {
      console.log("Error: " + JSON.stringify(e, null, 2));
    }

    return {
      content: [
        {
          type: "text",
          text: `Docs for ${name}`,
        },
      ],
    };
  }
);

// Initialize the transport
const transport = new StreamableHTTPTransport();

app.all("/mcp", async (c) => {
  if (!mcpServer.isConnected()) {
    // Connect the mcp with the transport
    await mcpServer.connect(transport);
  }

  return transport.handleRequest(c);
});

export default {
  port: 3000,
  fetch: app.fetch,
  idleTimeout: 255
};
