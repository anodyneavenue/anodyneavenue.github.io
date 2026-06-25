// src/build.js

// written by Jack Bridges

/*
    Welcome!

    This file:
        >> builds the static web-pages

    How?
        >> starts off with the website build material - sections, external links, etc... -

 */


// >>>>>>>>>>>>>>
// Imports + URLs + ...
// <<<<<<<<<<<<<<

const path = require("path");
const posts = require("../content/posts.js");
// const main_sections = require("../content/main_sections.js");
const fs = require("node:fs");
const {section_labels, section_label_descriptions} = require("../content/site_metadata.js");
const {section_content} = require("../content/site_metadata");

const root = path.join(__dirname, "..")
const output = path.join(root, "_site");

// urls
const website_url = "https://anodyneavenue.github.io";
const coffee_support_url = "https://buymeacoffee.com/anodyneavenue";

// version control
const version_file = "src/version.txt" // A.B.YY.MM.DD.N - maybe A.B.YYYY.MM.DD.N instead? Not important right now
let current_build_version = "";

function padding_2(x){
    // padding function for continuity in version formatting
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

function lines(parts) { // turns an array of html lines into one string of html
    return parts.filter( // parts is passed in and the blank lines are removed
        function(line) {
            return line !== "";

        }
    ).join("\n");
} // maybe add + "\n" - makes no difference however it's cleaner


// html_shell is the framework of each web-page on the site
// all are parsed inside and their content turned into html
function html_shell(entries) {
    const shell_title = entries.title;
    const shell_description = entries.description || "";
    const shell_content = Array.isArray(entries.content) ? entries.content.join("\n"):
        entries.content || "";

    return lines([
        "<!DOCTYPE html>",
        "<html lang ='en-GB'>",
        "<head>",
        "<meta charset = 'utf-8'>",
        "<meta name = 'viewport' content = 'width = device-width, initial-scale = 1'>",
        "<title>" + shell_title + "</title>",
        "<meta name = 'description' content = '" + shell_description + "'>",
        "</head>",
        "<body>",
        "<main>",
        shell_content,
        "</main>",
        "</body>",
        "</html>",
    ])
}

function write_file(file, content){
    const whole_path = path.join(output, file);
    const html_file = /\.html$/i.test(file); // this will be true if file ends in .html or .HTML; /i means case-insensitive

    fs.mkdirSync(path.dirname(whole_path), { recursive: true }); // creates the folder that contains whole_path, and if the parent folders don't exist - makes them also
    fs.writeFileSync(whole_path, content.trimStart(), "utf8");
}


// >>>>>>>>>>>>
// landing page
// <<<<<<<<<<<<

function build_landing_page() {

    write_file("index.html", html_shell({
        title: section_labels.landing,
        description: section_label_descriptions.landing,
        content: section_content.landing,

        })
    );
}

// >>>>>>>>
// 404 page
// <<<<<<<<<

function build_404() {
    write_file("404.html", html_shell({
        title: section_labels.error_404,
        description: section_label_descriptions.error_404,
        content: section_content.error_404,
    }))
}


// >>>>>>>>>>>>>
// Metadata Page
// <<<<<<<<<<<<<

// fyi: a "section" is defined as a form of metadata
// a page is just a page - it's just a sub of the root

const post_type_order = ["Blog", "Guides", "Essays", "References"];





// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Type Sections (minus reference)
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<









// >>>>>>>>>>>>>>>>>
// Reference Section
// <<<<<<<<<<<<<<<<<





// >>>>>>>>>>>>
// Archive page
// <<<<<<<<<<<<



// >>>>>
// Build
// <<<<<


function build(){
    build_landing_page()
    build_404()
}

build() // built!!! woo!