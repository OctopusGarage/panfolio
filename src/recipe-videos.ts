import catalog from "./recipe-videos.json";
export interface SourceVideo {
  platform: string;
  id: string;
}
export function validVideo(video: SourceVideo) {
  return video.platform === "youtube"
    ? /^[A-Za-z0-9_-]{11}$/.test(video.id)
    : video.platform === "bilibili" && /^BV[A-Za-z0-9]{10}$/.test(video.id);
}
export function videoPageUrl(video: SourceVideo) {
  if (!validVideo(video)) throw new Error("Invalid source video");
  return video.platform === "youtube"
    ? `https://www.youtube.com/watch?v=${video.id}`
    : `https://www.bilibili.com/video/${video.id}/`;
}
export function videoEmbedUrl(video: SourceVideo) {
  if (!validVideo(video)) throw new Error("Invalid source video");
  const url = new URL(
    video.platform === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${video.id}`
      : "https://player.bilibili.com/player.html",
  );
  url.searchParams.set("autoplay", "0");
  if (video.platform === "youtube") {
    url.searchParams.set("playsinline", "1");
    url.searchParams.set("rel", "0");
  } else {
    url.searchParams.set("bvid", video.id);
    url.searchParams.set("p", "1");
    url.searchParams.set("danmaku", "0");
  }
  return url.href;
}
export function videosForRecipe(id: string): SourceVideo[] {
  return catalog.find((entry) => entry.recipeId === id)?.videos || [];
}
export function videosForReference(recipeIds: string[], sources: string[]) {
  const directSources: SourceVideo[] = sources.flatMap((source) => {
    const match =
      /^https:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})$/.exec(
        source,
      );
    return match ? [{ platform: "youtube", id: match[1] }] : [];
  });
  return [...recipeIds.flatMap(videosForRecipe), ...directSources].filter(
    (video, index, videos) =>
      (video.platform === "bilibili" ||
        sources.includes(videoPageUrl(video))) &&
      videos.findIndex(
        (other) => other.platform === video.platform && other.id === video.id,
      ) === index,
  );
}
