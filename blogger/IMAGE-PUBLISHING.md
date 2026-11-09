# Publish responsive cover images

Prepared 7 November 2026. The project-content package contains **72 optimized WebP files for 24 source images**. The clean native/reusable preset contains no project images; upload your own images through Blogger. Existing public originals remain fallbacks and social images. Smaller files do not become public merely by restoring a theme.

Native Blogger thumbnails now use `sourceSet`/`resizeImage`. Imported post covers use a separate, reusable `responsiveImages` mapping, because their current originals are hosted on GitHub. The mapping is empty until the uploaded variants have been verified. This prevents broken URLs and avoids declaring the same full-size file as several different widths.

## Upload and activate

1. Open `responsive-image-plan.json` in this package. For each source image it lists the generated files, exact widths/heights, bytes and current original URL. Keep each set associated with the correct original filename.
2. Upload the generated WebP files from `assets/` to public HTTPS image hosting you control. You can use Blogger's image uploader in an unpublished media-storage draft and copy the actual hosted image URLs from HTML view. Keep the uploaded files/draft. A private account preview URL or local filesystem path is not an image URL.
3. Copy `responsive-images.upload.json` to `blogger/hosted-images.json` in the project. Fill each `url` with its corresponding public URL. Remove whole source entries you are not ready to activate. Do not leave an empty URL in an entry you keep. The `width` must match the image bytes actually served; Blogger may add a size segment to a URL, so check the full-size upload link.
4. In the project folder run:

   ```powershell
   node scripts/activate-blogger-images.mjs --map blogger/hosted-images.json --config blogger/config.json
   npm run build:blogger
   npm run test:blogger
   ```

   The activation command downloads and decodes every mapped image, checks its actual width, and writes `config.json` only after all pass. It records the results under `blogger/output/verification/hosted-images.json`. Failed verification leaves the configuration unchanged. This checks availability/dimensions, not that the owner selected the correct artwork.
5. Restore the rebuilt `blogger/output/iamrusiru-blogger.xml` and apply the rebuilt post bodies from `blogger/output/post-updates/`. These now contain `srcset` and `sizes`. Keep native post URLs/dates. Curated card/related images receive the same verified mapping at build time. The original `src` and social image continue to work.
6. In browser developer tools, disable cache and check a mobile and desktop viewport. Confirm `currentSrc` selects an appropriate smaller asset, requests return images, the crop/layout is unchanged and no image shifts appear. Run `npm run verify:blogger:live` after publishing.

If you prefer GitHub hosting, publish these files in your own repository first, then use their real public raw URLs in the map. This release does not push files to GitHub or upload into a Blogger account. Generating a URL from a filename without publishing that file is not sufficient.

If the uploaded files keep their filenames in one public directory, skip manual URL entry and use the directory option after uploading:

```powershell
node scripts/activate-blogger-images.mjs --base-url https://YOUR_PUBLIC_HOST/ACTUAL_IMAGE_DIRECTORY/ --config blogger/config.json
npm run build:blogger
npm run test:blogger
```

Replace the example directory with the actual public directory. Every generated URL is fetched and decoded before activation; missing files or wrong widths leave the configuration unchanged. This shortcut cannot infer opaque Blogger-upload URLs; use the mapping workflow for those.

## New posts and reuse

For a new post, upload its cover through Blogger and keep the native image element's `srcset`, `sizes`, alt and dimensions in HTML view. Use an empty alt for a redundant linked thumbnail; describe an informative image in context. Avoid lazy-loading the main article cover; below-fold illustrations can use `loading="lazy"`.

For another owner using a source-content export, map only their own assets and rebuild with their configuration. Native/reusable mode uses images uploaded through Blogger; this static map does not rewrite arbitrary saved native bodies. Do not copy this blog's signed proxy URLs or invent size variants on an image host that cannot resize. Keep captions, descriptive text and relevant credits. Responsive delivery follows [Google's image guidance](https://developers.google.com/search/docs/appearance/google-images); it does not guarantee indexing or AI citations.
