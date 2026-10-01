// Source unique des cours : lue par le catalogue (Formations) et éditée par le back-office.
(function () {
  const KEY = 'afd-catalogue-v1';
  const DOMAINS = [['lead', 'users', 'Leadership & management'], ['fin', 'landmark', 'Finance & gestion'], ['proj', 'square-kanban', 'Gestion de projet'], ['neg', 'handshake', 'Négociation & influence'], ['dig', 'cpu', 'Transformation digitale'], ['law', 'scale', 'Droit & conformité']];
  const SECTORS = [['bank', 'landmark', 'Banque & assurance'], ['tel', 'radio-tower', 'Télécoms'], ['nrg', 'zap', 'Énergie & mines'], ['agro', 'wheat', 'Agro-industrie'], ['pub', 'building-2', 'Secteur public'], ['ong', 'heart-handshake', 'ONG & développement'], ['health', 'stethoscope', 'Santé'], ['btp', 'hard-hat', 'BTP & industrie'], ['log', 'truck', 'Logistique & port']];
  const EXPERTS_SEED = [['an', 'Dr Aïssatou Ndiaye', 'Ancienne DRH groupe bancaire'], ['jmk', 'Jean-Marc Kouassi, CFA', 'Directeur financier'], ['sa', 'Serge Ahouansou', 'Directeur PMO, Cotonou'], ['mt', 'Mariam Traoré', 'Négociatrice internationale'], ['om', 'Olivier Mensah', 'Ex-CTO fintech'], ['ado', 'Afiavi Dossou', 'Experte bailleurs de fonds'], ['fbk', 'Me Fatou Bensouda-Kane', 'Avocate d\u2019affaires']];
  const EXTRA = {
    an: ['Dakar', 'lead', 'Expert', 'Docteure en sciences de gestion, ancienne DRH d\u2019un groupe bancaire panafricain. Coach certifiée de comités de direction.', 'a.ndiaye@africadres.com', '+221 77 540 12 88', '4,9'],
    jmk: ['Abidjan', 'fin', 'Expert', 'Vingt ans de direction financière dans l\u2019industrie et la banque en Afrique de l\u2019Ouest. Charterholder CFA, il a piloté trois levées de fonds régionales.', 'jm.kouassi@africadres.com', '+225 07 48 33 91 20', '4,8'],
    sa: ['Cotonou', 'proj', 'Expert', 'Directeur PMO à Cotonou, certifié PMP et PSM II. Il a piloté des programmes d\u2019infrastructure financés par la BOAD.', 's.ahouansou@africadres.com', '+229 01 96 42 18 07', '4,7'],
    mt: ['Bamako', 'neg', 'Expert', 'Négociatrice pour des accords commerciaux régionaux, intervenante dans plusieurs écoles de commerce.', 'm.traore@africadres.com', '+223 76 21 44 09', '4,8'],
    om: ['Lomé', 'dig', 'Expert', 'Ancien CTO d\u2019une fintech de paiement mobile, conseiller en transformation digitale pour le secteur public.', 'o.mensah@africadres.com', '+228 90 12 55 73', '4,6'],
    ado: ['Cotonou', 'fin', 'Contributrice', 'Spécialiste de la gestion financière de projets financés par les bailleurs internationaux.', 'a.dossou@africadres.com', '+229 01 97 63 25 41', '4,7'],
    fbk: ['Dakar', 'law', 'Expert', 'Avocate d\u2019affaires, spécialiste du droit OHADA et de la conformité bancaire.', 'f.bensouda@africadres.com', '+221 76 318 40 52', '4,8'],
  };
  const XKEY = 'afd-experts-v2';
  const MORE = { an: [22, 'Leadership situationnel, conduite du changement, coaching de dirigeants', 'Français, Wolof, Anglais', 'Docteure en sciences de gestion (Université Cheikh Anta Diop) · Coach certifiée ICF'], jmk: [20, 'Analyse financière, levée de fonds, contrôle de gestion, SYSCOHADA', 'Français, Anglais', 'CFA Charterholder · Master Finance (ESCA Abidjan)'], sa: [15, 'Scrum, gestion de portefeuille, projets d\u2019infrastructure', 'Français, Fon, Anglais', 'PMP · PSM II · Ingénieur génie civil (EPAC)'], mt: [18, 'Négociation commerciale, médiation, accords régionaux', 'Français, Bambara, Anglais', 'Master Commerce international (HEC Paris)'], om: [16, 'Stratégie digitale, paiement mobile, data et IA', 'Français, Éwé, Anglais', 'Ingénieur informatique · Executive MBA'], ado: [12, 'Gestion financière de projets, audit bailleurs, rapportage', 'Français, Anglais', 'Expert-comptable · Certification BAD / Banque mondiale'], fbk: [19, 'Droit OHADA, conformité LBC/FT, contrats commerciaux', 'Français, Anglais', 'Avocate au barreau de Dakar · DEA Droit des affaires'] };
  const xSeed = () => EXPERTS_SEED.map(([id, name, role]) => { const e = EXTRA[id], m = MORE[id] || [0, '', 'Français', '']; return { id, name, role, city: e[0], domain: e[1], kind: e[2], bio: e[3], email: e[4], phone: e[5], rating: e[6], status: 'Actif', years: m[0], skills: m[1], langs: m[2], creds: m[3], linkedin: 'linkedin.com/in/' + id }; });
  const xLoad = () => { try { const s = JSON.parse(localStorage.getItem(XKEY)); if (Array.isArray(s) && s.length) return s; } catch (e) {} return xSeed(); };
  let experts = xLoad();
  const TINT = { lead: '#1E3A66', fin: '#132C52', proj: '#0F4D40', neg: '#3A2E14', dig: '#132C52', law: '#3A2E14' };
  const c = (id, domain, sectors, title, expert, level, duration, pages, price, recMonths, recPace, status, version, subs, ph, desc, objectives, chapters) =>
    ({ id, domain, sectors, title, expert, level, duration, pages, price, recMonths, recPace, status, version, subs, ph, desc, objectives, chapters, tint: TINT[domain] });
  const SEED = [
    c('lead1', 'lead', ['bank', 'pub', 'tel'], 'Leadership et management d\u2019équipe', 'an', 'Intermédiaire', '6 h', 64, 12000, 2, 3, 'Publié', 'v2.4', 804, 'Manager animant une réunion',
      'Passer de l\u2019expertise technique au management d\u2019équipe : poser un cadre, déléguer, motiver et gérer les tensions, avec des cas issus de banques, d\u2019administrations et d\u2019opérateurs télécoms ouest-africains.',
      ['Adapter son style de leadership à chaque collaborateur', 'Conduire des entretiens de recadrage et d\u2019évaluation', 'Déléguer avec un suivi clair', 'Prévenir et désamorcer les conflits'],
      ['Du rôle d\u2019expert au rôle de manager', 'Les styles de leadership', 'Fixer des objectifs et déléguer', 'Motiver et reconnaître', 'Gérer les conflits', 'Plan de progrès personnel']),
    c('lead2', 'lead', ['pub', 'ong'], 'Conduire le changement', 'an', 'Expert', '4 h', 40, 12000, 3, 3, 'Publié', 'v1.2', 318, 'Atelier de transformation',
      'Méthodes pour préparer, annoncer et piloter une transformation organisationnelle en limitant les résistances.',
      ['Diagnostiquer la maturité au changement', 'Construire un plan de communication', 'Identifier et embarquer les relais', 'Mesurer l\u2019adoption'],
      ['Pourquoi les changements échouent', 'Diagnostic et cartographie des acteurs', 'Le récit du changement', 'Accompagner les résistances', 'Mesurer et ancrer']),
    c('lead3', 'lead', ['bank', 'tel', 'health'], 'Prise de parole en public', 'mt', 'Fondamental', '3 h', 32, 8000, 1, 3, 'Publié', 'v1.0', 262, 'Intervenante sur scène',
      'Structurer un message, capter l\u2019attention et gérer le trac en réunion, en comité ou sur scène.',
      ['Structurer une intervention en trois temps', 'Maîtriser voix, posture et regard', 'Répondre aux questions difficiles', 'Gérer le trac'],
      ['Préparer son message', 'La voix et le corps', 'Supports visuels', 'Questions-réponses', 'Entraînement guidé']),
    c('fin1', 'fin', ['bank', 'agro', 'btp', 'ong'], 'Finance pour non-financiers', 'jmk', 'Fondamental', '5 h', 48, 10000, 2, 3, 'Publié', 'v3.2', 612, 'Cadre analysant des chiffres',
      'Lire un bilan SYSCOHADA, comprendre un compte de résultat, piloter la trésorerie et dialoguer d\u2019égal à égal avec la direction financière.',
      ['Lire un bilan et un compte de résultat', 'Calculer et interpréter le BFR', 'Utiliser les ratios clés', 'Construire un budget simple'],
      ['Lire un bilan', 'Le compte de résultat', 'Trésorerie et BFR', 'Les ratios clés', 'Budget et prévisions', 'Décision d\u2019investissement']),
    c('fin2', 'fin', ['bank', 'nrg'], 'Contrôle de gestion opérationnel', 'jmk', 'Intermédiaire', '4 h 30', 44, 10000, 2, 4, 'Publié', 'v1.5', 205, 'Tableau de bord financier',
      'Concevoir des tableaux de bord utiles, analyser les écarts et piloter la performance d\u2019une unité opérationnelle.',
      ['Choisir des indicateurs pertinents', 'Analyser les écarts budgétaires', 'Calculer des coûts complets', 'Animer une revue de performance'],
      ['Rôle du contrôle de gestion', 'Calcul des coûts', 'Budget et écarts', 'Tableaux de bord', 'Revue de performance']),
    c('fin3', 'fin', ['ong', 'pub'], 'Gestion financière des projets de développement', 'ado', 'Intermédiaire', '5 h', 50, 12000, 3, 4, 'Publié', 'v1.1', 176, 'Réunion de suivi de projet',
      'Budgétiser, suivre et justifier les dépenses d\u2019un projet financé par un bailleur international.',
      ['Construire un budget par activité', 'Respecter les règles d\u2019éligibilité', 'Préparer un rapport financier', 'Réussir un audit de projet'],
      ['Cycle de projet et bailleurs', 'Budget par activité', 'Suivi des dépenses', 'Rapportage financier', 'Audit et clôture']),
    c('proj1', 'proj', ['tel', 'btp', 'pub'], 'Gestion de projet agile', 'sa', 'Intermédiaire', '5 h 30', 56, 10000, 2, 3, 'Publié', 'v1.8', 455, 'Équipe devant un kanban',
      'Scrum, Kanban et pilotage hybride : livrer plus vite, avec des équipes responsabilisées et des parties prenantes alignées.',
      ['Organiser un sprint de bout en bout', 'Rédiger et prioriser un backlog', 'Animer les cérémonies agiles', 'Combiner agile et cycle en V'],
      ['Pourquoi l\u2019agilité', 'Le cadre Scrum', 'Kanban et flux', 'Backlog et priorisation', 'Pilotage hybride', 'Cas pratique']),
    c('proj2', 'proj', ['btp', 'nrg', 'log'], 'Piloter un projet d\u2019infrastructure', 'sa', 'Expert', '6 h', 62, 15000, 3, 4, 'Brouillon', 'v1.0', 0, 'Chantier et ingénieurs',
      'Planifier, contractualiser et piloter un projet d\u2019infrastructure, de l\u2019étude de faisabilité à la réception.',
      ['Structurer un planning directeur', 'Gérer les contrats et avenants', 'Piloter les risques', 'Organiser la réception'],
      ['Faisabilité et montage', 'Planification', 'Contrats et marchés', 'Risques', 'Réception et clôture']),
    c('neg1', 'neg', ['bank', 'agro', 'log'], 'Négociation stratégique', 'mt', 'Expert', '4 h 30', 52, 15000, 3, 3, 'Publié', 'v2.0', 371, 'Négociation autour d\u2019une table',
      'Préparer, conduire et conclure des négociations complexes, y compris en contexte multiculturel.',
      ['Préparer sa MESORE et sa zone d\u2019accord', 'Cartographier les acteurs', 'Échanger concessions et contreparties', 'Sortir d\u2019une impasse'],
      ['Préparer', 'Cartographier les acteurs', 'Ouvrir la négociation', 'Concessions et contreparties', 'Négocier en contexte multiculturel', 'Sortir d\u2019une impasse']),
    c('neg2', 'neg', ['agro', 'log'], 'Négocier avec les acheteurs internationaux', 'mt', 'Intermédiaire', '4 h', 42, 12000, 2, 3, 'Publié', 'v1.3', 188, 'Rendez-vous commercial',
      'Défendre ses prix et ses conditions face aux centrales d\u2019achat et aux importateurs.',
      ['Comprendre la logique de l\u2019acheteur', 'Défendre sa marge', 'Négocier les Incoterms', 'Sécuriser le paiement'],
      ['Profil des acheteurs', 'Préparer son offre', 'Défendre son prix', 'Clauses et Incoterms', 'Conclure']),
    c('dig1', 'dig', ['bank', 'tel', 'pub'], 'Transformation digitale des organisations', 'om', 'Intermédiaire', '6 h', 60, 12000, 2, 3, 'Publié', 'v1.3', 520, 'Dirigeant devant des données',
      'Construire une feuille de route digitale réaliste et embarquer les équipes, avec des exemples de fintechs, d\u2019opérateurs et d\u2019administrations.',
      ['Diagnostiquer sa maturité digitale', 'Construire une feuille de route', 'Piloter par la donnée', 'Choisir ses partenaires technologiques'],
      ['Comprendre la rupture digitale', 'Diagnostiquer sa maturité', 'Construire la feuille de route', 'Données et décision', 'Embarquer les équipes', 'Choisir ses partenaires']),
    c('dig2', 'dig', ['bank', 'health', 'pub'], 'Data et IA pour décideurs', 'om', 'Fondamental', '4 h', 38, 10000, 1, 4, 'Brouillon', 'v0.9', 0, 'Analyse de données en équipe',
      'Comprendre ce que la donnée et l\u2019IA peuvent réellement apporter, et poser les bonnes questions à ses équipes.',
      ['Distinguer les usages de l\u2019IA', 'Évaluer un projet data', 'Anticiper les risques', 'Mettre en place une gouvernance'],
      ['Donnée et valeur', 'IA : ce qu\u2019elle sait faire', 'Choisir un cas d\u2019usage', 'Risques et éthique', 'Gouvernance']),
    c('law1', 'law', ['bank', 'agro', 'btp'], 'Droit OHADA des affaires', 'fbk', 'Fondamental', '5 h', 58, 8000, 1, 3, 'Publié', 'v1.1', 290, 'Juriste en entretien',
      'Les fondamentaux de l\u2019Acte uniforme OHADA : sociétés, contrats commerciaux, sûretés et recouvrement.',
      ['Choisir une forme de société', 'Sécuriser un contrat commercial', 'Comprendre les sûretés', 'Engager un recouvrement'],
      ['L\u2019espace OHADA', 'Droit des sociétés', 'Contrats commerciaux', 'Sûretés', 'Recouvrement']),
    c('law2', 'law', ['bank', 'tel'], 'Conformité, éthique et lutte anti-blanchiment', 'fbk', 'Intermédiaire', '4 h', 44, 10000, 1, 3, 'Publié', 'v1.0', 164, 'Comité de conformité',
      'Mettre en place un dispositif de conformité conforme aux exigences BCEAO et GAFI.',
      ['Identifier les obligations LBC/FT', 'Construire une cartographie des risques', 'Mettre en place le KYC', 'Déclarer une opération suspecte'],
      ['Cadre réglementaire', 'Cartographie des risques', 'KYC et vigilance', 'Déclarations', 'Culture éthique']),
    c('compta', 'fin', ['bank'], 'Comptabilité SYSCOHADA (édition 2019)', 'jmk', 'Fondamental', '5 h', 52, 8000, 2, 3, 'Retiré', 'v1.4', 12, 'Pièces comptables',
      'Ancienne édition remplacée par « Finance pour non-financiers ».', ['Passer les écritures courantes'], ['Principes', 'Écritures', 'Clôture']),
  ];
  const listeners = new Set();
  const PREMIUM = ['neg1', 'lead2', 'proj2', 'fin3', 'law2'];
  const withTier = a => a.map(c => c.tier ? c : Object.assign({}, c, { tier: PREMIUM.includes(c.id) ? 'premium' : 'basic' }));
  function load() { try { const s = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(s) && s.length) return withTier(s); } catch (e) {} return withTier(SEED.map(x => JSON.parse(JSON.stringify(x)))); }
  let courses = load();
  function emit() { listeners.forEach(fn => { try { fn(); } catch (e) {} }); }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(courses)); } catch (e) {} emit(); }
  window.addEventListener('storage', e => { if (e.key === 'afd-sub-tier') emit(); if (e.key === KEY) { courses = load(); emit(); } if (e.key === XKEY) { experts = xLoad(); emit(); } });
  function xPersist() { try { localStorage.setItem(XKEY, JSON.stringify(experts)); } catch (e) {} emit(); }
  window.AFD = {
    DOMAINS, SECTORS, TINT,
    get EXPERTS() { return experts.map(x => [x.id, x.name, x.role]); },
    getExperts: () => experts,
    saveExpert: x => { const i = experts.findIndex(e => e.id === x.id); experts = i >= 0 ? experts.map(e => e.id === x.id ? x : e) : experts.concat(x); xPersist(); return x; },
    blankExpert: () => ({ id: 'x' + Date.now().toString(36), name: '', role: '', city: 'Cotonou', domain: 'lead', kind: 'Expert', bio: '', email: '', phone: '+229 01 ', rating: '—', status: 'Actif', years: '', skills: '', langs: 'Français', creds: '', linkedin: '' }),
    assignCourse: (courseId, expertId) => { courses = courses.map(c => c.id === courseId ? Object.assign({}, c, { expert: expertId }) : c); persist(); },
    domainName: id => (DOMAINS.find(d => d[0] === id) || [, , id])[2],
    sectorName: id => (SECTORS.find(d => d[0] === id) || [, , id])[2],
    expert: id => { const x = experts.find(e => e.id === id) || experts[0] || { id: '', name: '—', role: '' }; return x; },
    getCourses: () => courses,
    myTier: () => { try { return localStorage.getItem('afd-sub-tier') || 'basic'; } catch (e) { return 'basic'; } },
    setMyTier: t => { try { localStorage.setItem('afd-sub-tier', t); } catch (e) {} emit(); },
    canAccess: c => c.tier !== 'premium' || window.AFD.myTier() === 'premium',
    getPublished: () => courses.filter(c => c.status === 'Publié'),
    getCourse: id => courses.find(c => c.id === id),
    saveCourse: c => { c = Object.assign({}, c, { tint: TINT[c.domain] || '#132C52' }); const i = courses.findIndex(x => x.id === c.id); courses = i >= 0 ? courses.map((x, j) => j === i ? c : x) : [c].concat(courses); persist(); return c; },
    deleteCourse: id => { courses = courses.filter(c => c.id !== id); persist(); },
    blank: () => ({ id: 'c' + Date.now().toString(36), tier: 'basic', domain: 'lead', sectors: [], title: '', expert: 'an', level: 'Fondamental', duration: '', pages: 0, price: 10000, recMonths: 2, recPace: 3, status: 'Brouillon', version: 'v1.0', subs: 0, ph: 'Visuel du cours', desc: '', objectives: [''], chapters: [''], tint: TINT.lead }),
    reset: () => { courses = SEED.map(x => JSON.parse(JSON.stringify(x))); experts = xSeed(); try { localStorage.removeItem(XKEY); } catch (e) {} persist(); },
    subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn); },
  };
})();
