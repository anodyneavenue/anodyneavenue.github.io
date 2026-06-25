// src/site_metadata.js


// >>>>>>>>>>>>>>>>>
// utility functions
// <<<<<<<<<<<<<<<<<

function breadcrumb_kicker(parts) {
    return "<a href = '" + parts.href + "'>" + parts.label + "</a>";
}

 function site_kicker() {
    return breadcrumb_kicker(
        {
            label: "ANODYNE AVENUE",
            href: "/"
        }
    );
}

// main sections of the website
const section_labels = {
    landing: "Landing Pad", // or maybe just Anodyne Avenue...
    error_404: "Error 404",
    about: "About",
    blog: "Blog",
    guides: "Guides",
    essays: "Essays",
    metadata: "Metadata", // subcategories inside metadata are not MAIN sections
    // maybe a pin option in the future -- make anything a main section...
    references: "References",
    archive: "Archive",

};

const section_label_descriptions = {
    landing: "A personal website and independent archive of essays, guides, research notes, and investigations.",
    error_404: "Error 404",
    about: "About",
    blog: "More personal and informal entries, logs, and public journals - irregular updates.",
    guides: "Structured explanations, methods, and practical notes.",
    essays: "In-depth arguments, investigations, and attempts to cover multiple perspectives of a topic - references included.",
    metadata: "Metadata",
    references: "References",
    archive: "Archive",
};

const section_content = {
    landing: [
        "",
        "<h1>Deep dives into topics of interest.</h1>",
        "",
    ],
    error_404: [
        "" + site_kicker(),
        "<h1>404</h1>",
    ],
    about: "About",
    blog: "Blog",
    guides: "Guides",
    essays: "Essays",
    metadata: "Metadata",
    references: "References",
    archive: "Archive",
}

module.exports = {
    section_labels,
    section_label_descriptions,
    section_content,
};