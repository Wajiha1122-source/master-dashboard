import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  Check,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Pencil,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { dashboardSummary, defaultPasswords, socialGroups, softwareLinks, websiteLinks } from './data/dashboardData.js';

function Launcher({ stage }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[#070a12]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)', transition: { duration: 0.8, ease: 'easeInOut' } }}
    >
      <div className="lux-loader-bg" />
      <AnimatePresence mode="wait">
        {stage === 0 ? (
          <motion.div
            key="welcome"
            className="loader-slide"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -22, filter: 'blur(8px)' }}
            transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.p className="loader-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
              Executive Access Suite
            </motion.p>
            <motion.div className="calligraphy-wrap" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}>
              <svg className="calligraphy-svg" viewBox="0 0 900 230" role="img" aria-label="Welcome">
                <text className="calligraphy-text calligraphy-shadow" x="50%" y="58%" textAnchor="middle">
                  Welcome
                </text>
                <text className="calligraphy-text calligraphy-main" x="50%" y="58%" textAnchor="middle">
                  Welcome
                </text>
                <text className="calligraphy-fill" x="50%" y="58%" textAnchor="middle">
                  Welcome
                </text>
              </svg>
            </motion.div>
            <motion.div className="gold-line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.15, delay: 0.75 }} />
          </motion.div>
        ) : (
          <motion.div
            key="master"
            className="loader-slide"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
            transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div className="loader-emblem" animate={{ y: [0, -6, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
              I&C
            </motion.div>
            <p className="loader-kicker">Irshad & Company</p>
            <h1 className="master-heading">Master Dashboard</h1>
            <div className="loader-progress">
              <motion.span initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2.25, ease: 'easeInOut' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Header({ query, setQuery }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#080b12]/88 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div className="brand-mark">I&C</div>
          <div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.32em] text-[#70d6ff]">Irshad & Company</p>
            <h2 className="text-base font-black text-slate-50">Master Dashboard</h2>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="search-shell">
            <Search className="h-4 w-4 text-[#70d6ff]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search access..." />
          </label>
          <a className="gold-button" href="#vault">
            <KeyRound className="h-4 w-4" />
            Vault
          </a>
        </div>
      </div>
    </header>
  );
}

function IntroPanel() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-5 pt-7 sm:px-6 lg:px-8">
      <motion.div className="intro-panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <div>
          <p className="section-eyebrow">CEO launcher</p>
          <h1>Premium access control for daily decisions.</h1>
          <p>All important software, websites, social channels, and saved logins in one refined command screen.</p>
        </div>
        <div className="summary-grid">
          {dashboardSummary.map((item) => {
            const Icon = item.icon;
            return (
              <div className="summary-pill" key={item.label}>
                <Icon className="h-4 w-4" />
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

function SoftwareSection({ query }) {
  const items = softwareLinks.filter((item) => `${item.name} ${item.label} ${item.description}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <section className="page-section">
      <SectionTitle eyebrow="Software" title="Core launch buttons" count={items.length} />
      <div className="software-grid">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.a className="software-tile" href={item.link} target="_blank" rel="noreferrer" key={item.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} whileHover={{ y: -6 }}>
              <div className="tile-top">
                <span>{item.label}</span>
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <Icon className="tile-icon" />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}

function WebsiteSection() {
  return (
    <section className="page-section">
      <SectionTitle eyebrow="Websites" title="Official web presence" count={websiteLinks.length} />
      <div className="website-row">
        {websiteLinks.map((item) => {
          const Icon = item.icon;
          return (
            <a className="website-card" href={item.link} target="_blank" rel="noreferrer" key={item.name}>
              <Icon className="h-7 w-7" />
              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <ArrowUpRight className="ml-auto h-5 w-5" />
            </a>
          );
        })}
      </div>
    </section>
  );
}

function SocialSection() {
  return (
    <section className="page-section">
      <SectionTitle eyebrow="Social media" title="Grouped brand channels" count={8} />
      <div className="social-grid">
        {socialGroups.map((group) => (
          <div className="social-panel" key={group.company}>
            <div className="social-head">
              <div>
                <p>{group.description}</p>
                <h3>{group.company}</h3>
              </div>
            </div>
            <div className="social-links">
              {group.links.map((item) => {
                const Icon = item.icon;
                return (
                  <a href={item.link} target="_blank" rel="noreferrer" key={item.name}>
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    <ArrowUpRight className="ml-auto h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title, count }) {
  return (
    <div className="section-title">
      <div>
        <p className="section-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <span>{String(count).padStart(2, '0')}</span>
    </div>
  );
}

function Vault() {
  const [records, setRecords] = useState(defaultPasswords);
  const [editingId, setEditingId] = useState(null);
  const [visible, setVisible] = useState({});
  const [copied, setCopied] = useState('');
  const draft = useMemo(() => records.find((record) => record.id === editingId), [editingId, records]);

  function updateRecord(id, field, value) {
    setRecords((current) => current.map((record) => (record.id === id ? { ...record, [field]: value } : record)));
  }

  async function copyValue(value, label) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(''), 1300);
  }

  function addRecord() {
    const id = crypto.randomUUID();
    setRecords((current) => [
      { id, label: 'New Access', company: 'Irshad & Company', username: 'add-login-here', password: 'add-password-here', url: '#ADD-LINK-HERE', notes: 'Add notes here.' },
      ...current,
    ]);
    setEditingId(id);
  }

  return (
    <section id="vault" className="page-section">
      <div className="vault-shell">
        <div className="vault-title">
          <div>
            <p className="section-eyebrow">Saved passwords</p>
            <h2>Editable access vault</h2>
            <span><ShieldCheck className="h-4 w-4" /> Static project data for Vercel</span>
          </div>
          <div className="vault-toolbar">
            <button className="gold-button" type="button" onClick={addRecord}>
              <Plus className="h-4 w-4" />
              Add login
            </button>
          </div>
        </div>
        <div className="vault-list">
          {records.map((record) => {
            const isEditing = editingId === record.id;
            const isVisible = visible[record.id];
            return (
              <motion.div layout className="vault-card" key={record.id}>
                <div className="vault-main">
                  <div>
                    <p>{record.company}</p>
                    {isEditing ? <input className="vault-input" value={record.label} onChange={(event) => updateRecord(record.id, 'label', event.target.value)} /> : <h3>{record.label}</h3>}
                  </div>
                  <VaultField label="Login" value={record.username} editing={isEditing} onChange={(value) => updateRecord(record.id, 'username', value)} onCopy={() => copyValue(record.username, `${record.label} login`)} copied={copied === `${record.label} login`} />
                  <VaultField label="Password" value={record.password} editing={isEditing} hidden={!isVisible} onChange={(value) => updateRecord(record.id, 'password', value)} onCopy={() => copyValue(record.password, `${record.label} password`)} copied={copied === `${record.label} password`} onToggle={() => setVisible((current) => ({ ...current, [record.id]: !current[record.id] }))} />
                  <div className="vault-actions">
                    <a className="icon-button" href={record.url} target="_blank" rel="noreferrer"><ArrowUpRight className="h-4 w-4" /></a>
                    <button className="icon-button" type="button" onClick={() => setEditingId(isEditing ? null : record.id)}>{isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}</button>
                    <button className="icon-button danger" type="button" onClick={() => setRecords((current) => current.filter((item) => item.id !== record.id))}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <AnimatePresence>
                  {isEditing && draft ? (
                    <motion.div className="vault-edit-row" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <input className="vault-input" value={record.company} onChange={(event) => updateRecord(record.id, 'company', event.target.value)} />
                      <input className="vault-input" value={record.url} onChange={(event) => updateRecord(record.id, 'url', event.target.value)} />
                      <div className="flex gap-2">
                        <input className="vault-input" value={record.notes} onChange={(event) => updateRecord(record.id, 'notes', event.target.value)} />
                        <button className="icon-button" type="button" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function VaultField({ label, value, editing, hidden, onChange, onCopy, copied, onToggle }) {
  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="copy-row">
        {editing ? <input value={value} onChange={(event) => onChange(event.target.value)} /> : <strong>{hidden ? '************' : value}</strong>}
        {onToggle ? <button type="button" onClick={onToggle}>{hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button> : null}
        <button type="button" onClick={onCopy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button>
      </div>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [launcherStage, setLauncherStage] = useState(0);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const slideTimer = window.setTimeout(() => setLauncherStage(1), 2200);
    const timer = window.setTimeout(() => setLoading(false), 4800);
    return () => {
      window.clearTimeout(slideTimer);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080b12] text-slate-50">
      <AnimatePresence>{loading && <Launcher stage={launcherStage} />}</AnimatePresence>
      <div className="site-bg" />
      <Header query={query} setQuery={setQuery} />
      <main className="relative z-10 pb-12">
        <IntroPanel />
        <SoftwareSection query={query} />
        <WebsiteSection />
        <SocialSection />
        <Vault />
      </main>
    </div>
  );
}
