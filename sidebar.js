const sidebar_key = "anodyne_sidebar_closed";

const mobile_query = matchMedia("(max-width: 760px)");
const pre_mobile_query = matchMedia("(max-width: 795px)");

let desktop_sidebar_was_open_before_mobile = false;

function mobile_screen() {
  return mobile_query.matches;
}

function save_sidebar_state() {
  localStorage.setItem(
      sidebar_key,
      document.body.classList.contains("side_closed") ? "1" : "0"
  );
}

function restore_sidebar_state() {
  if (mobile_screen()) {
    return;
  }

  if (localStorage.getItem(sidebar_key) === "1") {
    document.body.classList.add("side_closed");
    document.body.classList.remove("side_open");
  }
}

function close_sidebar() {
  document.body.classList.add("side_closed");
  document.body.classList.remove("side_open");
  save_sidebar_state();
}

function open_sidebar() {
  document.body.classList.remove("side_closed");
  document.body.classList.remove("side_open");
  save_sidebar_state();
}

function toggle_sidebar() {
  if (mobile_screen()) {
    document.body.classList.toggle("side_open");
    return;
  }

  if (document.body.classList.contains("side_closed")) {
    open_sidebar();
    return;
  }

  close_sidebar();
}

function close_mobile_sidebar(event) {
  if (!mobile_screen()) {
    return;
  }

  if (!document.body.classList.contains("side_open")) {
    return;
  }

  if (event.target.closest("#sidebar") || event.target.closest("#toggle")) {
    return;
  }

  document.body.classList.remove("side_open");
}

function close_mobile_sidebar_after_internal_link(event) {
  if (!mobile_screen()) {
    return;
  }

  if (!document.body.classList.contains("side_open")) {
    return;
  }

  const link = event.target.closest("#sidebar a[href^='#']");

  if (!link) {
    return;
  }

  document.body.classList.remove("side_open");
}

function handle_pre_mobile_change(event) {
  /*
    Desktop -> near-mobile:
    remember whether the desktop sidebar was open,
    then close it before the CSS switches to full-screen mobile.
  */
  if (event.matches && !mobile_screen()) {
    desktop_sidebar_was_open_before_mobile =
        !document.body.classList.contains("side_closed");

    document.body.classList.add("side_closed");
    document.body.classList.remove("side_open");
    return;
  }

  /*
    Near-mobile -> wider desktop:
    if it was open before being force-collapsed,
    restore it.
  */
  if (!event.matches && !mobile_screen() && desktop_sidebar_was_open_before_mobile) {
    document.body.classList.remove("side_closed");
    document.body.classList.remove("side_open");
    desktop_sidebar_was_open_before_mobile = false;
    save_sidebar_state();
  }
}

function handle_breakpoint_change(event) {
  const is_mobile = event.matches;

  /*
    Desktop -> mobile:
    mobile sidebar starts closed.
  */
  if (is_mobile) {
    document.body.classList.remove("side_open");
    return;
  }

  /*
    Mobile -> desktop:
    if the mobile sidebar is open, OR if the desktop sidebar was open
    before being force-collapsed, restore the normal desktop sidebar.
  */
  if (
      document.body.classList.contains("side_open") ||
      desktop_sidebar_was_open_before_mobile
  ) {
    document.body.classList.remove("side_open");
    document.body.classList.remove("side_closed");
    desktop_sidebar_was_open_before_mobile = false;
    save_sidebar_state();
  }
}


function current_sidebar_key_from_pathname(pathname) {
  const path = String(pathname || "/").replace(/\/+$/, "") || "/";

  if (path === "/posts/about.html" || path === "/posts/about") {
    return "about";
  }

  if (path === "/archive.html" || path === "/archive") {
    return "archive";
  }

  if (path === "/metadata/tags.html" || path === "/metadata/tags") {
    return "tags";
  }

  if (path.startsWith("/metadata/tags/")) {
    return "tags";
  }

  if (path === "/metadata/type/essays.html" || path === "/metadata/type/essays") {
    return "essays";
  }

  if (path === "/metadata/type/guides.html" || path === "/metadata/type/guides") {
    return "guides";
  }

  if (path === "/metadata/type/blog.html" || path === "/metadata/type/blog") {
    return "blog";
  }

  return "";
}

function highlight_sidebar_link() {
  const sidebar = document.getElementById("sidebar");

  if (!sidebar) {
    return;
  }

  const generated_key = document.body.dataset.activeSidebar || "";
  const fallback_key = current_sidebar_key_from_pathname(location.pathname);
  const active_key = generated_key || fallback_key;

  sidebar.querySelectorAll(".sidebar_nav a").forEach(function(link) {
    const active = active_key && link.dataset.sidebarKey === active_key;

    link.classList.toggle("active", Boolean(active));

    if (active) {
      link.setAttribute("aria-current", "page");
      return;
    }

    link.removeAttribute("aria-current");
  });
}



restore_sidebar_state();
highlight_sidebar_link();

document.getElementById("toggle")?.addEventListener("click", toggle_sidebar);

document.addEventListener("click", close_mobile_sidebar_after_internal_link, true);
document.addEventListener("click", close_mobile_sidebar);

mobile_query.addEventListener("change", handle_breakpoint_change);
pre_mobile_query.addEventListener("change", handle_pre_mobile_change);