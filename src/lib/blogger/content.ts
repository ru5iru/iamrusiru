import { parseDocument } from "htmlparser2";
import { createBloggerSanitizer } from "../../../supabase/functions/_shared/blogger";

export const sanitizeBlogger = createBloggerSanitizer(parseDocument);

// Only images copied into this project's Blogger bucket may survive revalidation.
export function bloggerMediaPrefix(backendUrl: string): string {
  return `${backendUrl.replace(/\/$/, "")}/storage/v1/object/public/blogger-media/`;
}