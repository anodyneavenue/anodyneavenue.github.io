const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const site = path.join(root, "_site");
const site_url = "https://anodyneavenue.github.io";

const required_files = [
  "index.html",
  "posts/about.html",
  "posts/about.txt",
  "archive.html",
  "metadata.html",
  "metadata/tags.html",
  "metadata/type.html",
  "metadata/type/blog.html",
  "metadata/type/essays.html",
  "metadata/type/guides.html",
  "metadata/graph.html",
  "metadata/graph-data.json",
  "feed.xml",
  "blog/feed.xml",
  "essays/feed.xml",
  "guides/feed.xml",
  "sitemap.xml",
  "robots.txt",
  "search-index.json",
  "404.html",
  "style.css",
  "graph.css",
  "graph.js",
  "sidebar.js",
  "minimap.js",
  "version.txt"
];

const core_html_files = [
  "index.html",
  "posts/about.html",
  "archive.html",
  "metadata.html",
  "metadata/tags.html",
  "metadata/type.html",
  "metadata/type/blog.html",
  "metadata/type/essays.html",
  "metadata/type/guides.html",
  "metadata/graph.html",
  "404.html"
];

const expected_active_sidebars = {
  "posts/about.html": "about",
  "archive.html": "archive",
  "metadata.html": "metadata",
  "metadata/tags.html": "metadata",
  "metadata/type.html": "metadata",
  "metadata/graph.html": "metadata",
  "metadata/type/blog.html": "blog",
  "metadata/type/essays.html": "essays",
  "metadata/type/guides.html": "guides"
};

const rss_files = [
  "feed.xml",
  "blog/feed.xml",
  "essays/feed.xml",
  "guides/feed.xml"
];

const errors = [];

function site_file(file) {
  return path.join(site, file);
}

function read_file(file) {
  return fs.readFileSync(site_file(file), "utf8");
}

function add_error(message) {
  errors.push(message);
}

function file_exists(file) {
  return fs.existsSync(site_file(file));
}

function check_required_files() {
  if (!fs.existsSync(site)) {
    add_error("Missing generated output directory: _site/");
    return;
  }

  required_files.forEach(function(file) {
    const full_path = site_file(file);

    if (!fs.existsSync(full_path)) {
      add_error("Missing generated file: _site/" + file);
      return;
    }

    if (fs.statSync(full_path).size === 0) {
      add_error("Generated file is empty: _site/" + file);
    }
  });
}

function check_html_structure() {
  core_html_files.forEach(function(file) {
    if (!file_exists(file)) {
      return;
    }

    const html = read_file(file).toLowerCase();

    if (!html.includes("<!doctype html>")) {
      add_error("Missing <!doctype html> in _site/" + file);
    }

    if (!html.includes("<main")) {
      add_error("Missing <main> in _site/" + file);
    }

    if (!html.includes("style.css")) {
      add_error("Missing style.css reference in _site/" + file);
    }

    if (!html.includes("sidebar.js")) {
      add_error("Missing sidebar.js reference in _site/" + file);
    }

    if (!html.includes('rel="canonical"')) {
      add_error("Missing canonical link in _site/" + file);
    }
  });
}

function check_active_sidebars() {
  Object.keys(expected_active_sidebars).forEach(function(file) {
    if (!file_exists(file)) {
      return;
    }

    const html = read_file(file);
    const expected = 'data-active-sidebar="' + expected_active_sidebars[file] + '"';

    if (!html.includes(expected)) {
      add_error("Missing " + expected + " in _site/" + file);
    }
  });
}

function read_json(file) {
  try {
    return JSON.parse(read_file(file));
  } catch (error) {
    add_error("Invalid JSON in _site/" + file + ": " + error.message);
    return null;
  }
}

function check_json() {
  ["search-index.json", "metadata/graph-data.json"].forEach(function(file) {
    if (!file_exists(file)) {
      return;
    }

    read_json(file);
  });
}

function check_rss() {
  rss_files.forEach(function(file) {
    if (!file_exists(file)) {
      return;
    }

    const xml = read_file(file).toLowerCase();

    if (!xml.includes("<rss")) {
      add_error("Missing <rss> marker in _site/" + file);
    }
  });
}

function check_sitemap() {
  const file = "sitemap.xml";

  if (!file_exists(file)) {
    return;
  }

  const xml = read_file(file);

  if (!xml.includes(site_url)) {
    add_error("Missing site URL in _site/sitemap.xml");
  }

  [
    site_url + "/",
    site_url + "/posts/about.html",
    site_url + "/archive.html",
    site_url + "/metadata/graph.html",
    site_url + "/metadata.html",
    site_url + "/metadata/tags.html",
    site_url + "/metadata/type/blog.html"
  ].forEach(function(url) {
    if (!xml.includes(url)) {
      add_error("Missing sitemap URL: " + url);
    }
  });
}

function check_robots() {
  const file = "robots.txt";

  if (!file_exists(file)) {
    return;
  }

  const text = read_file(file);

  if (!/sitemap:/i.test(text)) {
    add_error("Missing Sitemap: directive in _site/robots.txt");
  }
}

function check_graph() {
  if (file_exists("metadata/graph.html")) {
    const html = read_file("metadata/graph.html");

    if (!html.includes("graph.css")) {
      add_error("Missing graph.css reference in _site/metadata/graph.html");
    }

    if (!html.includes("graph.js")) {
      add_error("Missing graph.js reference in _site/metadata/graph.html");
    }

    if (!html.includes('id="metadata_graph_app"')) {
      add_error("Missing graph app mount point in _site/metadata/graph.html");
    }
  }

  if (file_exists("metadata.html")) {
    const metadata_html = read_file("metadata.html");

    if (!metadata_html.includes('/metadata/graph.html')) {
      add_error("Missing metadata graph link in _site/metadata.html");
    }
  }

  if (file_exists("graph.js")) {
    const graph_js = read_file("graph.js");

    if (!graph_js.includes('/metadata/graph-data.json')) {
      add_error("graph.js does not fetch /metadata/graph-data.json");
    }
  }

  if (!file_exists("metadata/graph-data.json")) {
    return;
  }

  const data = read_json("metadata/graph-data.json");

  if (!data) {
    return;
  }

  ["fields", "nodes", "edges", "posts"].forEach(function(key) {
    if (!Array.isArray(data[key])) {
      add_error("graph-data.json missing array: " + key);
    }
  });

  if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
    return;
  }

  const node_ids = new Set(data.nodes.map(function(node) {
    return node.id;
  }));

  data.nodes.forEach(function(node) {
    ["id", "field", "label", "href"].forEach(function(key) {
      if (!node[key]) {
        add_error("Graph node missing " + key + ": " + JSON.stringify(node));
      }
    });
  });

  data.edges.forEach(function(edge) {
    if (!node_ids.has(edge.source)) {
      add_error("Graph edge source does not match a node: " + edge.id);
    }

    if (!node_ids.has(edge.target)) {
      add_error("Graph edge target does not match a node: " + edge.id);
    }

    if (!Array.isArray(edge.posts)) {
      add_error("Graph edge missing posts array: " + edge.id);
    }
  });
}

check_required_files();
check_html_structure();
check_active_sidebars();
check_json();
check_rss();
check_sitemap();
check_robots();
check_graph();

if (errors.length) {
  console.error("Generated output verification failed:");
  errors.forEach(function(error) {
    console.error("- " + error);
  });
  process.exit(1);
}

console.log("Generated output verification passed.");
