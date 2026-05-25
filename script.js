const labels = { essays: "Essays", guides: "Guides", blog: "Blog" };
const params = new URLSearchParams(location.search);
const by_date = items => [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
const post_link = item => `post.html?p=${item.slug}`;

function post_card(item) {
  return `
    <a class="card" href="${post_link(item)}">
      <small>${item.date} · ${labels[item.type]} · ${item.edition}</small>
      <h3>${item.title}</h3>
      <p>${item.abstract}</p>
      <p class="tags">${item.tags.map(tag => `<span>${tag}</span>`).join("")}</p>
    </a>`;
}

function load_sidebar() {
  const sidebar_el = document.getElementById("sidebar");

  sidebar_el.innerHTML = `
    <a class="title" href="index.html">Anodyne Avenue</a>
    <nav>
      <a href="section.html?s=essays">Essays</a>
      <a href="section.html?s=guides">Guides</a>
      <a href="section.html?s=blog">Blog</a>
    </nav>
    ${Object.keys(labels).map(type => `
      <details open>
        <summary>${labels[type]}</summary>
        ${by_date(posts.filter(item => item.type == type)).map(item => `
          <a href="${post_link(item)}">${item.title}</a>
        `).join("")}
      </details>
    `).join("")}
    <footer>© Anodyne Avenue</footer>`;
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
    <p class="tags">${item.tags.map(tag => `<span>${tag}</span>`).join("")}</p>
    ${item.body}
    <footer>© Anodyne Avenue. All rights reserved.</footer>`;
}

function toggle_sidebar() {
  const mobile = matchMedia("(max-width: 760px)").matches;
  document.body.classList.toggle(mobile ? "side_open" : "side_closed");
}

document.getElementById("toggle").onclick = toggle_sidebar;

load_sidebar();
load_home();
load_section();
load_post();
