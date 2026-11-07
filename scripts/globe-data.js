/* Everything on the site, grouped by area, for the globe on the home page.
   One node per thing. Short labels; full titles are on the Research page.
   href: where a click goes. q: a search term that finds the item on the Research page. */
var GLOBE_DATA = {
  areas: [
    { id: 'neuro', label: 'Neurodevelopment',   href: 'research.html?area=neuro' },
    { id: 'onc',   label: 'Immuno-oncology',    href: 'research.html?area=onc' },
    { id: 'ra',    label: 'Drug repositioning', href: 'research.html?area=ra' },
    { id: 'dev',   label: 'Drug development',   href: 'research.html?area=dev' },
    { id: 'inf',   label: 'Innate immunity',    href: 'research.html?area=inf' },
    { id: 'tools', label: 'Open-source tools',  href: 'tools.html' }
  ],
  methods: [
    { id: 'sys',   label: 'pathway modeling',  near: ['ra', 'dev', 'inf', 'onc'], href: 'projects.html' },
    { id: 'omics', label: 'multi-omics',       near: ['neuro', 'onc'],             href: 'projects.html#preterm-brain-and-cerebellar-development' },
    { id: 'ml',    label: 'machine learning',  near: ['neuro', 'onc'],             href: 'projects.html' },
    { id: 'twin',  label: 'digital twins',     near: ['onc', 'dev'],               href: 'projects.html#beat-aml-drug-response-prediction-and-digital-twins' },
    { id: 'gen',   label: 'cancer genomics',   near: ['onc', 'dev'],               href: 'projects.html#cancer-nutrition-databases-and-patent-consulting' },
    { id: 'beh',   label: 'behavior analysis', near: ['neuro', 'tools'],           href: 'projects.html#preterm-brain-and-cerebellar-development' },
    { id: 'db',    label: 'drug databases',    near: ['dev', 'tools'],             href: 'projects.html#drug-knowledge-base-and-digital-drug-models' },
    { id: 'iot',   label: 'lab software',      near: ['tools'],                    href: 'projects.html#myvivarium-open-source-lab-animal-platform' }
  ],
  items: [
    /* neurodevelopment */
    { area: 'neuro', type: 'project', label: 'Preterm brain project, 2025 to now',         methods: ['omics', 'ml', 'beh'], href: 'projects.html#preterm-brain-and-cerebellar-development' },
    { area: 'neuro', type: 'paper',   label: 'Science 2026, cerebellar timing',            methods: ['omics', 'ml'],  q: 'Intrinsic Gestational Timing' },
    { area: 'neuro', type: 'paper',   label: 'Brain 2026, prematurity and behaviour',      methods: ['omics', 'beh'], q: 'Prematurity Insults Remodel' },
    { area: 'neuro', type: 'talk',    label: 'NEC and the pons, 2025',                     methods: ['omics'],        q: 'Necrotizing Enterocolitis' },
    { area: 'neuro', type: 'talk',    label: 'Early rehabilitation, 2025',                 methods: ['beh'],          q: 'Early postnatal rehabilitation' },
    { area: 'neuro', type: 'project', label: 'Neonatal brain-injury modeling, 2021 to 2022', methods: ['sys'],        href: 'projects.html#neonatal-brain-injury-modeling' },
    { area: 'neuro', type: 'paper',   label: 'Neonatal excitotoxicity model, 2022',        methods: ['sys'],          q: 'excitotoxicity' },
    /* immuno-oncology and AML digital twins */
    { area: 'onc', type: 'project', label: 'BEAT AML digital twins, 2017 to 2019',         methods: ['twin', 'gen'],  href: 'projects.html#beat-aml-drug-response-prediction-and-digital-twins' },
    { area: 'onc', type: 'project', label: 'Multi-cell biomarker modeling, 2019',          methods: ['sys'],          href: 'projects.html#multi-cell-immuno-oncology-biomarker-modeling' },
    { area: 'onc', type: 'paper',   label: 'Multi-cell biomarker profiles, 2019',          methods: ['sys'],          q: 'Multi-Cell Biomarker Profiles' },
    { area: 'onc', type: 'paper',   label: 'BET inhibitor response, 2019',                 methods: ['twin', 'gen'],  q: 'BET inhibitors using computational modeling' },
    { area: 'onc', type: 'paper',   label: 'Eph/Ephrin in skin cancer, 2025',              methods: ['sys'],          q: 'Eph/Ephrin' },
    { area: 'onc', type: 'talk',    label: 'ADE response in pediatric AML, 2018',          methods: ['twin', 'gen'],  q: 'AraC-Daunorubicin-Etoposide' },
    { area: 'onc', type: 'talk',    label: 'Dasatinib response, 2018',                     methods: ['twin'],         q: 'Dasatinib' },
    { area: 'onc', type: 'talk',    label: 'BET with palbociclib or sorafenib, 2018',      methods: ['twin'],         q: 'Palbociclib/Sorafenib' },
    { area: 'onc', type: 'talk',    label: 'CDK4/6 inhibitor response, 2017',              methods: ['twin'],         q: 'CDK4/6' },
    { area: 'onc', type: 'talk',    label: 'BET inhibitor validation, 2017',               methods: ['twin'],         q: 'BET Inhibitors Using a Computational Model' },
    { area: 'onc', type: 'talk',    label: 'IDH inhibitors beyond mutations, 2017',        methods: ['gen'],          q: 'IDH1/IDH2' },
    { area: 'onc', type: 'talk',    label: 'Venetoclax genomic signature, 2016',           methods: ['gen', 'ml'],    q: 'Venetoclax' },
    { area: 'onc', type: 'patent',  label: 'Nelfinavir combination patent, 2018',          methods: ['sys'],          q: 'nelfinavir' },
    { area: 'onc', type: 'article', label: 'Article: digital twins in medicine',           methods: ['twin'],         href: 'articles/digital-twin-leukemia-patient.html' },
    /* rheumatoid arthritis and drug repositioning */
    { area: 'ra', type: 'project', label: 'Immune-signaling modeling, 2007 to 2008',       methods: ['sys'],          href: 'projects.html#immune-signaling-pathway-modeling' },
    { area: 'ra', type: 'talk',    label: 'sEH inhibitor and inflammation, 2008',          methods: ['sys'],          q: 'Epoxide Hydrolase' },
    { area: 'ra', type: 'project', label: 'Rheumatoid-arthritis model, 2008 to 2012',      methods: ['sys'],          href: 'projects.html#rheumatoid-arthritis-model-and-repurposed-combination-therapy' },
    { area: 'ra', type: 'talk',    label: 'Repurposed combination in arthritis, 2012',     methods: ['sys'],          q: 'Repurposed Therapies' },
    { area: 'ra', type: 'talk',    label: 'Oral RA therapy modeling, 2012',                methods: ['sys'],          q: 'Oral Therapies for Rheumatoid Arthritis' },
    { area: 'ra', type: 'patent',  label: 'Inflammatory disease patent, 2014',             methods: ['sys'],          q: 'US20140127295A1' },
    { area: 'ra', type: 'patent',  label: 'Inflammatory disease patent, 2015',             methods: ['sys'],          q: 'US20150098993A1' },
    { area: 'ra', type: 'article', label: 'Article: drug repositioning by modeling',       methods: ['sys'],          href: 'articles/drug-repositioning-computational-approaches.html' },
    /* drug development platform */
    { area: 'dev', type: 'project', label: 'Drug-repurposing platform, 2011 to 2013',      methods: ['sys'],          href: 'projects.html#drug-repurposing-platform-and-predictive-modeling-methods' },
    { area: 'dev', type: 'project', label: 'Drug knowledge base, 2014 to 2017',            methods: ['db', 'twin'],   href: 'projects.html#drug-knowledge-base-and-digital-drug-models' },
    { area: 'dev', type: 'patent',  label: 'Therapeutic development method patent, 2015', methods: ['sys'],          q: 'development of therapeutic solutions' },
    { area: 'dev', type: 'project', label: 'Cancer-nutrition databases, 2019 to 2022',     methods: ['db', 'gen'],    href: 'projects.html#cancer-nutrition-databases-and-patent-consulting' },
    { area: 'dev', type: 'patent',  label: 'Plant supplement combination patent, 2022',    methods: ['db'],           q: 'US11478444B2' },
    { area: 'dev', type: 'patent',  label: 'Plant compound combination patent, 2023',      methods: ['db'],           q: 'EP3861992B1' },
    /* mucosal and innate immunity */
    { area: 'inf', type: 'project', label: 'Innate-immune modeling, 2013 to 2014',         methods: ['sys'],          href: 'projects.html#mucosal-and-innate-immune-modeling' },
    { area: 'inf', type: 'paper',   label: 'Histatin 5 and HagB, 2014',                    methods: ['sys'],          q: 'Histatin 5' },
    { area: 'inf', type: 'paper',   label: 'DEFB103 and cytokine responses, 2013',         methods: ['sys'],          q: 'DEFB103' },
    { area: 'inf', type: 'talk',    label: 'Oral inflammatory response model, 2014',       methods: ['sys'],          q: 'Oral Inflammatory Response' },
    { area: 'inf', type: 'talk',    label: 'HBD3 and dendritic cells, 2013',               methods: ['sys'],          q: 'HBD3' },
    /* open-source tools: one node per tool, also linked to the area it serves */
    { area: 'tools', type: 'tool', label: 'enrichlite',   methods: ['omics'],     also: ['neuro'], href: 'https://robinsonvidva.com/enrichlite/' },
    { area: 'tools', type: 'tool', label: 'drugtargets',  methods: ['db', 'gen'], also: ['dev'],   href: 'https://drugtargets.robinsonvidva.com' },
    { area: 'tools', type: 'tool', label: 'DrugInteract', methods: ['db'],        also: ['dev'],   href: 'https://robinsonvidva.com/DrugInteract/' },
    { area: 'tools', type: 'tool', label: 'neokine',      methods: ['beh', 'ml'], also: ['neuro'], href: 'https://robinsonvidva.com/neokine/' },
    { area: 'tools', type: 'tool', label: 'neokine-labs', methods: ['beh'],       also: ['neuro'], href: 'https://robinsonvidva.com/neokine-labs/' },
    { area: 'tools', type: 'tool', label: 'MyVivarium',   methods: ['iot'],       also: ['neuro'], href: 'tools.html#myvivarium' },
    { area: 'tools', type: 'article', label: 'Article: over-representation analysis', methods: ['omics'], href: 'articles/gene-set-over-representation-analysis.html' }
  ]
};
