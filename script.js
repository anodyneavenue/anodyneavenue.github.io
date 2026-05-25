const labels = { essays: "Essays", guides: "Guides", blog: "Blog" };
const params = new URLSearchParams(location.search);
const by_date = items => [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
const post_link = item => `post.html?p=${item.slug}`;

function post_card(item) {
  return `
    <article class="card">
      <small>${item.date} · ${labels[item.type]} · ${item.edition}</small>
      <h3><a href="${post_link(item)}">${item.title}</a></h3>
      <p>${item.abstract}</p>
    </article>`;
}

function post_links(type) {
  return by_date(posts.filter(item => item.type == type)).map(item => `
    <a href="${post_link(item)}" title="${item.title}">${item.title}</a>
  `).join("");
}

function load_sidebar() {
  const sidebar_el = document.getElementById("sidebar");

  sidebar_el.innerHTML = `
    <a class="title" href="index.html">anodyne avenue</a>

    <nav>
      <a href="section.html?s=essays">Essays</a>
      <a href="section.html?s=guides">Guides</a>
      <a href="section.html?s=blog">Blog</a>
    </nav>

    <details class="side_index">
      <summary>Index</summary>

      <div class="side_group">
        <p>&gt;&gt; Essays</p>
        ${post_links("essays")}
      </div>

      <div class="side_group">
        <p>&gt;&gt; Guides</p>
        ${post_links("guides")}
      </div>

      <div class="side_group">
        <p>&gt;&gt; Blog</p>
        ${post_links("blog")}
      </div>
    </details>

    <footer>anodyne avenue ©</footer>`;
}

function load_home() {
  const latest_el = document.getElementById("latest");
  if (!latest_el) return;
  latest_el.innerHTML = by_date(posts).slice(0, 5).map(post_card).join("");
}

function load_section() {
  const section_el = document.getElementById("section_posts");
  const title_el = document.getElementById("section_title");
  if (!section_el || !title_el) return;

  const type = params.get("s") || "essays";
  title_el.textContent = labels[type] || "Essays";
  section_el.innerHTML = by_date(posts.filter(item => item.type == type)).map(post_card).join("");
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
load_post();
check_sidebar_size();

document.getElementById("toggle").onclick = toggle_sidebar;
document.querySelectorAll(".back").forEach(item => item.onclick = go_back);

document.addEventListener("click", close_mobile_sidebar);
addEventListener("resize", check_sidebar_size);
