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

const site_url = "https://anodyneavenue.github.io";

const version_file = path.join(root, "version.txt");
let current_build_version = "";

function pad2(value) {
  return String(value).padStart(2, "0");
}

function build_version_date() {
  const now = new Date();

  return [
    pad2(now.getFullYear() % 100),
    pad2(now.getMonth() + 1),
    pad2(now.getDate())
  ].join(".");
}

function parse_version_text(text) {
  const match = String(text || "").trim().match(/^1\.(\d+)\.(\d{2})\.(\d{2})\.(\d{2})\.(\d+)$/);

  if (!match) {
    return null;
  }

  return {
    minor: Number(match[1]),
    increment: Number(match[5])
  };
}

function next_build_version() {
  let minor = 0;
  let increment = 0;

  if (fs.existsSync(version_file)) {
    const parsed = parse_version_text(fs.readFileSync(version_file, "utf8"));

    if (!parsed) {
      throw new Error("version.txt must use the format 1.X.YY.MM.DD.Increment, for example 1.0.26.05.29.12");
    }

    minor = parsed.minor;
    increment = parsed.increment;
  }

  return "1." + minor + "." + build_version_date() + "." + (increment + 1);
}

function write_version_file(version) {
  fs.writeFileSync(version_file, version + "\n", "utf8");
}

function version_footer_html() {
  if (!current_build_version) {
    return "";
  }

  return '<span class="site_version">v' + escape_html(current_build_version) + '</span>';
}


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

function escape_xml(value) {
  return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&apos;");
}

function absolute_url(file) {
  if (!file || file === "index.html") {
    return site_url + "/";
  }

  return site_url + "/" + String(file).replace(/^\/+/, "");
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
    '      <div class="minimap_shell">',
    '        <nav class="minimap" aria-label="Post sections">',
    headings.map(function(heading, index) {
      const marker = heading.level <= 1
          ? ""
          : "&gt;".repeat(heading.level - 1);

      const mix = Math.round((index / max_index) * 100);

      const scroll_top = heading.scroll_top
          ? ' data-scroll-top="true"'
          : "";

      return [
        '        <a class="minimap_item minimap_h' + heading.level + '" style="--map-mix: ' + mix + '%;" href="#' + escape_html(heading.id) + '"' + scroll_top + ">",
        '          <span class="minimap_marker" aria-hidden="true">' + marker + "</span>",
        '          <span class="minimap_text" data-text="' + escape_html(heading.text) + '"><span class="minimap_label">' + escape_html(heading.text) + "</span></span>",
        "        </a>"
      ].join("\n");
    }).join("\n"),
    "        </nav>",
    "      </div>",
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
  return "metadata/tags/" + tag_slug(tag) + ".html";
}

function linked_kicker(label, href) {
  return '<p class="kicker"><a href="' + escape_html(href) + '">' + escape_html(label) + '</a></p>';
}

function breadcrumb_kicker(parts) {
  return '<p class="kicker breadcrumb_kicker">' + parts.map(function(part) {
    return '<a href="' + escape_html(part.href) + '">' + escape_html(part.label) + '</a>';
  }).join(' / ') + '</p>';
}

function site_kicker() {
  return breadcrumb_kicker([
    { label: "ANODYNE AVENUE", href: "/" }
  ]);
}

function plain_site_kicker() {
  return '<p class="kicker">ANODYNE AVENUE</p>';
}

function section_kicker(type) {
  return breadcrumb_kicker([
    { label: "ANODYNE AVENUE", href: "/" },
    { label: labels[type].toUpperCase(), href: "/" + page_for_type(type) }
  ]);
}

function archive_kicker() {
  return breadcrumb_kicker([
    { label: "ANODYNE AVENUE", href: "/" },
    { label: "ARCHIVE", href: "/archive.html" }
  ]);
}

function metadata_kicker() {
  return breadcrumb_kicker([
    { label: "ANODYNE AVENUE", href: "/" },
    { label: "METADATA", href: "/metadata.html" }
  ]);
}

function metadata_field_kicker(field) {
  return breadcrumb_kicker([
    { label: "ANODYNE AVENUE", href: "/" },
    { label: "METADATA", href: "/metadata.html" },
    { label: field.label.toUpperCase(), href: "/" + metadata_field_page(field) }
  ]);
}

function post_metadata_anchor(item) {
  return "post_metadata_" + slug_text(item.slug || item.title);
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


function humanise_meta_key(key) {
  return String(key || "")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^./, function(char) {
        return char.toUpperCase();
      });
}

function metadata_value_empty(value) {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim() === "";
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }

  return false;
}

function metadata_value_text(value) {
  if (Array.isArray(value)) {
    return value.map(metadata_value_text).filter(Boolean).join(", ");
  }

  if (value && typeof value === "object") {
    return Object.keys(value).map(function(key) {
      return humanise_meta_key(key) + ": " + metadata_value_text(value[key]);
    }).filter(Boolean).join(" · ");
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return String(value || "");
}

const footer_metadata_excluded_keys = new Set([
  "show",
  "slug",
  "title",
  "type",
  "date",
  "revised",
  "tags",
  "abstract",
  "body"
]);

const page_metadata_excluded_keys = new Set([
  "show",
  "body"
]);

const primary_metadata_order = [
  "slug",
  "title",
  "type",
  "date",
  "tags",
  "abstract",
  "word_count"
];

function primary_metadata_rank(key) {
  const index = primary_metadata_order.indexOf(key);

  if (index >= 0) {
    return index;
  }

  return primary_metadata_order.length;
}

function metadata_field_entry(item, key, value, derived) {
  return {
    key: key,
    label: humanise_meta_key(key),
    value: value,
    text: metadata_value_text(value),
    derived: derived === true
  };
}

function post_footer_metadata_fields(item) {
  return Object.keys(item)
      .filter(function(key) {
        return !footer_metadata_excluded_keys.has(key) && !metadata_value_empty(item[key]);
      })
      .map(function(key) {
        return metadata_field_entry(item, key, item[key], false);
      });
}

function public_metadata_fields(item) {
  const fields = [];

  primary_metadata_order.forEach(function(key) {
    if (key === "word_count") {
      fields.push(metadata_field_entry(item, key, word_count_label(item), true));
      return;
    }

    if (
        Object.prototype.hasOwnProperty.call(item, key) &&
        !page_metadata_excluded_keys.has(key) &&
        !metadata_value_empty(item[key])
    ) {
      fields.push(metadata_field_entry(item, key, item[key], false));
    }
  });

  Object.keys(item)
      .filter(function(key) {
        return (
          primary_metadata_order.indexOf(key) < 0 &&
          !page_metadata_excluded_keys.has(key) &&
          !metadata_value_empty(item[key])
        );
      })
      .sort(function(a, b) {
        return humanise_meta_key(a).localeCompare(humanise_meta_key(b));
      })
      .forEach(function(key) {
        fields.push(metadata_field_entry(item, key, item[key], false));
      });

  return fields;
}

function metadata_value_entries(value) {
  if (Array.isArray(value)) {
    return value.map(metadata_value_text).filter(Boolean);
  }

  const text = metadata_value_text(value);
  return text ? [text] : [];
}

function metadata_field_slug(key) {
  return slug_text(key) || "metadata";
}

function metadata_field_page(field) {
  return "metadata/" + field.slug + ".html";
}

function metadata_value_slug(value) {
  return slug_text(value.value) || "value";
}

function metadata_field_value_page(field, value) {
  return "metadata/" + field.slug + "/" + metadata_value_slug(value) + ".html";
}

function metadata_value_key(value) {
  return String(value || "").toLowerCase();
}

function make_empty_metadata_field(key) {
  return {
    key: key,
    label: humanise_meta_key(key),
    slug: metadata_field_slug(key),
    derived: key === "word_count",
    posts: [],
    values: new Map()
  };
}

function all_metadata_fields(items) {
  const fields = new Map();

  primary_metadata_order.forEach(function(key) {
    fields.set(key, make_empty_metadata_field(key));
  });

  items.forEach(function(item) {
    public_metadata_fields(item).forEach(function(entry) {
      if (!fields.has(entry.key)) {
        fields.set(entry.key, {
          key: entry.key,
          label: entry.label,
          slug: metadata_field_slug(entry.key),
          derived: entry.derived === true,
          posts: [],
          values: new Map()
        });
      }

      const field = fields.get(entry.key);
      field.posts.push(item);

      metadata_value_entries(entry.value).forEach(function(value) {
        const key = metadata_value_key(value);

        if (!field.values.has(key)) {
          field.values.set(key, {
            value: value,
            posts: []
          });
        }

        field.values.get(key).posts.push(item);
      });
    });
  });

  return [...fields.values()].sort(function(a, b) {
    const rank_difference = primary_metadata_rank(a.key) - primary_metadata_rank(b.key);

    if (rank_difference !== 0) {
      return rank_difference;
    }

    return a.label.localeCompare(b.label);
  });
}

function metadata_post_count_label(count) {
  if (count === 1) {
    return "1 post";
  }

  return count + " posts";
}

function metadata_value_count_label(count) {
  if (count === 1) {
    return "1 value";
  }

  return count + " values";
}

function metadata_latest_date(items) {
  const latest = sort_by_date(items)[0];

  if (!latest) {
    return "";
  }

  return latest.date;
}

function metadata_field_meta(field) {
  const latest = metadata_latest_date(field.posts);
  const parts = [
    metadata_post_count_label(field.posts.length),
    metadata_value_count_label(field.values.size)
  ];

  if (latest) {
    parts.push("latest " + latest);
  }

  if (field.derived) {
    parts.push("derived");
  }

  return parts.filter(Boolean).map(escape_html).join(" · ");
}

function metadata_field_card(field) {
  return [
    '        <a class="tag_card metadata_card" href="/' + escape_html(metadata_field_page(field)) + '">',
    "          <small>" + metadata_field_meta(field) + "</small>",
    "          <span>" + escape_html(field.label) + "</span>",
    "        </a>"
  ].join("\n");
}

function metadata_field_index(fields) {
  if (!fields.length) {
    return '      <p class="muted">No metadata yet.</p>';
  }

  return [
    '      <section class="tag_index metadata_index" id="metadata_index">',
    fields.map(metadata_field_card).join("\n"),
    "      </section>"
  ].join("\n");
}

function metadata_value_meta(value) {
  const posts = sort_by_date(value.posts);
  const latest = metadata_latest_date(posts);
  const parts = [
    metadata_post_count_label(posts.length)
  ];

  if (latest) {
    parts.push("latest " + latest);
  }

  return parts.filter(Boolean).map(escape_html).join(" · ");
}

function metadata_value_card(field, value) {
  return [
    '        <a class="tag_card metadata_value_card metadata_value_card_link" href="/' + escape_html(metadata_field_value_page(field, value)) + '">',
    "          <small>" + metadata_value_meta(value) + "</small>",
    "          <span>" + escape_html(value.value) + "</span>",
    "        </a>"
  ].join("\n");
}

function metadata_field_values(field) {
  return [...field.values.values()].sort(function(a, b) {
    const post_difference = b.posts.length - a.posts.length;

    if (post_difference !== 0) {
      return post_difference;
    }

    return a.value.localeCompare(b.value);
  });
}

function metadata_field_section(field) {
  const values = metadata_field_values(field);
  const value_html = values.length
      ? values.map(function(value) {
        return metadata_value_card(field, value);
      }).join("\n")
      : '        <p class="muted">No posts yet.</p>';

  return [
    '      <section class="metadata_group" id="metadata_' + escape_html(field.slug) + '">',
    "        <h2>Values</h2>",
    '        <p class="muted metadata_group_meta">' + metadata_field_meta(field) + "</p>",
    '        <section class="tag_index metadata_value_index">',
    value_html,
    "        </section>",
    "      </section>"
  ].join("\n");
}

function metadata_value_page_content(field, value) {
  const posts = sort_by_date(value.posts);

  return [
    '      ' + metadata_field_kicker(field),
    "      <h1>" + escape_html(value.value) + "</h1>",
    '      <p class="muted intro">' + metadata_value_meta(value) + "</p>",
    "",
    posts.map(post_card).join("\n") || '      <p class="muted">No posts yet.</p>'
  ].join("\n");
}

const by_post_metadata_excluded_keys = new Set([
  "show",
  "body",
  "title",
  "date",
  "revised",
  "type",
  "slug",
  "word_count"
]);

/*
  By post follows the same metadata ordering as the metadata index after the
  card heading has already carried title/date/type/word count: tags first,
  then abstract, then remaining additional fields in their normal order.
*/
function by_post_metadata_fields(item) {
  return public_metadata_fields(item)
      .filter(function(field) {
        return !by_post_metadata_excluded_keys.has(field.key);
      });
}

function metadata_post_value_html(field) {
  if (field.key === "type" && labels[field.value]) {
    return escape_html(labels[field.value]);
  }

  return escape_html(field.text);
}

function metadata_post_card(item) {
  const fields = by_post_metadata_fields(item);

  return [
    '        <article class="metadata_post_entry" id="' + escape_html(post_metadata_anchor(item)) + '">',
    '          <a class="tag_card metadata_post_card" href="/' + post_page(item) + '">',
    "            <small>" + meta(item) + "</small>",
    '            <span class="metadata_post_title">' + escape_html(item.title) + "</span>",
    fields.length ? '            <dl class="post_meta_list metadata_post_list">' : '',
    fields.map(function(field) {
      return [
        '              <div class="post_meta_item metadata_post_row">',
        "                <dt>" + escape_html(field.label) + "</dt>",
        "                <dd>" + metadata_post_value_html(field) + "</dd>",
        "              </div>"
      ].join("\n");
    }).join("\n"),
    fields.length ? "            </dl>" : '',
    "          </a>",
    "        </article>"
  ].filter(function(line) {
    return line !== "";
  }).join("\n");
}

function metadata_post_index(items) {
  return [
    '      <section class="metadata_posts">',
    sort_by_date(items).map(metadata_post_card).join("\n"),
    "      </section>"
  ].join("\n");
}

function post_footer_metadata(item) {
  const rows = post_footer_metadata_fields(item).map(function(field) {
    return [
      '            <div class="post_meta_item">',
      "              <dt>" + escape_html(field.label) + "</dt>",
      "              <dd>" + escape_html(field.text) + "</dd>",
      "            </div>"
    ].join("\n");
  });

  if (!rows.length) {
    return "";
  }

  return [
    '      <footer class="post_meta_footer" aria-label="Post metadata">',
    '        <a class="post_meta_card" href="/metadata.html#' + escape_html(post_metadata_anchor(item)) + '">',
    '          <span class="post_meta_card_label">Metadata</span>',
    '          <dl class="post_meta_list">',
    rows.join("\n"),
    "          </dl>",
    "        </a>",
    "      </footer>"
  ].join("\n");
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
    '    <a class="title" href="/">ANODYNE AVENUE</a>',
    "",
    '    <nav class="sidebar_nav" aria-label="Main sections">',
    '      <a href="/essays.html">Essays</a>',
    '      <a href="/guides.html">Guides</a>',
    '      <a href="/blog.html">Blog</a>',
    '      <a href="/metadata/tags.html">Tags</a>',
    '      <a href="/archive.html">Archive</a>',
    "    </nav>",
    "",
    extra_html || "",
    "",
    "    <footer><span>anodyne avenue ©</span>" + version_footer_html() + "</footer>",
    "  </aside>"
  ].filter(function(line) {
    return line !== "";
  }).join("\n");
}

function shell(options) {
  const title = options.title;
  const description = options.description || "";
  const robots = options.robots || "";
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
    robots ? '  <meta name="robots" content="' + escape_html(robots) + '">' : "",
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
    title: "anodyne avenue",
    description: "An anonymous, text-first archive of essays, guides, and blog posts.",
    back: true,
    content: [
      '      ' + plain_site_kicker(),
      "      <h1>Deep dives into topics of interest.</h1>",
      '      <p class="muted intro">An anonymous <a href="/archive.html">archive</a> of essays, guides, and blog posts, under the pseudonym <b>anodyne avenue</b></p>',
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
        '      ' + section_kicker(type),
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
      '      ' + archive_kicker(),
      "      <h1>Archive</h1>",
      '      <p class="muted intro">All published posts, ordered by date from newest to oldest.</p>',
      "",
      sort_by_date(items).map(post_card).join("\n") || '      <p class="muted">No posts yet.</p>'
    ].join("\n")
  }));
}

function build_404() {
  write_file("404.html", shell({
    title: "anodyne avenue - not found",
    description: "Page not found.",
    back: true,
    content: [
      '      ' + site_kicker(),
      "      <h1>404</h1>",
      '      <p class="muted intro">The page you were looking for does not exist, may have moved, or may never have been written.</p>',
      "",
      '      <section class="tag_index">',
      '        <a class="tag_card" href="/metadata/tags.html">',
      "          <small>A subject index for the archive.</small>",
      "          <span>Tags</span>",
      "        </a>",
      '        <a class="tag_card" href="/archive.html">',
      "          <small>All published posts.</small>",
      "          <span>Archive</span>",
      "        </a>",
      "      </section>"
    ].join("\n")
  }));
}

function sitemap_entry(file, lastmod) {
  const lines = [
    "  <url>",
    "    <loc>" + escape_xml(absolute_url(file)) + "</loc>"
  ];

  if (lastmod) {
    lines.push("    <lastmod>" + escape_xml(lastmod) + "</lastmod>");
  }

  lines.push("  </url>");

  return lines.join("\n");
}

function build_sitemap(items) {
  const fields = all_metadata_fields(items);
  const entries = [];

  entries.push(sitemap_entry("index.html"));

  Object.keys(labels).forEach(function(type) {
    entries.push(sitemap_entry(page_for_type(type)));
  });

  entries.push(sitemap_entry("archive.html"));
  entries.push(sitemap_entry("metadata.html"));
  entries.push(sitemap_entry("tags.html"));

  fields.forEach(function(field) {
    entries.push(sitemap_entry(metadata_field_page(field), metadata_latest_date(field.posts)));

    metadata_field_values(field).forEach(function(value) {
      entries.push(sitemap_entry(metadata_field_value_page(field, value), metadata_latest_date(value.posts)));
    });
  });

  sort_by_date(items).forEach(function(item) {
    entries.push(sitemap_entry(post_page(item), item.revised || item.date));
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries.join("\n"),
    "</urlset>"
  ].join("\n");

  write_file("sitemap.xml", xml);
}

function open_graph_meta(item) {
  const title = item
      ? item.title + " - anodyne avenue"
      : "anodyne avenue";

  const description = item
      ? item.abstract
      : "An anonymous, text-first archive of essays, guides, and blog posts.";

  const url = item
      ? absolute_url(post_page(item))
      : absolute_url("index.html");

  return [
    '  <meta property="og:type" content="' + (item ? "article" : "website") + '">',
    '  <meta property="og:title" content="' + escape_html(title) + '">',
    '  <meta property="og:description" content="' + escape_html(description) + '">',
    '  <meta property="og:url" content="' + escape_html(url) + '">',
    '  <meta property="og:site_name" content="anodyne avenue">',
    '  <meta name="twitter:card" content="summary">'
  ].join("\n");
}

function build_metadata_page(items) {
  const fields = all_metadata_fields(items);

  write_file("metadata.html", shell({
    title: "anodyne avenue - metadata",
    description: "A public index of post metadata across the archive.",
    back: true,
    content: [
      '      ' + metadata_kicker(),
      "      <h1>Metadata</h1>",
      '      <p class="muted intro">A public index of post metadata across the archive: fields, values, counts, and the posts attached to them.</p>',
      "",
      metadata_field_index(fields),
      "",
      "      <h2>By post</h2>",
      '      <p class="muted metadata_group_meta">Each visible post and its public metadata, excluding the post body.</p>',
      metadata_post_index(items)
    ].join("\n")
  }));

  fields.forEach(function(field) {
    write_file(metadata_field_page(field), shell({
      title: field.label.toLowerCase() + " metadata - anodyne avenue",
      description: "Metadata values for " + field.label + ".",
      back: true,
      content: [
        '      ' + metadata_field_kicker(field),
        "      <h1>" + escape_html(field.label) + "</h1>",
        '      <p class="muted intro">' + metadata_field_meta(field) + "</p>",
        "",
        metadata_field_section(field)
      ].join("\n")
    }));

    metadata_field_values(field).forEach(function(value) {
      write_file(metadata_field_value_page(field, value), shell({
        title: value.value + " - " + field.label.toLowerCase() + " metadata - anodyne avenue",
        description: "Posts using " + field.label + ": " + value.value + ".",
          back: true,
        content: metadata_value_page_content(field, value)
      }));
    });
  });
}

function build_tags_page(items) {
  const fields = all_metadata_fields(items);
  const tags_field = fields.find(function(field) {
    return field.key === "tags";
  });

  const canonical = tags_field
      ? "/" + metadata_field_page(tags_field)
      : "/metadata.html";

  write_file("tags.html", shell({
    title: "anodyne avenue - tags",
    description: "Tags are part of the public metadata index.",
    back: true,
    content: [
      '      ' + metadata_kicker(),
      "      <h1>Tags</h1>",
      '      <p class="muted intro">Tags are now part of the metadata index.</p>',
      "",
      '      <section class="tag_index">',
      '        <a class="tag_card" href="' + escape_html(canonical) + '">',
      "          <small>canonical metadata page</small>",
      "          <span>Open tags</span>",
      "        </a>",
      "      </section>"
    ].join("\n")
  }));
}

function build_tag_pages(items) {
  /*
    Tags are now generated as normal metadata value pages under
    /metadata/tags/. This function remains as a no-op so older build flow
    names stay understandable.
  */
}

function post_headings(item, prepared) {
  return [
    {
      level: 1,
      id: "post_title",
      text: item.title,
      scroll_top: true
    }
  ].concat(prepared.headings);
}

function build_posts(items) {
  items.forEach(function(item) {
    const prepared = prepare_body(item.body);
    const headings = post_headings(item, prepared);

    write_file(post_page(item), shell({
      title: item.title + " - anodyne avenue",
      description: item.abstract,
      back: true,
      minimap: minimap(headings, item.type),
      content: [
        '    <article class="post">',
        '      ' + section_kicker(item.type),
        '      <header>',
        '        <h1 id="post_title">' + escape_html(item.title) + "</h1>",
        "        <p><small>" + meta(item) + "</small></p>",
        '        <p class="abstract">' + escape_html(item.abstract) + "</p>",
        tag_links(item),
        "      </header>",
        "",
        '      <section class="body">',
        prepared.html,
        "      </section>",
        "",
        post_footer_metadata(item),
        "    </article>"
      ].join("\n")
    }));
  });
}

function build() {
  const visible = shown_posts();

  validate_posts(visible);

  current_build_version = next_build_version();
  write_version_file(current_build_version);

  if (fs.existsSync(out)) {
    fs.rmSync(out, {
      recursive: true,
      force: true,
      maxRetries: 10,
      retryDelay: 200
    });
  }

  fs.mkdirSync(out, { recursive: true });
  fs.mkdirSync(path.join(out, "posts"), { recursive: true });
  fs.mkdirSync(path.join(out, "metadata"), { recursive: true });

  build_home(visible);
  build_sections(visible);
  build_archive(visible);
  build_metadata_page(visible);
  build_tags_page(visible);
  build_tag_pages(visible);
  build_posts(visible);
  build_404();
  build_sitemap(visible);

  copy_file("style.css");
  copy_file("sidebar.js");
  copy_file("minimap.js");
}

build();