import { useEffect, useId, useRef, useState } from "react";
import type { Locale } from "./types";
import {
  videoEmbedUrl,
  videoPageUrl,
  type SourceVideo as Video,
} from "./recipe-videos";
import "./source-video.css";

export function SourceVideo({
  videos,
  locale,
}: {
  videos: Video[];
  locale: Locale;
}) {
  const s = (zh: string, en: string) => (locale === "en" ? en : zh);
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(0);
  const [online, setOnline] = useState(navigator.onLine);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  useEffect(() => {
    const sync = () => {
      setOnline(navigator.onLine);
      if (!navigator.onLine) setOpened(false);
    };
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);
  if (!videos.length) return null;
  const video = videos[selected] || videos[0];
  const label = (item: Video, index: number) =>
    `${item.platform === "youtube" ? "YouTube" : s("B 站", "Bilibili")}${videos.filter((v) => v.platform === item.platform).length > 1 ? ` · ${videos.slice(0, index + 1).filter((v) => v.platform === item.platform).length}` : ""}`;
  const close = () => {
    setOpened(false);
    trigger.current?.focus();
  };
  return (
    <section
      className="source-video"
      aria-label={s("来源视频", "Source video")}
    >
      <div className="source-video-heading">
        <div>
          <h3>{s("看视频学做法", "See the technique")}</h3>
          <p>
            {s(
              "需要时再打开，对照原片查看操作。",
              "Open the source video when you want to see the technique.",
            )}
          </p>
        </div>
        <button
          ref={trigger}
          type="button"
          disabled={!online && !opened}
          aria-expanded={opened}
          aria-controls={opened ? panelId : undefined}
          onClick={() => (opened ? close() : setOpened(true))}
        >
          {opened ? s("关闭视频", "Close video") : s("观看视频", "Watch video")}
        </button>
      </div>
      {!online && (
        <p className="hint" role="status">
          {s(
            "联网后可观看视频，菜谱仍可继续阅读。",
            "Connect to the internet to watch. You can keep reading the recipe.",
          )}
        </p>
      )}
      {opened && online && (
        <div
          id={panelId}
          className="source-video-panel"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              close();
            }
          }}
        >
          {videos.length > 1 && (
            <div
              className="source-video-options"
              aria-label={s("选择视频来源", "Choose video source")}
            >
              {videos.map((item, index) => (
                <button
                  type="button"
                  key={item.platform + item.id}
                  aria-pressed={selected === index}
                  onClick={() => setSelected(index)}
                >
                  {label(item, index)}
                </button>
              ))}
            </div>
          )}
          <iframe
            key={video.platform + video.id}
            src={videoEmbedUrl(video)}
            title={s("来源视频播放器", "Source video player")}
            referrerPolicy="strict-origin-when-cross-origin"
            allow="fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
          />
          <p className="hint">
            {s(
              "由第三方平台提供播放；若无法播放，可切换来源或前往原站。",
              "Playback is provided by the video platform. If unavailable, switch sources or open the original site.",
            )}
          </p>
          <a
            href={videoPageUrl(video)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {s("前往原站观看", "Watch on original site")} ·{" "}
            {label(video, selected)} ↗
          </a>
        </div>
      )}
    </section>
  );
}
