var Feed = require("rss-to-json");

export async function getPodcastData() {
  var rss = await Feed.load("https://anchor.fm/s/22de9c80/podcast/rss");
  return rss["items"];
}
