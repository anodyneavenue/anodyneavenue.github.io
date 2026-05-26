const posts = [
  {
    slug: "a",
    title: "A",
    type: "essays",
    date: "2026-05-25",
    revised: "2026-05-26",
    edition: "1st edition",
    tags: ["test", "short form"],
    abstract: "A deliberately short title used to test compact archive entries.",
    body:
      '<p>This is a short test essay. It exists mainly to test how very small titles appear in the latest list, archive, section pages, and post layout.</p>' +
      '<p>The body is short, but still uses normal paragraph formatting.</p>'
  }
];

if (typeof module !== "undefined") {
  module.exports = posts;
}
