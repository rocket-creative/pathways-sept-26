"use client";

export interface OfficePhoto {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  alt: string;
}

/** Slow crossfade of one office's current photographs. The first frame stays put if motion is reduced. */
export default function OfficeCrossfade({ photos }: { photos: OfficePhoto[] }) {
  if (!photos.length) return null;
  const duration = 18;

  return (
    <div className="office-fade" data-count={photos.length}>
      {photos.map((photo, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={photo.src}
          src={photo.src}
          srcSet={photo.srcSet}
          sizes="(max-width: 800px) 100vw, 36rem"
          width={photo.width}
          height={photo.height}
          alt={index === 0 ? photo.alt : ""}
          style={{ animationDelay: `${(duration / photos.length) * index}s`, animationDuration: `${duration}s` }}
          decoding="async"
        />
      ))}
    </div>
  );
}
