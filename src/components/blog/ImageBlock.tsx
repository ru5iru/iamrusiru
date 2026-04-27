interface ImageBlockProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

const ImageBlock = ({ src, alt, width, height, caption }: ImageBlockProps) => {
  return (
    <figure className="my-8 mx-auto max-w-2xl">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="w-full h-auto rounded-lg"
      />
      {caption && (
        <figcaption className="text-sm text-muted-foreground text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default ImageBlock;
