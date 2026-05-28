let locked_minimap_id = null;
let programmatic_scroll = false;
let minimap_ticking = false;
let minimap_wrap_ticking = false;
let minimap_resize_observer = null;

let minimap_user_scrolling = false;
let minimap_user_scroll_timer = null;

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

            if (id === "page_top") {
                return {
                    id: id,
                    item: item,
                    heading: document.body
                };
            }

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

    /*
      Special handling for the post title.

      The title minimap item uses id="page_top". If we let the normal midpoint
      logic run, the first real heading can become active too early because the
      title is treated as being at scroll position 0.

      Instead:
      - keep the title active while the first real heading is still comfortably
        below the upper part of the viewport;
      - switch to normal heading logic once the first real heading approaches.
    */
    if (pairs[0] && pairs[0].id === "page_top") {
        if (pairs.length === 1) {
            return 0;
        }

        const first_heading_top = heading_top(pairs[1].heading);
        const title_switch_point = Math.max(0, first_heading_top - innerHeight * 0.22);

        if (scrollY < title_switch_point) {
            return 0;
        }

        const cursor = scrollY + innerHeight * 0.38;
        const positions = pairs.map(function(pair) {
            return heading_top(pair.heading);
        });

        for (let i = 1; i < positions.length - 1; i = i + 1) {
            const midpoint = (positions[i] + positions[i + 1]) / 2;

            if (cursor < midpoint) {
                return i;
            }
        }

        return positions.length - 1;
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

function note_minimap_user_scroll() {
    minimap_user_scrolling = true;

    clearTimeout(minimap_user_scroll_timer);

    minimap_user_scroll_timer = setTimeout(function() {
        minimap_user_scrolling = false;
    }, 220);
}

function keep_active_item_visible(minimap, item) {
    if (minimap_user_scrolling) {
        return;
    }

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

function set_active_pair(minimap, pairs, active_pair) {
    if (!active_pair) {
        return;
    }

    pairs.forEach(function(pair) {
        pair.item.classList.toggle("active", pair === active_pair);
    });

    minimap.style.setProperty("--progress", String(document_progress()));
    keep_active_item_visible(minimap, active_pair.item);
}

function set_active_minimap_item() {
    const minimap = document.querySelector(".minimap");
    const pairs = minimap_pairs();

    if (!minimap || !pairs.length) {
        return;
    }

    if (locked_minimap_id) {
        const locked_pair = pairs.find(function(pair) {
            return pair.id === locked_minimap_id;
        });

        if (locked_pair) {
            set_active_pair(minimap, pairs, locked_pair);
            return;
        }
    }

    const active_index = active_index_from_scroll(pairs);

    if (active_index < 0) {
        return;
    }

    set_active_pair(minimap, pairs, pairs[active_index]);
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

function prepare_one_minimap_label(text_box) {
    const label = text_box.querySelector(".minimap_label");

    if (!label) {
        return;
    }

    const width = text_box.getBoundingClientRect().width;

    if (width <= 0) {
        return;
    }

    const text = original_minimap_text(text_box, label);
    const lines = bold_wrapped_lines(label, text, width);

    render_lines(label, lines);
}

function prepare_minimap_label_wraps() {
    document.querySelectorAll(".minimap_text").forEach(prepare_one_minimap_label);
}

function request_minimap_wrap_update() {
    if (minimap_wrap_ticking) {
        return;
    }

    minimap_wrap_ticking = true;

    requestAnimationFrame(function() {
        prepare_minimap_label_wraps();
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
        request_minimap_wrap_update();
    });

    document.querySelectorAll(".minimap_text").forEach(function(text_box) {
        minimap_resize_observer.observe(text_box);
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

    if (id === "page_top") {
        event.preventDefault();

        locked_minimap_id = id;
        programmatic_scroll = true;
        minimap_user_scrolling = false;

        minimap_items().forEach(function(other) {
            other.classList.toggle("active", other === item);
        });

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

    minimap_items().forEach(function(other) {
        other.classList.toggle("active", other === item);
    });

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
        set_active_minimap_item();
    }, 900);
}

function unlock_minimap_from_user_scroll(event) {
    if (programmatic_scroll) {
        return;
    }

    if (event && event.target.closest(".minimap")) {
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

const minimap = document.querySelector(".minimap");

minimap?.addEventListener("click", scroll_to_heading);
minimap?.addEventListener("wheel", note_minimap_user_scroll, { passive: true });
minimap?.addEventListener("touchmove", note_minimap_user_scroll, { passive: true });
minimap?.addEventListener("pointerdown", note_minimap_user_scroll, { passive: true });

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
    request_minimap_wrap_update();
    request_minimap_update();
});

addEventListener("load", function() {
    prepare_minimap_label_wraps();
    observe_minimap_widths();
    set_active_minimap_item();
});

if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function() {
        request_minimap_wrap_update();
    });
}

if ("onscrollend" in window) {
    document.addEventListener("scrollend", set_active_minimap_item);
}

prepare_minimap_label_wraps();
observe_minimap_widths();
set_active_minimap_item();