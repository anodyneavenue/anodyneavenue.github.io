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

const params = new URLSearchParams(location.search);

const by_date = items => [...items].sort((a, b) => new Date(b.date) - new Date(a.date));

const post_link = item => `post.html?p=${item.slug}`;

function latest_by_title(items) {
  const latest = new Map();

  by_date(items).forEach(item => {
    const key = `${item.type}:${item.title.toLowerCase()}`;
    if (!latest.has(key)) latest.set(key, item);
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

function all_tags(items = latest_by_title(posts)) {
  const tags = new Map();

  items.forEach(item => {
    (item.tags || []).forEach(tag => {
      const slug = tag_slug(tag);
      if (!slug) return;

      if (!tags.has(slug)) {
        tags.set(slug, {
          name: tag,
          slug,
          posts: []
        });
      }

      tags.get(slug).posts.push(item);
    });
  });

  return [...tags.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function tag_links(item) {
  const tags = item.tags || [];
  if (!tags.length) return "";

  return `
    <div class="tags">
      ${tags.map(tag => `<a href="tags.html?t=${tag_slug(tag)}">${tag}</a>`).join("")}
    </div>
  `;
}

function post_card(item) {
  return `
    <article class="card">
      <small>${item.date} · ${labels[item.type]} · ${item.edition}</small>
      <h3><a class="post_title" href="${post_link(item)}">${item.title}</a></h3>
      <p>${item.abstract}</p>
      ${tag_links(item)}
    </article>
  `;
}

function load_sidebar() {
  const sidebar_el = document.getElementById("sidebar");
  if (!sidebar_el) return;

  sidebar_el.innerHTML = `
    <a class="title" href="index.html">anodyne avenue</a>

    <nav>
      <a href="section.html?s=essays">Essays</a>
      <a href="section.html?s=guides">Guides</a>
      <a href="section.html?s=blog">Blog</a>
      <a href="archive.html">Archive</a>
      <a href="tags.html">Tags</a>
    </nav>

    <footer>anodyne avenue ©</footer>
  `;
}

function load_home() {
  const latest_el = document.getElementById("latest");
  if (!latest_el) return;

  latest_el.innerHTML = by_date(latest_by_title(posts)).slice(0, 3).map(post_card).join("");
}

function load_section() {
  const section_el = document.getElementById("section_posts");
  const title_el = document.getElementById("section_title");
  const intro_el = document.getElementById("section_intro");

  if (!section_el || !title_el) return;

  const type = params.get("s") || "essays";
  const items = posts.filter(item => item.type === type);

  title_el.textContent = labels[type] || "Essays";

  if (intro_el) {
    intro_el.textContent = intros[type] || "";
  }

  section_el.innerHTML = by_date(latest_by_title(items)).map(post_card).join("");
}

function load_archive() {
  const archive_el = document.getElementById("archive");
  if (!archive_el) return;

  archive_el.innerHTML = by_date(posts).map(post_card).join("");
}

function load_post() {
  const post_el = document.getElementById("post");
  if (!post_el) return;

  const item = posts.find(post => post.slug === params.get("p")) || posts[0];

  post_el.innerHTML = `
    <article class="post">
      <p class="kicker">${labels[item.type]}</p>
      <small>${item.date} · ${item.edition}</small>

      <h1>${item.title}</h1>

      <p class="abstract"><strong>Abstract.</strong> ${item.abstract}</p>

      ${tag_links(item)}

      <div class="body">
        ${item.body}
      </div>

      <footer>anodyne avenue ©</footer>
    </article>
  `;
}

function load_tags() {
  const tags_el = document.getElementById("tags");
  const tag_posts_el = document.getElementById("tag_posts");
  const tag_title_el = document.getElementById("tag_title");
  const tag_intro_el = document.getElementById("tag_intro");

  if (!tags_el && !tag_posts_el) return;

  const selected = params.get("t");
  const visible_posts = latest_by_title(posts);
  const tags = all_tags(visible_posts);

  if (!selected) {
    if (tag_title_el) tag_title_el.textContent = "Tags";
    if (tag_intro_el) tag_intro_el.textContent = "Posts grouped by tag.";

    if (tags_el) {
      tags_el.innerHTML = tags.map(tag => `
        <a href="tags.html?t=${tag.slug}">
          <span>${tag.name}</span>
          <small>${tag.posts.length}</small>
        </a>
      `).join("") || `<p class="muted">No tags yet.</p>`;
    }

    return;
  }

  const tag = tags.find(item => item.slug === selected);

  if (!tag) {
    if (tag_title_el) tag_title_el.textContent = "Tag not found";
    if (tag_intro_el) tag_intro_el.textContent = "";
    if (tag_posts_el) tag_posts_el.innerHTML = `<p class="muted">No posts found for this tag.</p>`;
    return;
  }

  if (tag_title_el) tag_title_el.textContent = tag.name;
  if (tag_intro_el) tag_intro_el.textContent = `Posts tagged ${tag.name}.`;

  if (tags_el) tags_el.innerHTML = "";
  if (tag_posts_el) tag_posts_el.innerHTML = by_date(tag.posts).map(post_card).join("");
}

function mobile_screen() {
  return matchMedia("(max-width: 760px)").matches;
}

function sidebar_width() {
  return document.getElementById("sidebar").getBoundingClientRect().width;
}

function sidebar_fits() {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return innerWidth - sidebar_width() >= 34 * rem;
}

function close_sidebar() {
  document.body.classList.add("side_closed");
  document.body.classList.remove("side_open");
}

function toggle_sidebar() {
  if (mobile_screen()) {
    document.body.classList.toggle("side_open");
    return;
  }

  if (document.body.classList.contains("side_closed") && !sidebar_fits()) return;

  document.body.classList.toggle("side_closed");
}

function close_mobile_sidebar(event) {
  if (!mobile_screen()) return;
  if (!document.body.classList.contains("side_open")) return;
  if (event.target.closest("#sidebar") || event.target.closest("#toggle")) return;

  document.body.classList.remove("side_open");
}

function check_sidebar_size() {
  if (mobile_screen()) return;
  if (!sidebar_fits()) close_sidebar();
}

function go_back() {
  history.length > 1 ? history.back() : location.href = "index.html";
}

load_sidebar();
load_home();
load_section();
load_archive();
load_post();
load_tags();
check_sidebar_size();

document.getElementById("toggle").onclick = toggle_sidebar;
document.querySelectorAll(".back").forEach(item => item.onclick = go_back);
document.addEventListener("click", close_mobile_sidebar);
addEventListener("resize", check_sidebar_size);
