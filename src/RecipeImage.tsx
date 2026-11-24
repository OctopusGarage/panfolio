import { useEffect, useRef } from "react";
interface Props {
  src: string;
  kind: "card" | "cover";
}
export function RecipeImage({ src, kind }: Props) {
  const imageRef = useRef<HTMLImageElement>(null);
  const adoptAfterLoad = useRef(false);
  useEffect(() => {
    if (!("serviceWorker" in navigator) || navigator.serviceWorker.controller)
      return;
    const adopt = () => {
      adoptAfterLoad.current = true;
      const image = imageRef.current;
      if (image?.complete && image.naturalWidth && image.currentSrc) {
        adoptAfterLoad.current = false;
        void fetch(image.currentSrc).catch(() => {});
      }
    };
    navigator.serviceWorker.addEventListener("controllerchange", adopt);
    return () =>
      navigator.serviceWorker.removeEventListener("controllerchange", adopt);
  }, []);
  const local = src.startsWith("./recipes/") && src.endsWith(".jpg");
  const variant = (width: number) => src.replace(/\.jpg$/, `.${width}.jpg`);
  const mobileSizes =
    "(max-width:450px) calc(100vw - 40px), calc((100vw - 54px)/2)";
  const cardSizes =
    "(min-width:1450px) 250px, (min-width:1100px) calc((100vw - 340px)/3), calc((100vw - 316px)/2)";
  return (
    <picture>
      {local && (
        <source
          media="(max-width:760px)"
          srcSet={`${variant(480)} 480w, ${variant(768)} 768w`}
          sizes={kind === "cover" ? "calc(100vw - 40px)" : mobileSizes}
        />
      )}
      <img
        ref={imageRef}
        onLoad={(event) => {
          if (adoptAfterLoad.current) {
            adoptAfterLoad.current = false;
            void fetch(event.currentTarget.currentSrc).catch(() => {});
          }
        }}
        src={local ? variant(768) : src}
        srcSet={
          local
            ? `${variant(480)} 480w, ${variant(768)} 768w, ${variant(1200)} 1200w, ${src} 1536w`
            : undefined
        }
        sizes={
          local
            ? kind === "cover"
              ? "(min-width:1240px) 422px, 40vw"
              : cardSizes
            : undefined
        }
        width="1536"
        height="1024"
        loading={kind === "card" ? "lazy" : "eager"}
        decoding="async"
        alt=""
      />
    </picture>
  );
}
