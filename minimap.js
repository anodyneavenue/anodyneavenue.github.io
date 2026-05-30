let locked_minimap_id = null;
let programmatic_scroll = false;
let minimap_ticking = false;
let minimap_wrap_ticking = false;
let minimap_resize_observer = null;
let minimap_position_ticking = false;
let minimap_cache_ready = false;
let active_pair_index = -1;

let minimap_user_scrolling = false;
let minimap_user_scroll_timer = null;

let cached_minimap = null;
let cached_progress_owner = null;
let cached_pairs = [];
let cached_positions = [];
let cached_page_scroll_max = 0;

function minimap_element() {
    if (cached_minimap && document.contains(cached_minimap)) {
        return cached_minimap;
    }

    cached_minimap = document.querySelector(".minimap");
    cached_progress_owner = cached_minimap
        ? cached_minimap.closest(".minimap_shell") || cached_minimap
        : null;

    return cached_minimap;
}

function minimap_items() {
    const minimap = minimap_element();

    if (!minimap) {
        return [];
    }

    return Array.from(minimap.querySelectorAll(".minimap_item"));
}

function page_scroll_max() {
    return Math.max(0, document.documentElement.scrollHeight - innerHeight);
}

function document_progress() {
    const max = page_scroll_max();

    if (max <= 0) {
        return 0;
    }

    if (scrollY >= max - 4) {
        return 1;
    }

    return Math.max(0, Math.min(1, scrollY / max));
}

function heading_top(heading) {
    return heading.getBoundingClientRect().top + scrollY;
}

function refresh_minimap_cache() {
    const minimap = minimap_element();

    if (!minimap) {
        cached_pairs = [];
        cached_positions = [];
        cached_page_scroll_max = page_scroll_max();
        minimap_cache_ready = true;
        return;
    }

    cached_pairs = minimap_items()
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
                id: id,
                item: item,
                heading: heading
            };
        })
        .filter(Boolean);

    cached_positions = cached_pairs.map(function(pair) {
        return heading_top(pair.heading);
    });

    cached_page_scroll_max = page_scroll_max();
    minimap_cache_ready = true;
}

function request_minimap_position_refresh() {
    if (minimap_position_ticking) {
        return;
    }

    minimap_position_ticking = true;

    requestAnimationFrame(function() {
        refresh_minimap_cache();
        request_minimap_update();
        minimap_position_ticking = false;
    });
}

function active_index_from_scroll() {
    if (!cached_pairs.length) {
        return -1;
    }

    const max = page_scroll_max();

    if (max > 0 && scrollY >= max - 4) {
        return cached_pairs.length - 1;
    }

    /*
      Special handling for the post title.

      The title minimap item uses id="post_title" for the non-JavaScript
      fallback anchor, while JavaScript uses data-scroll-top="true" to scroll
      to the absolute top of the page.

      Keep the title active at the top of the page, then switch into the normal
      heading sequence only after the user has scrolled meaningfully into the
      post.
    */
    if (cached_pairs[0] && cached_pairs[0].id === "post_title") {
        if (cached_pairs.length === 1) {
            return 0;
        }

        if (scrollY <= 4) {
            return 0;
        }

        const first_heading_top = cached_positions[1];
        const title_switch_point = Math.max(96, first_heading_top - innerHeight * 0.22);

        if (scrollY < title_switch_point) {
            return 0;
        }

        const cursor = scrollY + innerHeight * 0.38;

        for (let i = 1; i < cached_positions.length - 1; i = i + 1) {
            const midpoint = (cached_positions[i] + cached_positions[i + 1]) / 2;

            if (cursor < midpoint) {
                return i;
            }
        }

        return cached_positions.length - 1;
    }

    const cursor = scrollY + innerHeight * 0.38;

    for (let i = 0; i < cached_positions.length - 1; i = i + 1) {
        const midpoint = (cached_positions[i] + cached_positions[i + 1]) / 2;

        if (cursor < midpoint) {
            return i;
        }
    }

    return cached_positions.length - 1;
}

function note_minimap_user_scroll() {
    minimap_user_scrolling = true;

    clearTimeout(minimap_user_scroll_timer);

    minimap_user_scroll_timer = setTimeout(function() {
        minimap_user_scrolling = false;
    }, 220);
}

function track_active_minimap_item(minimap, item) {
    if (minimap_user_scrolling) {
        return;
    }

    const max_scroll = Math.max(0, minimap.scrollHeight - minimap.clientHeight);

    if (max_scroll <= 0) {
        return;
    }

    const item_centre = item.offsetTop + item.offsetHeight / 2;
    const target = item_centre - minimap.clientHeight / 2;

    minimap.scrollTop = Math.max(0, Math.min(max_scroll, target));
}

function progress_owner_for(minimap) {
    if (cached_progress_owner && document.contains(cached_progress_owner)) {
        return cached_progress_owner;
    }

    cached_progress_owner = minimap.closest(".minimap_shell") || minimap;
    return cached_progress_owner;
}

function set_progress(minimap) {
    progress_owner_for(minimap).style.setProperty("--progress", String(document_progress()));
}

function set_passed_pairs(active_index) {
    cached_pairs.forEach(function(pair, index) {
        pair.item.classList.toggle("passed", index <= active_index);
    });
}

function clear_passed_pairs() {
    cached_pairs.forEach(function(pair) {
        pair.item.classList.remove("passed");
    });
}

function set_active_pair(minimap, active_index) {
    const active_pair = cached_pairs[active_index];

    if (!active_pair) {
        clear_passed_pairs();
        return;
    }

    if (active_pair_index !== active_index) {
        cached_pairs.forEach(function(pair, index) {
            pair.item.classList.toggle("active", index === active_index);
        });

        active_pair_index = active_index;
    }

    set_passed_pairs(active_index);
    set_progress(minimap);
    track_active_minimap_item(minimap, active_pair.item);
}

function set_active_minimap_item() {
    const minimap = minimap_element();

    if (!minimap) {
        return;
    }

    if (!minimap_cache_ready) {
        refresh_minimap_cache();
    }

    if (!cached_pairs.length) {
        set_progress(minimap);
        return;
    }

    if (locked_minimap_id) {
        const locked_index = cached_pairs.findIndex(function(pair) {
            return pair.id === locked_minimap_id;
        });

        if (locked_index >= 0) {
            set_active_pair(minimap, locked_index);
            return;
        }
    }

    const active_index = active_index_from_scroll();

    if (active_index < 0) {
        clear_passed_pairs();
        set_progress(minimap);
        return;
    }

    set_active_pair(minimap, active_index);
}

/*
  Stable minimap heading wrapping.

  Logic:
  - get actual minimap text-box width;
  - measure each candidate line as bold text;
  - if adding the next word would overflow, force a line break before it;
  - render fixed .minimap_line spans;
  - inactive labels remain normal weight;
  - hover/active labels become bold without changing line breaks.
*/

function original_minimap_text(text_box, label) {
    const text = text_box.getAttribute("data-text");

    if (text !== null) {
        return text;
    }

    return label.textContent || "";
}

function normalise_words(text) {
    return String(text || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
}

function copy_measurement_style(source, target) {
    const style = getComputedStyle(source);

    target.style.position = "absolute";
    target.style.left = "-99999px";
    target.style.top = "0";
    target.style.visibility = "hidden";
    target.style.pointerEvents = "none";

    target.style.display = "inline-block";
    target.style.whiteSpace = "nowrap";
    target.style.boxSizing = "border-box";
    target.style.padding = "0";
    target.style.border = "0";
    target.style.margin = "0";

    target.style.fontFamily = style.fontFamily;
    target.style.fontSize = style.fontSize;
    target.style.fontStyle = style.fontStyle;
    target.style.fontVariant = style.fontVariant;
    target.style.lineHeight = style.lineHeight;
    target.style.letterSpacing = style.letterSpacing;
    target.style.textTransform = style.textTransform;

    target.style.fontWeight = "700";
}

function make_measure_node(label) {
    const measure = document.createElement("span");

    copy_measurement_style(label, measure);
    document.body.appendChild(measure);

    return measure;
}

function measured_width(measure, text) {
    measure.textContent = text;
    return measure.getBoundingClientRect().width;
}

function split_long_word_by_bold_width(measure, word, width_limit) {
    const chars = Array.from(word);
    const chunks = [];
    let current = "";

    chars.forEach(function(char) {
        const candidate = current + char;

        if (!current) {
            current = char;
            return;
        }

        if (measured_width(measure, candidate) <= width_limit) {
            current = candidate;
            return;
        }

        chunks.push(current);
        current = char;
    });

    if (current) {
        chunks.push(current);
    }

    return chunks;
}

function bold_wrapped_lines(label, text, available_width) {
    const words = normalise_words(text);

    if (!words.length || !document.body) {
        return [String(text || "")];
    }

    const width_limit = Math.max(1, Math.floor(available_width) - 1);
    const measure = make_measure_node(label);

    const lines = [];
    let current = "";

    function push_word(word) {
        if (!current) {
            if (measured_width(measure, word) <= width_limit) {
                current = word;
                return;
            }

            split_long_word_by_bold_width(measure, word, width_limit).forEach(function(chunk) {
                lines.push(chunk);
            });

            return;
        }

        const candidate = current + " " + word;

        if (measured_width(measure, candidate) <= width_limit) {
            current = candidate;
            return;
        }

        lines.push(current);
        current = "";
        push_word(word);
    }

    words.forEach(push_word);

    if (current) {
        lines.push(current);
    }

    measure.remove();

    return lines.length ? lines : [String(text || "")];
}

function current_rendered_lines(label) {
    return Array.from(label.querySelectorAll(".minimap_line")).map(function(line) {
        return line.textContent;
    });
}

function same_lines(a, b) {
    if (a.length !== b.length) {
        return false;
    }

    return a.every(function(value, index) {
        return value === b[index];
    });
}

function render_lines(label, lines) {
    if (same_lines(current_rendered_lines(label), lines)) {
        return;
    }

    label.replaceChildren();

    lines.forEach(function(line) {
        const span = document.createElement("span");
        span.className = "minimap_line";
        span.textContent = line;
        label.appendChild(span);
    });
}

function prepare_one_minimap_label(text_box, force) {
    const label = text_box.querySelector(".minimap_label");

    if (!label) {
        return;
    }

    const width = text_box.getBoundingClientRect().width;

    if (width <= 0) {
        return;
    }

    const width_key = String(Math.floor(width));
    const text = original_minimap_text(text_box, label);
    const text_key = text;

    if (
        !force &&
        text_box.dataset.wrapWidth === width_key &&
        text_box.dataset.wrapText === text_key &&
        label.querySelector(".minimap_line")
    ) {
        return;
    }

    const lines = bold_wrapped_lines(label, text, width);

    render_lines(label, lines);
    text_box.dataset.wrapWidth = width_key;
    text_box.dataset.wrapText = text_key;
}

function prepare_minimap_label_wraps(force) {
    document.querySelectorAll(".minimap_text").forEach(function(text_box) {
        prepare_one_minimap_label(text_box, force === true);
    });
}

function request_minimap_wrap_update(force) {
    if (minimap_wrap_ticking) {
        return;
    }

    minimap_wrap_ticking = true;

    requestAnimationFrame(function() {
        prepare_minimap_label_wraps(force === true);
        refresh_minimap_cache();
        request_minimap_update();
        minimap_wrap_ticking = false;
    });
}

function observe_minimap_widths() {
    if (!("ResizeObserver" in window)) {
        return;
    }

    if (minimap_resize_observer) {
        minimap_resize_observer.disconnect();
    }

    minimap_resize_observer = new ResizeObserver(function() {
        request_minimap_wrap_update(false);
    });

    document.querySelectorAll(".minimap_text").forEach(function(text_box) {
        minimap_resize_observer.observe(text_box);
    });
}

function activate_clicked_item(item) {
    const index = cached_pairs.findIndex(function(pair) {
        return pair.item === item;
    });

    if (index >= 0) {
        set_active_pair(minimap_element(), index);
        return;
    }

    minimap_items().forEach(function(other) {
        other.classList.toggle("active", other === item);
    });
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

    if (!minimap_cache_ready) {
        refresh_minimap_cache();
    }

    if (item.dataset.scrollTop === "true") {
        event.preventDefault();

        locked_minimap_id = id;
        programmatic_scroll = true;
        minimap_user_scrolling = false;

        activate_clicked_item(item);

        if (matchMedia("(max-width: 760px)").matches) {
            document.body.classList.remove("side_open");
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        history.replaceState(null, "", location.pathname);

        setTimeout(function() {
            programmatic_scroll = false;
            refresh_minimap_cache();
            set_active_minimap_item();
        }, 900);

        return;
    }

    const heading = document.getElementById(id);

    if (!heading) {
        return;
    }

    event.preventDefault();

    locked_minimap_id = id;
    programmatic_scroll = true;
    minimap_user_scrolling = false;

    activate_clicked_item(item);

    if (matchMedia("(max-width: 760px)").matches) {
        document.body.classList.remove("side_open");
    }

    heading.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    history.replaceState(null, "", "#" + encodeURIComponent(id));

    setTimeout(function() {
        programmatic_scroll = false;
        refresh_minimap_cache();
        set_active_minimap_item();
    }, 900);
}

function event_started_in_minimap(event) {
    const target = event && event.target;

    if (!target || !target.closest) {
        return false;
    }

    return Boolean(target.closest(".minimap"));
}

function unlock_minimap_from_user_scroll(event) {
    if (programmatic_scroll) {
        return;
    }

    if (event_started_in_minimap(event)) {
        note_minimap_user_scroll();
        return;
    }

    locked_minimap_id = null;
    request_minimap_update();
}

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

const minimap = minimap_element();

minimap?.addEventListener("click", scroll_to_heading);
minimap?.addEventListener("wheel", note_minimap_user_scroll, { passive: true });
minimap?.addEventListener("touchmove", note_minimap_user_scroll, { passive: true });
minimap?.addEventListener("pointerdown", note_minimap_user_scroll, { passive: true });

refresh_minimap_cache();

document.addEventListener("scroll", request_minimap_update, { passive: true });

document.addEventListener("wheel", unlock_minimap_from_user_scroll, { passive: true });
document.addEventListener("touchmove", unlock_minimap_from_user_scroll, { passive: true });

document.addEventListener("keydown", function(event) {
    const scroll_keys = [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " "
    ];

    if (scroll_keys.includes(event.key)) {
        unlock_minimap_from_user_scroll(event);
    }
});

addEventListener("resize", function() {
    request_minimap_wrap_update(false);
    request_minimap_position_refresh();
});

addEventListener("load", function() {
    prepare_minimap_label_wraps(true);
    observe_minimap_widths();
    refresh_minimap_cache();
    set_active_minimap_item();
});

if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function() {
        request_minimap_wrap_update(true);
    });
}

if ("onscrollend" in window) {
    document.addEventListener("scrollend", function() {
        refresh_minimap_cache();
        set_active_minimap_item();
    });
}

prepare_minimap_label_wraps(true);
observe_minimap_widths();
refresh_minimap_cache();
set_active_minimap_item();
