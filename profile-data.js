// Profil de l'apprenant connecté : source unique pour tout l'espace apprenant.
(function () {
  const KEY = 'afd-me-v1';
  const DEF = { first: 'Sènami', last: 'Hounkpatin', email: 's.hounkpatin@groupe-atlantique.bj', phone: '01 97 45 21 38', certName: '', idConfirmedAt: 1773273600000 };
  const listeners = new Set();
  const load = () => { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.first != null) return Object.assign({}, DEF, s); } catch (e) {} return Object.assign({}, DEF); };
  let d = load();
  const emit = () => listeners.forEach(fn => { try { fn(); } catch (e) {} });
  window.addEventListener('storage', e => { if (e.key === KEY) { d = load(); emit(); } });
  window.addEventListener('focus', () => { d = load(); emit(); });
  const derive = x => { const full = (x.first.trim() + ' ' + x.last.trim()).replace(/\s+/g, ' ').trim(); return Object.assign({}, x, { full, ini: ((x.first.trim()[0] || '') + (x.last.trim()[0] || '')).toUpperCase(), cert: (x.certName || '').trim() || full, certCustom: !!(x.certName || '').trim() }); };
  window.AFD_ME = {
    get: () => { const x = derive(d); x.certName = ''; x.cert = x.full; x.certCustom = false; return x; }, DEF,
    set: patch => window.AFD_ME.save(patch),
    // Identité certifiée : nom verrouillé, aucun nom de certificat personnalisé.
    save: patch => { patch = Object.assign({}, patch); if (d.idConfirmedAt && !patch.__adminCorrection) { delete patch.first; delete patch.last; } delete patch.__adminCorrection; patch.certName = ''; d = Object.assign({}, d, patch); try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} emit(); return derive(d); },
    subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn); },
  };
})();
