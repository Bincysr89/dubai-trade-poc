import { useState, useRef, useEffect } from 'react';
import Header from './Header';
import { IntegratedClearanceIcon } from './AgentIcons';
import seaIconSrc from '../assets/icon-sea.svg';
import airIconSrc from '../assets/icon-air.svg';
import truckIconSrc from '../assets/External Truck.svg';
import shipIconSrc from '../assets/Ship (12).svg';
import planeIconSrc from '../assets/Plane (5).svg';

type Props = { onClose: () => void };

const font = "'Dubai', sans-serif";

/* ── Data ── */
const TRADE_OPTIONS = [
  { key: 'import',   label: 'Import',    desc: 'Bringing goods into Dubai',     color: '#1360d2', bg: '#eef4ff',
    icon: (<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v13M7 11l5 5 5-5"/><path d="M5 20h14"/></svg>) },
  { key: 'export',   label: 'Export',    desc: 'Sending goods out of Dubai',    color: '#0f7960', bg: '#edfaf5',
    icon: (<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V8M7 13l5-5 5 5"/><path d="M5 4h14"/></svg>) },
  { key: 'reexport', label: 'Re-Export', desc: 'Transit through Dubai',         color: '#7c3aed', bg: '#f4f0ff',
    icon: (<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 109-9H3"/><path d="M3 7v5h5"/></svg>) },
  { key: 'transfer', label: 'Transfer',  desc: 'Between zones or ports',        color: '#b45309', bg: '#fff8ed',
    icon: (<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>) },
  { key: 'other',    label: 'Other',     desc: 'Other trade activities',        color: '#697498', bg: '#f6f7fb',
    icon: (<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>) },
];

const MODE_OPTIONS = [
  { key: 'sea',  label: 'Sea',  desc: 'Vessel / container',   color: '#0369a1', bg: '#eff8ff',
    icon: (<img src={seaIconSrc}   alt="Sea"   width={30} height={30} style={{ objectFit: 'contain' }} />) },
  { key: 'air',  label: 'Air',  desc: 'Aircraft / airfreight',color: '#7c3aed', bg: '#f4f0ff',
    icon: (<img src={airIconSrc}   alt="Air"   width={30} height={30} style={{ objectFit: 'contain' }} />) },
  { key: 'land', label: 'Land', desc: 'Truck / road transport',color: '#b45309', bg: '#fff8ed',
    icon: (<img src={truckIconSrc} alt="Land"  width={30} height={30} style={{ objectFit: 'contain' }} />) },
  { key: 'rail', label: 'Rail', desc: 'Train / railway',       color: '#0f7960', bg: '#edfaf5',
    icon: (<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="14" rx="2"/><path d="M4 11h16M12 3v8M8 17l-2 3m10-3l2 3"/></svg>) },
];

const CARGO_OPTIONS = [
  { key: 'food',      label: 'Food Consignment',       color: '#0f7960', bg: '#edfaf5', icon: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>) },
  { key: 'vet',       label: 'Veterinary Consignments',color: '#0369a1', bg: '#eff8ff', icon: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>) },
  { key: 'consumer',  label: 'Consumer Goods',         color: '#7c3aed', bg: '#f4f0ff', icon: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>) },
  { key: 'firearms',  label: 'Fire Arms',              color: '#c0392b', bg: '#fff0ef', icon: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16M4 12l3-3m-3 3l3 3m10-3v3l2 2"/></svg>) },
  { key: 'chemicals', label: 'Chemicals & Hazardous',  color: '#b45309', bg: '#fff8ed', icon: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6v11l3.5 6H5.5L9 14V3z"/><line x1="9" y1="3" x2="15" y2="3"/></svg>) },
  { key: 'livestock', label: 'Live Animals',           color: '#0f7960', bg: '#edfaf5', icon: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M8 12c-4 1-6 4-6 6h20c0-2-2-5-6-6"/></svg>) },
  { key: 'pharma',    label: 'Pharmaceuticals',        color: '#7c3aed', bg: '#f4f0ff', icon: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>) },
  { key: 'other',     label: 'Other Goods',            color: '#697498', bg: '#f6f7fb', icon: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>) },
];

const PERMITS_MAP: Record<string, { label: string; authority: string }[]> = {
  'Food Consignment': [
    { label: 'Register and Access a Food Item', authority: 'Dubai Municipality' },
    { label: 'Request to Transfer Food Consignment from and to Dubai', authority: 'Dubai Municipality' },
    { label: 'Release of Importer Food Consignments for Local Market', authority: 'Dubai Municipality' },
    { label: 'Release of Imported Food Consignments for Re-Export', authority: 'Dubai Municipality' },
    { label: 'Request for Food Export / Food Health Certificate', authority: 'Dubai Municipality' },
  ],
  'Veterinary Consignments': [
    { label: 'Veterinary Import Permit', authority: 'MOCCAE' },
    { label: 'Veterinary Health Certificate', authority: 'MOCCAE' },
    { label: 'Release of Imported Consignments for Re-Export', authority: 'Dubai Municipality' },
  ],
  'Consumer Goods': [
    { label: 'Consumer Product Conformity Certificate', authority: 'Dubai Municipality' },
    { label: 'Release of Importer Consignments for Local Market', authority: 'Dubai Customs' },
  ],
  'Fire Arms': [
    { label: 'Firearm Import / Export Permit', authority: 'Dubai Police' },
    { label: 'Controlled Goods Import Approval', authority: 'Ministry of Economy' },
  ],
  'Chemicals & Hazardous': [
    { label: 'Hazardous Material Certificate', authority: 'Civil Defence' },
    { label: 'Dangerous Goods Declaration', authority: 'DCAA' },
  ],
  'Live Animals': [
    { label: 'Veterinary Health Certificate', authority: 'MOCCAE' },
    { label: 'CITES Import / Export Permit', authority: 'MOCCAE' },
    { label: 'Quarantine Clearance Certificate', authority: 'MOCCAE' },
  ],
  'Pharmaceuticals': [
    { label: 'Pharmaceutical Import Permit', authority: 'DCAA' },
    { label: 'Health Certificate for Medical Products', authority: 'Dubai Municipality' },
  ],
  'Other Goods': [
    { label: 'General Trade Clearance', authority: 'Dubai Customs' },
  ],
};

/* ── Mock frequent-use history (would come from API in production) ── */
const FREQUENT_COMBOS = [
  { activity: 'Import', mode: 'Sea',  cargo: 'Food Consignment',       count: 14, lastUsed: '3 days ago' },
  { activity: 'Export', mode: 'Air',  cargo: 'Pharmaceuticals',        count: 7,  lastUsed: '2 weeks ago' },
  { activity: 'Import', mode: 'Air',  cargo: 'Consumer Goods',         count: 3,  lastUsed: '1 month ago' },
];

/* ── Authority color map ── */
const AUTHORITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Dubai Municipality': { bg: '#e8f5ee', text: '#1a7a45', border: '#b6dfc8' },
  'DCAA':               { bg: '#fff3e0', text: '#b45309', border: '#f5c88a' },
  'Dubai Chambers':     { bg: '#ede9fe', text: '#6d28d9', border: '#c4b5fd' },
  'Dubai Chamber':      { bg: '#ede9fe', text: '#6d28d9', border: '#c4b5fd' },
  'SIRA':               { bg: '#fff0f0', text: '#c0392b', border: '#f5b8b8' },
  'Dubai Police':       { bg: '#e8f0fb', text: '#1360d2', border: '#b8d0f5' },
  'MOCCAE':             { bg: '#e8faf3', text: '#0f7960', border: '#a8dfc8' },
  'ESMA':               { bg: '#fef3e2', text: '#92400e', border: '#f8c97a' },
  'MOH':                { bg: '#fce7f3', text: '#9d174d', border: '#f4a8d0' },
  'Civil Defence':      { bg: '#fef2f2', text: '#b91c1c', border: '#fca5a5' },
  'Ministry of Economy':{ bg: '#f0f9ff', text: '#0369a1', border: '#bae6fd' },
  'Dubai Customs':      { bg: '#f8faff', text: '#334155', border: '#cbd5e1' },
};
const authorityStyle = (auth: string) => AUTHORITY_COLORS[auth] ?? { bg: '#f0f4ff', text: '#1360d2', border: '#c0d4f8' };

type Step = 'welcome' | 'activity' | 'mode' | 'cargo' | 'done';

const STEP_META = {
  welcome:  { question: "Welcome back! I found services you've recently applied for. Would you like to re-apply, or start a fresh search?", sub: '' },
  activity: { question: 'What are you looking to do?',              sub: 'Tell us your trade activity' },
  mode:     { question: 'How will your cargo travel?',              sub: 'Choose a shipment mode' },
  cargo:    { question: 'What type of cargo are you shipping?',     sub: 'Pick a cargo category' },
};


/* ── Chat bubble ── */
function ChatBubble({ text, sub }: { text: string; sub?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, animation: 'bubbleIn 0.32s cubic-bezier(0.34,1.56,0.64,1)' }}>
      <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#0e1b3d', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round">
          <circle cx="12" cy="8" r="3"/><path d="M6 20v-1a6 6 0 0112 0v1"/>
        </svg>
      </div>
      <div style={{ background: '#fff', border: '1px solid #dce8ff', borderRadius: '4px 18px 18px 18px', padding: '13px 20px', display: 'inline-block', boxShadow: '0 2px 12px rgba(19,96,210,0.07)', maxWidth: '70%' }}>
        <p style={{ fontFamily: font, fontSize: 18, fontWeight: 500, color: '#111838', margin: 0, lineHeight: 1.5 }}>{text}</p>
        {sub && <p style={{ fontFamily: font, fontSize: 14, color: '#8fa8c8', margin: '3px 0 0' }}>{sub}</p>}
      </div>
    </div>
  );
}

/* ── User answer pill ── */
function AnswerPill({ label, color }: { label: string; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', animation: 'pillIn 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
      <div style={{ background: color ?? '#1360d2', color: '#fff', borderRadius: '18px 4px 18px 18px', padding: '12px 22px', fontFamily: font, fontSize: 18, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 3px 14px rgba(19,96,210,0.3)' }}>
        <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M3 8l3.5 3.5L13 5"/></svg>
        {label}
      </div>
    </div>
  );
}

/* ── Recent services inside chat ── */
function RecentServicesInChat({ onQuickStart, onStartNew, readonly }: { onQuickStart: (c: typeof FREQUENT_COMBOS[0]) => void; onStartNew: () => void; readonly?: boolean }) {
  const [hovered, setHovered] = useState('');
  const actColors: Record<string, string> = { Import: '#1360d2', Export: '#0f7960', 'Re-Export': '#7c3aed', Transfer: '#b45309' };
  const modeColors: Record<string, string> = { Sea: '#0369a1', Air: '#7c3aed', Land: '#b45309', Rail: '#0f7960' };

  return (
    <div style={{ paddingLeft: 44, display: 'flex', flexDirection: 'column', gap: 10, animation: 'chipIn 0.3s ease' }}>
      {FREQUENT_COMBOS.map((combo, idx) => {
        const isHov = hovered === String(idx);
        const permits = PERMITS_MAP[combo.cargo] ?? [];
        return (
          <div key={idx}
            onMouseEnter={() => setHovered(String(idx))}
            onMouseLeave={() => setHovered('')}
            style={{ background: isHov ? '#f0f6ff' : '#f8faff', border: `1.5px solid ${isHov ? '#1360d2' : '#e0eaff'}`, borderRadius: 14, padding: '14px 18px', transition: 'all 0.15s', animation: `chipIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both`, animationDelay: `${idx * 80}ms` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: '#111838', margin: '0 0 4px' }}>
                  {permits.length} permit{permits.length !== 1 ? 's' : ''} — {permits.slice(0, 1).map(p => p.label).join('')}{permits.length > 1 ? ` + ${permits.length - 1} more` : ''}
                </p>
                <p style={{ fontFamily: font, fontSize: 16, color: '#697498', margin: '0 0 3px' }}>{combo.activity} · {combo.mode} · {combo.cargo}</p>
                <p style={{ fontFamily: font, fontSize: 13, color: '#b0bcd4', margin: 0 }}>Last applied {combo.lastUsed}</p>
              </div>
              {!readonly && (
                <button
                  onClick={() => onQuickStart(combo)}
                  style={{ flexShrink: 0, background: isHov ? '#1360d2' : '#eef4ff', color: isHov ? '#fff' : '#1360d2', border: 'none', borderRadius: 8, padding: '9px 18px', fontFamily: font, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                  Re-apply
                </button>
              )}
            </div>
          </div>
        );
      })}
      {/* Start new */}
      {!readonly && <button onClick={onStartNew}
        style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1.5px solid #1360d2', borderRadius: 20, padding: '9px 20px', fontFamily: font, fontSize: 13, fontWeight: 600, color: '#1360d2', cursor: 'pointer', animation: `chipIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both`, animationDelay: `${FREQUENT_COMBOS.length * 80}ms`, transition: 'all 0.15s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1360d2'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#1360d2'; }}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Start a new application
      </button>}
    </div>
  );
}

/* ── Typing indicator ── */
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, animation: 'bubbleIn 0.25s ease' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0e1b3d', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round">
          <circle cx="12" cy="8" r="3"/><path d="M6 20v-1a6 6 0 0112 0v1"/>
        </svg>
      </div>
      <div style={{ background: '#fff', border: '1px solid #dce8ff', borderRadius: '4px 18px 18px 18px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 5, boxShadow: '0 2px 12px rgba(19,96,210,0.07)' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#1360d2', animation: `typingDot 1.2s ease infinite`, animationDelay: `${i * 0.18}s` }} />
        ))}
      </div>
    </div>
  );
}

/* ── Option chips (chatbot style) ── */
function OptionCards({ options, onSelect }: { options: any[]; onSelect: (o: any) => void; cols?: number }) {
  const [hovered, setHovered] = useState('');
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingLeft: 42 }}>
      {options.map((o, idx) => (
        <button key={o.key} onClick={() => onSelect(o)}
          onMouseEnter={() => setHovered(o.key)}
          onMouseLeave={() => setHovered('')}
          style={{
            animation: `chipIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both`,
            animationDelay: `${idx * 60}ms`,
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: hovered === o.key ? '#1360d2' : '#fff',
            border: `1.5px solid ${hovered === o.key ? '#1360d2' : '#c8d8f4'}`,
            borderRadius: 20, padding: '8px 16px 8px 10px',
            cursor: 'pointer', transition: 'all 0.15s',
            boxShadow: hovered === o.key ? '0 4px 12px rgba(19,96,210,0.2)' : 'none',
          }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: hovered === o.key ? 'rgba(255,255,255,0.2)' : '#eef4ff', color: hovered === o.key ? '#fff' : '#1360d2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
            <div style={{ transform: 'scale(0.6)', transformOrigin: 'center', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{o.icon}</div>
          </div>
          <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: hovered === o.key ? '#fff' : '#111838', transition: 'color 0.15s', whiteSpace: 'nowrap' }}>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ── Cargo chips (chatbot style) ── */
function CargoCards({ onSelect }: { onSelect: (o: any) => void }) {
  const [q, setQ] = useState('');
  const [hovered, setHovered] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 50); }, []);
  const filtered = CARGO_OPTIONS.filter(c => c.label.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ animation: 'slideUp 0.28s ease', paddingLeft: 42 }}>
      <div style={{ position: 'relative', maxWidth: 280, marginBottom: 12 }}>
        <input ref={inputRef} type="text" placeholder="Search cargo type…" value={q} onChange={e => setQ(e.target.value)}
          style={{ width: '100%', height: 36, borderRadius: 18, border: '1.5px solid #dce8ff', padding: '0 36px 0 14px', fontFamily: font, fontSize: 13, color: '#111838', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
          onFocus={e => (e.currentTarget.style.borderColor = '#1360d2')}
          onBlur={e => (e.currentTarget.style.borderColor = '#dce8ff')}
        />
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#8fa8c8" strokeWidth="2" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {filtered.map((o, idx) => (
          <button key={o.key} onClick={() => onSelect(o)}
            onMouseEnter={() => setHovered(o.key)}
            onMouseLeave={() => setHovered('')}
            style={{
              animation: `chipIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both`,
              animationDelay: `${idx * 50}ms`,
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: hovered === o.key ? '#1360d2' : '#fff',
              border: `1.5px solid ${hovered === o.key ? '#1360d2' : '#c8d8f4'}`,
              borderRadius: 20, padding: '8px 16px 8px 10px',
              cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: hovered === o.key ? '0 4px 12px rgba(19,96,210,0.2)' : 'none',
            }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: hovered === o.key ? 'rgba(255,255,255,0.2)' : '#eef4ff', color: hovered === o.key ? '#fff' : '#1360d2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
              <div style={{ transform: 'scale(0.6)', transformOrigin: 'center', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{o.icon}</div>
            </div>
            <span style={{ fontFamily: font, fontSize: 15, fontWeight: 600, color: hovered === o.key ? '#fff' : '#111838', transition: 'color 0.15s', whiteSpace: 'nowrap' }}>{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Results section ── */
function ResultsSection({ answers, onRestart }: { answers: Record<string, string>; onRestart: () => void }) {
  const permits = PERMITS_MAP[answers.cargo] ?? [];
  const grouped = permits.reduce<Record<string, typeof permits>>((acc, p) => {
    (acc[p.authority] = acc[p.authority] || []).push(p); return acc;
  }, {});

  return (
    <div style={{ animation: 'slideUp 0.35s ease' }}>

      {/* Count banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'linear-gradient(135deg, #e8f0fb 0%, #dce8f8 100%)', border: '1px solid #c8d8f0', borderRadius: 14, padding: '18px 24px', marginBottom: 20 }}>
        <div style={{ textAlign: 'center', minWidth: 52 }}>
          <p style={{ fontFamily: font, fontSize: 38, fontWeight: 800, color: '#1360d2', margin: 0, lineHeight: 1 }}>{permits.length}</p>
          <p style={{ fontFamily: font, fontSize: 11, color: '#697498', margin: '3px 0 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Services</p>
        </div>
        <div style={{ width: 1, height: 40, background: '#c0d4ec', flexShrink: 0 }} />
        <div>
          <p style={{ fontFamily: font, fontSize: 15, fontWeight: 600, color: '#111838', margin: '0 0 4px' }}>
            {permits.length} permit{permits.length !== 1 ? 's' : ''} found for your shipment
          </p>
          <p style={{ fontFamily: font, fontSize: 13, color: '#697498', margin: 0 }}>
            Review each service below and start your application
          </p>
        </div>
        <button onClick={onRestart} style={{ marginLeft: 'auto', flexShrink: 0, background: '#fff', border: '1px solid #c8d8f0', borderRadius: 20, padding: '8px 16px', fontFamily: font, fontSize: 13, color: '#1360d2', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#1360d2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
          Start over
        </button>
      </div>

      {Object.entries(grouped).map(([auth, items]) => (
        <div key={auth} style={{ marginBottom: 14 }}>
          {(() => { const s = authorityStyle(auth); return (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 20, padding: '6px 14px 6px 10px', marginBottom: 10 }}>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke={s.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span style={{ fontFamily: font, fontSize: 12, fontWeight: 700, color: s.text, letterSpacing: '0.2px' }}>{auth}</span>
          </div>
          ); })()}
          {items.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f8fbff', border: '1px solid #e8f0ff', borderRadius: 10, padding: '12px 16px', marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eaf1ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IntegratedClearanceIcon size={22} />
              </div>
              <span style={{ flex: 1, fontFamily: font, fontSize: 16, color: '#111838' }}>{p.label}</span>
              <button style={{ background: '#1360d2', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontFamily: font, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                Start Journey
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Recent Services panel (right column) ── */
function RecentServicesPanel() {
  const [hovered, setHovered] = useState('');
  const recentServices = FREQUENT_COMBOS.flatMap(combo =>
    (PERMITS_MAP[combo.cargo] ?? []).slice(0, 2).map(svc => ({
      ...svc,
      activity: combo.activity,
      mode: combo.mode,
      cargo: combo.cargo,
      lastUsed: combo.lastUsed,
      key: `${combo.cargo}-${svc.label}`,
    }))
  ).slice(0, 5);

  return (
    <div style={{ background: '#fff', border: '1px solid #e5efff', borderRadius: 16, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: '#0e1b3d', padding: '18px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Recently Applied Services</p>
            <p style={{ fontFamily: font, fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0 }}>Quick re-apply from your history</p>
          </div>
        </div>
      </div>

      {/* Service cards */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {recentServices.map((svc) => {
          const isHov = hovered === svc.key;
          const actOpt = TRADE_OPTIONS.find(o => o.label === svc.activity);
          const modeOpt = MODE_OPTIONS.find(o => o.label === svc.mode);
          return (
            <div key={svc.key}
              onMouseEnter={() => setHovered(svc.key)}
              onMouseLeave={() => setHovered('')}
              style={{ background: isHov ? '#f0f6ff' : '#f8faff', border: `1.5px solid ${isHov ? '#1360d2' : '#e8efff'}`, borderRadius: 12, padding: '14px 16px', transition: 'all 0.15s', cursor: 'default' }}>

              {/* Service name */}
              <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: '#111838', margin: '0 0 4px', lineHeight: 1.4 }}>{svc.label}</p>

              {/* Meta row + button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {(() => { const s = authorityStyle(svc.authority); return (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 20, padding: '4px 10px 4px 8px', alignSelf: 'flex-start' }}>
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke={s.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    <span style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: s.text }}>{svc.authority}</span>
                  </div>
                  ); })()}
                  <p style={{ fontFamily: font, fontSize: 11, color: '#b0bcd4', margin: 0 }}>{svc.lastUsed}</p>
                </div>
                <button style={{ flexShrink: 0, background: isHov ? '#1360d2' : '#eef4ff', color: isHov ? '#fff' : '#1360d2', border: 'none', borderRadius: 8, padding: '8px 14px', fontFamily: font, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                  Re-apply
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main ── */
export default function PermitsCreatePage({ onClose }: Props) {
  const [step, setStep] = useState<Step>('welcome');
  const [history, setHistory] = useState<{ step: Step; answer: string; opt: any }[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const answers: Record<string, string> = Object.fromEntries(history.map(h => [h.step, h.answer]));

  const scrollDown = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 60);

  const showStep = (s: Step) => {
    setIsTyping(true); setShowOptions(false); setStep(s);
    setTimeout(() => { setIsTyping(false); scrollDown(); }, 900);
    setTimeout(() => { setShowOptions(true); scrollDown(); }, 1350);
  };

  useEffect(() => { showStep('welcome'); }, []);

  const pick = (currentStep: Step, nextStep: Step, opt: any) => {
    setShowOptions(false);
    setHistory(h => [...h, { step: currentStep, answer: opt.label, opt }]);
    scrollDown();
    if (nextStep === 'done') {
      setTimeout(() => { setStep('done'); scrollDown(); }, 400);
    } else {
      showStep(nextStep);
    }
  };

  const restart = () => { setHistory([]); showStep('welcome'); };

  const quickStart = (combo: typeof FREQUENT_COMBOS[0]) => {
    const actOpt   = TRADE_OPTIONS.find(o => o.label === combo.activity)!;
    const modeOpt  = MODE_OPTIONS.find(o => o.label === combo.mode)!;
    const cargoOpt = CARGO_OPTIONS.find(o => o.label === combo.cargo)!;
    setHistory(h => [
      ...h,
      { step: 'welcome'  as Step, answer: `Re-apply — ${combo.activity} / ${combo.mode} / ${combo.cargo}`, opt: null },
      { step: 'activity' as Step, answer: combo.activity, opt: actOpt },
      { step: 'mode'     as Step, answer: combo.mode,     opt: modeOpt },
      { step: 'cargo'    as Step, answer: combo.cargo,     opt: cargoOpt },
    ]);
    setShowOptions(false);
    setStep('done');
    scrollDown();
  };

  const startNew = () => {
    setHistory(h => [...h, { step: 'welcome' as Step, answer: 'Start a new application', opt: null }]);
    showStep('activity');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', background: '#eef3fb' }}>
      <style>{`
        @keyframes bubbleIn  { from { opacity:0; transform: translateY(10px) scale(0.96); } to { opacity:1; transform: none; } }
        @keyframes pillIn    { from { opacity:0; transform: translateX(14px) scale(0.94); } to { opacity:1; transform: none; } }
        @keyframes chipIn    { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: none; } }
        @keyframes typingDot { 0%,80%,100% { transform: translateY(0); opacity:0.4; } 40% { transform: translateY(-5px); opacity:1; } }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: #c8deff; border-radius: 4px; }
      `}</style>

      <Header />

      {/* Content area — fills remaining height */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 32px 0', minHeight: 0 }}>

        {/* Breadcrumb + BU row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: font, fontSize: 14 }}>
            <span style={{ color: '#8f94ae', cursor: 'pointer' }}>Home</span>
            <span style={{ color: '#dc3545', margin: '0 3px' }}>/</span>
            <span style={{ color: '#8f94ae', cursor: 'pointer' }}>Service Catalog</span>
            <span style={{ color: '#dc3545', margin: '0 3px' }}>/</span>
            <span style={{ color: '#111838', fontWeight: 500 }}>Find Permits & Certificates</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#e2ebf9', border: '1px solid #c8d8ee', borderRadius: 6, padding: '6px 14px', fontFamily: font, fontSize: 14, color: '#0e1b3d', fontWeight: 500 }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#1360d2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span style={{ color: '#697498', fontSize: 12, fontWeight: 400 }}>BU:</span>
            AE-1019056 — Business Unit - Test LLC
          </div>
        </div>

        {/* Chat window — fills remaining space */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: 'transparent', overflow: 'hidden' }}>

          {/* Chat header */}
          <div style={{ background: '#fff', borderBottom: '1px solid #e0eaff', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#eef4ff', border: '1.5px solid #dce8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: '#111838', margin: 0 }}>Permit / Certificate Assistant</p>
              <p style={{ fontFamily: font, fontSize: 12, color: '#697498', margin: '2px 0 0' }}>Answer a few questions to find exactly what to apply for</p>
            </div>
          </div>

          {/* Messages area */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '28px 32px 100px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 18 }}>
            <div style={{ maxWidth: 1040, width: '100%', alignSelf: 'center', display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Answered history — all fully visible */}
              {history.map((h, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <ChatBubble text={STEP_META[h.step as keyof typeof STEP_META]?.question ?? ''} />
                  {h.step === 'welcome' && (
                    <RecentServicesInChat onQuickStart={quickStart} onStartNew={startNew} readonly />
                  )}
                  <AnswerPill label={h.answer} color={h.opt?.color} />
                </div>
              ))}

              {/* Active state */}
              {step === 'done' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'bubbleIn 0.35s ease' }}>
                  {/* Summary strip */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#eef4ff', border: '1px solid #dce8ff', borderRadius: 12, padding: '12px 18px', flexWrap: 'wrap' }}>
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#1360d2" strokeWidth="2.3" strokeLinecap="round"><path d="M3 8l3.5 3.5L13 5"/></svg>
                    <span style={{ fontFamily: font, fontSize: 13, color: '#697498' }}>You selected:</span>
                    {history.filter(h => h.step !== 'welcome').map((h, i) => {
                      const opt = h.opt;
                      return (
                        <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #dce8ff', borderRadius: 20, padding: '5px 12px 5px 8px' }}>
                          <div style={{ width: 18, height: 18, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1360d2', overflow: 'hidden' }}>
                            {opt?.icon && <div style={{ transform: 'scale(0.65)', transformOrigin: 'center' }}>{opt.icon}</div>}
                          </div>
                          <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: '#1360d2' }}>{h.answer}</span>
                        </div>
                      );
                    })}
                    <button onClick={restart} style={{ marginLeft: 'auto', background: '#fff', border: '1px solid #dce8ff', borderRadius: 8, fontFamily: font, fontSize: 12, color: '#1360d2', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', fontWeight: 600 }}>
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#1360d2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Change
                    </button>
                  </div>
                  <ResultsSection answers={answers} onRestart={restart} />
                </div>
              ) : isTyping ? (
                <TypingIndicator />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <ChatBubble text={STEP_META[step].question} sub={STEP_META[step].sub} />
                  {showOptions && (
                    <>
                      {step === 'welcome'  && <RecentServicesInChat onQuickStart={quickStart} onStartNew={startNew} />}
                      {step === 'activity' && <OptionCards options={TRADE_OPTIONS} onSelect={o => pick('activity', 'mode', o)} />}
                      {step === 'mode'     && <OptionCards options={MODE_OPTIONS}  onSelect={o => pick('mode', 'cargo', o)} />}
                      {step === 'cargo'    && <CargoCards onSelect={o => pick('cargo', 'done', o)} />}
                    </>
                  )}
                </div>
              )}

              <div ref={bottomRef} style={{ height: 1 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', boxShadow: '0 -1px 20px rgba(0,0,0,0.07)', height: 70, display: 'flex', alignItems: 'center', padding: '0 40px', zIndex: 201 }}>
        <button onClick={onClose} style={{ border: '1px solid #1360d2', borderRadius: 6, padding: '10px 24px', fontFamily: font, fontSize: 15, fontWeight: 500, color: '#1360d2', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#1360d2" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Listing
        </button>
      </div>
    </div>
  );
}
