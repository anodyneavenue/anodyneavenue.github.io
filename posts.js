function escape_attr(value) {
  return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
}

function html(parts) {
  return parts.join("");
}

function math_inline(tex) {
  return '<span class="math_source math_inline_source" data-tex="' + escape_attr(tex) + '"></span>';
}

function math_display(tex, label) {
  return '<figure class="math_source math_display_source" data-tex="' + escape_attr(tex) + '" data-label="' + escape_attr(label || "") + '"></figure>';
}

const show_debug_posts = false;

function debug_show(value) {
  return show_debug_posts === true ? true : value === true;
}

function unique_values(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function debug_post(config) {
  return Object.assign(
      {
        show: debug_show(false),
        edition: "debug",
        status: "debug",
        debug: true
      },
      config,
      {
        title: "[DEBUG] " + config.title,
        tags: unique_values(["debug"].concat(config.tags || []))
      }
  );
}

function debug_untagged_post(config) {
  return Object.assign(
      {
        show: debug_show(false),
        edition: "debug",
        status: "debug",
        debug: true
      },
      config,
      {
        title: "[DEBUG] " + config.title
      }
  );
}

function debug_paragraph(seed, count) {
  const sentence = "Debug paragraph " + seed + " checks spacing, wrapping, reading rhythm, generated metadata, post navigation, archive cards, and long-page behaviour under repeated content pressure.";

  return Array.from({ length: count }, function(_, index) {
    return '<p>' + sentence + ' Segment ' + (index + 1) + '.</p>';
  }).join("");
}

function debug_sections(prefix, count, level) {
  const heading_level = level || 2;

  return Array.from({ length: count }, function(_, index) {
    const n = index + 1;
    return '<h' + heading_level + '>' + prefix + ' section ' + n + '</h' + heading_level + '>' +
        '<p>This generated debug section exists to stress heading extraction, minimap generation, anchor creation, active-state tracking, and internal scrolling.</p>';
  }).join("");
}

function debug_mixed_sections(prefix, count) {
  return Array.from({ length: count }, function(_, index) {
    const n = index + 1;
    const level = index % 5 === 0 ? 2 : index % 3 === 0 ? 4 : 3;

    return '<h' + level + '>' + prefix + ' mixed heading ' + n + '</h' + level + '>' +
        '<p>This heading intentionally alternates between h2, h3, and h4 levels.</p>';
  }).join("");
}

function debug_long_word(seed, repeats) {
  return Array.from({ length: repeats }, function() {
    return seed;
  }).join("");
}

function debug_formula_series(count) {
  return Array.from({ length: count }, function(_, index) {
    const n = index + 1;

    return '<h2>Formula set ' + n + '</h2>' +
        '<p>Inline formula ' + math_inline('E_{' + n + '} = mc^2') + ' appears inside a generated paragraph.</p>' +
        math_display('\\int_0^{' + n + '} x^2\\,\\mathrm{d}x = \\frac{' + n + '^3}{3}', 'Generated formula ' + n);
  }).join("");
}

// Posts below
const posts = [
  // Site posts
  {
    show: true,
    slug: "about",
    title: "About",
    type: "blog",
    date: "2026-06-09",
    // edition: "1st edition",
    sidebar_key: "about",
    // breadcrumb_tail: "ABOUT",
    tags: ["Welcome!"],
    abstract: "About Anodyne Avenue as an independent publication and digital archive.",
    body: html([
      '<p>Hello there, and welcome! <a href="/anodyneavenue.github.io">anodyneavenue.github.io</a> is an independent publication and digital archive of essays, guides, research notes, and long-form investigations.</p>',
      '<p>This site is written and maintained by a single author under the pen name Anodyne Avenue. It exists as a place to explore questions in science, mathematics, technology, philosophy, history, and other subjects that reward deeper examination than a typical article, social-media post, or news cycle can provide.</p>',
      '<p>Some pieces are practical guides. Others are essays, reflections, or attempts to understand a difficult idea from multiple perspectives. The common thread is curiosity, careful reasoning, and a preference for depth over speed.</p>',
      '<p>Although many posts draw on my background in physics, the aim of Anodyne Avenue is not to be limited to any one discipline. The most interesting questions rarely respect the boundaries between subjects.</p>',
      '<p>This archive is a long-term project: a place to document what I learn, what I discover, and occasionally what I change my mind about.</p>',
      '<p>I hope you enjoy :)</p>',
      '<h2>Support</h2>',
      '<p>All content on Anodyne Avenue is freely available. If you find the archive useful and would like to support both the publication and the person behind it, you can do so through Buy Me a Coffee.</p>',
      '<a class="support_link" href="https://buymeacoffee.com/anodyneavenue" target="_blank" rel="noopener noreferrer">Buy Me a Coffee</a>'
    ])
  },

  /*
    Template post

    {
      show: false,
      slug: "post-slug",
      title: "Post Title",
      type: "blog", // "blog", "essays", or "guides"
      date: "YYYY-MM-DD",
      // revised: "YYYY-MM-DD",
      // edition: "1st edition",
      // status: "draft",
      // sidebar_key: "about",
      // breadcrumb_tail: "ABOUT",
      tags: ["tag"],
      abstract: "Short summary used in cards, feeds, search index, and metadata pages.",
      body: html([
        '<p>Opening paragraph.</p>',
        '<h2>Section heading</h2>',
        '<p>Section text.</p>'
      ])
    },
  */

  // Debug suite: navigation and sorting
  debug_post({
    slug: "debug_navigation_oldest",
    title: "Navigation Oldest",
    type: "blog",
    date: "1999-12-31",
    tags: ["navigation", "sorting", "oldest"],
    abstract: "Debug post for testing the older end of global newer/older navigation and archive ordering.",
    body: html([
      '<p>This post should usually sit at the older end of chronological views when debug posts are enabled.</p>',
      '<h2>Expected behaviour</h2>',
      '<p>It should have a newer link but no older link in bottom post navigation.</p>'
    ])
  }),

  debug_post({
    slug: "debug_navigation_middle_anchor",
    title: "Navigation Middle Anchor",
    type: "guides",
    date: "2026-07-01",
    tags: ["navigation", "middle"],
    abstract: "Debug post intended to have both newer and older neighbours when the full suite is enabled.",
    body: html([
      '<p>This post should usually have both a newer and an older global navigation link.</p>',
      '<h2>Check</h2>',
      '<p>Inspect the two-card newer/older layout at the bottom of the post.</p>'
    ])
  }),

  debug_post({
    slug: "debug_navigation_newest_revised",
    title: "Navigation Newest Revised",
    type: "guides",
    date: "2024-02-01",
    revised: "2030-12-31",
    tags: ["navigation", "sorting", "revised"],
    abstract: "Debug post for testing that revised dates override original dates in global navigation.",
    body: html([
      '<p>This post has an intentionally far-future revised date.</p>',
      '<h2>Expected behaviour</h2>',
      '<p>It should sort as the newest visible post when debug posts are enabled.</p>'
    ])
  }),

  debug_post({
    slug: "debug_same_date_alpha_aardvark",
    title: "Aardvark Same Date Debug",
    type: "essays",
    date: "2026-06-01",
    tags: ["sorting", "same-date"],
    abstract: "Debug post for same-date alphabetical ordering tests.",
    body: html([
      '<p>This post shares an effective date with another debug post.</p>',
      '<p>The title should place it before Zebra Same Date Debug.</p>'
    ])
  }),

  debug_post({
    slug: "debug_same_date_alpha_zebra",
    title: "Zebra Same Date Debug",
    type: "essays",
    date: "2026-06-01",
    tags: ["sorting", "same-date"],
    abstract: "Debug post for same-date alphabetical ordering tests.",
    body: html([
      '<p>This post shares an effective date with another debug post.</p>',
      '<p>The title should place it after Aardvark Same Date Debug.</p>'
    ])
  }),

  debug_post({
    slug: "debug_tie_breaker_slug_a",
    title: "Same Title Same Date Debug",
    type: "blog",
    date: "2026-06-16",
    tags: ["sorting", "slug-tiebreak"],
    abstract: "Debug post for slug tie-breaking when title and date match.",
    body: '<p>This should sort before slug B if date and title are equal.</p>'
  }),

  debug_post({
    slug: "debug_tie_breaker_slug_b",
    title: "Same Title Same Date Debug",
    type: "blog",
    date: "2026-06-16",
    tags: ["sorting", "slug-tiebreak"],
    abstract: "Second debug post for slug tie-breaking when title and date match.",
    body: '<p>This should sort after slug A if date and title are equal.</p>'
  }),

  debug_post({
    slug: "debug_archive_year_2099",
    title: "Archive Year 2099",
    type: "blog",
    date: "2099-01-01",
    tags: ["archive", "future-date"],
    abstract: "Debug post with a far-future original date to test future-date ordering.",
    body: '<p>This post should sit near the future end unless revised dates supersede it.</p>'
  }),

  // Debug suite: metadata and routing
  debug_post({
    slug: "debug_metadata_dense",
    title: "Metadata Dense Post",
    type: "guides",
    date: "2026-06-02",
    revised: "2026-06-03",
    status: "experimental",
    series: "Debug suite",
    part: 7,
    confidence: "low",
    scope: "metadata stress test",
    audience: "site maintainer",
    tags: ["metadata", "dense", "tag 1", "tag 2", "tag 3", "tag 4"],
    abstract: "Debug post with several public metadata fields to test metadata pages, footer metadata cards, and archive rendering.",
    body: html([
      '<p>This post exists to test public metadata rendering.</p>',
      '<h2>Metadata fields</h2>',
      '<p>It includes status, series, part, confidence, scope, audience, tags, date, revised date, and edition.</p>'
    ])
  }),

  debug_post({
    slug: "debug_many_metadata_values",
    title: "Many Metadata Values",
    type: "guides",
    date: "2026-06-25",
    revised: "2026-06-26",
    edition: "debug third edition",
    status: "debug",
    series: "Debug suite",
    part: 999,
    confidence: "deliberately uncertain",
    scope: "maximal metadata test",
    audience: "maintainer, reader, future self",
    difficulty: "unnecessarily specific",
    reading_time: "about five imaginary minutes",
    canonical: false,
    reviewed: true,
    tags: ["metadata", "stress", "boolean", "custom-fields"],
    abstract: "Debug post with booleans, numbers, strings, and many custom metadata fields.",
    body: html([
      '<p>This post tests public metadata field generation.</p>',
      '<h2>Expected behaviour</h2>',
      '<p>Additional metadata fields should appear in consistent order and should not create broken routes.</p>'
    ])
  }),

  debug_untagged_post({
    slug: "debug_missing_tags_property",
    title: "Missing Tags Property",
    type: "guides",
    date: "2026-06-14",
    abstract: "Debug post deliberately omitting the tags field to confirm that tags metadata is optional.",
    body: html([
      '<p>This post intentionally has no tags property.</p>',
      '<h2>Expected behaviour</h2>',
      '<p>The build should pass, and the post should simply not appear under any tag-specific metadata page.</p>'
    ])
  }),

  debug_post({
    slug: "debug_tags_many",
    title: "Many Tags Post",
    type: "essays",
    date: "2026-06-07",
    tags: ["tag-alpha", "tag-beta", "tag-gamma", "tag-delta", "tag-epsilon", "tag-zeta", "tag-eta", "tag-theta", "tag-iota", "tag-kappa", "tag-lambda"],
    abstract: "Debug post with many tags to stress tag wrapping on post pages, archive cards, and metadata pages.",
    body: html([
      '<p>This post has many tags.</p>',
      '<h2>Wrapping</h2>',
      '<p>The tag row should wrap cleanly without breaking the page width.</p>'
    ])
  }),

  debug_post({
    slug: "debug_tag_case_spacing",
    title: "Tag Case and Spacing",
    type: "essays",
    date: "2026-06-27",
    tags: ["Tag With Spaces", "tag with spaces", "TAG WITH SPACES", "debug spaced tag", "debug/slash/tag"],
    abstract: "Debug post for tag slug generation, case normalisation, spacing, and slash handling.",
    body: html([
      '<p>This post tests whether visually similar tags collide or remain usable.</p>',
      '<h2>Tags</h2>',
      '<p>Inspect metadata tag pages and tag links.</p>'
    ])
  }),

  debug_post({
    slug: "debug_special_characters",
    title: 'Special <Characters> & "Quoted" Text',
    type: "guides",
    date: "2026-06-09",
    tags: ["escaping", "special-characters"],
    abstract: "Debug post for checking escaping of <, >, &, and quotes in titles, metadata, feeds, and generated links.",
    body: html([
      '<p>This post tests escaping in generated HTML.</p>',
      '<h2>Characters</h2>',
      '<p>Visible body HTML is intentionally ordinary; metadata contains the special characters.</p>'
    ])
  }),

  debug_post({
    slug: "debug_unicode_text",
    title: "Unicode, Diacritics, Symbols — α β γ Ω ñ ü 中文",
    type: "guides",
    date: "2026-06-17",
    tags: ["unicode", "escaping", "symbols"],
    abstract: "Debug post containing Unicode, Greek letters, dashes, diacritics, and non-Latin characters.",
    body: html([
      '<p>Unicode body test: α β γ Ω — ñ ü 中文. This should not corrupt generated pages, feeds, or search indexes.</p>',
      '<h2>Unicode heading — αβγ</h2>',
      '<p>The generated heading ID should remain stable even if the visible text contains symbols.</p>'
    ])
  }),

  debug_post({
    slug: "debug_slug_with_numbers_123",
    title: "Slug With Numbers 123",
    type: "essays",
    date: "2026-06-15",
    tags: ["slug", "numbers"],
    abstract: "Debug post for numeric slug and metadata routing tests.",
    body: '<p>Numeric slugs should build and link normally.</p>'
  }),

  // Debug suite: layout, overflow, and performance
  debug_post({
    slug: "debug_empty_minimal_post",
    title: "Empty Minimal Post",
    type: "blog",
    date: "2026-06-04",
    tags: ["minimal", "empty-body"],
    abstract: "Debug post with intentionally minimal visible content.",
    body: '<p></p>'
  }),

  debug_post({
    slug: "debug_short_post_no_minimap",
    title: "Short Post No Minimap",
    type: "blog",
    date: "2026-06-05",
    tags: ["minimap", "short"],
    abstract: "Debug post with too few headings to trigger the minimap.",
    body: html([
      '<p>This post should not create a minimap.</p>',
      '<h2>Only heading</h2>',
      '<p>There are fewer than three headings.</p>'
    ])
  }),

  debug_post({
    slug: "debug_tiny_one_word",
    title: "Tiny",
    type: "blog",
    date: "2026-06-24",
    tags: ["tiny", "word-count"],
    abstract: "Tiny.",
    body: '<p>Tiny.</p>'
  }),

  debug_post({
    slug: "debug_long_title_and_abstract",
    title: "Post With an Excessively Long Title Designed to Test Wrapping in Cards, Navigation Links, Metadata Pages, Search Indexes, and Post Headers",
    type: "essays",
    date: "2026-06-08",
    tags: ["layout", "long-title"],
    abstract: "This deliberately overlong abstract is intended to test whether card layouts, metadata value pages, archive rows, section pages, RSS summaries, and post headers continue to behave sensibly when a post description contains much more text than a normal entry would usually contain.",
    body: html([
      '<p>This post is for long-title and long-abstract layout testing.</p>',
      '<h2>Long text</h2>',
      '<p>The site should remain readable and avoid horizontal overflow.</p>'
    ])
  }),

  debug_post({
    slug: "debug_responsive_long_unbroken_text",
    title: "Responsive Long Unbroken Text",
    type: "essays",
    date: "2026-06-30",
    tags: ["responsive", "overflow", "long-word"],
    abstract: "Debug post for long unbroken strings that may reveal horizontal overflow problems.",
    body: html([
      '<p>' + debug_long_word("supercalifragilisticexpialidocious", 8) + '</p>',
      '<h2>Expected behaviour</h2>',
      '<p>The page should avoid destructive horizontal overflow where possible.</p>'
    ])
  }),

  debug_post({
    slug: "debug_very_long_body",
    title: "Very Long Body Stress Test",
    type: "essays",
    date: "2026-06-23",
    tags: ["longform", "scroll", "performance"],
    abstract: "Debug post with a long body but fewer headings, intended to test page length, word counts, and footer placement.",
    body: html([
      '<h2>Long body</h2>',
      debug_paragraph("long-body", 120)
    ])
  }),

  debug_post({
    slug: "debug_memory_large_body",
    title: "Memory Large Body Stress Test",
    type: "essays",
    date: "2026-07-02",
    tags: ["memory", "performance", "stress"],
    abstract: "Debug post with generated repeated content to test build size, browser memory pressure, and very long generated HTML.",
    body: html([
      '<h2>Generated body</h2>',
      debug_paragraph("memory", 500)
    ])
  }),

  // Debug suite: headings and minimap
  debug_post({
    slug: "debug_heading_collision",
    title: "Heading Collision Post",
    type: "guides",
    date: "2026-06-06",
    tags: ["minimap", "headings"],
    abstract: "Debug post with repeated headings to test generated heading IDs and minimap entries.",
    body: html([
      '<p>This post repeats heading text several times.</p>',
      '<h2>Repeat</h2>',
      '<p>First repeat.</p>',
      '<h2>Repeat</h2>',
      '<p>Second repeat.</p>',
      '<h3>Repeat</h3>',
      '<p>Nested repeat.</p>',
      '<h2>Repeat</h2>',
      '<p>Third repeat.</p>'
    ])
  }),

  debug_post({
    slug: "debug_manual_heading_ids",
    title: "Manual Heading IDs",
    type: "blog",
    date: "2026-06-28",
    tags: ["headings", "anchors", "manual-id"],
    abstract: "Debug post with pre-existing heading IDs to test that the generator preserves them.",
    body: html([
      '<p>This post includes manual heading IDs.</p>',
      '<h2 id="manual_anchor">Manual Anchor</h2>',
      '<p>The generator should preserve this ID.</p>',
      '<h2>Automatic Anchor</h2>',
      '<p>The generator should create this ID.</p>',
      '<h3 id="manual_nested_anchor">Manual Nested Anchor</h3>',
      '<p>The minimap should link to the manual nested ID.</p>'
    ])
  }),

  debug_post({
    slug: "debug_deep_heading_levels",
    title: "Deep Heading Levels",
    type: "blog",
    date: "2026-06-20",
    tags: ["minimap", "headings", "hierarchy"],
    abstract: "Debug post for h2, h3, and h4 extraction and minimap indentation.",
    body: html([
      '<p>This post tests all supported heading levels.</p>',
      '<h2>Level Two A</h2><p>Text.</p>',
      '<h3>Level Three A</h3><p>Text.</p>',
      '<h4>Level Four A</h4><p>Text.</p>',
      '<h2>Level Two B</h2><p>Text.</p>',
      '<h3>Level Three B</h3><p>Text.</p>',
      '<h4>Level Four B</h4><p>Text.</p>'
    ])
  }),

  debug_post({
    slug: "debug_massive_minimap",
    title: "Massive Minimap Stress Test",
    type: "guides",
    date: "2026-06-21",
    revised: "2026-06-22",
    tags: ["minimap", "stress", "scroll"],
    abstract: "Debug post with many headings to stress minimap scrolling, active-state tracking, and heading centring.",
    body: html([
      '<p>This post generates many headings.</p>',
      debug_sections("Massive minimap", 48, 2)
    ])
  }),

  debug_post({
    slug: "debug_many_many_headers",
    title: "Many Many Headers Stress Test",
    type: "guides",
    date: "2026-07-03",
    tags: ["minimap", "headings", "stress"],
    abstract: "Debug post with a very large number of mixed h2, h3, and h4 headings.",
    body: html([
      '<p>This post creates a large mixed heading hierarchy.</p>',
      debug_mixed_sections("Header stress", 160)
    ])
  }),

  // Debug suite: HTML structures
  debug_post({
    slug: "debug_html_entities_in_body",
    title: "HTML Entities in Body",
    type: "essays",
    date: "2026-06-18",
    tags: ["html", "entities", "escaping"],
    abstract: "Debug post for HTML entities and inline code-like text.",
    body: html([
      '<p>This paragraph contains escaped entities: &amp; &lt; &gt; &quot;.</p>',
      '<h2>Code-like text</h2>',
      '<p><code>const value = "debug";</code> should inherit sensible inline styling or remain readable by browser default.</p>'
    ])
  }),

  debug_post({
    slug: "debug_blockquote_lists",
    title: "Blockquotes and Lists",
    type: "guides",
    date: "2026-06-19",
    tags: ["html", "lists", "blockquote"],
    abstract: "Debug post for blockquotes, unordered lists, ordered lists, and nested-ish content spacing.",
    body: html([
      '<blockquote><p>This is a blockquote used to test spacing and text colour.</p></blockquote>',
      '<h2>Lists</h2>',
      '<ul><li>First unordered item</li><li>Second unordered item with a longer line that should wrap cleanly inside the reading column.</li></ul>',
      '<ol><li>First ordered item</li><li>Second ordered item</li></ol>'
    ])
  }),

  // Debug suite: type pages
  debug_post({
    slug: "debug_type_blog",
    title: "Type Blog",
    type: "blog",
    date: "2026-06-10",
    tags: ["type", "blog"],
    abstract: "Debug post for blog type pages and global navigation.",
    body: '<p>Blog type debug post.</p>'
  }),

  debug_post({
    slug: "debug_type_guide",
    title: "Type Guide",
    type: "guides",
    date: "2026-06-11",
    tags: ["type", "guides"],
    abstract: "Debug post for guide type pages and global navigation.",
    body: '<p>Guide type debug post.</p>'
  }),

  debug_post({
    slug: "debug_type_essay",
    title: "Type Essay",
    type: "essays",
    date: "2026-06-12",
    tags: ["type", "essays"],
    abstract: "Debug post for essay type pages and global navigation.",
    body: '<p>Essay type debug post.</p>'
  }),

  // Debug suite: maths and KaTeX
  debug_post({
    slug: "debug_math_rendering_examples",
    title: "Math Rendering Examples",
    type: "guides",
    date: "2026-05-30",
    status: "hidden example",
    uses_math: true,
    math_macros: {
      "\\E": "\\vec{E}",
      "\\B": "\\vec{B}",
      "\\dd": "\\,\\mathrm{d}",
      "\\ket": "\\left|#1\\right\\rangle",
      "\\bra": "\\left\\langle#1\\right|"
    },
    tags: ["math", "physics", "katex"],
    abstract: "Hidden example post showing inline, display, labelled, aligned, matrix, cases, vector-calculus, and bra-ket maths rendering.",
    body: html([
      '<p>This hidden post demonstrates build-time maths rendering. Inline maths works inside a paragraph, for example ',
      math_inline(String.raw`E = mc^2`),
      ' or ',
      math_inline(String.raw`\psi(x)=\langle x\mid\psi\rangle`),
      '.</p>',
      '<h2>Display equations</h2>',
      '<p>A display equation can be unlabelled:</p>',
      math_display(String.raw`\nabla \cdot \E = \frac{\rho}{\epsilon_0}`),
      '<p>It can also carry a quiet caption:</p>',
      math_display(String.raw`\vec{F} = q\left(\E + \vec{v}\times\B\right)`, "Lorentz force"),
      '<h2>Aligned working</h2>',
      math_display(String.raw`\begin{aligned}
\nabla \cdot \E &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \B &= 0 \\
\nabla \times \E &= -\frac{\partial \B}{\partial t} \\
\nabla \times \B &= \mu_0\vec{J}+\mu_0\epsilon_0\frac{\partial \E}{\partial t}
\end{aligned}`, "Maxwell equations, differential form"),
      '<h2>Matrices and cases</h2>',
      math_display(String.raw`A = \begin{pmatrix} a & b \\ c & d \end{pmatrix},\qquad f(x)=\begin{cases} x^2, & x\ge 0 \\ -x^2, & x<0 \end{cases}`),
      '<h2>Integrals and quantum notation</h2>',
      math_display(String.raw`\oint_{\partial S}\B\cdot\dd\vec{\ell}=\mu_0 I_{\mathrm{enc}},\qquad \bra{\phi}\hat{A}\ket{\psi}=\int_D \phi^*(x)(\hat{A}\psi)(x)\dd x`, "Mixed physics notation")
    ])
  }),

  debug_post({
    slug: "debug_many_latex_formulas",
    title: "Many LaTeX Formulas Stress Test",
    type: "guides",
    date: "2026-07-04",
    uses_math: true,
    tags: ["math", "latex", "stress", "katex"],
    abstract: "Debug post with many generated inline and display maths blocks to stress KaTeX rendering and equation layout.",
    body: html([
      '<p>This post generates many maths placeholders.</p>',
      debug_formula_series(60)
    ])
  }),

  debug_post({
    slug: "debug_math_error_allowed",
    title: "Math Error Allowed",
    type: "guides",
    date: "2026-06-29",
    uses_math: true,
    allow_math_errors: true,
    tags: ["math", "error", "katex"],
    abstract: "Debug post for allowed KaTeX errors. The build should not fail when allow_math_errors is true.",
    body: html([
      '<p>This post contains intentionally invalid maths with errors allowed.</p>',
      math_display(String.raw`\notarealcommand{x}`)
    ])
  })
];

if (typeof module !== "undefined") {
  module.exports = posts;
}
