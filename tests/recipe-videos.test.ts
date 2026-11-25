import { test } from "node:test";
import assert from "node:assert/strict";
import catalog from "../src/recipe-videos.json";
import recipes from "../src/recipes.json";
import { essentials } from "../src/kitchen-essentials";
import {
  validVideo,
  videoEmbedUrl,
  videoPageUrl,
  videosForReference,
} from "../src/recipe-videos";

test("video metadata preserves reviewed source associations and safe provider IDs", () => {
  assert.equal(
    new Set(catalog.map((entry) => entry.recipeId)).size,
    catalog.length,
  );
  for (const entry of catalog) {
    const recipe = recipes.find((recipe) => recipe.id === entry.recipeId);
    assert.ok(recipe);
    for (const video of entry.videos) {
      assert.ok(validVideo(video));
      const embed = new URL(videoEmbedUrl(video));
      assert.equal(embed.searchParams.get("autoplay"), "0");
      assert.ok(
        ["www.youtube-nocookie.com", "player.bilibili.com"].includes(
          embed.hostname,
        ),
      );
      if (video.platform === "youtube")
        assert.ok(recipe.body.includes(videoPageUrl(video)));
      else assert.equal(recipe.source, videoPageUrl(video));
    }
  }
  for (const video of [
    { platform: "other", id: "123" },
    { platform: "youtube", id: "../evil?x=1" },
    { platform: "bilibili", id: "BV<script>" },
  ]) {
    assert.equal(validVideo(video), false);
    assert.throws(() => videoEmbedUrl(video));
    assert.throws(() => videoPageUrl(video));
  }
});
test("reference video associations are deduplicated and retain known YouTube originals", () => {
  for (const entry of essentials) {
    const videos = videosForReference(entry.recipeIds, entry.sources);
    assert.ok(videos.length);
    assert.equal(
      new Set(videos.map((video) => video.platform + video.id)).size,
      videos.length,
    );
    for (const video of videos.filter((video) => video.platform === "youtube"))
      assert.ok(entry.sources.includes(videoPageUrl(video)));
  }
});

test("standalone kitchen techniques retain direct source videos without fabricated recipe associations", () => {
  assert.deepEqual(
    videosForReference([], ["https://www.youtube.com/watch?v=W5GM33NabB0"]),
    [{ platform: "youtube", id: "W5GM33NabB0" }],
  );
  assert.deepEqual(
    videosForReference(
      [],
      [
        "https://example.com/watch?v=W5GM33NabB0",
        "https://www.youtube.com/watch?v=invalid",
      ],
    ),
    [],
  );
});
