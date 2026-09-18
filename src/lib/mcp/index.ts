import { defineMcp } from "@lovable.dev/mcp-js";
import listPosts from "./tools/list-posts";
import searchPosts from "./tools/search-posts";
import getPost from "./tools/get-post";
import listTopics from "./tools/list-topics";

export default defineMcp({
  name: "i-am-rusiru",
  title: "I am Rusiru",
  version: "0.1.0",
  instructions:
    "Read-only access to iamrusiru, the engineering blog of Rusiru Rathmina, covering code, security (OWASP), career lessons and side projects. Use `search_posts` to find articles by topic, `list_posts` to browse newest first or filter by category/tag, `list_topics` to see available categories and tags, and `get_post` to read one article in full. All content is public.",
  tools: [searchPosts, listPosts, getPost, listTopics],
});
