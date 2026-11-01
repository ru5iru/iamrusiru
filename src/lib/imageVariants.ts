// Keep full-size JPEG URLs for feeds and social crawlers. Cards use smaller WebP files.
const originals = import.meta.glob<string>("../assets/post-*.{jpg,png}", {
  eager: true,
  import: "default",
});
const thumbnails = import.meta.glob<string>("../assets/post-*.{jpg,png}", {
  eager: true,
  import: "default",
  query: "?w=384&format=webp",
});
const thumbnailByUrl = new Map(
  Object.entries(originals).flatMap(([path, url]) => {
    const thumbnail = thumbnails[path];
    return thumbnail ? [[url, thumbnail] as const] : [];
  }),
);

export const getThumbnail = (url: string): string => thumbnailByUrl.get(url) ?? url;