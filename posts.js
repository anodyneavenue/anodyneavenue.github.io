function escape_attr(value) {
  return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
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
        tags: Array.from(new Set(["debug"].concat(config.tags || [])))
      }
  );
}

function debug_paragraph(seed, count) {
  const sentence = "Debug paragraph " + seed + " checks spacing, wrapping, reading rhythm, generated metadata, post navigation, and archive cards under repeated content pressure.";
  return Array.from({ length: count }, function(_, index) {
    return '<p>' + sentence + ' Segment ' + (index + 1) + '.</p>';
  }).join("");
}

function debug_sections(prefix, count, level) {
  const heading_level = level || 2;
  return Array.from({ length: count }, function(_, index) {
    const n = index + 1;
    return '<h' + heading_level + '>' + prefix + ' section ' + n + '</h' + heading_level + '>' +
        '<p>This generated debug section exists to stress heading extraction, minimap generation, anchor creation, and internal scrolling.</p>';
  }).join("");
}

// Posts below
const posts = [
  {
    show: false,
    slug: "hello-world",
    title: "Hello World!",
    type: "blog",
    date: "2026-05-28",
    // revised: "2026-05-27",
    edition: "1st edition",
    tags: ["Journal"],
    abstract: "A short introduction to anodyne avenue: anonymity, uncertainty, unfinished questions, and the need for a slower archive of thought.",
    body:
        '<p>On this website, I write under the pseudonym <strong>anodyne avenue</strong> - a small attempt at anonymity in a time that increasingly resists it. I am, as of writing, an undergraduate physics student in the UK with strong interests in the arts and humanities.</p>' +
        '<h2>A bit more about me</h2>' +
        '<p>Foundationally, I seem to exist somewhere between two states: curiosity and confusion, each constantly feeding the other.</p>' +
        '<p>I frequently fall into deep dives on obscure topics and questions, which only intensify both states. More often than not, I emerge from these ventures with even more questions than answers.</p>' +
        '<p>Unfortunately, I also have a tendency to leave many of these investigations unfinished - abandoned sometimes just before completion when some other shiny new idea passes by. I have often struggled to carry these ventures through to completion, partly because I have had no real outlet for them... until now!</p>' +
        '<p>At times, this has been a source of loneliness: I often find myself dissatisfied with the incompleteness of an answer while others seem content to leave it there.</p>' +
        '<p>A large part of this tendency stems from an ongoing attempt to find certainty in a world that appears to offer very little of it, despite our natural inclination to force things neatly into boxes with clear edges and definitions. Science, in one flavour or another, has been one avenue through which I have tried to approach that problem. Yet even this eventually encounters its own limits: finite precision and resolution, uncertainty, approximation, and so on.</p>' +
        '<p>Here is something I found particularly interesting: one of my lecturers once said that a large amount of modern physics is now performed using numerical methods, as many problems cannot be solved analytically - using only pen and paper - in any usable form. Instead, we brute-force approximations from computers until we converge upon some desired decimal place.</p>' +
        '<p>I\'ve gradually come to realise that a large part of studying physics at university is accepting that pure certainty - true 0% or 100% certainty - does not really exist. We can approach conclusions. We can converge towards them. We can increase confidence given the available evidence and data. But there is always a small gap between certainty and reality.</p>' +
        '<p>That idea has gradually become part of my broader writing ethos.</p>' +
        '<p>Accepting this has led me to search for understanding elsewhere as well - across philosophy, literature, history, art, and other disciplines that attempt, in their own ways, to grapple with many of the same underlying questions.</p>' +
        '<h3>anodyne avenue</h3>' +
        '<p>This website exists partly as an attempt to give some structure to that search.</p>' +
        '<p>anodyne avenue is intended to be a text-first archive of essays, notes, guides, and reflections: a place to think slowly and methodically; to follow ideas properly; to remove outside noise where possible; and to document what I learn along the way.</p>' +
        '<p>Some posts will be technical, others philosophical or personal; many will likely sit somewhere in between.</p>' +
        '<h2>The aim is exploration</h2>' +
        '<p>If you have somehow wandered here and find yourself similarly curious and, more often than not, equally confused - or dissatisfied with shallow explanations - then perhaps some part of this archive may prove useful to you as well.</p>' +
        '<p>Thank you for reading.</p>'
  },
  {
    show: false,
    slug: "to-do-list",
    title: "To Do List",
    type: "blog",
    date: "2026-05-24",
    // revised: "2026-05-26",
    edition: "1st edition",
    tags: ["to-do"],
    abstract: "To Do List for this anodyne avenue",
    body:
        '<h2>Sidebar</h2>' +
        '<p></p>' +
        '<h2>Minimap</h2>' +
        '<p>> Post title jump defaults to the title position and does not try to scroll to the top of the page when JS is disabled.</p>' +
        '<p>> Progress bar moved to .</p>' +
        '<h2>Sidebar</h2>' +
        '<p></p>' +
        '<h2>Sidebar</h2>' +
        '<p></p>'

  },
  {
    show: debug_show(false),
    slug: "example_post",
    title: "[DEBUG] Example Post",
    type: "essays",
    date: "2026-05-28",
    edition: "1st edition",
    status: "draft",
    series: "Website notes",
    part: 1,
    confidence: "provisional",
    scope: "personal note",
    tags: ["debug"],
    abstract: "Short abstract here.",
    body:
        "<p>Post body here.</p>"
  },
  {
    show: debug_show(false),
    slug: "template",
    title: "[DEBUG] Template for a post",
    type: "essays",
    date: "2026-05-24",
    // revised: "2026-05-26",
    edition: "1st edition",
    tags: ["debug"],
    abstract: "Template",
    body:
        '<p>This is visible.</p>'
  },
  {
    show: debug_show(false),
    slug: "template-2",
    title: "[DEBUG] Template for a post",
    type: "essays",
    date: "2027-05-24",
    // revised: "2026-05-26",
    edition: "2nd edition",
    tags: ["debug"],
    abstract: "Template",
    body:
        '<p>This is visible. A test of editons and how they render</p>'
  },
  {
    show: debug_show(false),
    slug: "a",
    title: "[DEBUG] hello isla",
    type: "essays",
    date: "2027-05-25",
    revised: "2026-05-26",
    edition: "1st edition",
    tags: ["debug"],
    abstract: "A deliberately short title used to test compact archive entries.",
    body:
        '<p>This is visible.</p>'
  },
  {
    show: debug_show(false),
    slug: "debug_post",
    title: "[DEBUG] Debug Post",
    type: "essays",
    date: "2026-05-26",
    edition: "draft",
    tags: ["debug", "tag 1", "tag 2", "tag 3"],
    abstract: "This will not appear.",
    body:
        '<p>This page will be built.</p>'
  },
  {
    show: debug_show(false),
    slug: "long_nonsense_test",
    title: "[DEBUG] Long Nonsense Test Post",
    type: "blog",
    date: "2026-05-26",
    revised: "2028-08-08",
    edition: "draft",
    tags: ["debug", "layout-test", "longform", "tag 1", "tag 2", "tag 3", "tag 4", "tag 5", "tag 6"],
    abstract: "A deliberately long nonsense post for testing spacing, scrolling, cards, archive layout, and the minimap.",
    body:
        '<p>Velmora thandric solivane perrenthia gralvok nembular fossenly trivanic yelthrope caldorin venshara morthalic dravanel quensibra haldovent prasmira lonthevik sarnival obrethic clandever.</p>' +
        '<p>Fralithen obvessa merlantic dovrane shenvara ulmoric trevashon bindelor castenive prullomar exanthic velludra norvessan yalthimer oscarven drovenith salmaric quenthos.</p>' +

        '<h2>First vardolian section</h2>' +
        '<p>Vardolin crenmora estavik lentharen brissolar quamithen vellorian drenthic osmeral nalthorin perrasken jolmiver antorish selvinar drumbalic festonive harnovel.</p>' +
        '<p>Lumerath shavendor climberon arvestic norphelan tressavik galmorin vethrassa undelith corvamer plensidra torrivan eldanic meskoral fluvendro.</p>' +
        '<p>Prendolin valtheric ossimera candrivel jarnothic belvessa tramorin seldavir ophrenic daskovar yendralis morvethen clussaric trenfolda.</p>' +

        '<h2>Second morvethic section</h2>' +
        '<p>Morvethic dandrelon senvoria luskareth trembovan althesic grondavan yumeroth pergalin fossavert drelmorin venthessa nardovic plessiman.</p>' +
        '<p>Ondravic shentular pellarith gombraven lorthasic vendrimal corlethia zarmoven antelisk qandorin sulvessa tharnomic predavon.</p>' +
        '<p>Yalbrithen tremoria solkaven daverinth mellusian frentivar obselith navrenthic caldovim perranel vostenira quarmelith.</p>' +

        '<h3>Smaller thendric subsection</h3>' +
        '<p>Thendric omlarven pessoria zalcriven northelia brindavos meriquant ellovish carnethor silvundra pravelisk ostendar falmorin.</p>' +
        '<p>Vellorim naskovan drellithia sentovar umbravel corthenik bravidol lomerissa yaskenth folmerin gravessic shontarel.</p>' +

        '<h2>Third quensibar section</h2>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Gralmora shesparin undrelith femorask valcronia prindavel narethic solmivra quendalos trevinal iskaveth plossarian.</p>' +

        '<h2>Fourth eldranic section</h2>' +
        '<p>Eldranic vorphelia tasmorven belsorin clundavia yenthavar osperial nalmoric drasiveth quembralin foltessa remboldin.</p>' +
        '<p>Harnoveth lumbrasic porthalin veskoria fandrelith sorvanel climorath jostevin pramoria keltharin undrovia mossavel.</p>' +
        '<p>Trenvora calmeshic dovrenthia yaskemir bralvonic sesthorin olevandra qestavik narloven fralmodic vensithea.</p>' +

        '<h3>Nested obren subsection</h3>' +
        '<p>Obrenith valmora destivar crenovil plenthora sarnumic grellovan ostemira candrithen vullescar morqavin thessorial.</p>' +
        '<p>Drelmora flassiven trellobar yandoric olvessa primendic shalvoret kesthian nolgraver pendrissa vorthamin.</p>' +

        '<h2>Fifth falsenor section</h2>' +
        '<p>Falsenor brenthavia solmerick danthelia pravossin quarnivel mordrassa jenvothic almerind cressavon hulthamer.</p>' +
        '<p>Ostrevic meldraven yassoria clentharic vornemil pasthelin gromiveth fessandor ulmarive tendrasken joltharia.</p>' +
        '<p>Venshara polthrenic qelvoria drumaneth calsiveri nethromal praskovin ellavoth murdelian sarnithek lostervan.</p>' +

        '<h2>Sixth nembular section</h2>' +
        '<p>Nembular fravendic torlavia shenmorin beldovar yelmorian corthasil premvessa ostalith quensidor lumerasken valthorim.</p>' +
        '<p>Seldrivan merquolic drossaven thamoria pendorish clessamir orvanelith zenthora bralvessa uldemarin fosthavin.</p>' +
        '<p>Nembular fravendic torlavia shenmorin beldovar yelmorian corthasil premvessa ostalith quensidor lumerasken valthorim.</p>' +
        '<p>Seldrivan merquolic drossaven thamoria pendorish clessamir orvanelith zenthora bralvessa uldemarin fosthavin.</p>' +
        '<p>Nembular fravendic torlavia shenmorin beldovar yelmorian corthasil premvessa ostalith quensidor lumerasken valthorim.</p>' +
        '<p>Seldrivan merquolic drossaven thamoria pendorish clessamir orvanelith zenthora bralvessa uldemarin fosthavin.</p>' +
        '<p>Nembular fravendic torlavia shenmorin beldovar yelmorian corthasil premvessa ostalith quensidor lumerasken valthorim.</p>' +
        '<p>Seldrivan merquolic drossaven thamoria pendorish clessamir orvanelith zenthora bralvessa uldemarin fosthavin.</p>' +
        '<p>Nembular fravendic torlavia shenmorin beldovar yelmorian corthasil premvessa ostalith quensidor lumerasken valthorim.</p>' +
        '<p>Seldrivan merquolic drossaven thamoria pendorish clessamir orvanelith zenthora bralvessa uldemarin fosthavin.</p>' +
        '<p>Kelmaric ondriveth sarnolya grimvessin dantelora yosthevik perrival clundorath messavik althorin qemvessa.</p>' +
        '<p>Velmora thandric solivane perrenthia gralvok nembular fossenly trivanic yelthrope caldorin venshara morthalic dravanel quensibra haldovent prasmira lonthevik sarnival obrethic clandever.</p>' +
        '<p>Fralithen obvessa merlantic dovrane shenvara ulmoric trevashon bindelor castenive prullomar exanthic velludra norvessan yalthimer oscarven drovenith salmaric quenthos.</p>' +

        '<h2>First vardolian section</h2>' +
        '<p>Vardolin crenmora estavik lentharen brissolar quamithen vellorian drenthic osmeral nalthorin perrasken jolmiver antorish selvinar drumbalic festonive harnovel.</p>' +
        '<p>Lumerath shavendor climberon arvestic norphelan tressavik galmorin vethrassa undelith corvamer plensidra torrivan eldanic meskoral fluvendro.</p>' +
        '<p>Prendolin valtheric ossimera candrivel jarnothic belvessa tramorin seldavir ophrenic daskovar yendralis morvethen clussaric trenfolda.</p>' +

        '<h2>Second morvethic section</h2>' +
        '<p>Morvethic dandrelon senvoria luskareth trembovan althesic grondavan yumeroth pergalin fossavert drelmorin venthessa nardovic plessiman.</p>' +
        '<p>Ondravic shentular pellarith gombraven lorthasic vendrimal corlethia zarmoven antelisk qandorin sulvessa tharnomic predavon.</p>' +
        '<p>Yalbrithen tremoria solkaven daverinth mellusian frentivar obselith navrenthic caldovim perranel vostenira quarmelith.</p>' +

        '<h3>Smaller thendric subsection</h3>' +
        '<p>Thendric omlarven pessoria zalcriven northelia brindavos meriquant ellovish carnethor silvundra pravelisk ostendar falmorin.</p>' +
        '<p>Vellorim naskovan drellithia sentovar umbravel corthenik bravidol lomerissa yaskenth folmerin gravessic shontarel.</p>' +

        '<h2>Third quensibar section</h2>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Gralmora shesparin undrelith femorask valcronia prindavel narethic solmivra quendalos trevinal iskaveth plossarian.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Gralmora shesparin undrelith femorask valcronia prindavel narethic solmivra quendalos trevinal iskaveth plossarian.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Quensibar marvellen ostrovia dendrimal cassovent belthoria vandriken nolvessa temerash ulvandric prennomar yesthavin crellovia.</p>' +
        '<p>Sarnivol draskelia mendorath velladric polmaren jessithor clavendria ostmiven yultharic frenovash dolmerian trassivel.</p>' +
        '<p>Gralmora shesparin undrelith femorask valcronia prindavel narethic solmivra quendalos trevinal iskaveth plossarian.</p>' +

        '<h2>Fourth eldranic section</h2>' +
        '<p>Eldranic vorphelia tasmorven belsorin clundavia yenthavar osperial nalmoric drasiveth quembralin foltessa remboldin.</p>' +
        '<p>Harnoveth lumbrasic porthalin veskoria fandrelith sorvanel climorath jostevin pramoria keltharin undrovia mossavel.</p>' +
        '<p>Trenvora calmeshic dovrenthia yaskemir bralvonic sesthorin olevandra qestavik narloven fralmodic vensithea.</p>' +

        '<h3>Nested obren subsection</h3>' +
        '<p>Obrenith valmora destivar crenovil plenthora sarnumic grellovan ostemira candrithen vullescar morqavin thessorial.</p>' +
        '<p>Drelmora flassiven trellobar yandoric olvessa primendic shalvoret kesthian nolgraver pendrissa vorthamin.</p>' +

        '<h2>Fifth falsenor section</h2>' +
        '<p>Falsenor brenthavia solmerick danthelia pravossin quarnivel mordrassa jenvothic almerind cressavon hulthamer.</p>' +
        '<p>Ostrevic meldraven yassoria clentharic vornemil pasthelin gromiveth fessandor ulmarive tendrasken joltharia.</p>' +
        '<p>Venshara polthrenic qelvoria drumaneth calsiveri nethromal praskovin ellavoth murdelian sarnithek lostervan.</p>'
  },


  {
    show: debug_show(false),
    slug: "debug_navigation_oldest",
    title: "[DEBUG] Debug Navigation Oldest",
    type: "blog",
    date: "2024-01-01",
    edition: "debug",
    status: "debug",
    tags: ["debug", "navigation", "oldest"],
    abstract: "Debug post for testing the oldest end of global newer/older navigation.",
    body:
        '<p>This post should usually sit at the older end of the global post navigation sequence.</p>' +
        '<h2>Expected behaviour</h2>' +
        '<p>It should have a newer link but no older link when debug posts are enabled.</p>'
  },

  {
    show: debug_show(false),
    slug: "debug_navigation_newest_revised",
    title: "[DEBUG] Debug Navigation Newest Revised",
    type: "guides",
    date: "2024-02-01",
    revised: "2030-12-31",
    edition: "debug",
    status: "debug",
    tags: ["debug", "navigation", "revised"],
    abstract: "Debug post for testing that revised dates override original dates in global navigation.",
    body:
        '<p>This post has an intentionally far-future revised date.</p>' +
        '<h2>Expected behaviour</h2>' +
        '<p>It should sort as the newest visible post when debug posts are enabled.</p>'
  },

  {
    show: debug_show(false),
    slug: "debug_same_date_alpha_aardvark",
    title: "[DEBUG] Aardvark Same Date Debug",
    type: "essays",
    date: "2026-06-01",
    edition: "debug",
    status: "debug",
    tags: ["debug", "sorting", "same-date"],
    abstract: "Debug post for same-date alphabetical ordering tests.",
    body:
        '<p>This post shares an effective date with another debug post.</p>' +
        '<p>The title should place it before Zebra Same Date Debug.</p>'
  },

  {
    show: debug_show(false),
    slug: "debug_same_date_alpha_zebra",
    title: "[DEBUG] Zebra Same Date Debug",
    type: "essays",
    date: "2026-06-01",
    edition: "debug",
    status: "debug",
    tags: ["debug", "sorting", "same-date"],
    abstract: "Debug post for same-date alphabetical ordering tests.",
    body:
        '<p>This post shares an effective date with another debug post.</p>' +
        '<p>The title should place it after Aardvark Same Date Debug.</p>'
  },

  {
    show: debug_show(false),
    slug: "debug_metadata_dense",
    title: "[DEBUG] Debug Metadata Dense Post",
    type: "guides",
    date: "2026-06-02",
    revised: "2026-06-03",
    edition: "debug",
    status: "experimental",
    series: "Debug suite",
    part: 7,
    confidence: "low",
    scope: "metadata stress test",
    audience: "site maintainer",
    tags: ["debug", "metadata", "dense", "tag 1", "tag 2", "tag 3", "tag 4"],
    abstract: "Debug post with several public metadata fields to test metadata pages, footer metadata cards, and archive rendering.",
    body:
        '<p>This post exists to test public metadata rendering.</p>' +
        '<h2>Metadata fields</h2>' +
        '<p>It includes status, series, part, confidence, scope, audience, tags, date, revised date, and edition.</p>'
  },

  {
    show: debug_show(false),
    slug: "debug_empty_minimal_post",
    title: "[DEBUG] Debug Empty Minimal Post",
    type: "blog",
    date: "2026-06-04",
    edition: "debug",
    tags: [],
    abstract: "Debug post with intentionally minimal visible content.",
    body:
        '<p></p>'
  },

  {
    show: debug_show(false),
    slug: "debug_short_post_no_minimap",
    title: "[DEBUG] Debug Short Post No Minimap",
    type: "blog",
    date: "2026-06-05",
    edition: "debug",
    status: "debug",
    tags: ["debug", "minimap", "short"],
    abstract: "Debug post with too few headings to trigger the minimap.",
    body:
        '<p>This post should not create a minimap.</p>' +
        '<h2>Only heading</h2>' +
        '<p>There are fewer than three headings.</p>'
  },

  {
    show: debug_show(false),
    slug: "debug_heading_collision",
    title: "[DEBUG] Debug Heading Collision Post",
    type: "guides",
    date: "2026-06-06",
    edition: "debug",
    status: "debug",
    tags: ["debug", "minimap", "headings"],
    abstract: "Debug post with repeated headings to test generated heading IDs and minimap entries.",
    body:
        '<p>This post repeats heading text several times.</p>' +
        '<h2>Repeat</h2>' +
        '<p>First repeat.</p>' +
        '<h2>Repeat</h2>' +
        '<p>Second repeat.</p>' +
        '<h3>Repeat</h3>' +
        '<p>Nested repeat.</p>' +
        '<h2>Repeat</h2>' +
        '<p>Third repeat.</p>'
  },

  {
    show: debug_show(false),
    slug: "debug_tags_many",
    title: "[DEBUG] Debug Many Tags Post",
    type: "essays",
    date: "2026-06-07",
    edition: "debug",
    status: "debug",
    tags: ["debug", "tag-alpha", "tag-beta", "tag-gamma", "tag-delta", "tag-epsilon", "tag-zeta", "tag-eta", "tag-theta", "tag-iota", "tag-kappa", "tag-lambda"],
    abstract: "Debug post with many tags to stress tag wrapping on post pages, archive cards, and metadata pages.",
    body:
        '<p>This post has many tags.</p>' +
        '<h2>Wrapping</h2>' +
        '<p>The tag row should wrap cleanly without breaking the page width.</p>'
  },

  {
    show: debug_show(false),
    slug: "debug_long_title_and_abstract",
    title: "[DEBUG] Debug Post With an Excessively Long Title Designed to Test Wrapping in Cards, Navigation Links, Metadata Pages, Search Indexes, and Post Headers",
    type: "essays",
    date: "2026-06-08",
    edition: "debug",
    status: "debug",
    tags: ["debug", "layout", "long-title"],
    abstract: "This deliberately overlong abstract is intended to test whether card layouts, metadata value pages, archive rows, section pages, RSS summaries, and post headers continue to behave sensibly when a post description contains much more text than a normal entry would usually contain.",
    body:
        '<p>This post is for long-title and long-abstract layout testing.</p>' +
        '<h2>Long text</h2>' +
        '<p>The site should remain readable and avoid horizontal overflow.</p>'
  },

  {
    show: debug_show(false),
    slug: "debug_special_characters",
    title: "[DEBUG] Debug <Special> & \"Quoted\" Characters",
    type: "guides",
    date: "2026-06-09",
    edition: "debug",
    status: "debug",
    tags: ["debug", "escaping", "special-characters"],
    abstract: "Debug post for checking escaping of <, >, &, and quotes in titles, metadata, feeds, and generated links.",
    body:
        '<p>This post tests escaping in generated HTML.</p>' +
        '<h2>Characters</h2>' +
        '<p>Visible body HTML is intentionally ordinary; metadata contains the special characters.</p>'
  },

  {
    show: debug_show(false),
    slug: "debug_type_blog",
    title: "[DEBUG] Debug Type Blog",
    type: "blog",
    date: "2026-06-10",
    edition: "debug",
    status: "debug",
    tags: ["debug", "type", "blog"],
    abstract: "Debug post for blog type pages and global navigation.",
    body:
        '<p>Blog type debug post.</p>'
  },

  {
    show: debug_show(false),
    slug: "debug_type_guide",
    title: "[DEBUG] Debug Type Guide",
    type: "guides",
    date: "2026-06-11",
    edition: "debug",
    status: "debug",
    tags: ["debug", "type", "guides"],
    abstract: "Debug post for guide type pages and global navigation.",
    body:
        '<p>Guide type debug post.</p>'
  },

  {
    show: debug_show(false),
    slug: "debug_type_essay",
    title: "[DEBUG] Debug Type Essay",
    type: "essays",
    date: "2026-06-12",
    edition: "debug",
    status: "debug",
    tags: ["debug", "type", "essays"],
    abstract: "Debug post for essay type pages and global navigation.",
    body:
        '<p>Essay type debug post.</p>'
  },



  debug_post({
    slug: "debug_zero_length_abstract",
    title: "Zero Length Abstract",
    type: "blog",
    date: "2026-06-13",
    tags: ["abstract", "empty-field"],
    abstract: "Debug post with a deliberately minimal abstract to test compact card spacing without violating required post validation.",
    body:
        '<p>This post originally tested a zero-length abstract, but the generator correctly requires every visible post to have an abstract.</p>' +
        '<h2>Expected behaviour</h2>' +
        '<p>The card should not collapse strangely and metadata pages should not fail.</p>'
  }),

  debug_post({
    slug: "debug_missing_tags_property",
    title: "Missing Tags Property",
    type: "guides",
    date: "2026-06-14",
    abstract: "Debug post deliberately omitting the tags field before debug_post adds the debug tag.",
    body:
        '<p>This post omits a tags array in the config object.</p>' +
        '<h2>Expected behaviour</h2>' +
        '<p>The helper should add the debug tag automatically.</p>'
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
    slug: "debug_unicode_text",
    title: "Unicode, Diacritics, Symbols — α β γ Ω ñ ü 中文",
    type: "guides",
    date: "2026-06-17",
    tags: ["unicode", "escaping", "symbols"],
    abstract: "Debug post containing Unicode, Greek letters, dashes, diacritics, and non-Latin characters.",
    body:
        '<p>Unicode body test: α β γ Ω — ñ ü 中文. This should not corrupt generated pages, feeds, or search indexes.</p>' +
        '<h2>Unicode heading — αβγ</h2>' +
        '<p>The generated heading ID should remain stable even if the visible text contains symbols.</p>'
  }),

  debug_post({
    slug: "debug_html_entities_in_body",
    title: "HTML Entities in Body",
    type: "essays",
    date: "2026-06-18",
    tags: ["html", "entities", "escaping"],
    abstract: "Debug post for HTML entities and inline code-like text.",
    body:
        '<p>This paragraph contains escaped entities: &amp; &lt; &gt; &quot;.</p>' +
        '<h2>Code-like text</h2>' +
        '<p><code>const value = "debug";</code> should inherit sensible inline styling or remain readable by browser default.</p>'
  }),

  debug_post({
    slug: "debug_blockquote_lists",
    title: "Blockquotes and Lists",
    type: "guides",
    date: "2026-06-19",
    tags: ["html", "lists", "blockquote"],
    abstract: "Debug post for blockquotes, unordered lists, ordered lists, and nested-ish content spacing.",
    body:
        '<blockquote><p>This is a blockquote used to test spacing and text colour.</p></blockquote>' +
        '<h2>Lists</h2>' +
        '<ul><li>First unordered item</li><li>Second unordered item with a longer line that should wrap cleanly inside the reading column.</li></ul>' +
        '<ol><li>First ordered item</li><li>Second ordered item</li></ol>'
  }),

  debug_post({
    slug: "debug_deep_heading_levels",
    title: "Deep Heading Levels",
    type: "blog",
    date: "2026-06-20",
    tags: ["minimap", "headings", "hierarchy"],
    abstract: "Debug post for h2, h3, and h4 extraction and minimap indentation.",
    body:
        '<p>This post tests all supported heading levels.</p>' +
        '<h2>Level Two A</h2><p>Text.</p>' +
        '<h3>Level Three A</h3><p>Text.</p>' +
        '<h4>Level Four A</h4><p>Text.</p>' +
        '<h2>Level Two B</h2><p>Text.</p>' +
        '<h3>Level Three B</h3><p>Text.</p>' +
        '<h4>Level Four B</h4><p>Text.</p>'
  }),

  debug_post({
    slug: "debug_massive_minimap",
    title: "Massive Minimap Stress Test",
    type: "guides",
    date: "2026-06-21",
    revised: "2026-06-22",
    tags: ["minimap", "stress", "scroll"],
    abstract: "Debug post with many headings to stress minimap scrolling, active-state tracking, and heading centring.",
    body:
        '<p>This post generates many headings.</p>' +
        debug_sections("Massive minimap", 48, 2)
  }),

  debug_post({
    slug: "debug_very_long_body",
    title: "Very Long Body Stress Test",
    type: "essays",
    date: "2026-06-23",
    tags: ["longform", "scroll", "performance"],
    abstract: "Debug post with a long body but fewer headings, intended to test page length, word counts, and footer placement.",
    body:
        '<h2>Long body</h2>' +
        debug_paragraph("long-body", 120)
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
    body:
        '<p>This post tests public metadata field generation.</p>' +
        '<h2>Expected behaviour</h2>' +
        '<p>Additional metadata fields should appear in consistent order and should not create broken routes.</p>'
  }),

  debug_post({
    slug: "debug_tag_case_spacing",
    title: "Tag Case and Spacing",
    type: "essays",
    date: "2026-06-27",
    tags: ["Tag With Spaces", "tag with spaces", "TAG WITH SPACES", "debug spaced tag", "debug/slash/tag"],
    abstract: "Debug post for tag slug generation, case normalisation, spacing, and slash handling.",
    body:
        '<p>This post tests whether visually similar tags collide or remain usable.</p>' +
        '<h2>Tags</h2>' +
        '<p>Inspect metadata tag pages and tag links.</p>'
  }),

  debug_post({
    slug: "debug_manual_heading_ids",
    title: "Manual Heading IDs",
    type: "blog",
    date: "2026-06-28",
    tags: ["headings", "anchors", "manual-id"],
    abstract: "Debug post with pre-existing heading IDs to test that the generator preserves them.",
    body:
        '<p>This post includes manual heading IDs.</p>' +
        '<h2 id="manual_anchor">Manual Anchor</h2>' +
        '<p>The generator should preserve this ID.</p>' +
        '<h2>Automatic Anchor</h2>' +
        '<p>The generator should create this ID.</p>' +
        '<h3 id="manual_nested_anchor">Manual Nested Anchor</h3>' +
        '<p>The minimap should link to the manual nested ID.</p>'
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
    body:
        '<p>This post contains intentionally invalid maths with errors allowed.</p>' +
        math_display(String.raw`\notarealcommand{x}`)
  }),

  debug_post({
    slug: "debug_responsive_long_unbroken_text",
    title: "Responsive Long Unbroken Text",
    type: "essays",
    date: "2026-06-30",
    tags: ["responsive", "overflow", "long-word"],
    abstract: "Debug post for a long unbroken body string that may reveal horizontal overflow problems.",
    body:
        '<p>supercalifragilisticexpialidocioussupercalifragilisticexpialidocioussupercalifragilisticexpialidocioussupercalifragilisticexpialidocious</p>' +
        '<h2>Expected behaviour</h2>' +
        '<p>The page should avoid destructive horizontal overflow where possible.</p>'
  }),

  debug_post({
    slug: "debug_archive_year_1999",
    title: "Archive Year 1999",
    type: "blog",
    date: "1999-12-31",
    tags: ["archive", "old-date"],
    abstract: "Debug post with a very old date to test archive ordering and feed dates.",
    body: '<p>This post should sit at the old end of chronological views.</p>'
  }),

  debug_post({
    slug: "debug_archive_year_2099",
    title: "Archive Year 2099",
    type: "blog",
    date: "2099-01-01",
    tags: ["archive", "future-date"],
    abstract: "Debug post with a far future original date to test future-date ordering.",
    body: '<p>This post should sit near the future end unless revised dates supersede it.</p>'
  }),

  debug_post({
    slug: "debug_navigation_middle_anchor",
    title: "Navigation Middle Anchor",
    type: "guides",
    date: "2026-07-01",
    tags: ["navigation", "middle"],
    abstract: "Debug post intended to have both newer and older neighbours when the full suite is enabled.",
    body:
        '<p>This post should usually have both a newer and an older global navigation link.</p>' +
        '<h2>Check</h2>' +
        '<p>Inspect the two-card newer/older layout.</p>'
  }),
  {
    show: debug_show(false),
    slug: "math-rendering-examples",
    title: "[DEBUG] Math Rendering Examples",
    type: "guides",
    date: "2026-05-30",
    edition: "example",
    status: "hidden example",
    uses_math: true,
    math_macros: {
      "\\E": "\\vec{E}",
      "\\B": "\\vec{B}",
      "\\dd": "\\,\\mathrm{d}",
      "\\ket": "\\left|#1\\right\\rangle",
      "\\bra": "\\left\\langle#1\\right|"
    },
    tags: ["debug","math", "physics", "example"],
    abstract: "Hidden example post showing inline, display, labelled, aligned, matrix, cases, vector-calculus, and bra-ket maths rendering.",
    body:
        '<p>This hidden post demonstrates build-time maths rendering. Inline maths works inside a paragraph, for example ' + math_inline(String.raw`E = mc^2`) + ' or ' + math_inline(String.raw`\psi(x)=\langle x\mid\psi\rangle`) + '.</p>' +
        '<h2>Display equations</h2>' +
        '<p>A display equation can be unlabelled:</p>' +
        math_display(String.raw`\nabla \cdot \E = \frac{\rho}{\epsilon_0}`) +
        '<p>It can also carry a quiet caption:</p>' +
        math_display(String.raw`\vec{F} = q\left(\E + \vec{v}\times\B\right)`, 'Lorentz force') +
        '<h2>Aligned working</h2>' +
        math_display(String.raw`
\begin{aligned}
\nabla \cdot \E &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \B &= 0 \\
\nabla \times \E &= -\frac{\partial \B}{\partial t} \\
\nabla \times \B &= \mu_0\vec{J}+\mu_0\epsilon_0\frac{\partial \E}{\partial t}
\end{aligned}
`, 'Maxwell equations, differential form') +
        '<h2>Matrices and cases</h2>' +
        math_display(String.raw`
A = \begin{pmatrix}
a & b \\
c & d
\end{pmatrix},\qquad
f(x)=\begin{cases}
x^2, & x\ge 0 \\
-x^2, & x<0
\end{cases}
`) +
        '<h2>Integrals and quantum notation</h2>' +
        math_display(String.raw`
\oint_{\partial S}\B\cdot\dd\vec{\ell}=\mu_0 I_{\mathrm{enc}},\qquad
\bra{\phi}\hat{A}\ket{\psi}=\int_D \phi^*(x)(\hat{A}\psi)(x)\dd x
`, 'Mixed physics notation')
  },

];

if (typeof module !== "undefined") {
  module.exports = posts;
}