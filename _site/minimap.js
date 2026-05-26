function minimap_items() {
    return Array.from(document.querySelectorAll(".minimap_item"));
}

function minimap_pairs() {
    return minimap_items()
        .map(function(item) {
            const href = item.getAttribute("href");

            if (!href || !href.startsWith("#")) {
                return null;
            }

            const id = decodeURIComponent(href.slice(1));
            const heading = document.getElementById(id);

            if (!heading) {
                return null;
            }

            return {
                item: item,
                heading: heading
            };
        })
        .filter(Boolean);
}

function page_scroll_max() {
    return Math.max(0, document.documentElement.scrollHeight - innerHeight);
}

function document_progress() {
    const max = page_scroll_max();

    if (max <= 0) {
        return 0;
    }

    return Math.max(0, Math.min(1, scrollY / max));
}

function keep_active_item_visible(minimap, item) {
    const top = item.offsetTop;
    const bottom = top + item.offsetHeight;

    if (top < minimap.scrollTop) {
        minimap.scrollTop = top;
        return;
    }

    if (bottom > minimap.scrollTop + minimap.clientHeight) {
        minimap.scrollTop = bottom - minimap.clientHeight;
    }
}

function active_pair_from_scroll(pairs) {
    const max = page_scroll_max();
    const near_bottom = max > 0 && scrollY >= max - 8;

    if (near_bottom) {
        return pairs[pairs.length - 1];
    }

    const marker = scrollY + 100;
    let active_pair = pairs[0];

    pairs.forEach(function(pair) {
        if (pair.heading.offsetTop <= marker) {
            active_pair = pair;
        }
    });

    return active_pair;
}

function set_active_pair(active_pair) {
    const minimap = document.querySelector(".minimap");
    const pairs = minimap_pairs();

    if (!minimap || !pairs.length || !active_pair) {
        return;
    }

    pairs.forEach(function(pair) {
        pair.item.classList.toggle("active", pair.item === active_pair.item);
    });

    minimap.style.setProperty("--progress", document_progress());
    keep_active_item_visible(minimap, active_pair.item);
}

function set_active_minimap_item() {
    const minimap = document.querySelector(".minimap");
    const pairs = minimap_pairs();

    if (!minimap || !pairs.length) {
        return;
    }

    set_active_pair(active_pair_from_scroll(pairs));
}

function scroll_to_heading(event) {
    const item = event.target.closest(".minimap_item");

    if (!item) {
        return;
    }

    const href = item.getAttribute("href");

    if (!href || !href.startsWith("#")) {
        return;
    }

    const id = decodeURIComponent(href.slice(1));
    const heading = document.getElementById(id);

    if (!heading) {
        return;
    }

    event.preventDefault();

    item.classList.add("active");

    minimap_items().forEach(function(other) {
        if (other !== item) {
            other.classList.remove("active");
        }
    });

    heading.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    history.replaceState(null, "", "#" + encodeURIComponent(id));

    setTimeout(set_active_minimap_item, 350);
    setTimeout(set_active_minimap_item, 700);
}

let minimap_ticking = false;

function request_minimap_update() {
    if (minimap_ticking) {
        return;
    }

    minimap_ticking = true;

    requestAnimationFrame(function() {
        set_active_minimap_item();
        minimap_ticking = false;
    });
}

document.querySelector(".minimap")?.addEventListener("click", scroll_to_heading);
document.addEventListener("scroll", request_minimap_update, { passive: true });
addEventListener("resize", request_minimap_update);
addEventListener("load", set_active_minimap_item);

set_active_minimap_item();