const posts = [
  {
    show: true,
    slug: "template",
    title: "Template for a post",
    type: "essays",
    date: "2026-05-24",
    // revised: "2026-05-26",
    edition: "1st edition",
    tags: ["template"],
    abstract: "Template",
    body:
        '<p>This is visible.</p>'
  },
  {
    show: true,
    slug: "a",
    title: "hello isla",
    type: "essays",
    date: "2026-05-25",
    revised: "2026-05-26",
    edition: "1st edition",
    tags: ["debug"],
    abstract: "A deliberately short title used to test compact archive entries.",
    body:
        '<p>This is visible.</p>'
  },
  {
    show: false,
    slug: "debug_post",
    title: "Debug Post",
    type: "blog",
    date: "2026-05-26",
    edition: "draft",
    tags: ["debug"],
    abstract: "This will not appear.",
    body:
        '<p>This page will not be built.</p>'
  },
  {
    show: true,
    slug: "long_nonsense_test",
    title: "Long Nonsense Test Post",
    type: "blog",
    date: "2026-05-26",
    edition: "draft",
    tags: ["debug", "layout-test", "longform"],
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
        '<p>Kelmaric ondriveth sarnolya grimvessin dantelora yosthevik perrival clundorath messavik althorin qemvessa.</p>'
  }
];

if (typeof module !== "undefined") {
  module.exports = posts;
}