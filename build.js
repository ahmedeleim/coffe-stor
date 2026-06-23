// Offline asset builder: downloads Tailwind, Google Fonts (+woff2), and all images locally.
const https = require("https");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const ASSETS = path.join(ROOT, "assets");
const FONTS = path.join(ASSETS, "fonts");
const IMGDIR = path.join(ASSETS, "img");
[ASSETS, FONTS, IMGDIR].forEach(function (d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

function get(url, asText) {
  return new Promise(function (resolve, reject) {
    function go(u, n) {
      if (n > 6) return reject(new Error("too many redirects"));
      https.get(u, { headers: { "User-Agent": UA, "Accept": "*/*" } }, function (res) {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          return go(new URL(res.headers.location, u).href, n + 1);
        }
        if (res.statusCode !== 200) { res.resume(); return reject(new Error(u + " -> " + res.statusCode)); }
        const chunks = [];
        res.on("data", function (c) { chunks.push(c); });
        res.on("end", function () { const b = Buffer.concat(chunks); resolve(asText ? b.toString("utf8") : b); });
      }).on("error", reject);
    }
    go(url, 0);
  });
}

const FONT_FAMILIES = [
  "Manrope:wght@400;500;600;700;800",
  "Work+Sans:wght@300;400;500;600",
  "EB+Garamond:wght@400;500;600",
  "Space+Grotesk:wght@400;500;600;700",
  "Cairo:wght@400;500;600;700",
  "Material+Symbols+Outlined:wght,FILL@100..700,0..1"
];

const IMG_IDS = [
  // page images
  "1554118811-1e0d58224f24", "1511920170033-f8396924c348", "1517433670267-08bbd4be890f",
  // menu items
  "1510591509098-f4fdc6d0ff04","1551030173-122aabc4489c","1572442388796-11668a67e53d",
  "1517256064527-09c73fc73e38","1485808191679-5f86510681a2","1494314671902-399b18174975",
  "1497636577773-f1231844b336","1578314675249-a6910f80cc4e","1578374173705-969cbe6f2d6b",
  "1447933601403-0c6688de566e","1442550528053-c431ecb55509","1461023058943-07fcbe16d735",
  "1517701550927-30cf4ba1dba5","1561043433-aaf687c4cf04","1572490122747-3968b75cc699",
  "1633933358116-a27b902fad35","1555507036-ab1f4038808a","1623334044303-241021148842",
  "1568471173242-461f0a730452","1509365465985-25d11c17e812","1607958996333-41aef7caefaa",
  "1499636136210-6f4ee915583e","1606313564200-e75d5e30476c","1533134242443-d4fd215305ad",
  "1605286978633-2dec93ff88a2","1585445490387-f47934b73b54","1620921568790-c1cf8984624c"
];

(async function () {
  // 1) Tailwind CDN runtime
  try {
    const tw = await get("https://cdn.tailwindcss.com/3.4.16?plugins=forms,container-queries", true);
    fs.writeFileSync(path.join(ASSETS, "tailwind.js"), tw);
    console.log("OK tailwind.js (" + tw.length + " bytes)");
  } catch (e) { console.log("FAIL tailwind: " + e.message); }

  // 2) Fonts: fetch CSS for each family, then download every woff2 and rewrite to local
  let css = "";
  for (const fam of FONT_FAMILIES) {
    try {
      const url = "https://fonts.googleapis.com/css2?family=" + fam + "&display=swap";
      css += "\n/* " + fam + " */\n" + await get(url, true);
    } catch (e) { console.log("FAIL css " + fam + ": " + e.message); }
  }
  const urls = Array.from(new Set((css.match(/https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2/g) || [])));
  console.log("woff2 files: " + urls.length);
  let i = 0;
  for (const u of urls) {
    i++;
    const fname = "f" + i + ".woff2";
    try {
      const buf = await get(u, false);
      fs.writeFileSync(path.join(FONTS, fname), buf);
      css = css.split(u).join("./fonts/" + fname);
    } catch (e) { console.log("FAIL woff2 " + u + ": " + e.message); }
  }
  fs.writeFileSync(path.join(ASSETS, "fonts.css"), css);
  console.log("OK fonts.css (" + css.length + " bytes, " + i + " fonts)");

  // 3) Images
  let ok = 0, fail = 0;
  for (const id of IMG_IDS) {
    const u = "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=800&q=80";
    try {
      const buf = await get(u, false);
      fs.writeFileSync(path.join(IMGDIR, id + ".jpg"), buf);
      ok++;
    } catch (e) { fail++; console.log("FAIL img " + id + ": " + e.message); }
  }
  console.log("Images: " + ok + " ok, " + fail + " fail");
  console.log("DONE");
})();
