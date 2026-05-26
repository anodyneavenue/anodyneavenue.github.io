function mobile_screen() {
  return matchMedia("(max-width: 760px)").matches;
}

function sidebar_width() {
  const sidebar = document.getElementById("sidebar");

  if (!sidebar) {
    return 0;
  }

  return sidebar.getBoundingClientRect().width;
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

  if (document.body.classList.contains("side_closed") && !sidebar_fits()) {
    return;
  }

  document.body.classList.toggle("side_closed");
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

function check_sidebar_size() {
  if (mobile_screen()) {
    return;
  }

  if (!sidebar_fits()) {
    close_sidebar();
  }
}

function go_back() {
  if (history.length > 1) {
    history.back();
    return;
  }

  location.href = "/index.html";
}

document.getElementById("toggle")?.addEventListener("click", toggle_sidebar);

document.querySelectorAll(".back").forEach(function(item) {
  item.addEventListener("click", go_back);
});

document.addEventListener("click", close_mobile_sidebar);
addEventListener("resize", check_sidebar_size);

check_sidebar_size();
