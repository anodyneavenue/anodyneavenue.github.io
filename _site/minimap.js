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

function heading_top(heading) {
    return heading.getBoundingClientRect().top + scrollY;
}

function active_index_from_scroll(pairs) {
    if (!pairs.length) {
        return -1;
    }

    const max = page_scroll_max();

    if (max > 0 && scrollY >= max - 4) {
        return pairs.length - 1;
    }

    const cursor = scrollY + innerHeight * 0.38;
    const positions = pairs.map(function(pair) {
        return heading_top(pair.heading);
    });

    for (let i = 0; i < positions.length - 1; i = i + 1) {
        const midpoint = (positions[i] + positions[i + 1]) / 2;

        if (cursor < midpoint) {
            return i;
        }
    }

    return positions.length - 1;
}

function keep_active_item_visible(minimap, item) {
    const top = item.offsetTop;
    const bottom = top + item.offsetHeight;
    const buffer = 12;

    if (top < minimap.scrollTop + buffer) {
        minimap.scrollTop = Math.max(0, top - buffer);
        return;
    }

    if (bottom > minimap.scrollTop + minimap.clientHeight - buffer) {
        minimap.scrollTop = bottom - minimap.clientHeight + buffer;
    }
}

function set_active_minimap_item() {
    const minimap = document.querySelector(".minimap");
    const pairs = minimap_pairs();

    if (!minimap || !pairs.length) {
        return;
    }

    const active_index = active_index_from_scroll(pairs);

    if (active_index < 0) {
        return;
    }

    const active_pair = pairs[active_index];

    pairs.forEach(function(pair) {
        pair.item.classList.toggle("active", pair === active_pair);
    });

    minimap.style.setProperty("--progress", document_progress());
    keep_active_item_visible(minimap, active_pair.item);
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

    minimap_items().forEach(function(other) {
        other.classList.toggle("active", other === item);
    });

    heading.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    history.replaceState(null, "", "#" + encodeURIComponent(id));

    setTimeout(set_active_minimap_item, 250);
    setTimeout(set_active_minimap_item, 600);
    setTimeout(set_active_minimap_item, 1000);
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

if ("onscrollend" in window) {
    document.addEventListener("scrollend", set_active_minimap_item);
}

set_active_minimap_item();