function minimap_items() {
    return Array.from(document.querySelectorAll(".minimap_item"));
}

function heading_for_item(item) {
    const id = item.getAttribute("href").slice(1);
    return document.getElementById(id);
}

function set_active_minimap_item() {
    const items = minimap_items();

    if (!items.length) {
        return;
    }

    let active = items[0];

    items.forEach(function(item) {
        const heading = heading_for_item(item);

        if (!heading) {
            return;
        }

        if (heading.getBoundingClientRect().top <= 120) {
            active = item;
        }
    });

    items.forEach(function(item) {
        item.classList.toggle("active", item === active);
    });
}

document.addEventListener("scroll", set_active_minimap_item, { passive: true });
addEventListener("resize", set_active_minimap_item);

set_active_minimap_item();