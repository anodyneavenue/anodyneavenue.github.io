const fs = require("fs");
const path = require("path");
const posts = require("./posts.js");

const labels = {
  essays: "Essays",
  guides: "Guides",
  blog: "Blog"
};

const intros = {
  essays: "Long-form arguments, investigations, and attempts to look at a topic from more than one side.",
  guides: "Structured explanations, methods, and practical notes.",
  blog: "Shorter entries, fragments, logs, and irregular updates."
};

const root = __dirname;

function escape_html(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function sort_by_date(items) {
  return [...items].sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });
}

function latest_by_title(items) {
  const latest = new Map();

  sort_by_date(items).forEach(function(item) {
    const key = item.type + ":" + item.title.toLowerCase();

    if (!latest.has(key)) {
      latest.set(key, item);
    }
  });

  return [...latest.values()];
}

function tag_slug(tag) {
  return String(tag)
    .toLowerCase()
    .trim()
    .replaceAll("&", "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function page_for_type(type) {
  return type + ".html";
}

function post_page(item) {
  return "posts/" + item.slug + ".html";
}

function tag_page(tag) {
  return "tag/" + tag_slug(tag) + ".html";
}

function meta(item) {
  const parts = [
    item.date,
    labels[item.type],
    item.edition
  ];

  if (item.revised) {
    parts.push("revised " + item.revised);
  }

  return parts.filter(Boolean).map(escape_html).join(" · ");
}

function tag_links(item) {
  const tags = item.tags || [];

  if (!tags.length) {
    return "";
  }

  return [
    '    <div class="tags">',
    tags.map(function(tag) {
      return '<a href="/' + tag_page(tag) + '">' + escape_html(tag) + '</a>';
    }).join(""),
    "    </div>"
  ].join("\n");
}

function post_card(item) {
  return [
    '    <article class="card">',
    "      <small>" + meta(item) + "</small>",
    '      <h3><a class="post_title" href="/' + post_page(item) + '">' + escape_html(item.title) + "</a></h3>",
    "      <p>" + escape_html(item.abstract) + "</p>",
    tag_links(item),
    "    </article>"
  ].join("\n");
}

function sidebar() {
  return [
    '  <aside id="sidebar">',
    '    <a class="title" href="/index.html">anodyne avenue</a>',
    "",
    "    <nav>",
    '      <a href="/essays.html">Essays</a>',
    '      <a href="/guides.html">Guides</a>',
    '      <a href="/blog.html">Blog</a>',
    '      <a href="/archive.html">Archive</a>',
    '      <a href="/tags.html">Tags</a>',
    "    </nav>",
    "",
    "    <footer>anodyne avenue ©</footer>",
    "  </aside>"
  ].join("\n");
}

function shell(options) {
  const title = options.title;
  const description = options.description || "";
  const back = options.back || false;
  const content = options.content;

  return [
    "<!doctype html>",
    '<html lang="en-GB">',
    "<head>",
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1">',
    "  <title>" + escape_html(title) + "</title>",
    description ? '  <meta name="description" content="' + escape_html(description) + '">' : "",
    '  <link rel="stylesheet" href="/style.css">',
    '  <script src="/sidebar.js" defer></script>',
    "</head>",
    "<body>",
    '  <button id="toggle" type="button" aria-label="Toggle sidebar">☰</button>',
    back ? '  <button class="back" type="button" aria-label="Back">←</button>' : "",
    "",
    sidebar(),
    "",
    "  <main>",
    content,
    "  </main>",
    "</body>",
    "</html>"
  ].filter(function(line) {
    return line !== "";
  }).join("\n") + "\n";
}

function write_file(file, content) {
  const full = path.join(root, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trimStart(), "utf8");
}

function remove_path(file) {
  const full = path.join(root, file);

  if (fs.existsSync(full)) {
    fs.rmSync(full, { recursive: true, force: true });
  }
}

function validate_posts() {
  const slugs = new Set();
  const types = new Set(Object.keys(labels));

  posts.forEach(function(item, index) {
    const name = item.slug || "post " + String(index + 1);

    ["slug", "title", "type", "date", "edition", "abstract", "body"].forEach(function(field) {
      if (!item[field]) {
        throw new Error(name + " is missing " + field);
      }
    });

    if (slugs.has(item.slug)) {
      throw new Error("duplicate slug: " + item.slug);
    }

    if (!types.has(item.type)) {
      throw new Error(name + " has invalid type: " + item.type);
    }

    if (item.tags && !Array.isArray(item.tags)) {
      throw new Error(name + " tags must be an array");
    }

    slugs.add(item.slug);
  });
}

function all_tags(items) {
  const tags = new Map();

  items.forEach(function(item) {
    (item.tags || []).forEach(function(tag) {
      const slug = tag_slug(tag);

      if (!slug) {
        return;
      }

      if (!tags.has(slug)) {
        tags.set(slug, {
          name: tag,
          slug: slug,
          posts: []
        });
      }

      tags.get(slug).posts.push(item);
    });
  });

  return [...tags.values()].sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });
}

function build_home() {
  const latest = sort_by_date(latest_by_title(posts)).slice(0, 3);

  write_file("index.html", shell({
    title: "anodyne avenue",
    description: "An anonymous, text-first archive of essays, guides, and blog posts.",
    content: [
      '      <p class="kicker">anodyne avenue</p>',
      "      <h1>Deep dives into topics of interest, looking at all sides.</h1>",
      '      <p class="muted">An anonymous, text-first archive of essays, guides, and blog posts.</p>',
      "",
      "      <h2>Latest</h2>",
      latest.map(post_card).join("\n") || '      <p class="muted">No posts yet.</p>'
    ].join("\n")
  }));
}

function build_sections() {
  Object.keys(labels).forEach(function(type) {
    const items = latest_by_title(posts.filter(function(item) {
      return item.type === type;
    }));

    write_file(page_for_type(type), shell({
      title: labels[type].toLowerCase() + " — anodyne avenue",
      description: intros[type],
      back: true,
      content: [
        '      <p class="kicker">anodyne avenue</p>',
        "      <h1>" + labels[type] + "</h1>",
        '      <p class="muted intro">' + escape_html(intros[type]) + "</p>",
        "",
        sort_by_date(items).map(post_card).join("\n") || '      <p class="muted">No posts yet.</p>'
      ].join("\n")
    }));
  });
}

function build_archive() {
  write_file("archive.html", shell({
    title: "archive — anodyne avenue",
    description: "All published posts, ordered by date from newest to oldest.",
    back: true,
    content: [
      '      <p class="kicker">anodyne avenue</p>',
      "      <h1>Archive</h1>",
      '      <p class="muted intro">All published posts, ordered by date from newest to oldest.</p>',
      "",
      sort_by_date(posts).map(post_card).join("\n") || '      <p class="muted">No posts yet.</p>'
    ].join("\n")
  }));
}

function build_posts() {
  posts.forEach(function(item) {
    write_file(post_page(item), shell({
      title: item.title + " — anodyne avenue",
      description: item.abstract,
      back: true,
      content: [
        '      <article class="post">',
        '        <p class="kicker">' + escape_html(labels[item.type]) + "</p>",
        "        <small>" + meta(item) + "</small>",
        "",
        "        <h1>" + escape_html(item.title) + "</h1>",
        "",
        '        <p class="abstract"><strong>Abstract.</strong> ' + escape_html(item.abstract) + "</p>",
        "",
        tag_links(item),
        "",
        '        <div class="body">',
        "          " + item.body,
        "        </div>",
        "",
        "        <footer>anodyne avenue ©</footer>",
        "      </article>"
      ].join("\n")
    }));
  });
}

function build_tags() {
  const visible_posts = latest_by_title(posts);
  const tags = all_tags(visible_posts);

  write_file("tags.html", shell({
    title: "tags — anodyne avenue",
    description: "Posts grouped by tag.",
    back: true,
    content: [
      '      <p class="kicker">anodyne avenue</p>',
      "      <h1>Tags</h1>",
      '      <p class="muted intro">Posts grouped by tag.</p>',
      "",
      '      <section class="tag_index">',
      tags.map(function(tag) {
        return [
          '        <a href="/tag/' + tag.slug + '.html">',
          "          <span>" + escape_html(tag.name) + "</span>",
          "          <small>" + tag.posts.length + "</small>",
          "        </a>"
        ].join("\n");
      }).join("\n") || '        <p class="muted">No tags yet.</p>',
      "      </section>"
    ].join("\n")
  }));

  tags.forEach(function(tag) {
    write_file("tag/" + tag.slug + ".html", shell({
      title: tag.name + " — anodyne avenue",
      description: "Posts tagged " + tag.name + ".",
      back: true,
      content: [
        '      <p class="kicker">tag</p>',
        "      <h1>" + escape_html(tag.name) + "</h1>",
        '      <p class="muted intro">Posts tagged ' + escape_html(tag.name) + ".</p>",
        "",
        sort_by_date(tag.posts).map(post_card).join("\n") || '      <p class="muted">No posts yet.</p>'
      ].join("\n")
    }));
  });
}

function build() {
  validate_posts();

  remove_path("posts");
  remove_path("tag");
  remove_path("script.js");
  remove_path("post.html");
  remove_path("section.html");

  build_home();
  build_sections();
  build_archive();
  build_tags();
  build_posts();
}

build();
