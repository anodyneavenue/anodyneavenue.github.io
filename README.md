# Anodyne Avenue

Pseudonym.

```text
anodyneavenue.github.io
```

## Structure

```text
index.html      landing page with latest posts
section.html    reusable page for Essays, Guides, and Blog
post.html       reusable page for individual posts
archive.html    full archive of all posts
posts.js        post data and article bodies
script.js       rendering, filtering, sidebar logic
style.css       visual layout and responsive behaviour
README.md       project notes
```

## Sections

```text
Essays    long-form arguments, investigations, and reflections
Guides    structured explanations, methods, and practical notes
Blog      shorter entries, fragments, logs, and updates
Archive   all published posts in date order
```

## Behaviour

- The landing page shows the latest 3 posts.
- The archive shows all posts, including older editions.
- Section pages only show the latest edition when multiple posts have the same title.
- Posts are ordered by date, newest first.
- The sidebar can be collapsed.
- On mobile, tapping outside the sidebar closes it.
- The site uses no contact section and no personal identity details.

## Adding a post

Add a new object inside the `posts` array in `posts.js`:

```js
{
  slug: "example_post",
  title: "Example Post",
  type: "essays",
  date: "2026-05-25",
  edition: "1st edition",
  abstract: "Short abstract here.",
  body: `
    <p>Post body here.</p>
  `
}
```

Valid `type` values:

```text
essays
guides
blog
```

## Editions

To publish a new edition, add a new post with the same `title` and `type`, but with a newer `date`, different `slug`, and updated `edition`.

Example:

```js
{
  slug: "example_post_first",
  title: "Example Post",
  type: "essays",
  date: "2025-01-01",
  edition: "1st edition",
  abstract: "Old version.",
  body: `
    <p>Old body.</p>
  `
},
{
  slug: "example_post_second",
  title: "Example Post",
  type: "essays",
  date: "2026-01-01",
  edition: "2nd edition",
  abstract: "New version.",
  body: `
    <p>New body.</p>
  `
}
```

The section page will show only the newer edition. The archive will show both.

## Deployment

This site is designed for GitHub Pages.

Repository name:

```text
anodyneavenue.github.io
```

GitHub Pages settings:

```text
Settings → Pages → Deploy from branch → main → /root
```

Live site:

```text
https://anodyneavenue.github.io
```

## Copyright

```text
anodyne avenue ©
```
