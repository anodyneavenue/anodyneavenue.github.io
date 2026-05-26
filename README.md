# Anodyne Avenue

Pseudonym.

anodyneavenue.github.io

## Purpose

An anonymous, text-first archive of essays, guides, and blog posts.

The site is deliberately minimal, quiet, black-and-white, and archive-like.

## Structure

posts.js        post source data
build.js        static site generator
sidebar.js      sidebar interaction only
style.css       visual layout and responsive behaviour
index.html      generated landing page
essays.html     generated essays section
guides.html     generated guides section
blog.html       generated blog section
archive.html    generated archive page
tags.html       generated tags page
posts/          generated post pages
tag/            generated tag pages
README.md       project notes

## Sections

Essays
Guides
Blog
Archive
Tags

## Behaviour

The site is statically generated.

Page content is written directly into the generated HTML files.

The browser does not need client-side JavaScript to show posts, sections, archive pages, tag pages, or individual post content.

sidebar.js only controls the collapsible sidebar, mobile outside-click closing, auto-collapse behaviour, and the back button.

## Adding a post

Add a new object inside the posts array in posts.js.

Example:

{
  slug: "example_post",
  title: "Example Post",
  type: "essays",
  date: "2026-05-25",
  revised: "2026-05-26",
  edition: "1st edition",
  tags: ["example", "notes"],
  abstract: "Short abstract here.",
  body:
    '<p>Post body here.</p>'
}

Valid type values:

essays
guides
blog

revised is optional.

If present, it displays as:

revised YYYY-MM-DD

tags is optional, but should be an array when used.

## Editions

To publish a new edition, add a new post with the same title and type, but with:

new slug
newer date
new edition
updated body

Section pages show only the latest edition of a post.

The archive shows all editions.

Tag pages show the latest edition only.

## Build

After editing posts.js, run:

node build.js

or:

npm run build

Then commit the generated HTML files.

## Deployment

This is a plain GitHub Pages site.

The generated files are committed directly to the repository.

## Copyright

anodyne avenue ©

## Commands

Run this locally after adding the files:

node build.js

This generates:

index.html
essays.html
guides.html
blog.html
archive.html
tags.html
posts/a.html
tag/test.html
tag/short_form.html

It also removes the old files if present:

script.js
post.html
section.html
