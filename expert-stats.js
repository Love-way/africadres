// Statistiques des experts (démo déterministe) : lues par l'Espace expert et le back-office.
(function () {
  const h = s => { let x = 2166136261; for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; };
  const rng = seed => { let s = seed || 1; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; };
  const MONTHS = ['Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.'];
  const NAMES = ['Sènami H.', 'Gildas H.', 'Fifamè A.', 'Codjo Z.', 'Awa D.', 'Kouamé Y.', 'Mahougnon A.', 'Isabelle D.', 'Arnaud K.', 'Aminata S.', 'Rodrigue A.', 'Nadège T.', 'Ismaël O.', 'Bérénice G.', 'Fabrice M.'];
  const ROLES = ['Responsable financière · SBEE', 'Chef de projet · MTN Bénin', 'Juriste · Cabinet Adjovi', 'Directeur logistique · Port de Cotonou', 'Manager RH · Sonatel', 'Directeur commercial · SIB', 'Contrôleur de gestion · Ecobank', 'Coordinatrice · ONG Alafia', 'Ingénieur · SONEB', 'Auditrice · KPMG Dakar'];
  const GOOD = ['Contenu très concret, avec des cas africains qui parlent à notre quotidien.', 'Clair, structuré et directement applicable dès le lundi suivant.', 'Le meilleur support que j\u2019ai lu sur le sujet. Les exemples chiffrés aident beaucoup.', 'Je l\u2019ai suivi sur mon téléphone entre deux réunions : parfait.', 'L\u2019examen final est exigeant mais juste. Le certificat a de la valeur.', 'Très bonne progression pédagogique, on ne se perd jamais.'];
  const MID = ['Bon contenu, mais certains chapitres mériteraient plus d\u2019exercices.', 'Intéressant ; la partie finale est un peu dense.', 'Utile, j\u2019aurais aimé davantage de modèles à télécharger.'];
  const LOW = ['Trop théorique à mon goût sur le chapitre 3.'];
  const QS = ['Calcul du BFR à partir d\u2019un bilan simplifié', 'Différence entre EBE et résultat d\u2019exploitation', 'Choisir le bon style de leadership selon la situation', 'Ordre des cérémonies dans un sprint', 'Identifier sa MESORE avant une négociation', 'Lecture d\u2019un ratio de liquidité', 'Délai de prescription en droit OHADA', 'Priorisation d\u2019un backlog (méthode MoSCoW)'];

  function course(c) {
    const r = rng(h(c.id));
    const live = c.status === 'Publié';
    const learners = live ? (c.subs || Math.round(120 + r() * 700)) : 0;
    const favorites = Math.round(learners * (0.16 + r() * 0.2));
    const rating = live ? Math.round((4.15 + r() * 0.75) * 10) / 10 : 0;
    const reviews = Math.round(learners * (0.14 + r() * 0.12));
    const p5 = Math.min(.86, Math.max(.4, (rating - 3.4) / 1.7)), p4 = (1 - p5) * .68, p3 = (1 - p5 - p4) * .62, p2 = (1 - p5 - p4 - p3) * .6;
    const dist = [p5, p4, p3, p2, Math.max(0, 1 - p5 - p4 - p3 - p2)].map(p => Math.round(p * reviews));
    const completion = live ? Math.round(52 + r() * 34) : 0;
    const passRate = live ? Math.round(68 + r() * 24) : 0;
    const certs = Math.round(learners * completion / 100 * passRate / 100);
    const growth = .55 + r() * .25;
    const monthly = MONTHS.map((m, i) => ({ m, v: live ? Math.round(learners / 3.2 * (growth + (1 - growth) * i / 5) * (0.9 + r() * 0.2)) : 0 }));
    const chs = (c.chapters || []).filter(Boolean);
    let reach = 100;
    const funnel = chs.map((t, i) => { if (i) reach = Math.max(completion, Math.round(reach - (100 - completion) / chs.length * (0.6 + r() * 0.9))); if (i === chs.length - 1) reach = completion; return { n: i + 1, t, v: live ? reach : 0 }; });
    const hard = QS.slice().sort(() => r() - .5).slice(0, 3).map(q => ({ q, ok: Math.round(38 + r() * 22) }));
    const revs = [];
    const nRev = live ? 4 + Math.floor(r() * 4) : 0;
    for (let i = 0; i < nRev; i++) { const s = r() < .7 ? 5 : r() < .75 ? 4 : r() < .7 ? 3 : 2; const pool = s >= 5 ? GOOD : s >= 3 ? MID : LOW; const day = 1 + Math.floor(r() * 26); revs.push({ name: NAMES[Math.floor(r() * NAMES.length)], role: ROLES[Math.floor(r() * ROLES.length)], stars: s, text: pool[Math.floor(r() * pool.length)], date: new Date(2026, 8 - Math.floor(i / 3), day), course: c.title, courseId: c.id }); }
    const avgTime = live ? Math.round((parseFloat(String(c.duration || '5').replace(',', '.')) || 5) * (1.1 + r() * .5) * 10) / 10 : 0;
    return { id: c.id, title: c.title, status: c.status, live, learners, favorites, rating, reviews, dist, completion, passRate, certs, monthly, funnel, hard, revs, avgTime, tint: c.tint };
  }
  function expert(id) {
    const A = window.AFD; if (!A) return null;
    const cs = A.getCourses().filter(c => c.expert === id && c.status !== 'Retiré').map(course);
    const live = cs.filter(c => c.live);
    const learners = live.reduce((a, c) => a + c.learners, 0);
    const reviews = live.reduce((a, c) => a + c.reviews, 0);
    const rating = reviews ? Math.round(live.reduce((a, c) => a + c.rating * c.reviews, 0) / reviews * 10) / 10 : 0;
    const w = (k) => learners ? Math.round(live.reduce((a, c) => a + c[k] * c.learners, 0) / learners) : 0;
    const dist = [0, 1, 2, 3, 4].map(i => live.reduce((a, c) => a + c.dist[i], 0));
    const monthly = MONTHS.map((m, i) => ({ m, v: live.reduce((a, c) => a + c.monthly[i].v, 0) }));
    const revs = live.flatMap(c => c.revs).sort((a, b) => b.date - a.date);
    const all = A.getExperts().map(x => { const s = A.getCourses().filter(c => c.expert === x.id && c.status === 'Publié').map(course); const rv = s.reduce((a, c) => a + c.reviews, 0); return { id: x.id, r: rv ? s.reduce((a, c) => a + c.rating * c.reviews, 0) / rv : 0 }; }).filter(x => x.r).sort((a, b) => b.r - a.r);
    const rank = all.findIndex(x => x.id === id) + 1;
    const prev = monthly[4].v, cur = monthly[5].v;
    return { id, courses: cs, live: live.length, learners, favorites: live.reduce((a, c) => a + c.favorites, 0), reviews, rating, dist, completion: w('completion'), passRate: w('passRate'), certs: live.reduce((a, c) => a + c.certs, 0), monthly, revs, rank, of: all.length, trend: prev ? Math.round((cur - prev) / prev * 100) : 0 };
  }
  window.AFD_XSTATS = { course, expert, MONTHS };
})();
