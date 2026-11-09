import rawRedirects from "../data/redirects.json";

export interface RedirectEntry {
  oldRoute: string;
  redirectRoute: string;
  isRedirectEnabled: boolean;
  newDummyRoute: string;
}

export interface ResolvedRedirect {
  oldPath: string;
  dummyPath: string;
  target: string;
}

/** "/about/" -> "/about", "https://x.app/post/a" -> "/post/a" */
export function normalizePath(input: string): string {
  let p = input;
  try {
    if (/^https?:\/\//i.test(input)) p = new URL(input).pathname;
  } catch {
    /* keep as is */
  }
  p = p.split(/[?#]/)[0] || "/";
  if (!p.startsWith("/")) p = `/${p}`;
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p || "/";
}

/**
 * Returns only enabled, valid entries. Invalid entries are skipped so a typo
 * can never create a loop or chain: the target must be an absolute http(s)
 * URL, must not point back at this site's old or dummy route for the same
 * page, and must not be another enabled old route (which would chain).
 */
export function resolveRedirects(entries: RedirectEntry[], siteOrigin: string): ResolvedRedirect[] {
  const enabled = entries.filter((e) => e.isRedirectEnabled === true);
  const oldPaths = new Set(enabled.map((e) => normalizePath(e.oldRoute)));
  const result: ResolvedRedirect[] = [];
  for (const e of enabled) {
    let target: URL;
    try {
      target = new URL(e.redirectRoute);
    } catch {
      continue;
    }
    if (!/^https?:$/.test(target.protocol)) continue;
    const oldPath = normalizePath(e.oldRoute);
    const dummyPath = normalizePath(e.newDummyRoute);
    if (dummyPath === oldPath) continue;
    const sameSite = target.origin === new URL(siteOrigin).origin;
    if (sameSite) {
      const tp = normalizePath(target.pathname);
      if (tp === oldPath || tp === dummyPath || oldPaths.has(tp)) continue;
    }
    result.push({ oldPath, dummyPath, target: target.toString() });
  }
  return result;
}

const SITE_ORIGIN = "https://iamrusiru.lovable.app";
export const activeRedirects = resolveRedirects(rawRedirects as RedirectEntry[], SITE_ORIGIN);

export function findRedirectForOld(path: string): ResolvedRedirect | undefined {
  const p = normalizePath(path);
  return activeRedirects.find((r) => r.oldPath === p);
}

export function findRedirectForDummy(path: string): ResolvedRedirect | undefined {
  const p = normalizePath(path);
  return activeRedirects.find((r) => r.dummyPath === p);
}
