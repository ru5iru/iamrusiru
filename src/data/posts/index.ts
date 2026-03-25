// Central registry — import and add your post here, it auto-appears everywhere
import switchedToTypescript from "./switched-to-typescript";
import cliToolRust from "./cli-tool-rust";
import booksBetterEngineer from "./books-better-engineer";

import reactServerComponents from "./react-server-components";
import fastapiQuickstart from "./fastapi-quickstart";
import sideProjectsKeepMeSane from "./side-projects-keep-me-sane";
import codeReviewEtiquette from "./code-review-etiquette";
import dotfileOneLiners from "./dotfile-one-liners";
import burnoutAndRecovery from "./burnout-and-recovery";
import debuggingProduction from "./debugging-production";
import gitWorkflowTips from "./git-workflow-tips";
import whyIJournal from "./why-i-journal-as-dev";
import dockerComposeDev from "./docker-compose-dev";

export type { BlogPost, ContentBlock } from "./types";

const allPosts = [
  switchedToTypescript,
  cliToolRust,
  booksBetterEngineer,
  
  reactServerComponents,
  fastapiQuickstart,
  sideProjectsKeepMeSane,
  codeReviewEtiquette,
  dotfileOneLiners,
  burnoutAndRecovery,
  debuggingProduction,
  gitWorkflowTips,
  whyIJournal,
  dockerComposeDev,
];

export default allPosts;
