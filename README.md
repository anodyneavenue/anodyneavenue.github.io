# Anodyne Avenue
Pseudonym.

```text
anodyneavenue.github.io
```

## Structure
```text
index.html      website landing page
section.html    reusable page for website sections
post.html       reusable page for individual posts
archive.html    full archive of all posts
posts.js        post data
script.js       rendering, filtering, and the sidebar's logic
style.css       visual layout and responsive behaviour
README.md       project notes!
```

## Sections
```text
Essays    _
Guides    _
Blog      _
Archive   all published posts in date order
```

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
  body: '
    <p>Post body here.</p>
  '
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

## Copyright
anodyne avenue ©
