const posts = [
  {
    slug: "a",
    title: "A",
    type: "essays",
    date: "2026-05-25",
    edition: "1st edition",
    abstract: "A deliberately short title used to test compact archive entries.",
    body: `
      <p>This is a short test essay. It exists mainly to test how very small titles appear in the latest list, archive, section pages, and post layout.</p>
      <p>The body is short, but still uses normal paragraph formatting.</p>
    `
  },
  {
    slug: "the_problem_with_explanations_that_feel_complete_before_they_have_encountered_their_strongest_objection",
    title: "The Problem with Explanations That Feel Complete Before They Have Encountered Their Strongest Objection",
    type: "essays",
    date: "2026-05-21",
    edition: "2nd edition",
    abstract: "A long-title test piece about explanation, closure, disagreement, and intellectual overconfidence.",
    body: `
      <p>This essay tests long titles, long archive lines, and the way the layout handles text that wants to exceed the width of the page.</p>
      <p>An explanation can become satisfying before it becomes adequate. That is the danger. Satisfaction is not the same as contact with the problem.</p>
      <h2>First pressure</h2>
      <p>The first pressure is rhetorical. A clean explanation often wins attention before a careful explanation has finished defining the terms.</p>
      <h2>Second pressure</h2>
      <p>The second pressure is emotional. A reader often wants the relief of conclusion more than the discomfort of suspended judgement.</p>
      <h2>Revision</h2>
      <p>The test of an explanation is not whether it sounds whole, but whether it survives its most informed antagonist.</p>
    `
  },
  {
    slug: "how_to_build_a_small_private_system_for_thinking_without_turning_it_into_a_performance",
    title: "How to Build a Small Private System for Thinking without Turning It into a Performance",
    type: "guides",
    date: "2026-05-18",
    edition: "1st edition",
    abstract: "A guide-style test post with a long title, ordered sections, and practical prose.",
    body: `
      <p>The point of a private thinking system is not productivity theatre. It is reduction of friction.</p>
      <h2>1. Keep the entry point small</h2>
      <p>A system fails when the act of entering something becomes larger than the thing being entered.</p>
      <h2>2. Separate capture from judgement</h2>
      <p>Capture first. Sort later. Do not make every thought defend its existence at the door.</p>
      <h2>3. Archive without guilt</h2>
      <p>An archive is not a promise to return. It is a controlled way of not losing something completely.</p>
    `
  },
  {
    slug: "notes_from_a_false_start",
    title: "Notes from a False Start",
    type: "blog",
    date: "2026-05-12",
    edition: "1st edition",
    abstract: "A short blog-style piece about abandoned beginnings.",
    body: `
      <p>False starts are not always failures. Sometimes they are the first visible sign that the real object has not yet been found.</p>
      <p>This entry tests short blog formatting.</p>
    `
  },
  {
    slug: "on_argument_maps_and_the_strange_comfort_of_disagreement",
    title: "On Argument Maps and the Strange Comfort of Disagreement",
    type: "essays",
    date: "2026-04-30",
    edition: "3rd edition",
    abstract: "A medium-length essay entry testing editions, dates, and archive order.",
    body: `
      <p>Disagreement becomes less threatening when its structure is visible. Argument maps do not remove conflict; they make it legible.</p>
      <h2>Claims</h2>
      <p>A claim is not yet an argument. It becomes part of an argument when its support, implications, and vulnerabilities are made explicit.</p>
      <h2>Use</h2>
      <p>The value of mapping is not neatness. The value is seeing where the dispute actually lives.</p>
    `
  },
  {
    slug: "why_some_questions_should_remain_open_longer_than_comfort_allows",
    title: "Why Some Questions Should Remain Open Longer Than Comfort Allows",
    type: "essays",
    date: "2026-04-14",
    edition: "1st edition",
    abstract: "A slow essay about patience, incompleteness, and premature closure.",
    body: `
      <p>Some questions are damaged by early answers. Not because answers are bad, but because the first answer often becomes a frame.</p>
      <p>To leave a question open is not to avoid responsibility. It is sometimes the only responsible method.</p>
    `
  },
  {
    slug: "guide_to_reading_a_topic_from_three_sides",
    title: "Guide to Reading a Topic from Three Sides",
    type: "guides",
    date: "2026-03-29",
    edition: "1st edition",
    abstract: "A concise guide for triangulating a subject through sympathetic, hostile, and neutral sources.",
    body: `
      <h2>Side one</h2>
      <p>Read the strongest advocate first. Understand the internal logic before criticising it.</p>
      <h2>Side two</h2>
      <p>Read the strongest critic second. Look for the pressure points.</p>
      <h2>Side three</h2>
      <p>Read the dullest neutral account last. It often reveals what both sides forgot to mention.</p>
    `
  },
  {
    slug: "small_log",
    title: "Small Log",
    type: "blog",
    date: "2026-03-07",
    edition: "1st edition",
    abstract: "A small dated entry for testing the blog catalogue.",
    body: `
      <p>A short log entry. Useful for testing sparse content.</p>
    `
  },
  {
    slug: "the_archive_as_a_method_of_not_deciding_too_early",
    title: "The Archive as a Method of Not Deciding Too Early",
    type: "essays",
    date: "2026-02-16",
    edition: "2nd edition",
    abstract: "An essay about archives as suspended judgement rather than storage.",
    body: `
      <p>An archive is often treated as storage, but it can also be a way of delaying interpretation.</p>
      <p>To archive something is to refuse two extremes: forgetting it and finalising it.</p>
      <h2>Against finality</h2>
      <p>The archive allows material to remain available without pretending that its meaning is settled.</p>
    `
  },
  {
    slug: "guide_to_revision_notes",
    title: "Guide to Revision Notes",
    type: "guides",
    date: "2026-01-22",
    edition: "1st edition",
    abstract: "A short practical guide used to test guide formatting.",
    body: `
      <p>Good notes reduce future ambiguity. Bad notes preserve confusion in a more decorative form.</p>
      <h2>Compress</h2>
      <p>Keep the structure, remove the padding.</p>
      <h2>Test</h2>
      <p>A note is not complete until it can generate a question.</p>
    `
  },
  {
    slug: "winter_fragment",
    title: "Winter Fragment",
    type: "blog",
    date: "2025-12-19",
    edition: "1st edition",
    abstract: "A fragmentary post with minimal structure.",
    body: `
      <p>The year narrows. The archive grows sideways.</p>
      <p>Not everything becomes an essay. Some things remain weather.</p>
    `
  },
  {
    slug: "against_the_aesthetic_of_having_already_understood",
    title: "Against the Aesthetic of Having Already Understood",
    type: "essays",
    date: "2025-11-08",
    edition: "1st edition",
    abstract: "A test essay with a philosophical tone and medium-length body.",
    body: `
      <p>There is a posture of understanding that can appear before understanding itself. It has the rhythm of conclusion and the confidence of memory.</p>
      <p>The danger is not ignorance. The danger is ignorance that has learned the gestures of insight.</p>
    `
  },
  {
    slug: "how_to_make_a_topic_index",
    title: "How to Make a Topic Index",
    type: "guides",
    date: "2025-10-13",
    edition: "1st edition",
    abstract: "A guide for making indexes that stay usable after they become large.",
    body: `
      <h2>Use stable names</h2>
      <p>Do not rename categories every time your mood changes.</p>
      <h2>Prefer retrieval over beauty</h2>
      <p>An index is successful when it gets you back to the thing.</p>
      <h2>Leave space for disorder</h2>
      <p>The point is not perfect taxonomy. The point is return.</p>
    `
  },
  {
    slug: "an_unnecessarily_long_title_designed_to_test_what_happens_when_an_archive_entry_refuses_to_be_brief_reasonable_or_typographically_polite",
    title: "An Unnecessarily Long Title Designed to Test What Happens When an Archive Entry Refuses to Be Brief, Reasonable, or Typographically Polite",
    type: "blog",
    date: "2025-09-02",
    edition: "1st edition",
    abstract: "A stress test for very long titles in the archive, latest list, and post page.",
    body: `
      <p>This entry exists almost entirely to break the layout.</p>
      <p>If the layout survives this title, it will probably survive ordinary titles.</p>
    `
  },
  {
    slug: "notes_on_balance",
    title: "Notes on Balance",
    type: "essays",
    date: "2025-08-28",
    edition: "1st edition",
    abstract: "A short essay testing older dates and calm prose.",
    body: `
      <p>Balance is often mistaken for standing between two positions. Sometimes balance means knowing when one side has better evidence.</p>
      <p>The point is not symmetry. The point is proportion.</p>
    `
  },
  {
    slug: "guide_to_disagreeing_with_your_own_first_draft",
    title: "Guide to Disagreeing with Your Own First Draft",
    type: "guides",
    date: "2025-07-15",
    edition: "2nd edition",
    abstract: "A guide for revising essays by treating the first draft as an opponent.",
    body: `
      <h2>Find the strongest sentence</h2>
      <p>Keep it. Build around it.</p>
      <h2>Find the easiest sentence</h2>
      <p>Distrust it. It may be hiding the hard part.</p>
      <h2>Find the missing objection</h2>
      <p>The absent objection is often the real essay.</p>
    `
  },
  {
    slug: "log_after_midnight",
    title: "Log after Midnight",
    type: "blog",
    date: "2025-06-01",
    edition: "1st edition",
    abstract: "A quiet blog entry testing older chronology.",
    body: `
      <p>After midnight, ideas look more complete than they are. Morning is a useful editor.</p>
    `
  },
  {
    slug: "the_difference_between_a_theme_and_a_question",
    title: "The Difference between a Theme and a Question",
    type: "essays",
    date: "2025-04-18",
    edition: "1st edition",
    abstract: "An essay about turning vague interests into examinable questions.",
    body: `
      <p>A theme is a region. A question is a path through it.</p>
      <p>Many projects fail because they collect themes without producing questions.</p>
      <h2>Theme</h2>
      <p>Identity, memory, technology, attention, language.</p>
      <h2>Question</h2>
      <p>What changes when a private note becomes a public artefact?</p>
    `
  },
  {
    slug: "guide_to_cutting_a_long_essay",
    title: "Guide to Cutting a Long Essay",
    type: "guides",
    date: "2025-03-05",
    edition: "1st edition",
    abstract: "A practical guide for reducing essay length without flattening the argument.",
    body: `
      <h2>Cut throat-clearing</h2>
      <p>If the essay only begins in paragraph three, delete paragraphs one and two.</p>
      <h2>Cut repeated permission</h2>
      <p>Do not keep apologising for complexity.</p>
      <h2>Keep pressure</h2>
      <p>The best cuts increase force rather than merely reducing length.</p>
    `
  },
  {
    slug: "one_line",
    title: "One Line",
    type: "blog",
    date: "2025-01-11",
    edition: "1st edition",
    abstract: "A very small post.",
    body: `
      <p>This is almost nothing.</p>
    `
  },
  {
    slug: "the_shape_of_an_argument_when_seen_from_too_far_away",
    title: "The Shape of an Argument When Seen from Too Far Away",
    type: "essays",
    date: "2024-12-20",
    edition: "1st edition",
    abstract: "An older test essay about abstraction and distance.",
    body: `
      <p>From far away, every argument becomes simple. The distance removes texture, hesitation, and the local reasons people care.</p>
      <p>Good analysis moves between distance and nearness without confusing either for truth.</p>
    `
  },
  {
    slug: "guide_to_naming_files_without_hating_yourself_later",
    title: "Guide to Naming Files without Hating Yourself Later",
    type: "guides",
    date: "2024-11-09",
    edition: "1st edition",
    abstract: "A guide for filenames, archives, and future retrieval.",
    body: `
      <p>A good filename is a small act of mercy toward your future self.</p>
      <h2>Use dates</h2>
      <p>Dates sort better than moods.</p>
      <h2>Use subjects</h2>
      <p>A title should tell you why the file exists.</p>
      <h2>Avoid drama</h2>
      <p>Do not name a file final unless you want to create final_final_revised_actual.</p>
    `
  },
  {
    slug: "a_blog_post_with_a_normal_length_title",
    title: "A Blog Post with a Normal-Length Title",
    type: "blog",
    date: "2024-10-14",
    edition: "1st edition",
    abstract: "A plain entry for testing ordinary behaviour.",
    body: `
      <p>This post is intentionally ordinary. It tests the default case.</p>
    `
  },
  {
    slug: "against_clean_edges",
    title: "Against Clean Edges",
    type: "essays",
    date: "2024-09-30",
    edition: "2nd edition",
    abstract: "A short essay about categories, borders, and the messiness of real objects.",
    body: `
      <p>Clean edges are often produced by the observer, not the object.</p>
      <p>That does not make categories useless. It makes them tools rather than mirrors.</p>
    `
  },
  {
    slug: "guide_to_beginning_again",
    title: "Guide to Beginning Again",
    type: "guides",
    date: "2024-08-03",
    edition: "1st edition",
    abstract: "A guide for restarting abandoned projects without ritual self-punishment.",
    body: `
      <h2>Do not reconstruct the whole past</h2>
      <p>Find the next action, not the full archaeology.</p>
      <h2>Make the restart small</h2>
      <p>A restart that requires a ceremony is too large.</p>
      <h2>Preserve only what helps</h2>
      <p>The old version does not deserve loyalty merely because it came first.</p>
    `
  },
  {
    slug: "archive_test_entry_zero",
    title: "Archive Test Entry Zero",
    type: "blog",
    date: "2024-06-17",
    edition: "1st edition",
    abstract: "A deliberately plain old entry for archive testing.",
    body: `
      <p>This entry exists to make the archive longer and to test chronological sorting.</p>
    `
  },
  {
    slug: "the_kind_of_neutrality_that_is_not_actually_neutral",
    title: "The Kind of Neutrality That Is Not Actually Neutral",
    type: "essays",
    date: "2024-05-26",
    edition: "1st edition",
    abstract: "An essay about neutrality, framing, and hidden commitments.",
    body: `
      <p>Neutrality can be a method, a pose, or a refusal. These should not be confused.</p>
      <p>The neutral voice often hides decisions about what counts as relevant, extreme, serious, or already settled.</p>
    `
  },
  {
    slug: "guide_to_public_notes",
    title: "Guide to Public Notes",
    type: "guides",
    date: "2024-04-10",
    edition: "1st edition",
    abstract: "A guide for deciding which notes deserve publication.",
    body: `
      <h2>Ask what changes in public</h2>
      <p>A private note can be incomplete. A public note needs enough context to avoid misleading the reader.</p>
      <h2>Keep uncertainty visible</h2>
      <p>Publication should not force false confidence.</p>
    `
  },
  {
    slug: "old_blog_fragment",
    title: "Old Blog Fragment",
    type: "blog",
    date: "2024-02-02",
    edition: "1st edition",
    abstract: "An older blog fragment for testing archive depth.",
    body: `
      <p>The archive is starting to feel older than the site.</p>
    `
  },
  {
    slug: "on_the_suspicion_that_every_good_question_has_more_than_one_entrance",
    title: "On the Suspicion That Every Good Question Has More Than One Entrance",
    type: "essays",
    date: "2023-12-12",
    edition: "1st edition",
    abstract: "A long-titled older essay testing deep archive behaviour.",
    body: `
      <p>A good question can usually be entered through history, language, evidence, feeling, power, or technique.</p>
      <p>The entrance changes the route. It may also change what counts as an answer.</p>
    `
  },
  {
    slug: "guide_to_testing_a_website_layout",
    title: "Guide to Testing a Website Layout",
    type: "guides",
    date: "2023-10-19",
    edition: "1st edition",
    abstract: "A meta-guide for testing this site with varied content.",
    body: `
      <h2>Use long titles</h2>
      <p>Long titles test overflow, spacing, and rhythm.</p>
      <h2>Use old dates</h2>
      <p>Old dates test sorting.</p>
      <h2>Use different types</h2>
      <p>Different sections test filtering.</p>
      <h2>Use short bodies</h2>
      <p>Short bodies test whether the layout depends on content volume.</p>
    `
  },
  {
    slug: "first_archive_seed",
    title: "First Archive Seed",
    type: "blog",
    date: "2023-08-01",
    edition: "1st edition",
    abstract: "The oldest placeholder entry.",
    body: `
      <p>This is the bottom of the current test archive.</p>
    `
  }
  ,
  {
    slug: "edition_test_essay_first",
    title: "Edition Test Essay",
    type: "essays",
    date: "2024-01-01",
    edition: "1st edition",
    abstract: "Old essay edition. This should appear in the archive, but not on the Essays section page.",
    body: `
      <p>This is the first edition of the essay. It should remain visible in the archive.</p>
    `
  },
  {
    slug: "edition_test_essay_second",
    title: "Edition Test Essay",
    type: "essays",
    date: "2025-01-01",
    edition: "2nd edition",
    abstract: "Middle essay edition. This should appear in the archive, but not on the Essays section page.",
    body: `
      <p>This is the second edition of the essay. It should remain visible in the archive.</p>
    `
  },
  {
    slug: "edition_test_essay_third",
    title: "Edition Test Essay",
    type: "essays",
    date: "2026-01-01",
    edition: "3rd edition",
    abstract: "Latest essay edition. This should be the only version shown on the Essays section page.",
    body: `
      <p>This is the third and latest edition of the essay. It should appear in both the archive and the Essays section page.</p>
    `
  },
  {
    slug: "edition_test_guide_first",
    title: "Edition Test Guide",
    type: "guides",
    date: "2023-06-01",
    edition: "1st edition",
    abstract: "Old guide edition. Archive only.",
    body: `
      <p>This is the first guide edition.</p>
    `
  },
  {
    slug: "edition_test_guide_second",
    title: "Edition Test Guide",
    type: "guides",
    date: "2026-06-01",
    edition: "2nd edition",
    abstract: "Latest guide edition. This should be the only version shown on the Guides section page.",
    body: `
      <p>This is the second and latest guide edition.</p>
    `
  },
  {
    slug: "edition_test_blog_first",
    title: "Edition Test Blog",
    type: "blog",
    date: "2024-04-04",
    edition: "1st edition",
    abstract: "Old blog edition. Archive only.",
    body: `
      <p>This is the first blog edition.</p>
    `
  },
  {
    slug: "edition_test_blog_second",
    title: "Edition Test Blog",
    type: "blog",
    date: "2026-04-04",
    edition: "2nd edition",
    abstract: "Latest blog edition. This should be the only version shown on the Blog section page.",
    body: `
      <p>This is the second and latest blog edition.</p>
    `
  },
  {
    slug: "same_title_essay",
    title: "Same Title across Different Sections",
    type: "essays",
    date: "2026-07-01",
    edition: "1st edition",
    abstract: "Essay version of a title also used in another section.",
    body: `
      <p>This checks that duplicate-title filtering is separated by section type.</p>
    `
  },
  {
    slug: "same_title_guide",
    title: "Same Title across Different Sections",
    type: "guides",
    date: "2026-07-02",
    edition: "1st edition",
    abstract: "Guide version of a title also used in another section.",
    body: `
      <p>This should not hide the essay version, because it belongs to Guides.</p>
    `
  },
  {
    slug: "latest_top_three_test",
    title: "Latest Top Three Test",
    type: "blog",
    date: "2027-01-01",
    edition: "1st edition",
    abstract: "Very new test post. This should appear in the homepage Latest top three.",
    body: `
      <p>This tests whether the homepage only shows the three newest posts.</p>
    `
  }
];
