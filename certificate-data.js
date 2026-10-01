// Modèle de certificat (édité par l'admin) + certificats délivrés (demandés par les apprenants).
(function () {
  const KEY = 'afd-cert-v1';
  const DEF = { modelRev: 5, tpl: { version: 4, name: 'Modèle officiel Africadres 2026', bg: './certificat-modele-africadres.png', bgName: 'certificat-modele-africadres.png', bgSize: '', align: 'center', color: '#0B1F3A', nameY: 50, signer: 'Rodrigue Agbodjogbé', signerTitle: 'Directeur académique', mention: 'a suivi avec succès la formation', updatedAt: '1 septembre 2026' }, issued: [] };
  const listeners = new Set();
  const load = () => { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.tpl) { if (!s.modelRev) { s.modelRev = 5; if (!s.tpl.bg) s.tpl = Object.assign({}, DEF.tpl, { sig: s.tpl.sig, sigOk: s.tpl.sigOk, sigSigned: s.tpl.sigSigned, signer: s.tpl.signer || DEF.tpl.signer, signerTitle: s.tpl.signerTitle || DEF.tpl.signerTitle, version: Math.max(s.tpl.version || 0, DEF.tpl.version) }); try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} } return s; } } catch (e) {} return JSON.parse(JSON.stringify(DEF)); };
  let data = load();
  const emit = () => listeners.forEach(fn => { try { fn(); } catch (e) {} });
  const persist = () => { let ok = true; try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { ok = false; } emit(); return ok; };
  window.addEventListener('storage', e => { if (e.key === KEY) { data = load(); emit(); } });
  window.addEventListener('focus', () => { data = load(); emit(); });
  const frDate = d => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  const W = 1123, H = 794;
  const F = (w, s, fam) => w + ' ' + s + 'px ' + (fam || '"Plus Jakarta Sans", Inter, sans-serif');
  function qr(x, X, Y, S, seed) {
    const n = 25, c = S / n; let h = 7;
    for (const ch of String(seed)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const rnd = () => { h = (h * 1103515245 + 12345) >>> 0; return (h >>> 16) & 1; };
    x.fillStyle = '#fff'; x.fillRect(X - 6, Y - 6, S + 12, S + 12); x.fillStyle = '#0B1F3A';
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const inF = (i < 8 && j < 8) || (i > n - 9 && j < 8) || (i < 8 && j > n - 9); if (!inF && rnd()) x.fillRect(X + i * c, Y + j * c, c + .3, c + .3); }
    const fin = (a, b) => { x.fillStyle = '#0B1F3A'; x.fillRect(X + a * c, Y + b * c, 7 * c, 7 * c); x.fillStyle = '#fff'; x.fillRect(X + (a + 1) * c, Y + (b + 1) * c, 5 * c, 5 * c); x.fillStyle = '#0B1F3A'; x.fillRect(X + (a + 2) * c, Y + (b + 2) * c, 3 * c, 3 * c); };
    fin(0, 0); fin(n - 7, 0); fin(0, n - 7);
  }
  function drawDefault(x, d) {
    x.fillStyle = '#FBF9F4'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#0B1F3A'; x.fillRect(0, 0, 250, H);
    x.save(); x.beginPath(); x.rect(0, 0, 250, H); x.clip(); x.strokeStyle = 'rgba(201,162,75,.22)'; x.lineWidth = 1;
    for (let i = -H; i < 250 + H; i += 22) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + H, H); x.stroke(); x.beginPath(); x.moveTo(i + H, 0); x.lineTo(i, H); x.stroke(); }
    x.restore();
    x.strokeStyle = '#C9A24B'; x.lineWidth = 1; x.strokeRect(272, 22, W - 294, H - 44); x.strokeRect(278, 28, W - 306, H - 56);
    x.textAlign = 'left'; x.fillStyle = '#fff'; x.font = F(800, 22); x.fillText('AFRI', 40, 76); const w = x.measureText('AFRI').width; x.font = F(500, 22); x.fillText('CADRES', 40 + w, 76);
    x.fillStyle = '#C9A24B'; x.font = F(600, 10, 'Inter, sans-serif'); try { x.letterSpacing = '3px'; } catch (e) {} x.fillText('INSTITUT DE FORMATION', 40, 98); try { x.letterSpacing = '0px'; } catch (e) {}
    const cy = H - 150; x.beginPath(); x.arc(125, cy, 64, 0, Math.PI * 2); x.fillStyle = '#132C52'; x.fill(); x.strokeStyle = '#C9A24B'; x.lineWidth = 2; x.stroke();
    x.beginPath(); x.arc(125, cy, 54, 0, Math.PI * 2); x.lineWidth = 1; x.stroke();
    x.textAlign = 'center'; x.fillStyle = '#C9A24B'; x.font = F(700, 11, 'Inter, sans-serif'); x.fillText('CERTIFIÉ', 125, cy - 6); x.font = F(800, 20); x.fillText(d.year || '2026', 125, cy + 18);
  }
  function render(t, d, scale) {
    scale = scale || 1;
    const cv = document.createElement('canvas'); cv.width = W * scale; cv.height = H * scale;
    const x = cv.getContext('2d'); x.scale(scale, scale);
    const fit = (text, w, size, max) => { let s = size; x.font = F(w, s); while (x.measureText(text).width > max && s > 16) { s -= 2; x.font = F(w, s); } };
    const go = (img, sig) => {
      const custom = !!img;
      if (custom) { const r = Math.max(W / img.width, H / img.height), iw = img.width * r, ih = img.height * r; x.drawImage(img, (W - iw) / 2, (H - ih) / 2, iw, ih); } else drawDefault(x, d);
      const left = custom ? 90 : 320, right = custom ? W - 90 : W - 70, center = t.align === 'center', cx = center ? (left + right) / 2 : left;
      const main = t.color || '#0B1F3A', sub = main === '#FFFFFF' ? 'rgba(255,255,255,.85)' : main === '#A8802F' ? '#6B5220' : '#4A5568', gold = main === '#FFFFFF' ? '#E4C77E' : '#A8802F';
      const ny = H * (t.nameY || 46) / 100;
      x.textAlign = center ? 'center' : 'left'; x.textBaseline = 'alphabetic';
      x.fillStyle = gold; x.font = F(700, 13, 'Inter, sans-serif'); try { x.letterSpacing = '4px'; } catch (e) {} x.fillText('CERTIFICAT DE RÉUSSITE', cx, ny - 118); try { x.letterSpacing = '0px'; } catch (e) {}
      x.fillStyle = sub; x.font = F(400, 17, 'Inter, sans-serif'); x.fillText('Décerné à', cx, ny - 58);
      x.fillStyle = main; fit(d.name, 800, 52, right - left); x.fillText(d.name, cx, ny);
      x.fillStyle = gold; x.fillRect(center ? cx - 60 : cx, ny + 22, 120, 2);
      x.fillStyle = sub; x.font = F(400, 17, 'Inter, sans-serif'); x.fillText(t.mention || '', cx, ny + 66);
      const ct = '« ' + d.course + ' »'; x.fillStyle = main; fit(ct, 700, 30, right - left); x.fillText(ct, cx, ny + 112);
      x.fillStyle = sub; x.font = F(500, 15, 'Inter, sans-serif'); x.fillText('Score obtenu : ' + d.score + '  ·  Délivré le ' + d.date, cx, ny + 152);
      const fy = H - 84; x.textAlign = 'left';
      if (sig) { const sh = 64, sw = Math.min(220, sig.width * sh / sig.height); x.drawImage(sig, left, fy - 30 - sh - 2, sw, sh); }
      if (t.sig && t.sigSigned) { x.fillStyle = sub; x.font = F(400, 10, 'Inter, sans-serif'); x.fillText('Signé électroniquement · ' + t.sigSigned, left + 232, fy - 34); }
      x.strokeStyle = sub; x.lineWidth = 1; x.beginPath(); x.moveTo(left, fy - 30); x.lineTo(left + 220, fy - 30); x.stroke();
      x.fillStyle = main; x.font = F(700, 15); x.fillText(t.signer || '', left, fy - 6); x.fillStyle = sub; x.font = F(400, 13, 'Inter, sans-serif'); x.fillText(t.signerTitle || '', left, fy + 14);
      const qs = 92, qx = right - qs, qy = H - 60 - qs; qr(x, qx, qy, qs, d.id);
      x.textAlign = 'right'; x.fillStyle = sub; x.font = F(500, 12, 'ui-monospace, Menlo, monospace'); x.fillText(d.id, qx - 18, qy + 52); x.font = F(400, 12, 'Inter, sans-serif'); x.fillText('Vérifier : africadres.com/verifier', qx - 18, qy + 72);
      return cv.toDataURL('image/png');
    };
    const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    const li = src => src ? new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; }) : Promise.resolve(null);
    return ready.then(() => Promise.all([li(t.bg), li(t.sig)])).then(([a, b]) => go(a, b));
  }
  function shrink(file) {
    return new Promise((res, rej) => { const r = new FileReader(); r.onerror = rej; r.onload = () => { const im = new Image(); im.onerror = rej; im.onload = () => { const cv = document.createElement('canvas'); cv.width = 1684; cv.height = 1191; const x = cv.getContext('2d'); const k = Math.max(cv.width / im.width, cv.height / im.height); x.drawImage(im, (cv.width - im.width * k) / 2, (cv.height - im.height * k) / 2, im.width * k, im.height * k); res(cv.toDataURL('image/jpeg', .85)); }; im.src = r.result; }; r.readAsDataURL(file); });
  }
  function trimSig(cv) {
    const x = cv.getContext('2d'), w = cv.width, h = cv.height, px = x.getImageData(0, 0, w, h).data; let x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let y = 0; y < h; y++) for (let i = 0; i < w; i++) if (px[(y * w + i) * 4 + 3] > 10) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) return null; const p = 6; x0 = Math.max(0, x0 - p); y0 = Math.max(0, y0 - p); x1 = Math.min(w - 1, x1 + p); y1 = Math.min(h - 1, y1 + p);
    const o = document.createElement('canvas'); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1; o.getContext('2d').drawImage(cv, x0, y0, o.width, o.height, 0, 0, o.width, o.height); return o.toDataURL('image/png');
  }
  function sigFromFile(file) {
    return new Promise((res, rej) => { const r = new FileReader(); r.onerror = rej; r.onload = () => { const im = new Image(); im.onerror = rej; im.onload = () => { const k = Math.min(1, 600 / im.width, 240 / im.height); const cv = document.createElement('canvas'); cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k); const x = cv.getContext('2d'); x.drawImage(im, 0, 0, cv.width, cv.height); const id = x.getImageData(0, 0, cv.width, cv.height), p = id.data; for (let i = 0; i < p.length; i += 4) { const l = (p[i] + p[i + 1] + p[i + 2]) / 3; if (l > 225) p[i + 3] = 0; } x.putImageData(id, 0, 0); res(trimSig(cv)); }; im.src = r.result; }; r.readAsDataURL(file); });
  }
  const _bu = new Map();
  function blobUrl(src) {
    if (!src || src.indexOf('data:') !== 0) return src || '';
    if (_bu.has(src)) return _bu.get(src);
    const [h, b64] = src.split(','); const mime = (h.match(/data:([^;]+)/) || [, 'image/png'])[1];
    const bin = atob(b64), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    const url = URL.createObjectURL(new Blob([u8], { type: mime }));
    if (_bu.size > 12) { const k0 = _bu.keys().next().value; URL.revokeObjectURL(_bu.get(k0)); _bu.delete(k0); }
    _bu.set(src, url); return url;
  }
  const css = src => src ? 'url(' + blobUrl(src) + ')' : 'none';
  window.AFD_CERT = {
    blobUrl, css,
    trimSig, sigFromFile,
    W, H, get: () => data, frDate, render, shrink,
    SAMPLE: { name: 'Sènami Hounkpatin', course: 'Finance pour non-financiers', score: '88 %', date: '30 septembre 2026', id: 'AFD-2026-FIN-04817', year: '2026' },
    publish: t => { data.tpl = Object.assign({}, t, { version: (data.tpl.version || 1) + 1, updatedAt: frDate(new Date()) }); return persist(); },
    issue: d => { const id = 'AFD-2026-' + (d.code || 'CRS') + '-' + String(4820 + data.issued.length).padStart(5, '0'); const rec = Object.assign({}, d, { id, date: frDate(new Date()), tplVersion: data.tpl.version, at: Date.now() }); data.issued = [rec].concat(data.issued); persist(); return rec; },
    resetIssued: email => { data.issued = data.issued.filter(r => r.email !== email); persist(); },
    findIssued: (courseId, email) => data.issued.find(r => r.courseId === courseId && r.email === email),
    subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn); },
  };
})();
