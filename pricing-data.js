// Tarif de l'abonnement mensuel + promotions : édité dans le back-office, lu par les pages publiques.
(function () {
  const KEY = 'afd-pricing-v1';
  window.addEventListener('focus', () => { data = load(); emit(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { data = load(); emit(); } });
  const TODAY = (() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); })();
  const SEED = {
    base: 15000,
    premium: 50000,
    plans: [{ m: 1, disc: 0 }, { m: 3, disc: 5 }, { m: 6, disc: 10 }, { m: 12, disc: 20 }],
    promos: [
      { id: 'p1', name: 'Rentrée des cadres 2026', price: 12000, start: '2026-09-20', end: '2026-10-15', banner: 'Offre de rentrée : l\u2019abonnement mensuel passe à 12 000 FCFA jusqu\u2019au 15 octobre.', enabled: true },
      { id: 'p2', name: 'Black Friday', price: 10000, start: '2026-11-27', end: '2026-11-30', banner: 'Black Friday : 1 mois d\u2019accès à 10 000 FCFA, 4 jours seulement.', enabled: true },
      { id: 'p0', name: 'Lancement de la plateforme', price: 9000, start: '2026-03-01', end: '2026-03-31', banner: 'Offre de lancement', enabled: true },
    ],
  };
  const listeners = new Set();
  const load = () => { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.base) { if (!s.plans) s.plans = JSON.parse(JSON.stringify(SEED.plans)); if (!s.premium) s.premium = SEED.premium; return s; } } catch (e) {} return JSON.parse(JSON.stringify(SEED)); };
  let data = load();
  const emit = () => listeners.forEach(f => { try { f(); } catch (e) {} });
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} emit(); };
  window.addEventListener('storage', e => { if (e.key === KEY) { data = load(); emit(); } });
  const d = s => { const [y, m, j] = s.split('-').map(Number); return new Date(y, m - 1, j); };
  const status = (p, at) => { at = at || TODAY; if (!p.enabled) return 'off'; if (at < d(p.start)) return 'scheduled'; if (at > new Date(d(p.end).getTime() + 864e5 - 1)) return 'ended'; return 'live'; };
  const fmt = v => Math.round(v).toLocaleString('fr-FR').replace(/\u202f|\u00a0/g, ' ') + ' FCFA';
  const fdate = s => d(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  window.AFD_PRICE = {
    TODAY, fmt, fdate, status,
    get: () => data,
    current: at => { const live = data.promos.filter(p => status(p, at) === 'live' && p.price < data.base).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0) || b.start.localeCompare(a.start))[0]; const price = live ? live.price : data.base; return { base: data.base, price, promo: live || null, off: live ? Math.round((1 - live.price / data.base) * 100) : 0, label: fmt(price), baseLabel: fmt(data.base), until: live ? fdate(live.end) : '' }; },
    TIERS: { basic: { id: 'basic', name: 'Basic', features: ['Tous les cours Basic du catalogue', 'Évaluations et examen final', 'Certificat numérique vérifiable', 'Support par e-mail'] }, premium: { id: 'premium', name: 'Premium', features: ['Tout le contenu Basic', 'Accès aux cours Premium exclusifs', 'Fiches-outils et modèles téléchargeables', 'Sessions live mensuelles avec les experts', 'Support prioritaire sous 24 h'] } },
    tierPrice: (tier, at) => { const c = window.AFD_PRICE.current(at); return tier === 'premium' ? (data.premium || SEED.premium) : c.price; },
    plans: (at, tier) => { const c = window.AFD_PRICE.current(at); const mp = tier === 'premium' ? (data.premium || SEED.premium) : c.price, mb = tier === 'premium' ? (data.premium || SEED.premium) : c.base; return (data.plans || SEED.plans).map(p => { const gross = mp * p.m, total = Math.round(gross * (1 - p.disc / 100) / 100) * 100, grossBase = mb * p.m; return { m: p.m, disc: p.disc, name: p.m === 12 ? '1 an' : p.m + ' mois', total, gross, perMonth: Math.round(total / p.m / 100) * 100, save: grossBase - total, label: fmt(total), perMonthLabel: fmt(Math.round(total / p.m / 100) * 100), grossLabel: fmt(grossBase), saveLabel: fmt(grossBase - total) }; }); },
    plan: (m, at, tier) => window.AFD_PRICE.plans(at, tier).find(p => p.m === m) || window.AFD_PRICE.plans(at, tier)[0],
    // Passage Basic → Premium, méthode A : le crédit restant est déduit, le Premium repart de zéro à partir d'aujourd'hui (une seule date de renouvellement).
    upgradeQuote: ({ paid, start, end, today, months }) => { const DAY = 864e5; const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate()); const total = Math.max(1, Math.round((end - start) / DAY)), left = Math.max(0, Math.round((end - t0) / DAY)); const credit = Math.round(paid * left / total / 5) * 5; const pl = window.AFD_PRICE.plan(months || 1, t0, 'premium'); const due = Math.max(0, pl.total - credit); const addM = (dd, n) => { const y = dd.getFullYear(), m = dd.getMonth() + n, day = dd.getDate(); const last = new Date(y, m + 1, 0).getDate(); return new Date(y, m, Math.min(day, last)); }; return { total, left, credit, premium: pl.total, due, newStart: t0, newEnd: addM(t0, pl.m), months: pl.m, creditLabel: fmt(credit), dueLabel: fmt(due), premiumLabel: fmt(pl.total), formula: fmt(paid) + ' × ' + left + '/' + total }; },
    setPlans: plans => { data = Object.assign({}, data, { plans }); persist(); },
    setBase: v => { data = Object.assign({}, data, { base: v }); persist(); },
    savePromo: p => { const i = data.promos.findIndex(x => x.id === p.id); p = Object.assign({ createdAt: i >= 0 ? (data.promos[i].createdAt || 0) : Date.now() }, p); data = Object.assign({}, data, { promos: i >= 0 ? data.promos.map(x => x.id === p.id ? p : x) : [p].concat(data.promos) }); persist(); },
    removePromo: id => { data = Object.assign({}, data, { promos: data.promos.filter(x => x.id !== id) }); persist(); },
    reset: () => { data = JSON.parse(JSON.stringify(SEED)); persist(); },
    subscribe: f => { listeners.add(f); return () => listeners.delete(f); },
  };
})();
