var Feed = require("rss-to-json");

export async function getSubstackData() {
  var rss = await Feed.load("https://mashhoodr.substack.com/feed");
  return rss["items"];
}
