// src/site_metadata.js

// main sections of the website
const labels = {
    landing: "Landing Pad", // or maybe just Anodyne Avenue...
    about: "About",
    blog: "Blog",
    guides: "Guides",
    essays: "Essays",
    metadata: "Metadata", // subcategories inside metadata are not MAIN sections
    // maybe a pin option in the future -- make anything a main section...
    references: "References",
    archive: "Archive",
};

const label_descriptions = {
    landing: "A personal website and independent archive of essays, guides, research notes, and investigations.",
    about: "About",
    blog: "More personal and informal entries, logs, and public journals - irregular updates.",
    guides: "Structured explanations, methods, and practical notes.",
    essays: "In-depth arguments, investigations, and attempts to cover multiple perspectives of a topic - references included.",
    metadata: "Metadata",
    references: "References",
    archive: "Archive",
};

module.exports = {
    labels,
        label_descriptions,
};