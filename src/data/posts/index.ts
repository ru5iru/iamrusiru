// Central registry: import and add your post here, it auto-appears everywhere
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
import cleanCodePrinciples from "./clean-code-principles";
import owaspTopTen from "./owasp-top-ten";
import vibeCoding from "./vibe-coding";
import codeReviewSecurityPlatform from "./code-review-security-platform";
import drupalPageCaching from "./drupal-page-caching";
import workLifeBalance from "./work-life-balance-for-developers";

export type { BlogPost, ContentBlock, FAQ } from "./types";

const allPosts = [
  workLifeBalance,
  drupalPageCaching,
  codeReviewSecurityPlatform,
  vibeCoding,
  owaspTopTen,
  cleanCodePrinciples,
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
