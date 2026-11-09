---
name: blogger-images
description: Prepare Blogger cover/image briefs, accessible image markup and real responsive variants, including this project's GitHub-hosted asset activation workflow. Use for article images and image-delivery fixes while retaining the existing design.
---

# Blogger images

Read the active configuration and [IMAGE-PUBLISHING.md](../../IMAGE-PUBLISHING.md). Determine whether the task concerns a new native post, an existing source-export image, or a requested new visual. Keep those workflows distinct.

- **New native entry:** use the supplied/authorized image, or provide a specific image brief if no asset is available. Upload through Blogger when authorized, retain its genuine image URLs/srcset/sizes, supply meaningful alt and true dimensions, and preserve existing image block classes. Do not require a theme rebuild for a normal new post.
- **Source-export assets:** use `output/responsive-image-plan.json` and its actual generated files. Host public variants first; then activate by verified URL map or real directory base. Never declare several widths for one unchanged file or emit URLs for unpublished files.
- **New artwork requested:** use the available imagegen skill for raster generation/editing when appropriate. Inspect supplied images before describing or editing them. Keep the prompt/brief separate from an actual delivered image; do not imply that a brief has created/uploaded a cover.

For a real uploaded directory, from the repository root:

```powershell
node scripts/activate-blogger-images.mjs --base-url ACTUAL_PUBLIC_HTTPS_DIRECTORY --config blogger/config.json
```

Use `--map FILE` for opaque Blogger URLs instead. Continue only after successful verification; activation fetches/decodes every image and checks actual widths before updating configuration. Do not assume a different GitHub branch or private preview is public hosting. Read the current base/branch from the chosen configuration; do not hardcode this owner's account into reused content.

If source-export mappings changed, build and run the Blogger suite, then provide or carry out the authorized XML/body update steps. Newly activated covers require the freshly rebuilt body files; the theme alone cannot rewrite saved post HTML. Native cards and saved widgets must also be checked on Blogger. Keep working original fallbacks/social images until their replacement is deliberate.

Preserve crop, palette and existing layout. Inspect informative images to write accurate alt; use empty alt for redundant/decorative thumbnails with adjacent naming text. Retain intrinsic dimensions; avoid lazy-loading the main article cover and use lazy loading for appropriate below-fold illustrations.

Verify actual served image bytes/widths, fallback availability, browser `currentSrc`, mobile/desktop crop and layout reservation when those parts change. A local generated WebP, HTML `srcset` attribute or HEAD 200 alone does not prove responsive delivery. Never describe generated-file byte savings as measured live Core Web Vitals gains.

Return actual file/URL mappings, image dimensions/alt/caption/credit information, checks performed and any remaining upload/activation steps. Preparation does not itself authorize a Git push, upload, account edit or publication; perform those when included in the user's authorized task. For post composition use [Blogger authoring](../../SKILL.md); for installation use [publishing](../blogger-publishing/SKILL.md).
