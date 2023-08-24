const Parser = require("rss-parser");
const parser = new Parser({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
  },
  requestOptions: {
    rejectUnauthorized: false
  }
});

const cache = {};

module.exports = function getImportantNews(lang) {
  if (cache[lang]) return cache[lang];
  let url = {
    ro: "https://news.ournet.ro/rss/stories/important.xml",
    it: "https://news.ournet.it/rss/stories/important.xml",
    es: "https://noticias.ournet.es/rss/stories/important.xml",
    cs: "https://news.ournet.cz/rss/stories/important.xml",
    bg: "https://news.our.bg/rss/stories/important.xml",
    en: "https://news.ournet.in/rss/stories/important.xml",
    hu: "https://news.ournet.hu/rss/stories/important.xml"
  }[lang];

  if (!url) return [];

  return parser.parseURL(url).then(({ items }) => {
    cache[lang] = items.map((item) => ({
      title: item.title,
      url: item.link.substring(0, item.link.indexOf("?")),
      description: item.description,
      image: item.enclosure.url
        .replace("/large/", "/medium/")
        .replace(/jpg$/, "webp")
    }));

    return cache[lang];
  });
};
