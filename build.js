const fs = require("fs");
const path = require("path");
const posts = require("./posts.js");

const labels = {
  essays: "Essays",
  guides: "Guides",
  blog: "Blog"
};

const intros = {
  essays: "Long-form arguments, investigations, and attempts to look at a topic from multiple perspectives - references included.",
  guides: "Structured explanations, methods, and practical notes.",
  blog: "Shorter entries, fragments, logs, public journals, and irregular updates."
};

const root = __dirname;
const out = path.join(root, "_site");

function shown_posts() {
  return posts.filter(function(item) {
    return item.show === true;
  });
}

function escape_html(value) {
  return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
}

function strip_html(value) {
  return String(value || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
}

function slug_text(value) {
  return String(value || "")
      .toLowerCase()
      .trim()
      .replaceAll("&", "and")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
}

function word_count(item) {
  const text = [
    item.title,
    item.abstract,
    strip_html(item.body)
  ].join(" ");

  const words = text.match(/\b[\w’'-]+\b/g);

  if (!words) {
    return 0;
  }

  return words.length;
}

function word_count_label(item) {
  const count = word_count(item);

  if (count === 1) {
    return "1 word";
  }

  return count + " words";
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
  return slug_text(tag);
}

function heading_slug(text, used) {
  let base = slug_text(text);

  if (!base) {
    base = "section";
  }

  let slug = base;
  let count = 2;

  while (used.has(slug)) {
    slug = base + "_" + count;
    count = count + 1;
  }

  used.add(slug);
  return slug;
}

function prepare_body(body) {
  const headings = [];
  const used = new Set();

  const html = String(body || "").replace(/<h([2-4])([^>]*)>(.*?)<\/h\1>/gis, function(match, level, attrs, inner) {
    const text = strip_html(inner);
    const existing = attrs.match(/\sid=["']([^"']+)["']/i);
    const id = existing ? existing[1] : heading_slug(text, used);

    if (existing) {
      used.add(id);
    }

    headings.push({
      level: Number(level),
      id: id,
      text: text
    });

    if (existing) {
      return match;
    }

    return "<h" + level + attrs + ' id="' + id + '">' + inner + "</h" + level + ">";
  });

  return {
    html: html,
    headings: headings
  };
}

function minimap(headings, type) {
  if (!headings || headings.length < 3) {
    return "";
  }

  const max_index = Math.max(1, headings.length - 1);

  return [
    '    <section class="sidebar_minimap map_' + escape_html(type) + '" aria-label="On this page">',
    '      <p class="sidebar_section_title">On this page</p>',
    '      <nav class="minimap" aria-label="Post sections">',
    headings.map(function(heading, index) {
      const marker = "&gt;".repeat(Math.max(1, heading.level - 1));
      const mix = Math.round((index / max_index) * 100);

      return [
        '        <a class="minimap_item minimap_h' + heading.level + '" style="--map-mix: ' + mix + '%;" href="#' + escape_html(heading.id) + '">',
        '          <span class="minimap_marker" aria-hidden="true">' + marker + "</span>",
        '          <span class="minimap_text">' + escape_html(heading.text) + "</span>",
        "        </a>"
      ].join("\n");
    }).join("\n"),
    "      </nav>",
    "    </section>"
  ].join("\n");
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
    word_count_label(item)
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
    '      <a class="card_link" href="/' + post_page(item) + '">',
    "        <small>" + meta(item) + "</small>",
    '        <h3><span class="post_title">' + escape_html(item.title) + "</span></h3>",
    "        <p>" + escape_html(item.abstract) + "</p>",
    "      </a>",
    tag_links(item),
    "    </article>"
  ].join("\n");
}

function sidebar(extra_html) {
  return [
    '  <aside id="sidebar">',
    '    <a class="title" href="/">anodyne avenue</a>',
    "",
    '    <nav class="sidebar_nav" aria-label="Main sections">',
    '      <a href="/essays.html">Essays</a>',
    '      <a href="/guides.html">Guides</a>',
    '      <a href="/blog.html">Blog</a>',
    '      <a href="/tags.html">Tags</a>',
    '      <a href="/archive.html">Archive</a>',
    "    </nav>",
    "",
    extra_html || "",
    "",
    "    <footer>anodyne avenue ©</footer>",
    "  </aside>"
  ].filter(function(line) {
    return line !== "";
  }).join("\n");
}

function shell(options) {
  const title = options.title;
  const description = options.description || "";
  const back = options.back || false;
  const content = options.content;
  const minimap_html = options.minimap || "";
  const minimap_script = minimap_html ? '  <script src="/minimap.js" defer></script>' : "";

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
    minimap_script,
    "</head>",
    "<body>",
    '  <button id="toggle" type="button" aria-label="Toggle sidebar">☰</button>',
    back ? '  <button class="back" type="button" aria-label="Back">‹</button>' : "",
    "",
    sidebar(minimap_html),
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
  const full = path.join(out, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trimStart(), "utf8");
}

function copy_file(file) {
  fs.copyFileSync(path.join(root, file), path.join(out, file));
}

function validate_posts(items) {
  const slugs = new Set();
  const types = new Set(Object.keys(labels));

  items.forEach(function(item, index) {
    const name = item.slug || "visible post " + String(index + 1);

    ["slug", "title", "type", "date", "edition", "abstract", "body"].forEach(function(field) {
      if (!item[field]) {
        throw new Error(name + " is missing " + field);
      }
    });

    if (slugs.has(item.slug)) {
      throw new Error("duplicate visible slug: " + item.slug);
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

  return [...tags.values()];
}

function tag_count_label(count) {
  if (count === 1) {
    return "1 post";
  }

  return count + " posts";
}

function tag_latest_date(tag) {
  const latest = sort_by_date(tag.posts)[0];

  if (!latest) {
    return "";
  }

  return latest.date;
}

function tag_type_label(tag) {
  const type_order = Object.keys(labels);
  const found = new Set(tag.posts.map(function(item) {
    return item.type;
  }));

  return type_order.filter(function(type) {
    return found.has(type);
  }).map(function(type) {
    return labels[type].toLowerCase();
  }).join(" / ");
}

function tag_meta(tag) {
  const parts = [
    tag_count_label(tag.posts.length),
    "latest " + tag_latest_date(tag),
    tag_type_label(tag)
  ];

  return parts.filter(Boolean).map(escape_html).join(" · ");
}

function sort_tags_by_density(tags) {
  return [...tags].sort(function(a, b) {
    const count_difference = b.posts.length - a.posts.length;

    if (count_difference !== 0) {
      return count_difference;
    }

    return a.name.localeCompare(b.name);
  });
}

function sort_tags_alphabetically(tags) {
  return [...tags].sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });
}

function tag_group_letter(tag) {
  const first = String(tag.name || "").trim().charAt(0).toUpperCase();

  if (/^[A-Z0-9]$/.test(first)) {
    return first;
  }

  return "#";
}

function tag_card(tag) {
  return [
    '        <a class="tag_card" href="/tag/' + tag.slug + '.html">',
    "          <small>" + tag_meta(tag) + "</small>",
    "          <span>" + escape_html(tag.name) + "</span>",
    "        </a>"
  ].join("\n");
}

function tag_index(tags) {
  if (!tags.length) {
    return '      <p class="muted">No tags yet.</p>';
  }

  if (tags.length < 20) {
    return [
      '      <section class="tag_index">',
      sort_tags_by_density(tags).map(tag_card).join("\n"),
      "      </section>"
    ].join("\n");
  }

  const grouped = new Map();

  sort_tags_alphabetically(tags).forEach(function(tag) {
    const letter = tag_group_letter(tag);

    if (!grouped.has(letter)) {
      grouped.set(letter, []);
    }

    grouped.get(letter).push(tag);
  });

  return [
    '      <section class="tag_index tag_index_grouped">',
    [...grouped.entries()].map(function(entry) {
      const letter = entry[0];
      const group_tags = entry[1];

      return [
        '        <section class="tag_group">',
        "          <h2>" + escape_html(letter) + "</h2>",
        group_tags.map(tag_card).join("\n"),
        "        </section>"
      ].join("\n");
    }).join("\n"),
    "      </section>"
  ].join("\n");
}

function build_home(items) {
  const latest = sort_by_date(latest_by_title(items)).slice(0, 3);

  write_file("index.html", shell({
    title: "anodyne avenue - home",
    description: "An anonymous, text-first archive of essays, guides, and blog posts.",
    back: true,
    content: [
      '      <p class="kicker">anodyne avenue</p>',
      "      <h1>Deep dives into niche topics of interest.</h1>",
      '      <p class="muted intro">An anonymous archive of essays, guides, and blog posts, under the pseudonym <b>anodyne avenue</b></p>',
      "",
      "      <h2>Latest</h2>",
      latest.map(post_card).join("\n") || '      <p class="muted">No posts yet.</p>'
    ].join("\n")
  }));
}

function build_sections(items) {
  Object.keys(labels).forEach(function(type) {
    const section_posts = latest_by_title(items.filter(function(item) {
      return item.type === type;
    }));

    write_file(page_for_type(type), shell({
      title: labels[type].toLowerCase() + " - anodyne avenue",
      description: intros[type],
      back: true,
      content: [
        '      <p class="kicker">anodyne avenue</p>',
        "      <h1>" + labels[type] + "</h1>",
        '      <p class="muted intro">' + escape_html(intros[type]) + "</p>",
        "",
        sort_by_date(section_posts).map(post_card).join("\n") || '      <p class="muted">No posts yet.</p>'
      ].join("\n")
    }));
  });
}

function build_archive(items) {
  write_file("archive.html", shell({
    title: "anodyne avenue - archive",
    description: "All published posts, ordered by date from newest to oldest.",
    back: true,
    content: [
      '      <p class="kicker">anodyne avenue</p>',
      "      <h1>Archive</h1>",
      '      <p class="muted intro">All published posts, ordered by date from newest to oldest.</p>',
      "",
      sort_by_date(items).map(post_card).join("\n") || '      <p class="muted">No posts yet.</p>'
    ].join("\n")
  }));
}

function build_posts(items) {
  items.forEach(function(item) {
    const prepared = prepare_body(item.body);
    const post_minimap = minimap(prepared.headings, item.type);

    write_file(post_page(item), shell({
      title: "anodyne avenue - " + item.title,
      description: item.abstract,
      back: true,
      minimap: post_minimap,
      content: [
        '      <article class="post">',
        '        <p class="kicker">' + escape_html(labels[item.type]) + "</p>",
        "        <small>" + meta(item) + "</small>",
        "",
        "        <h1>" + escape_html(item.title) + "</h1>",
        "",
        '        <p class="abstract"><strong>Abstract:</strong> ' + escape_html(item.abstract) + "</p>",
        "",
        tag_links(item),
        "",
        '        <div class="body">',
        "          " + prepared.html,
        "        </div>",
        "",
        "        <footer>anodyne avenue ©</footer>",
        "      </article>"
      ].join("\n")
    }));
  });
}

function build_tags(items) {
  const visible_posts = latest_by_title(items);
  const tags = all_tags(visible_posts);

  write_file("tags.html", shell({
    title: "anodyne avenue - tags",
    description: "A subject index for the archive.",
    back: true,
    content: [
      '      <p class="kicker">anodyne avenue</p>',
      "      <h1>Tags</h1>",
      '      <p class="muted intro">A subject index for the archive. Tags group posts by recurring themes, methods, questions, and areas of interest.</p>',
      "",
      tag_index(tags)
    ].join("\n")
  }));

  sort_tags_alphabetically(tags).forEach(function(tag) {
    write_file("tag/" + tag.slug + ".html", shell({
      title: "anodyne avenue - " + tag.name,
      description: "Posts filed under " + tag.name + ".",
      back: true,
      content: [
        '      <p class="kicker">tag</p>',
        "      <h1>" + escape_html(tag.name) + "</h1>",
        '      <p class="muted intro">Posts filed under this tag, ordered from newest to oldest.</p>',
        "",
        sort_by_date(tag.posts).map(post_card).join("\n") || '      <p class="muted">No posts yet.</p>'
      ].join("\n")
    }));
  });
}

function build() {
  const visible_posts = shown_posts();

  validate_posts(visible_posts);

  if (fs.existsSync(out)) {
    fs.rmSync(out, { recursive: true, force: true });
  }

  fs.mkdirSync(out, { recursive: true });

  build_home(visible_posts);
  build_sections(visible_posts);
  build_archive(visible_posts);
  build_tags(visible_posts);
  build_posts(visible_posts);

  copy_file("style.css");
  copy_file("sidebar.js");

  if (fs.existsSync(path.join(root, "minimap.js"))) {
    copy_file("minimap.js");
  }

  write_file(".nojekyll", "");
}

build();