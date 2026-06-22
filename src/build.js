// src/build.js

// written by Jack Bridges

/*
    Welcome!

    This file:
        >> builds the static web-pages

    How?
        >> starts off with the website build material - sections, external links, etc... -

 */


// >>>>>>>
// Imports
// <<<<<<<

const posts = require("content/posts.js");

// urls
const website_url = "https://anodyneavenue.github.io";
const coffee_support_url = "https://buymeacoffee.com/anodyneavenue";

// version control
const version_file = "src/version.txt" // A.B.YY.MM.DD.N - maybe A.B.YYYY.MM.DD.N instead? Not important right now
let current_build_version = "";

function padding_2(x){
    return String(x).padStart(2,"0"); // max number is 2, so 2026 -> 2026, 5 -> 05, etc... CHECK!
}

function build_version(){
    const build_date = new Date();

    return [
        padding_2(build_date.getFullYear() % 100), // i.e 2026 -> 26
        padding_2(1 + build_date.getMonth()), // months 0 -> 11, so + 1: 11 -> 12
        padding_2(build_date.getDate()),
    ].join(".") // essentially, YY.MM.DD
}


// >>>>>>>>>>>>>>>>>>>>>>
// generic build material
// <<<<<<<<<<<<<<<<<<<<<<

// main sections of the website
const section_labels = {
    landing: "Landing Pad", // or maybe just Anodyne Avenue...
    about: "About",
    blog: "Blog",
    guides: "Guides",
    essays: "Essays",
    metadata: "Metadata", // subcategories inside metadata are not MAIN sections
    // maybe a pin option in the feature -- make anything a main section...
    references: "References",
    archive: "Archive",
};

const post_type_order = ["Blog", "Guides", "Essays", "References"];




// >>>>>>>>>>>>>>>>>>>>>>
// Reference section page
// <<<<<<<<<<<<<<<<<<<<<<





// >>>>>
// Build
// <<<<<

function write_file(file, content){

}

function build_landing_page(items) {

    write_file("index.html",)
}