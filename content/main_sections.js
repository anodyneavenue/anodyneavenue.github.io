// content/main_sections.js

// written by Jack Bridges

/*
    This file contains the body text of the main sections for anodyne avenue.
 */


const { labels, label_descriptions } = require("./site_metadata.js");


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

        description: [label_descriptions.landing],
        content:[
            "<h1>Deep dives into topics of interest.</h1>",
            ""
        ]

    },

]