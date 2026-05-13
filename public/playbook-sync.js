// Realtime shared persistence for the JORO playbook.
// Loads + saves edits to Lovable Cloud (Supabase) and syncs across all viewers.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hkwnykyogphszeigvsry.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrd255a3lvZ3Boc3plaWd2c3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODY0OTIsImV4cCI6MjA5MzU2MjQ5Mn0.S2Hcdonk5HU6ed4M3mk72uaJgJTN3mKxEnkUa9XFx9g';

const supa = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

const KEY_BUDGET = 'budgetData2026';
const KEY_EQUIPMENT = 'equipmentState';
const KEY_TEXTS = 'editableTexts';

let applyingRemote = false;
let texts = {}; // path -> html

// ---------- Helpers ----------
function nodePath(el) {
  if (!el || el === document.body) return '';
  const parts = [];
  let cur = el;
  while (cur && cur !== document.body && cur.parentElement) {
    const parent = cur.parentElement;
    const same = Array.from(parent.children).filter(c => c.tagName === cur.tagName);
    const idx = same.indexOf(cur);
    let seg = cur.tagName.toLowerCase();
    if (cur.id) { seg += '#' + cur.id; parts.unshift(seg); break; }
    if (same.length > 1) seg += `:nth-of-type(${idx + 1})`;
    parts.unshift(seg);
    cur = parent;
  }
  return parts.join('>');
}

async function saveKV(key, value) {
  if (applyingRemote) return;
  try {
    await supa.from('playbook_kv').upsert({ key, value, updated_at: new Date().toISOString() });
  } catch (e) { console.warn('saveKV failed', key, e); }
}

function debounce(fn, ms) {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

const saveBudgetDebounced = debounce(() => {
  if (window.budgetData2026) saveKV(KEY_BUDGET, window.budgetData2026);
}, 300);

const saveEquipmentDebounced = debounce(() => {
  try {
    const v = JSON.parse(localStorage.getItem('joro_equipment_v2') || '{}');
    saveKV(KEY_EQUIPMENT, v);
  } catch {}
}, 300);

const saveTextsDebounced = debounce(() => saveKV(KEY_TEXTS, texts), 400);

// ---------- Apply remote state ----------
function applyBudget(remote) {
  if (!Array.isArray(remote) || !window.budgetData2026) return;
  applyingRemote = true;
  try {
    // Merge by description (stable key)
    remote.forEach(rItem => {
      const local = window.budgetData2026.find(i => i.description === rItem.description);
      if (local) Object.assign(local, rItem);
    });
    if (typeof window.renderBudget === 'function') window.renderBudget();
  } finally { applyingRemote = false; }
}

function applyEquipment(remote) {
  if (!remote || typeof remote !== 'object') return;
  applyingRemote = true;
  try {
    localStorage.setItem('joro_equipment_v2', JSON.stringify(remote));
    if (typeof window.renderEquipment === 'function') window.renderEquipment();
    if (typeof window.updateHealthOverview === 'function') window.updateHealthOverview();
  } finally { applyingRemote = false; }
}

function applyTexts(remote) {
  if (!remote || typeof remote !== 'object') return;
  texts = { ...remote };
  applyingRemote = true;
  try {
    Object.entries(remote).forEach(([path, html]) => {
      try {
        const el = document.querySelector(cssFromPath(path));
        if (el && document.activeElement !== el) el.innerHTML = html;
      } catch {}
    });
  } finally { applyingRemote = false; }
}

function cssFromPath(path) {
  // path uses '>' separators already valid for CSS
  return path.replace(/>/g, ' > ');
}

// ---------- Wrap existing mutators ----------
function wrapMutators() {
  const wrap = (name, after) => {
    const orig = window[name];
    if (typeof orig !== 'function') return;
    window[name] = function (...args) {
      const r = orig.apply(this, args);
      try { after(); } catch (e) { console.warn(name, e); }
      return r;
    };
  };
  wrap('editAmount', saveBudgetDebounced);
  wrap('toggleRecup', saveBudgetDebounced);
  wrap('addPrestataire', saveBudgetDebounced);
  wrap('removePrestataire', saveBudgetDebounced);
  wrap('cycleHealth', saveEquipmentDebounced);
  wrap('updateEquipmentNote', saveEquipmentDebounced);

  // Wrap togglePageLock so we attach text-save listeners after the page wires editables.
  const origToggle = window.togglePageLock;
  if (typeof origToggle === 'function') {
    window.togglePageLock = function () {
      const r = origToggle.apply(this, arguments);
      setTimeout(attachTextSavers, 50);
      return r;
    };
  }
}

function attachTextSavers() {
  const els = document.querySelectorAll('[contenteditable="true"]');
  els.forEach(el => {
    if (el.dataset.syncWired) return;
    // Skip the budget cells (they go through editAmount which already saves the data model)
    if (el.classList.contains('editable-cell')) return;
    el.dataset.syncWired = '1';
    const path = nodePath(el);
    if (!path) return;
    el.dataset.syncPath = path;
    el.addEventListener('blur', () => {
      if (applyingRemote) return;
      texts[path] = el.innerHTML;
      saveTextsDebounced();
    });
  });
}

// ---------- Init ----------
async function init() {
  try {
    const { data, error } = await supa.from('playbook_kv').select('key,value');
    if (error) { console.warn('load error', error); }
    else if (data) {
      data.forEach(row => {
        if (row.key === KEY_BUDGET) applyBudget(row.value);
        else if (row.key === KEY_EQUIPMENT) applyEquipment(row.value);
        else if (row.key === KEY_TEXTS) applyTexts(row.value);
      });
    }
  } catch (e) { console.warn('init load failed', e); }

  wrapMutators();

  // Realtime
  supa.channel('playbook_kv_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'playbook_kv' }, (payload) => {
      const row = payload.new || payload.old;
      if (!row) return;
      if (row.key === KEY_BUDGET) applyBudget(row.value);
      else if (row.key === KEY_EQUIPMENT) applyEquipment(row.value);
      else if (row.key === KEY_TEXTS) applyTexts(row.value);
    })
    .subscribe();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(init, 100));
} else {
  setTimeout(init, 100);
}
