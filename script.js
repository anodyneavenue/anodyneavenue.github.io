const labels = { essays: "Essays", guides: "Guides", blog: "Blog" };
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

function post_card(item) {
  return `
    <article class="card">
      <small>${item.date} · ${labels[item.type]} · ${item.edition}</small>
      <h3><a href="${post_link(item)}">${item.title}</a></h3>
      <p>${item.abstract}</p>
    </article>`;
}

function load_sidebar() {
  const sidebar_el = document.getElementById("sidebar");

  sidebar_el.innerHTML = `
    <a class="title" href="index.html">anodyne avenue</a>

    <nav>
      <a href="section.html?s=essays">Essays</a>
      <a href="section.html?s=guides">Guides</a>
      <a href="section.html?s=blog">Blog</a>
      <a href="archive.html">Archive</a>
    </nav>

    <footer>anodyne avenue ©</footer>`;
}

function load_home() {
  const latest_el = document.getElementById("latest");
  if (!latest_el) return;
  latest_el.innerHTML = by_date(posts).slice(0, 3).map(post_card).join("");
}

function load_section() {
  const section_el = document.getElementById("section_posts");
  const title_el = document.getElementById("section_title");
  const intro_el = document.getElementById("section_intro");
  if (!section_el || !title_el) return;

  const type = params.get("s") || "essays";
  const items = posts.filter(item => item.type == type);

  title_el.textContent = labels[type] || "Essays";
  if (intro_el) intro_el.textContent = intros[type] || "";

  section_el.innerHTML = latest_by_title(items).map(post_card).join("");
}

function load_archive() {
  const archive_el = document.getElementById("archive");
  if (!archive_el) return;
  archive_el.innerHTML = by_date(posts).map(post_card).join("");
}

function load_post() {
  const post_el = document.getElementById("post");
  if (!post_el) return;

  const item = posts.find(post => post.slug == params.get("p")) || posts[0];

  post_el.innerHTML = `
    <p class="kicker">${labels[item.type]}</p>
    <small>${item.date} · ${item.edition}</small>
    <h1>${item.title}</h1>
    <p class="abstract"><b>Abstract.</b> ${item.abstract}</p>
    ${item.body}
    <footer>anodyne avenue ©</footer>`;
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
check_sidebar_size();

document.getElementById("toggle").onclick = toggle_sidebar;
document.querySelectorAll(".back").forEach(item => item.onclick = go_back);
document.addEventListener("click", close_mobile_sidebar);
addEventListener("resize", check_sidebar_size);
