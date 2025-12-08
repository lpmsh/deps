// import { Search } from "@upstash/search";

// interface Content {
//   name: string;
  
// }


// export async function getClient() {
//   const client = Search.fromEnv();

//   const index = client.index("packages");



// }

// await index.upsert([
//   {
//     id: "star-wars",
//     content: {
//       title: "Star Wars: Episode IV, A New Hope",
//       genre: "sci-fi",
//     },
//     metadata: {
//       summary:
//         "A long time ago in a distant galaxy, a rebellion rises against an oppressive empire.",
//     },
//   },
// ]);

// const searchResults = await index.search({
//   query: "space opera",
//   limit: 2,
//   filter: "genre = 'sci-fi'",
// });
