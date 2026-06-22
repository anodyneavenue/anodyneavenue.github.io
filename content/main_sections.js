// content/main_sections.js

// written by Jack Bridges

/*
    This file contains the body text of the main sections for anodyne avenue.
 */

const section_descriptions = {
    landing: "A personal website and independent archive of essays, guides, research notes, and investigations.",
    about: "About",
    blog: "More personal and informal entries, logs, and public journals - irregular updates.",
    guides: "Structured explanations, methods, and practical notes.",
    essays: "In-depth arguments, investigations, and attempts to cover multiple perspectives of a topic - references included.",
    metadata: "Metadata",
    references: "References",
    archive: "Archive",
};


//
function html(rows){
    return rows.join("")
}



// >>>>>
// Main sections
// <<<<<

const posts = [
    {
        title: "anodyne avenue",

        description: [section_descriptions.landing],
        content:[
            "<h1>Deep dives into topics of interest.</h1>",
            ""
        ]

    },

    {
        slug: "test",
        title: "Test",

        body: html([

        ])
    },

]