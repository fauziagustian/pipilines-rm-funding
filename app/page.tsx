"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Activity,
  Archive,
  Bell,
  BriefcaseBusiness,
  Building2,
  Camera,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleCheckBig,
  ClipboardCheck,
  CloudDownload,
  Clock3,
  Database,
  Download,
  Eye,
  FileChartColumnIncreasing,
  FileArchive,
  Filter,
  Gauge,
  HardDrive,
  Image as ImageIcon,
  KeyRound,
  LayoutDashboard,
  ListFilter,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MoreHorizontal,
  Navigation,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
  UserRound,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";

type NavKey =
  | "Kunjungan"
  | "Ringkasan"
  | "Pipeline"
  | "Aktivitas"
  | "Nasabah"
  | "Pusat Bisnis"
  | "Laporan"
  | "Manajemen Data"
  | "Pengaturan";

type VisitStatus = "Menunggu Review" | "Disetujui" | "Perlu Perbaikan" | "Draft";

type Visit = {
  id: string;
  company: string;
  rm: string;
  time: string;
  zone: string;
  purpose: string;
  result: string;
  status: VisitStatus;
  photos: number;
  tone: string;
};

type Pipeline = {
  id: string;
  name: string;
  rm: string;
  product: "Giro" | "Tabungan" | "Deposito";
  amount: number;
  status: "Hot" | "Warm" | "Cold";
  probability: number;
  commitment: string;
  zone: string;
  nextAction: string;
};

const navItems: Array<{
  label: NavKey;
  icon: typeof LayoutDashboard;
}> = [
  { label: "Kunjungan", icon: Camera },
  { label: "Ringkasan", icon: LayoutDashboard },
  { label: "Pipeline", icon: ListFilter },
  { label: "Aktivitas", icon: ClipboardCheck },
  { label: "Nasabah", icon: UsersRound },
  { label: "Pusat Bisnis", icon: Building2 },
  { label: "Laporan", icon: FileChartColumnIncreasing },
  { label: "Manajemen Data", icon: Database },
  { label: "Pengaturan", icon: Settings },
];

const roleIdentity: Record<string, { name: string; initials: string }> = {
  "Pemimpin Cabang": { name: "Ahmad Fauzi", initials: "AF" },
  "Lead RM Funding": { name: "Dian Pramono", initials: "DP" },
  "RM Funding": { name: "Kinanah", initials: "KI" },
};

const visitRows: Visit[] = [
  {
    id: "VIS-260811-014",
    company: "PT Surya Karya Abadi",
    rm: "Kinanah",
    time: "09:00",
    zone: "Matraman",
    purpose: "Finalisasi pembukaan Giro",
    result: "Dokumen legal lengkap, menunggu tanda tangan direksi.",
    status: "Menunggu Review",
    photos: 3,
    tone: "blue",
  },
  {
    id: "VIS-260811-012",
    company: "RS Harapan Keluarga",
    rm: "Karlina",
    time: "10:30",
    zone: "Jatinegara",
    purpose: "Penawaran Deposito",
    result: "Nasabah meminta simulasi tenor 3 dan 6 bulan.",
    status: "Disetujui",
    photos: 2,
    tone: "green",
  },
  {
    id: "VIS-260811-009",
    company: "Yayasan Cendekia Jaya",
    rm: "Fitri",
    time: "13:30",
    zone: "Duren Sawit",
    purpose: "Kebutuhan cash management",
    result: "Perlu kunjungan lanjutan bersama Lead RM.",
    status: "Perlu Perbaikan",
    photos: 1,
    tone: "orange",
  },
  {
    id: "VIS-260811-006",
    company: "PT Transit Niaga",
    rm: "Rido",
    time: "15:00",
    zone: "Kramat Jati",
    purpose: "Validasi potensi payroll",
    result: "Agenda kunjungan belum dimulai.",
    status: "Draft",
    photos: 0,
    tone: "slate",
  },
];

const pipelineRows: Pipeline[] = [
  {
    id: "PL-260814-021",
    name: "PT Surya Karya Abadi",
    rm: "Kinanah",
    product: "Giro",
    amount: 25,
    status: "Hot",
    probability: 85,
    commitment: "14 Agu 2026",
    zone: "Matraman",
    nextAction: "Finalisasi dokumen pembukaan rekening",
  },
  {
    id: "PL-260815-017",
    name: "RS Harapan Keluarga",
    rm: "Karlina",
    product: "Deposito",
    amount: 18.5,
    status: "Hot",
    probability: 80,
    commitment: "15 Agu 2026",
    zone: "Jatinegara",
    nextAction: "Presentasi skema penempatan dana",
  },
  {
    id: "PL-260818-014",
    name: "Yayasan Cendekia Jaya",
    rm: "Fitri",
    product: "Giro",
    amount: 12,
    status: "Warm",
    probability: 65,
    commitment: "18 Agu 2026",
    zone: "Duren Sawit",
    nextAction: "Kunjungan bersama Lead RM",
  },
  {
    id: "PL-260819-012",
    name: "PT Transit Niaga",
    rm: "Rido",
    product: "Tabungan",
    amount: 8.8,
    status: "Warm",
    probability: 60,
    commitment: "19 Agu 2026",
    zone: "Kramat Jati",
    nextAction: "Konfirmasi struktur payroll",
  },
  {
    id: "PL-260820-009",
    name: "CV Sumber Berkah",
    rm: "Dias",
    product: "Giro",
    amount: 6.75,
    status: "Hot",
    probability: 75,
    commitment: "20 Agu 2026",
    zone: "Pulo Gadung",
    nextAction: "Follow-up keputusan pemilik usaha",
  },
  {
    id: "PL-260822-008",
    name: "Koperasi Sejahtera Jatinegara",
    rm: "Aldo",
    product: "Deposito",
    amount: 5.4,
    status: "Cold",
    probability: 35,
    commitment: "22 Agu 2026",
    zone: "Jatinegara",
    nextAction: "Lengkapi profil kebutuhan nasabah",
  },
  {
    id: "PL-260824-005",
    name: "PT Karya Boga Utama",
    rm: "Ghifari",
    product: "Tabungan",
    amount: 4.65,
    status: "Warm",
    probability: 55,
    commitment: "24 Agu 2026",
    zone: "Cakung",
    nextAction: "Jadwalkan demo cash management",
  },
  {
    id: "PL-260825-003",
    name: "PT Prima Logistik Asia",
    rm: "Irene",
    product: "Giro",
    amount: 3.8,
    status: "Cold",
    probability: 30,
    commitment: "25 Agu 2026",
    zone: "Makasar",
    nextAction: "Validasi potensi transaksi bulanan",
  },
];

const rmPerformance = [
  { name: "Kinanah", amount: 75.3, target: 90, percent: 84, trend: 12.4 },
  { name: "Karlina", amount: 61.35, target: 75, percent: 82, trend: 8.1 },
  { name: "Fitri", amount: 46.7, target: 65, percent: 72, trend: 4.8 },
  { name: "Rido", amount: 45, target: 70, percent: 64, trend: -2.3 },
];

const products = [
  { name: "Giro", amount: 147.9, percent: 50, color: "#1769c2" },
  { name: "Tabungan", amount: 96.15, percent: 32, color: "#20a36a" },
  { name: "Deposito", amount: 53.4, percent: 18, color: "#f19c3d" },
];

function money(value: number) {
  return `Rp${value.toLocaleString("id-ID", {
    minimumFractionDigits: value % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  })} M`;
}

function Sidebar({
  active,
  role,
  onRoleChange,
  onChange,
  mobileOpen,
  onClose,
}: {
  active: NavKey;
  role: string;
  onRoleChange: (role: string) => void;
  onChange: (key: NavKey) => void;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <button
        className={`sidebar-scrim ${mobileOpen ? "is-open" : ""}`}
        aria-label="Tutup navigasi"
        onClick={onClose}
      />
      <aside className={`sidebar ${mobileOpen ? "is-open" : ""}`} aria-label="Menu aplikasi">
        <div className="brand-row">
          <div className="brand-mark">P</div>
          <div>
            <strong>PIPELINE</strong>
            <span>RM Funding · Jatinegara</span>
          </div>
          <button className="icon-button mobile-close" onClick={onClose} aria-label="Tutup menu">
            <X size={19} />
          </button>
        </div>

        <div className="workspace-pill">
          <div className="workspace-icon">
            <Building2 size={18} />
          </div>
          <div>
            <span>Kantor Cabang</span>
            <strong>BRI Jatinegara</strong>
          </div>
          <ChevronDown size={16} />
        </div>

        <nav className="sidebar-nav" aria-label="Navigasi utama">
          <span className="nav-caption">RUANG KERJA</span>
          {navItems.slice(0, 7).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={active === item.label ? "active" : ""}
                onClick={() => {
                  onChange(item.label);
                  onClose();
                }}
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{item.label}</span>
                {item.label === "Kunjungan" ? <em>4</em> : item.label === "Aktivitas" ? <em>12</em> : null}
              </button>
            );
          })}
          <span className="nav-caption nav-caption-spaced">SISTEM</span>
          {navItems.slice(7).filter((item) => role === "Pemimpin Cabang" || item.label !== "Manajemen Data").map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={active === item.label ? "active" : ""}
                onClick={() => {
                  onChange(item.label);
                  onClose();
                }}
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <label className="sidebar-role-selector">
            <UserRound size={16} />
            <span>Mode demo</span>
            <select value={role} onChange={(event) => { onRoleChange(event.target.value); onClose(); }}>
              <option>RM Funding</option>
              <option>Lead RM Funding</option>
              <option>Pemimpin Cabang</option>
            </select>
          </label>
          <div className="sync-row">
            <span className="sync-dot" />
            <span>Data tersinkron</span>
            <time>09:42</time>
          </div>
          <div className="sidebar-help">
            <Sparkles size={17} />
            <div>
              <strong>Butuh bantuan?</strong>
              <span>Panduan penggunaan aplikasi</span>
            </div>
            <ChevronRight size={16} />
          </div>
        </div>
      </aside>
    </>
  );
}

function Topbar({
  role,
  setRole,
  onOpenMenu,
  onSecurity,
  search,
  setSearch,
}: {
  role: string;
  setRole: (value: string) => void;
  onOpenMenu: () => void;
  onSecurity: () => void;
  search: string;
  setSearch: (value: string) => void;
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const identity = roleIdentity[role] ?? roleIdentity["RM Funding"];
  return (
    <header className="topbar">
      <button className="icon-button menu-button" onClick={onOpenMenu} aria-label="Buka menu">
        <Menu size={21} />
      </button>
      <div className="top-search">
        <Search size={18} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari nasabah, RM, atau pipeline..."
          aria-label="Cari data pipeline"
        />
        <kbd>⌘ K</kbd>
      </div>
      <div className="top-actions">
        <button className="security-button" onClick={onSecurity}>
          <ShieldCheck size={17} />
          <span>Keamanan</span>
        </button>
        <button className="icon-button notification-button" aria-label="Notifikasi">
          <Bell size={19} />
          <span />
        </button>
        <div className="profile-wrap">
          <button
            className="profile-button"
            onClick={() => setProfileOpen((open) => !open)}
            aria-expanded={profileOpen}
          >
            <div className="avatar">{identity.initials}</div>
            <div>
              <strong>{identity.name}</strong>
              <span>{role}</span>
            </div>
            <ChevronDown size={16} />
          </button>
          {profileOpen ? (
            <div className="profile-menu">
              <span className="menu-label">Lihat sebagai</span>
              {["RM Funding", "Lead RM Funding", "Pemimpin Cabang"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setRole(item);
                    setProfileOpen(false);
                  }}
                >
                  <UserRound size={16} />
                  {item}
                  {item === role ? <Check size={15} /> : null}
                </button>
              ))}
              <div className="menu-separator" />
              <button onClick={onSecurity}>
                <LockKeyhole size={16} />
                Simulasi login aman
              </button>
              <button>
                <LogOut size={16} />
                Keluar
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function KpiCard({
  label,
  value,
  note,
  change,
  icon: Icon,
  tone,
  progress,
}: {
  label: string;
  value: string;
  note: string;
  change?: string;
  icon: typeof Target;
  tone: string;
  progress?: number;
}) {
  return (
    <article className="kpi-card">
      <div className={`kpi-icon ${tone}`}>
        <Icon size={20} strokeWidth={1.9} />
      </div>
      <div className="kpi-copy">
        <div className="kpi-label">
          <span>{label}</span>
          <MoreHorizontal size={17} />
        </div>
        <strong>{value}</strong>
        <div className="kpi-note">
          {change ? (
            <span className={change.startsWith("-") ? "negative" : "positive"}>
              {change.startsWith("-") ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
              {change}
            </span>
          ) : null}
          <span>{note}</span>
        </div>
        {typeof progress === "number" ? (
          <div className="mini-progress">
            <span style={{ width: `${progress}%` }} />
          </div>
        ) : null}
      </div>
    </article>
  );
}

function OverviewChart() {
  const points = [32, 41, 38, 54, 49, 63, 58, 72, 69, 81, 78, 88];
  return (
    <article className="panel chart-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">PERKEMBANGAN BULANAN</span>
          <h2>Pipeline vs. Realisasi</h2>
        </div>
        <div className="chart-legend">
          <span><i className="legend-pipeline" />Pipeline</span>
          <span><i className="legend-realized" />Realisasi</span>
        </div>
      </div>
      <div className="chart-summary">
        <div>
          <span>Total Pipeline</span>
          <strong>Rp297,45 M</strong>
        </div>
        <div>
          <span>Realisasi</span>
          <strong>Rp215,30 M</strong>
        </div>
        <div className="coverage-pill">
          <Gauge size={16} /> 72,4% coverage
        </div>
      </div>
      <div className="line-chart" aria-label="Grafik perkembangan pipeline Agustus">
        <div className="y-labels"><span>300</span><span>200</span><span>100</span><span>0</span></div>
        <div className="chart-grid">
          {[0, 1, 2, 3].map((line) => <i key={line} />)}
          <div className="chart-bars">
            {points.map((point, index) => (
              <div className="chart-column" key={index}>
                <span className="pipeline-bar" style={{ height: `${point}%` }} />
                <span className="realized-bar" style={{ height: `${Math.max(point - 18, 9)}%` }} />
              </div>
            ))}
          </div>
          <div className="x-labels"><span>1 Agu</span><span>8 Agu</span><span>15 Agu</span><span>22 Agu</span><span>31 Agu</span></div>
        </div>
      </div>
    </article>
  );
}

function ProductMix() {
  return (
    <article className="panel product-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">KOMPOSISI</span>
          <h2>Pipeline per Produk</h2>
        </div>
        <button className="plain-button">Detail <ChevronRight size={15} /></button>
      </div>
      <div className="product-chart-wrap">
        <div className="donut" aria-label="Komposisi produk Giro 50%, Tabungan 32%, Deposito 18%">
          <div><strong>154</strong><span>Prospek</span></div>
        </div>
        <div className="product-list">
          {products.map((product) => (
            <div className="product-row" key={product.name}>
              <div>
                <span className="product-dot" style={{ backgroundColor: product.color }} />
                <span>{product.name}</span>
                <em>{product.percent}%</em>
              </div>
              <strong>{money(product.amount)}</strong>
              <div className="product-progress"><span style={{ width: `${product.percent * 1.8}%`, backgroundColor: product.color }} /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="product-insight">
        <Sparkles size={17} />
        <p><strong>Giro mendominasi pipeline.</strong> Kontribusinya mencapai 49,7% dari total potensi dana.</p>
      </div>
    </article>
  );
}

function PerformancePanel() {
  return (
    <article className="panel performance-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">KINERJA TIM</span>
          <h2>Kontribusi RM Funding</h2>
        </div>
        <button className="plain-button">Lihat semua <ChevronRight size={15} /></button>
      </div>
      <div className="rm-list">
        {rmPerformance.map((rm, index) => (
          <div className="rm-row" key={rm.name}>
            <div className="rank">{index + 1}</div>
            <div className="mini-avatar">{rm.name.slice(0, 2).toUpperCase()}</div>
            <div className="rm-info">
              <div><strong>{rm.name}</strong><span>{money(rm.amount)} / {money(rm.target)}</span></div>
              <div className="rm-progress"><span style={{ width: `${rm.percent}%` }} /></div>
            </div>
            <div className="rm-score">
              <strong>{rm.percent}%</strong>
              <span className={rm.trend < 0 ? "down" : "up"}>{rm.trend > 0 ? "+" : ""}{rm.trend}%</span>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function AttentionPanel({ onOpenPipeline }: { onOpenPipeline: () => void }) {
  return (
    <article className="panel attention-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">PERLU PERHATIAN</span>
          <h2>Tindak Lanjut Hari Ini</h2>
        </div>
        <span className="alert-count">5 tugas</span>
      </div>
      <div className="attention-list">
        <button onClick={onOpenPipeline}>
          <span className="attention-icon urgent"><CircleAlert size={18} /></span>
          <div><strong>3 pipeline melewati jadwal</strong><span>Nilai potensi Rp12,6 Miliar</span></div>
          <ChevronRight size={16} />
        </button>
        <button>
          <span className="attention-icon warning"><CalendarDays size={18} /></span>
          <div><strong>2 komitmen jatuh tempo hari ini</strong><span>Perlu konfirmasi realisasi</span></div>
          <ChevronRight size={16} />
        </button>
        <button>
          <span className="attention-icon neutral"><Eye size={18} /></span>
          <div><strong>154 status kunjungan belum terisi</strong><span>Lengkapi aktivitas agar data akurat</span></div>
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="attention-footer">
        <CircleCheckBig size={16} /> 8 tindak lanjut selesai minggu ini
      </div>
    </article>
  );
}

function VisitPhotoStack({ visit }: { visit: Visit }) {
  if (visit.photos === 0) {
    return (
      <div className="visit-no-photo">
        <Camera size={18} />
        <span>Belum ada foto</span>
      </div>
    );
  }

  return (
    <div className="visit-photo-stack" aria-label={`${visit.photos} foto kunjungan`}>
      {Array.from({ length: Math.min(visit.photos, 3) }).map((_, index) => (
        <div className={`visit-photo photo-${visit.tone}-${index + 1}`} key={index}>
          <Building2 size={index === 0 ? 22 : 17} />
          {index === 0 ? <span>{visit.company.split(" ")[0]}</span> : null}
        </div>
      ))}
      <span className="photo-count"><ImageIcon size={12} />{visit.photos}</span>
    </div>
  );
}

function VisitPage({ role, onAddVisit }: { role: string; onAddVisit: () => void }) {
  const isRm = role === "RM Funding";
  const [filter, setFilter] = useState(isRm ? "Semua" : "Menunggu Review");
  const identity = roleIdentity[role] ?? roleIdentity["RM Funding"];
  const rows = visitRows.filter((visit) => {
    const belongsToUser = isRm ? visit.rm === "Kinanah" || visit.status === "Draft" : true;
    const matchesFilter = filter === "Semua" || visit.status === filter;
    return belongsToUser && matchesFilter;
  });

  return (
    <>
      <section className="mobile-welcome">
        <div>
          <span>SELASA, 11 AGUSTUS 2026</span>
          <h1>{isRm ? `Halo, ${identity.name}.` : "Kunjungan tim hari ini"}</h1>
          <p>{isRm ? "Lengkapi bukti kunjungan langsung dari ponsel Anda." : "Tinjau bukti dan hasil kunjungan RM Funding dari satu layar."}</p>
        </div>
        <button className="mobile-profile-chip" aria-label={`Profil ${identity.name}`}>{identity.initials}</button>
      </section>

      <section className="visit-progress-card">
        <div className="visit-progress-top">
          <div>
            <span>{isRm ? "PROGRES SAYA HARI INI" : "PROGRES TIM HARI INI"}</span>
            <strong>{isRm ? "3 dari 4 kunjungan" : "38 dari 52 kunjungan"}</strong>
          </div>
          <div className="progress-ring"><strong>{isRm ? "75%" : "73%"}</strong></div>
        </div>
        <div className="visit-progress-line"><span style={{ width: isRm ? "75%" : "73%" }} /></div>
        <div className="visit-progress-meta">
          <span><CircleCheckBig size={15} />{isRm ? "2 disetujui" : "31 disetujui"}</span>
          <span><Clock3 size={15} />{isRm ? "1 menunggu review" : "7 perlu ditinjau"}</span>
        </div>
        <button className="visit-primary-cta" onClick={onAddVisit}><Camera size={19} />Catat kunjungan</button>
      </section>

      <section className="visit-quick-grid">
        <button><span className="quick-icon blue"><Navigation size={19} /></span><div><strong>Agenda berikutnya</strong><em>10:30 · RS Harapan Keluarga</em></div><ChevronRight size={17} /></button>
        <button><span className="quick-icon orange"><CircleAlert size={19} /></span><div><strong>{isRm ? "1 laporan perlu diperbaiki" : "7 laporan menunggu review"}</strong><em>{isRm ? "Tambahkan foto lokasi" : "Nilai pipeline Rp31,2 M"}</em></div><ChevronRight size={17} /></button>
      </section>

      <section className="visit-list-section">
        <div className="visit-section-heading">
          <div><span className="eyebrow">BUKTI AKTIVITAS</span><h2>{isRm ? "Kunjungan Saya" : "Review Kunjungan Tim"}</h2></div>
          <span className="mobile-only-count">{rows.length} data</span>
        </div>
        <div className="visit-filter-row" role="group" aria-label="Filter kunjungan">
          {["Semua", "Menunggu Review", "Disetujui", "Perlu Perbaikan"].map((item) => (
            <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>
          ))}
        </div>
        <div className="visit-card-list">
          {rows.map((visit) => (
            <article className="visit-card" key={visit.id}>
              <div className="visit-card-head">
                <div className="visit-company-mark">{visit.company.charAt(0)}</div>
                <div><strong>{visit.company}</strong><span>{visit.id} · {visit.rm}</span></div>
                <span className={`visit-status ${visit.status.toLowerCase().replaceAll(" ", "-")}`}>{visit.status}</span>
              </div>
              <div className="visit-meta-row">
                <span><Clock3 size={14} />{visit.time} WIB</span>
                <span><MapPin size={14} />{visit.zone}</span>
              </div>
              <VisitPhotoStack visit={visit} />
              <div className="visit-result">
                <span>{visit.purpose}</span>
                <p>{visit.result}</p>
              </div>
              <div className="visit-card-actions">
                <button className="secondary-button"><Eye size={16} />Lihat laporan</button>
                {!isRm && visit.status === "Menunggu Review" ? <button className="primary-button"><Check size={16} />Setujui</button> : null}
                {isRm && visit.status === "Perlu Perbaikan" ? <button className="primary-button">Perbaiki</button> : null}
              </div>
            </article>
          ))}
          {rows.length === 0 ? <div className="visit-empty"><Camera size={24} /><strong>Tidak ada kunjungan</strong><span>Coba pilih status lainnya.</span></div> : null}
        </div>
      </section>

      <aside className="mobile-resource-note">
        <Smartphone size={18} />
        <p><strong>Hemat data seluler.</strong> Foto dikompresi otomatis di ponsel sebelum dikirim, tanpa mengurangi keterbacaan bukti kunjungan.</p>
      </aside>
    </>
  );
}

function VisitFormModal({ onClose }: { onClose: () => void }) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState("");
  const [saved, setSaved] = useState(false);

  function choosePhotos(files: FileList | null) {
    if (!files) return;
    const selected = Array.from(files);
    if (selected.length > 3) {
      setPhotoError("Maksimal 3 foto untuk setiap kunjungan.");
    } else {
      setPhotoError("");
    }
    setPhotos(selected.slice(0, 3));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <div className="overlay modal-overlay visit-modal-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-card visit-form-card" role="dialog" aria-modal="true" aria-label="Catat kunjungan harian">
        {saved ? (
          <div className="success-state visit-success">
            <div><CircleCheckBig size={34} /></div>
            <span>LAPORAN TERKIRIM</span>
            <h2>Kunjungan menunggu review</h2>
            <p>Lead RM dan Pemimpin Cabang dapat langsung melihat catatan serta foto kunjungan ini.</p>
            <button className="primary-button" onClick={onClose}>Kembali ke kunjungan</button>
          </div>
        ) : (
          <>
            <div className="visit-form-head">
              <div><span>KUNJUNGAN HARIAN</span><h2>Catat Kunjungan</h2><p>11 Agustus 2026 · RM Kinanah</p></div>
              <button className="icon-button" onClick={onClose} aria-label="Tutup form kunjungan"><X size={20} /></button>
            </div>
            <form className="visit-form" onSubmit={submit}>
              <div className="visit-form-step"><span>1</span><div><strong>Informasi kunjungan</strong><em>Pilih prospek dan waktu kunjungan</em></div></div>
              <label>Prospek / nasabah *<select required defaultValue="PT Surya Karya Abadi"><option>PT Surya Karya Abadi</option><option>RS Harapan Keluarga</option><option>Yayasan Cendekia Jaya</option></select></label>
              <div className="visit-field-row"><label>Waktu *<input type="time" defaultValue="09:00" required /></label><label>Zona<select defaultValue="Matraman"><option>Matraman</option><option>Jatinegara</option><option>Duren Sawit</option></select></label></div>
              <label>Tujuan kunjungan *<input required defaultValue="Finalisasi pembukaan Giro" /></label>

              <div className="visit-form-step"><span>2</span><div><strong>Foto bukti kunjungan</strong><em>Terlihat oleh Lead RM dan Pemimpin Cabang</em></div></div>
              <label className="photo-upload-box">
                <input type="file" accept="image/jpeg,image/png,image/webp,image/heic" multiple onChange={(event) => choosePhotos(event.currentTarget.files)} />
                <span className="upload-icon"><Upload size={23} /></span>
                <strong>Ambil foto atau pilih dari galeri</strong>
                <em>JPG, PNG, HEIC · maks. 3 foto · asli maks. 10 MB/foto</em>
              </label>
              {photoError ? <p className="photo-error">{photoError}</p> : null}
              {photos.length > 0 ? (
                <div className="selected-photos">
                  {photos.map((photo, index) => (
                    <div key={`${photo.name}-${photo.lastModified}`}><span><ImageIcon size={17} /></span><p><strong>Foto {index + 1}</strong><em>{photo.name}</em></p><small>Siap dikompresi</small></div>
                  ))}
                </div>
              ) : null}
              <div className="compression-note"><Smartphone size={17} /><p><strong>Kompresi otomatis:</strong> sisi terpanjang 1.600 px, WebP kualitas 78, target 400 KB dan maksimal 1 MB setelah kompresi.</p></div>

              <div className="visit-form-step"><span>3</span><div><strong>Hasil & tindak lanjut</strong><em>Catatan ringkas yang dapat ditindaklanjuti</em></div></div>
              <label>Hasil kunjungan *<textarea required rows={3} placeholder="Tuliskan keputusan, kebutuhan, atau kendala nasabah..." /></label>
              <label>Tindak lanjut<select defaultValue="Follow-up 3 hari"><option>Follow-up 1 hari</option><option>Follow-up 3 hari</option><option>Kunjungan lanjutan</option><option>Tidak ada tindak lanjut</option></select></label>
              <div className="location-proof"><MapPin size={17} /><div><strong>Lokasi tercatat</strong><span>-6.2148, 106.8709 · akurasi ±18 meter</span></div><button type="button">Perbarui</button></div>
              <div className="visit-form-actions"><button type="button" className="secondary-button" onClick={onClose}>Simpan draft</button><button type="submit" className="primary-button">Kirim untuk review</button></div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function DataManagementPage() {
  const [rmCount, setRmCount] = useState(15);
  const [visitsPerDay, setVisitsPerDay] = useState(4);
  const [photosPerVisit, setPhotosPerVisit] = useState(3);
  const [photoKb, setPhotoKb] = useState(400);
  const [message, setMessage] = useState("");
  const monthlyVisits = rmCount * visitsPerDay * 22;
  const monthlyGb = (monthlyVisits * photosPerVisit * photoKb) / 1024 / 1024;
  const yearlyGb = monthlyGb * 12;
  const safeYearlyGb = yearlyGb * 1.2;
  const metadataMb = (monthlyVisits * 12) / 1024;

  return (
    <>
      <section className="data-heading">
        <div className="data-title-icon"><Database size={24} /></div>
        <div><span>PEMIMPIN CABANG · BRI JATINEGARA</span><h1>Manajemen Data Cabang</h1><p>Pantau kapasitas, arsip, retensi, dan pengajuan penghapusan data aktivitas RM Funding.</p></div>
        <button className="secondary-button" onClick={() => setMessage("Estimasi kapasitas telah diperbarui berdasarkan asumsi terbaru.")}><RefreshCw size={16} />Perbarui estimasi</button>
      </section>

      <div className="data-alert"><ShieldCheck size={18} /><p><strong>Akses terbatas pada cakupan Cabang Jatinegara.</strong> Setiap unduhan arsip, perubahan kebijakan, dan pengajuan penghapusan dicatat dalam audit trail.</p></div>

      <section className="storage-kpi-grid">
        <article><span className="storage-kpi-icon blue"><HardDrive size={20} /></span><div><em>Foto per bulan</em><strong>{monthlyGb.toFixed(2)} GB</strong><small>{monthlyVisits.toLocaleString("id-ID")} kunjungan</small></div></article>
        <article><span className="storage-kpi-icon green"><Database size={20} /></span><div><em>Data terstruktur</em><strong>{metadataMb.toFixed(1)} MB/bln</strong><small>±{(metadataMb * 12).toFixed(0)} MB per tahun</small></div></article>
        <article><span className="storage-kpi-icon orange"><Archive size={20} /></span><div><em>Kapasitas aman tahun 1</em><strong>{safeYearlyGb.toFixed(0)} GB</strong><small>Termasuk buffer 20%</small></div></article>
        <article><span className="storage-kpi-icon violet"><CloudDownload size={20} /></span><div><em>Backup bulanan</em><strong>{(monthlyGb * 1.05).toFixed(2)} GB</strong><small>Arsip terenkripsi</small></div></article>
      </section>

      <section className="data-grid">
        <article className="panel storage-estimator">
          <div className="panel-heading"><div><span className="eyebrow">KALKULATOR KAPASITAS</span><h2>Asumsi Pemakaian Mobile</h2></div><span className="recommended-pill">Baseline rekomendasi</span></div>
          <div className="estimator-controls">
            <label><span>RM aktif</span><input aria-label="Jumlah RM aktif" type="number" min="1" max="100" value={rmCount} onChange={(event) => setRmCount(Math.max(1, Number(event.target.value) || 1))} /><em>orang</em></label>
            <label><span>Kunjungan / RM / hari</span><input aria-label="Kunjungan per RM per hari" type="number" min="1" max="15" value={visitsPerDay} onChange={(event) => setVisitsPerDay(Math.max(1, Number(event.target.value) || 1))} /><em>kunjungan</em></label>
            <label><span>Foto / kunjungan</span><input aria-label="Foto per kunjungan" type="number" min="1" max="5" value={photosPerVisit} onChange={(event) => setPhotosPerVisit(Math.max(1, Number(event.target.value) || 1))} /><em>foto</em></label>
            <label><span>Rata-rata foto</span><input aria-label="Ukuran rata-rata foto" type="number" min="100" max="1000" step="50" value={photoKb} onChange={(event) => setPhotoKb(Math.max(100, Number(event.target.value) || 100))} /><em>KB</em></label>
          </div>
          <div className="estimator-result"><div><span>22 hari kerja</span><strong>{monthlyVisits.toLocaleString("id-ID")} kunjungan/bulan</strong></div><div><span>Proyeksi 12 bulan</span><strong>{yearlyGb.toFixed(1)} GB foto</strong></div><div><span>Dengan buffer 20%</span><strong>{safeYearlyGb.toFixed(1)} GB</strong></div></div>
        </article>

        <article className="panel upload-policy-panel">
          <div className="panel-heading"><div><span className="eyebrow">KEBIJAKAN UPLOAD</span><h2>Optimasi Foto Otomatis</h2></div><Smartphone size={20} /></div>
          <div className="policy-list">
            <div><span>01</span><p><strong>Validasi di ponsel</strong><em>Terima JPG, PNG, HEIC hingga 10 MB.</em></p></div>
            <div><span>02</span><p><strong>Kompresi sebelum upload</strong><em>WebP 1.600 px, kualitas 78, target 400 KB.</em></p></div>
            <div><span>03</span><p><strong>Batas server</strong><em>Maksimal 1 MB/foto dan 3 foto/kunjungan.</em></p></div>
            <div><span>04</span><p><strong>Metadata aman</strong><em>EXIF pribadi dihapus; lokasi dan waktu disimpan terpisah.</em></p></div>
          </div>
        </article>
      </section>

      <section className="panel lifecycle-panel">
        <div className="panel-heading"><div><span className="eyebrow">SIKLUS HIDUP DATA</span><h2>Retensi, Backup, dan Penghapusan Aman</h2></div><span className="policy-status"><ShieldCheck size={15} />Butuh persetujuan Compliance</span></div>
        <div className="lifecycle-track">
          <div className="lifecycle-item active"><span>0–12 bulan</span><strong>Online & aktif</strong><p>Foto tersedia untuk dashboard dan audit cabang.</p><em>±{safeYearlyGb.toFixed(0)} GB</em></div>
          <ChevronRight size={20} />
          <div className="lifecycle-item archive"><span>13–24 bulan</span><strong>Arsip bulanan</strong><p>Unduh paket terenkripsi beserta checksum dan manifest.</p><em>Cold archive</em></div>
          <ChevronRight size={20} />
          <div className="lifecycle-item purge"><span>&gt;24 bulan</span><strong>Kandidat hapus</strong><p>Hanya setelah backup tervalidasi dan persetujuan berjenjang.</p><em>30 hari recycle</em></div>
        </div>
        <div className="delete-guardrail"><CircleAlert size={18} /><p><strong>Data tidak dihapus otomatis berdasarkan umur.</strong> Legal hold, investigasi, audit, dan kebijakan retensi bank selalu mengalahkan jadwal penghapusan.</p></div>
      </section>

      <section className="data-bottom-grid">
        <article className="panel archive-list-panel">
          <div className="panel-heading"><div><span className="eyebrow">PUSAT BACKUP</span><h2>Arsip Siap Diunduh</h2></div><button className="plain-button">Lihat semua <ChevronRight size={15} /></button></div>
          <div className="archive-list">
            {[
              ["Juli 2026", "1,48 GB", "1.276 kunjungan", "Terverifikasi"],
              ["Juni 2026", "1,39 GB", "1.198 kunjungan", "Terverifikasi"],
              ["Mei 2026", "1,51 GB", "1.304 kunjungan", "Terverifikasi"],
            ].map(([month, size, count, status]) => (
              <div key={month}><span className="archive-file-icon"><FileArchive size={19} /></span><p><strong>{month}</strong><em>{count} · {size}</em></p><span className="archive-verified"><Check size={13} />{status}</span><button aria-label={`Unduh backup ${month}`} onClick={() => setMessage(`Backup ${month} siap diunduh. Tautan berlaku 15 menit.`)}><Download size={17} /></button></div>
            ))}
          </div>
        </article>

        <article className="panel safe-delete-panel">
          <div className="panel-heading"><div><span className="eyebrow">PENGHAPUSAN TERKENDALI</span><h2>Proses Empat Lapis</h2></div><Trash2 size={19} /></div>
          <ol><li><span>1</span><p><strong>Ekspor</strong><em>Arsip dan manifest</em></p></li><li><span>2</span><p><strong>Verifikasi</strong><em>Checksum dan jumlah berkas</em></p></li><li><span>3</span><p><strong>Persetujuan</strong><em>Pinca dan Compliance</em></p></li><li><span>4</span><p><strong>Recycle 30 hari</strong><em>Dapat dipulihkan sebelum purge</em></p></li></ol>
          <button className="danger-outline-button" onClick={() => setMessage("Permintaan penghapusan dibuat sebagai draft dan belum menghapus data apa pun.")}><Trash2 size={16} />Ajukan penghapusan data</button>
        </article>
      </section>

      <section className="branch-governance-grid">
        <div><Building2 size={20} /><p><strong>Cabang Jatinegara</strong><span>Cakupan data dan arsip dibatasi per cabang</span></p><button onClick={() => setMessage("Cakupan aktif: BRI Cabang Jatinegara.")}>Lihat cakupan</button></div>
        <div><ShieldCheck size={20} /><p><strong>Persetujuan berjenjang</strong><span>Tindakan sensitif tidak diproses sepihak</span></p><button onClick={() => setMessage("Alur persetujuan: Pinca, Compliance, lalu pelaksana sistem.")}>Lihat alur</button></div>
        <div><FileChartColumnIncreasing size={20} /><p><strong>1.842 audit event</strong><span>30 hari terakhir di Cabang Jatinegara</span></p><button onClick={() => setMessage("Audit trail Cabang Jatinegara siap ditinjau.")}>Lihat audit</button></div>
      </section>

      {message ? <div className="data-toast" role="status"><CircleCheckBig size={17} />{message}<button onClick={() => setMessage("")} aria-label="Tutup pemberitahuan"><X size={15} /></button></div> : null}
    </>
  );
}

function MobileBottomNav({ active, onChange, onAddVisit, onMore }: { active: NavKey; onChange: (key: NavKey) => void; onAddVisit: () => void; onMore: () => void }) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Navigasi mobile">
      <button className={active === "Kunjungan" ? "active" : ""} onClick={() => onChange("Kunjungan")}><Camera size={20} /><span>Kunjungan</span></button>
      <button className={active === "Pipeline" ? "active" : ""} onClick={() => onChange("Pipeline")}><ListFilter size={20} /><span>Pipeline</span></button>
      <button className="mobile-add-visit" onClick={onAddVisit} aria-label="Catat kunjungan"><Plus size={24} /></button>
      <button className={active === "Ringkasan" ? "active" : ""} onClick={() => onChange("Ringkasan")}><LayoutDashboard size={20} /><span>Ringkasan</span></button>
      <button onClick={onMore}><Menu size={20} /><span>Lainnya</span></button>
    </nav>
  );
}

function PipelineTable({
  rows,
  onSelect,
  full = false,
}: {
  rows: Pipeline[];
  onSelect: (row: Pipeline) => void;
  full?: boolean;
}) {
  const visibleRows = full ? rows : rows.slice(0, 5);
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Prospek / Nasabah</th>
            <th>RM Funding</th>
            <th>Produk</th>
            <th>Potensi</th>
            <th>Status</th>
            <th>Komitmen</th>
            <th aria-label="Aksi" />
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => (
            <tr key={row.id} onClick={() => onSelect(row)}>
              <td><div className="customer-cell"><span>{row.name.charAt(0)}</span><div><strong>{row.name}</strong><em>{row.id}</em></div></div></td>
              <td><div className="rm-cell"><span>{row.rm.slice(0, 2).toUpperCase()}</span>{row.rm}</div></td>
              <td><span className={`product-tag ${row.product.toLowerCase()}`}>{row.product}</span></td>
              <td><strong>{money(row.amount)}</strong></td>
              <td><span className={`status-tag ${row.status.toLowerCase()}`}><i />{row.status}</span></td>
              <td><span className="date-cell"><CalendarDays size={14} />{row.commitment}</span></td>
              <td><button className="row-button" aria-label={`Lihat ${row.name}`}><ChevronRight size={16} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {visibleRows.length === 0 ? <div className="empty-table">Tidak ada pipeline yang cocok dengan pencarian.</div> : null}
    </div>
  );
}

function Dashboard({
  role,
  filteredRows,
  onSelect,
  onAdd,
  onGoPipeline,
}: {
  role: string;
  filteredRows: Pipeline[];
  onSelect: (row: Pipeline) => void;
  onAdd: () => void;
  onGoPipeline: () => void;
}) {
  const identity = roleIdentity[role] ?? roleIdentity["RM Funding"];
  return (
    <>
      <section className="page-intro">
        <div>
          <div className="intro-meta">
            <span className="live-dot" /> Data s.d. 9 Agustus 2026
            <span className="demo-badge">DATA SIMULASI</span>
          </div>
          <h1>Selamat pagi, {identity.name.split(" ")[0]}.</h1>
          <p>Berikut ringkasan kinerja RM Funding Jatinegara untuk pengambilan keputusan hari ini.</p>
        </div>
        <div className="intro-actions">
          <button className="secondary-button"><Download size={17} />Unduh laporan</button>
          <button className="primary-button" onClick={onAdd}><Plus size={18} />Tambah pipeline</button>
        </div>
      </section>

      <div className="role-context">
        <ShieldCheck size={16} /> Tampilan disesuaikan untuk <strong>{role}</strong>
      </div>

      <section className="kpi-grid">
        <KpiCard label="Total Pipeline" value="Rp297,45 M" note="vs. bulan lalu" change="+12,8%" icon={WalletCards} tone="blue" progress={76} />
        <KpiCard label="Prospek Aktif" value="154" note="16 berstatus Hot" change="+9 prospek" icon={BriefcaseBusiness} tone="violet" progress={68} />
        <KpiCard label="Pipeline Hot" value="Rp80,35 M" note="potensi siap realisasi" change="+18,2%" icon={Activity} tone="orange" progress={84} />
        <KpiCard label="Realisasi Target" value="72,4%" note="Rp215,30 M terealisasi" change="+6,4%" icon={Target} tone="green" progress={72.4} />
      </section>

      <section className="dashboard-grid">
        <OverviewChart />
        <ProductMix />
        <PerformancePanel />
        <AttentionPanel onOpenPipeline={onGoPipeline} />
      </section>

      <section className="panel pipeline-panel">
        <div className="panel-heading table-heading">
          <div>
            <span className="eyebrow">PRIORITAS TERDEKAT</span>
            <h2>Pipeline yang Perlu Dikawal</h2>
          </div>
          <div className="table-actions">
            <button className="filter-button"><Filter size={16} />Filter</button>
            <button className="plain-button" onClick={onGoPipeline}>Lihat semua <ChevronRight size={15} /></button>
          </div>
        </div>
        <PipelineTable rows={filteredRows} onSelect={onSelect} />
      </section>

      <footer className="page-footer">
        <span>Sumber simulasi: Workbook Pipeline RM Funding Jatinegara</span>
        <span>Terakhir diperbarui 9 Agu 2026, 09:42 WIB</span>
      </footer>
    </>
  );
}

function PipelinePage({
  rows,
  onSelect,
  onAdd,
}: {
  rows: Pipeline[];
  onSelect: (row: Pipeline) => void;
  onAdd: () => void;
}) {
  const [status, setStatus] = useState("Semua status");
  const statusRows = status === "Semua status" ? rows : rows.filter((row) => row.status === status);
  return (
    <>
      <section className="page-intro compact">
        <div>
          <div className="intro-meta"><span className="live-dot" /> Diperbarui 09:42 WIB</div>
          <h1>Kelola Pipeline</h1>
          <p>Pantau seluruh peluang funding dari prospek hingga realisasi dalam satu tempat.</p>
        </div>
        <button className="primary-button" onClick={onAdd}><Plus size={18} />Tambah pipeline</button>
      </section>
      <section className="module-stats">
        <div><span>Total potensi</span><strong>Rp297,45 M</strong><em>154 pipeline aktif</em></div>
        <div><span>Weighted pipeline</span><strong>Rp181,62 M</strong><em>61,1% probabilitas</em></div>
        <div><span>Jatuh tempo 7 hari</span><strong>Rp51,30 M</strong><em>11 komitmen</em></div>
        <div><span>Perlu tindak lanjut</span><strong>23</strong><em>3 sudah terlambat</em></div>
      </section>
      <section className="panel pipeline-panel full-table-panel">
        <div className="panel-heading table-heading">
          <div>
            <span className="eyebrow">DAFTAR UTAMA</span>
            <h2>Semua Pipeline</h2>
          </div>
          <div className="table-actions">
            <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter status">
              <option>Semua status</option>
              <option>Hot</option>
              <option>Warm</option>
              <option>Cold</option>
            </select>
            <button className="filter-button"><Filter size={16} />Filter lanjutan</button>
            <button className="secondary-button"><Download size={16} />Ekspor</button>
          </div>
        </div>
        <PipelineTable rows={statusRows} onSelect={onSelect} full />
      </section>
    </>
  );
}

type ModuleKey = Exclude<NavKey, "Kunjungan" | "Ringkasan" | "Pipeline" | "Laporan" | "Manajemen Data">;

const moduleContent: Record<ModuleKey, { title: string; subtitle: string; items: Array<[string, string, string]> }> = {
  Aktivitas: {
    title: "Aktivitas & Kunjungan",
    subtitle: "Jadwalkan kunjungan, catat hasil pertemuan, dan pastikan setiap prospek memiliki tindak lanjut.",
    items: [["12", "Agenda minggu ini", "4 kunjungan hari ini"], ["154", "Belum ada status visit", "Perlu dilengkapi"], ["8", "Tindak lanjut selesai", "Minggu berjalan"]],
  },
  Nasabah: {
    title: "Portofolio Nasabah",
    subtitle: "Profil terpusat untuk memantau CASA, tren saldo, dan peluang pengembangan setiap nasabah.",
    items: [["1.184", "Debitur terpantau", "OS Rp1,605 T"], ["Rp80,4 M", "CASA 8 Agustus", "Turun Rp2,56 M MTD"], ["41", "Peluang cross-sell", "Prioritas bulan ini"]],
  },
  "Pusat Bisnis": {
    title: "Peta Pusat Bisnis",
    subtitle: "Petakan potensi wilayah dan prospek baru agar pembagian coverage RM lebih terarah.",
    items: [["13", "Zona bisnis", "Wilayah Jatinegara"], ["1.325", "Prospek new business", "Estimasi Rp162,2 M"], ["1.248", "Status BRI belum terisi", "Perlu cleansing data"]],
  },
  Pengaturan: {
    title: "Pengaturan Sistem",
    subtitle: "Kelola pengguna, akses per peran, target, notifikasi, dan kebijakan keamanan aplikasi.",
    items: [["3", "Kelompok akses", "Pinca, Lead RM, RM"], ["OTP", "Verifikasi email", "Wajib saat login"], ["Aktif", "Audit trail", "Semua perubahan tercatat"]],
  },
};

const reportMetrics = [
  { label: "Potensi pipeline", value: "Rp297,45 M", note: "154 pipeline aktif", icon: WalletCards, tone: "blue" },
  { label: "Realisasi funding", value: "Rp215,30 M", note: "72,4% dari target", icon: Target, tone: "green" },
  { label: "Kunjungan", value: "196", note: "174 telah disetujui", icon: Camera, tone: "orange" },
  { label: "Kapasitas data", value: "1,51 GB", note: "Estimasi foto per bulan", icon: HardDrive, tone: "violet" },
] as const;

const reportProducts = [
  { name: "Giro", realization: "Rp112,40 M", progress: 86.5, tone: "blue" },
  { name: "Deposito", realization: "Rp69,80 M", progress: 77.6, tone: "green" },
  { name: "Tabungan", realization: "Rp33,10 M", progress: 60.2, tone: "orange" },
] as const;

const reportRMRows = [
  { rank: 1, name: "Kinanah", pipeline: "Rp58,20 M", realization: "Rp45,10 M", visits: 42, score: "91%" },
  { rank: 2, name: "Karlina", pipeline: "Rp51,75 M", realization: "Rp38,60 M", visits: 39, score: "87%" },
  { rank: 3, name: "Fitri", pipeline: "Rp46,90 M", realization: "Rp34,20 M", visits: 36, score: "82%" },
  { rank: 4, name: "Rizky", pipeline: "Rp41,30 M", realization: "Rp29,90 M", visits: 34, score: "78%" },
  { rank: 5, name: "Aulia", pipeline: "Rp36,85 M", realization: "Rp25,70 M", visits: 31, score: "74%" },
] as const;

const reportLibrary = [
  {
    title: "Laporan Eksekutif Cabang",
    description: "KPI utama, realisasi produk, leaderboard RM, dan rekomendasi pimpinan.",
    meta: "PDF · 4 halaman",
    icon: FileChartColumnIncreasing,
    downloadable: true,
  },
  {
    title: "Detail Pipeline",
    description: "Daftar prospek, status Hot/Warm/Cold, probabilitas, komitmen, dan tindak lanjut.",
    meta: "Excel / CSV · 154 baris",
    icon: ListFilter,
    downloadable: false,
  },
  {
    title: "Rekap Kunjungan",
    description: "Aktivitas harian RM, status review, lokasi, hasil kunjungan, dan bukti foto.",
    meta: "PDF / Excel · 196 aktivitas",
    icon: Camera,
    downloadable: false,
  },
  {
    title: "Kapasitas & Retensi Data",
    description: "Pertumbuhan penyimpanan, status backup, arsip, dan kandidat penghapusan aman.",
    meta: "Khusus Pemimpin Cabang",
    icon: Database,
    downloadable: false,
  },
] as const;

function ReportsPage({ role }: { role: string }) {
  const [period, setPeriod] = useState("1–11 Agustus 2026");
  const [notice, setNotice] = useState("");
  const visibleReports = role === "Pemimpin Cabang" ? reportLibrary : reportLibrary.slice(0, 3);

  function previewExport(title: string) {
    setNotice(`${title} siap dibuat pada versi produksi. PDF sample eksekutif sudah dapat diunduh.`);
  }

  return (
    <>
      <section className="report-hero">
        <div className="report-hero-copy">
          <div className="intro-meta">
            <span className="demo-badge">DATA DEMO</span>
            <span>Diperbarui 11 Agu 2026, 09:42 WIB</span>
          </div>
          <h1>Laporan Kinerja RM Funding</h1>
          <p>Sample laporan terpadu untuk evaluasi pipeline, pencapaian produk, aktivitas kunjungan, dan kapasitas data tanpa membuat pivot spreadsheet.</p>
          <span className="report-role"><UserRound size={14} />Tampilan untuk <strong>{role}</strong></span>
        </div>
        <div className="report-page-actions">
          <label className="report-period">
            <CalendarDays size={16} />
            <span>Periode</span>
            <select value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Periode laporan">
              <option>1–11 Agustus 2026</option>
              <option>Agustus 2026</option>
              <option>Triwulan III 2026</option>
            </select>
          </label>
          <button className="secondary-button" onClick={() => window.print()}><Printer size={16} />Cetak</button>
          <a
            className="primary-button report-download-button"
            href="/sample-laporan-rm-funding-jatinegara.pdf"
            download
            onClick={() => setNotice("PDF sample laporan mulai diunduh.")}
          >
            <Download size={16} />Unduh PDF sample
          </a>
        </div>
      </section>

      <div className="report-disclaimer"><ShieldCheck size={15} /><strong>DATA DEMO — BUKAN DATA RESMI BANK.</strong> Angka pada halaman dan PDF hanya untuk menggambarkan format laporan aplikasi.</div>

      <section className="report-kpi-grid" aria-label="Ringkasan indikator laporan">
        {reportMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label}>
              <span className={`report-kpi-icon ${metric.tone}`}><Icon size={19} /></span>
              <div><span>{metric.label}</span><strong>{metric.value}</strong><em>{metric.note}</em></div>
            </article>
          );
        })}
      </section>

      <section className="report-main-grid">
        <article className="panel report-product-panel">
          <div className="panel-heading">
            <div><span className="eyebrow">PENCAPAIAN PRODUK</span><h2>Realisasi funding terhadap target</h2></div>
            <span className="report-period-chip">{period}</span>
          </div>
          <div className="report-product-list">
            {reportProducts.map((product) => (
              <div key={product.name}>
                <div className="report-product-copy"><strong>{product.name}</strong><span>{product.realization}</span><em>{product.progress}%</em></div>
                <div className="report-progress"><span className={product.tone} style={{ width: `${product.progress}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="report-product-total"><span>Total realisasi</span><strong>Rp215,30 M</strong><em>72,4% dari target cabang</em></div>
        </article>

        <article className="panel report-visit-panel">
          <div className="panel-heading"><div><span className="eyebrow">KUNJUNGAN HARIAN</span><h2>Status bukti kunjungan</h2></div><Camera size={20} /></div>
          <div className="report-visit-ring" aria-label="88,8 persen kunjungan disetujui">
            <div><strong>88,8%</strong><span>disetujui</span></div>
          </div>
          <div className="report-visit-legend">
            <span><i className="approved" />Disetujui <strong>174</strong></span>
            <span><i className="review" />Perlu review <strong>14</strong></span>
            <span><i className="revision" />Perbaikan <strong>8</strong></span>
          </div>
        </article>
      </section>

      <section className="panel report-rm-panel">
        <div className="panel-heading table-heading">
          <div><span className="eyebrow">KINERJA TIM</span><h2>Sample leaderboard RM Funding</h2></div>
          <span className="report-table-note">Urutan berdasarkan skor gabungan</span>
        </div>
        <div className="report-table-wrap">
          <table className="report-table">
            <thead><tr><th>Peringkat</th><th>RM Funding</th><th>Pipeline</th><th>Realisasi</th><th>Kunjungan</th><th>Skor</th></tr></thead>
            <tbody>
              {reportRMRows.map((row) => (
                <tr key={row.rank}>
                  <td><span className={`report-rank rank-${row.rank}`}>{row.rank}</span></td>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.pipeline}</td>
                  <td>{row.realization}</td>
                  <td>{row.visits}</td>
                  <td><span className="report-score">{row.score}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="report-secondary-grid">
        <article className="panel report-priority-panel">
          <div className="panel-heading"><div><span className="eyebrow">TINDAK LANJUT PRIORITAS</span><h2>Catatan untuk rapat kinerja</h2></div><CircleAlert size={20} /></div>
          <ol>
            <li><span>1</span><div><strong>Kawal 16 pipeline Hot senilai Rp80,35 M</strong><p>Pastikan komitmen dan next action terisi sebelum akhir minggu.</p></div></li>
            <li><span>2</span><div><strong>Review 22 bukti kunjungan</strong><p>14 menunggu review dan 8 perlu dilengkapi oleh RM terkait.</p></div></li>
            <li><span>3</span><div><strong>Aktifkan backup bulanan tervalidasi</strong><p>Estimasi paket backup awal 1,59 GB per bulan.</p></div></li>
          </ol>
        </article>

        <article className="panel report-pipeline-panel">
          <div className="panel-heading"><div><span className="eyebrow">KOMPOSISI PIPELINE</span><h2>Potensi berdasarkan status</h2></div><Gauge size={20} /></div>
          <div className="report-pipeline-bars">
            <div><span><i className="hot" />Hot</span><strong>Rp80,35 M</strong><em>16 data</em></div>
            <div><span><i className="warm" />Warm</span><strong>Rp169,10 M</strong><em>91 data</em></div>
            <div><span><i className="cold" />Cold</span><strong>Rp48,00 M</strong><em>47 data</em></div>
          </div>
        </article>
      </section>

      <section className="report-library-section">
        <div className="report-section-heading"><div><span className="eyebrow">PUSAT LAPORAN</span><h2>Format laporan yang tersedia</h2><p>Setiap laporan dapat difilter menurut periode, RM, produk, status, dan wilayah.</p></div><FileArchive size={23} /></div>
        <div className="report-library-grid">
          {visibleReports.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title}>
                <span className="report-file-icon"><Icon size={20} /></span>
                <div><h3>{item.title}</h3><p>{item.description}</p><em>{item.meta}</em></div>
                {item.downloadable ? (
                  <a href="/sample-laporan-rm-funding-jatinegara.pdf" download onClick={() => setNotice("PDF sample laporan mulai diunduh.")} aria-label={`Unduh ${item.title}`}><Download size={16} />Unduh</a>
                ) : (
                  <button onClick={() => previewExport(item.title)} aria-label={`Buat ${item.title}`}><FileChartColumnIncreasing size={16} />Buat laporan</button>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <footer className="page-footer report-footer">
        <span>Sumber simulasi: workbook Pipeline RM Funding Jatinegara dan data fitur demo</span>
        <span>Periode aktif: {period}</span>
      </footer>

      {notice ? <div className="report-toast" role="status" aria-live="polite"><CircleCheckBig size={17} /><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Tutup pemberitahuan"><X size={15} /></button></div> : null}
    </>
  );
}

function ModulePage({ module }: { module: ModuleKey }) {
  const content = moduleContent[module];
  return (
    <>
      <section className="page-intro compact">
        <div>
          <div className="intro-meta"><span className="demo-badge">DEMO MODUL</span></div>
          <h1>{content.title}</h1>
          <p>{content.subtitle}</p>
        </div>
        <button className="secondary-button"><Download size={17} />Unduh data</button>
      </section>
      <section className="module-stats three">
        {content.items.map(([value, label, note]) => (
          <div key={label}><span>{label}</span><strong>{value}</strong><em>{note}</em></div>
        ))}
      </section>
      <section className="panel module-preview">
        <div className="module-illustration">
          {module === "Aktivitas" ? <CalendarDays size={33} /> : null}
          {module === "Nasabah" ? <UsersRound size={33} /> : null}
          {module === "Pusat Bisnis" ? <Building2 size={33} /> : null}
          {module === "Pengaturan" ? <Settings size={33} /> : null}
        </div>
        <span className="eyebrow">GAMBARAN MODUL</span>
        <h2>{content.title} akan terhubung langsung dengan pipeline</h2>
        <p>Dalam versi produksi, data pada halaman ini diperbarui otomatis dari aktivitas tim dan dapat difilter tanpa membuat pivot spreadsheet.</p>
        <button className="primary-button">Lihat rancangan alur <ChevronRight size={17} /></button>
      </section>
    </>
  );
}

function DetailDrawer({ row, onClose }: { row: Pipeline; onClose: () => void }) {
  return (
    <div className="overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="detail-drawer" role="dialog" aria-modal="true" aria-label={`Detail ${row.name}`}>
        <div className="drawer-head">
          <div><span>DETAIL PIPELINE</span><h2>{row.name}</h2><p>{row.id}</p></div>
          <button className="icon-button" onClick={onClose} aria-label="Tutup detail"><X size={20} /></button>
        </div>
        <div className="drawer-hero">
          <div><span>Potensi dana</span><strong>{money(row.amount)}</strong></div>
          <span className={`status-tag ${row.status.toLowerCase()}`}><i />{row.status}</span>
        </div>
        <div className="probability-block">
          <div><span>Probabilitas realisasi</span><strong>{row.probability}%</strong></div>
          <div className="rm-progress"><span style={{ width: `${row.probability}%` }} /></div>
        </div>
        <div className="detail-grid">
          <div><span>Produk</span><strong>{row.product}</strong></div>
          <div><span>RM Funding</span><strong>{row.rm}</strong></div>
          <div><span>Zona bisnis</span><strong>{row.zone}</strong></div>
          <div><span>Tanggal komitmen</span><strong>{row.commitment}</strong></div>
        </div>
        <div className="next-action">
          <span>Langkah selanjutnya</span>
          <p>{row.nextAction}</p>
          <button className="secondary-button"><CalendarDays size={16} />Jadwalkan aktivitas</button>
        </div>
        <div className="activity-timeline">
          <h3>Riwayat aktivitas</h3>
          <div><i /><p><strong>Pipeline diperbarui menjadi {row.status}</strong><span>Hari ini, 09:15 · oleh {row.rm}</span></p></div>
          <div><i /><p><strong>Catatan kunjungan ditambahkan</strong><span>7 Agu 2026, 14:30</span></p></div>
          <div><i /><p><strong>Prospek dibuat</strong><span>2 Agu 2026, 10:05</span></p></div>
        </div>
        <div className="drawer-actions">
          <button className="secondary-button" onClick={onClose}>Tutup</button>
          <button className="primary-button">Ubah pipeline</button>
        </div>
      </aside>
    </div>
  );
}

function AddPipelineModal({ onClose }: { onClose: () => void }) {
  const [saved, setSaved] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }
  return (
    <div className="overlay modal-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-label="Tambah pipeline baru">
        {saved ? (
          <div className="success-state">
            <div><CircleCheckBig size={34} /></div>
            <span>DATA TERSIMPAN</span>
            <h2>Pipeline baru berhasil dibuat</h2>
            <p>Demo ini tidak mengirim data ke server. Pada aplikasi produksi, Lead RM akan langsung menerima notifikasi.</p>
            <button className="primary-button" onClick={onClose}>Kembali ke dashboard</button>
          </div>
        ) : (
          <>
            <div className="modal-head">
              <div><span>INPUT TERPUSAT</span><h2>Tambah Pipeline Baru</h2><p>Lengkapi data inti. Kolom wajib ditandai dengan *.</p></div>
              <button className="icon-button" onClick={onClose} aria-label="Tutup form"><X size={20} /></button>
            </div>
            <form onSubmit={submit} className="pipeline-form">
              <label className="full">Nama prospek / nasabah *<input required placeholder="Contoh: PT Maju Bersama" /></label>
              <label>Produk *<select required defaultValue=""><option value="" disabled>Pilih produk</option><option>Giro</option><option>Tabungan</option><option>Deposito</option></select></label>
              <label>Potensi dana *<div className="input-prefix"><span>Rp</span><input required type="number" placeholder="0" /></div></label>
              <label>Status pipeline *<select defaultValue="Warm"><option>Hot</option><option>Warm</option><option>Cold</option></select></label>
              <label>Tanggal komitmen *<input required type="date" defaultValue="2026-08-20" /></label>
              <label>Zona bisnis<select defaultValue="Jatinegara"><option>Jatinegara</option><option>Matraman</option><option>Duren Sawit</option><option>Kramat Jati</option></select></label>
              <label>Probabilitas *<div className="input-suffix"><input required type="number" min="0" max="100" defaultValue="60" /><span>%</span></div></label>
              <label className="full">Rencana tindak lanjut<textarea rows={3} placeholder="Tuliskan langkah berikutnya..." /></label>
              <div className="form-note full"><ShieldCheck size={16} />Setiap perubahan akan tercatat pada audit trail.</div>
              <div className="form-actions full"><button type="button" className="secondary-button" onClick={onClose}>Batal</button><button type="submit" className="primary-button">Simpan pipeline</button></div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function SecurityModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"email" | "otp" | "done">("email");
  return (
    <div className="overlay modal-overlay security-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="security-modal" role="dialog" aria-modal="true" aria-label="Simulasi login aman">
        <button className="icon-button security-close" onClick={onClose} aria-label="Tutup simulasi"><X size={20} /></button>
        <div className="security-brand"><span>P</span><div><strong>PIPELINE</strong><em>RM Funding · Jatinegara</em></div></div>
        {step === "email" ? (
          <div className="security-content">
            <div className="security-icon"><LockKeyhole size={25} /></div>
            <span className="eyebrow">AKSES TERLINDUNGI</span>
            <h2>Masuk ke ruang kerja</h2>
            <p>Gunakan email perusahaan yang telah terdaftar.</p>
            <label>Email perusahaan<input type="email" defaultValue="ahmad.fauzi@corp.bri.co.id" /></label>
            <div className="captcha-demo"><div className="captcha-check"><Check size={17} /></div><div><strong>Saya bukan robot</strong><span>Cloudflare Turnstile</span></div><ShieldCheck size={23} /></div>
            <button className="primary-button full-button" onClick={() => setStep("otp")}><Mail size={17} />Kirim kode OTP</button>
            <small><ShieldCheck size={13} />Dilindungi rate limiting, CAPTCHA, dan audit akses.</small>
          </div>
        ) : null}
        {step === "otp" ? (
          <div className="security-content">
            <div className="security-icon"><KeyRound size={25} /></div>
            <span className="eyebrow">VERIFIKASI DUA LANGKAH</span>
            <h2>Masukkan kode OTP</h2>
            <p>Kode 6 digit telah dikirim ke a•••••@corp.bri.co.id</p>
            <div className="otp-row">{[2, 8, 4, 6, 1, 9].map((number, index) => <input key={index} value={number} readOnly aria-label={`Digit OTP ${index + 1}`} />)}</div>
            <div className="otp-meta"><span><Clock3 size={14} />Berlaku 04:32</span><button>Kirim ulang</button></div>
            <button className="primary-button full-button" onClick={() => setStep("done")}><ShieldCheck size={17} />Verifikasi & masuk</button>
            <button className="text-button" onClick={() => setStep("email")}>Gunakan email lain</button>
          </div>
        ) : null}
        {step === "done" ? (
          <div className="security-content security-success">
            <div className="success-ring"><CircleCheckBig size={38} /></div>
            <span className="eyebrow">VERIFIKASI BERHASIL</span>
            <h2>Akses Anda aman</h2>
            <p>Identitas dan perangkat telah diverifikasi. Sesi akan tercatat dalam audit trail.</p>
            <div className="session-info"><span><UserRound size={16} />Pemimpin Cabang</span><span><ShieldCheck size={16} />Sesi terenkripsi</span></div>
            <button className="primary-button full-button" onClick={onClose}>Lanjut ke dashboard</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function Home() {
  const [active, setActive] = useState<NavKey>("Kunjungan");
  const [role, setRole] = useState("RM Funding");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Pipeline | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const desktopViewport = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileOpen(false);
    };

    if (desktopViewport.addEventListener) {
      desktopViewport.addEventListener("change", closeOnDesktop);
      return () => desktopViewport.removeEventListener("change", closeOnDesktop);
    }

    desktopViewport.addListener(closeOnDesktop);
    return () => desktopViewport.removeListener(closeOnDesktop);
  }, []);

  function changeRole(nextRole: string) {
    setRole(nextRole);
    if (nextRole !== "Pemimpin Cabang" && active === "Manajemen Data") {
      setActive("Kunjungan");
    }
  }

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return pipelineRows;
    return pipelineRows.filter((row) =>
      [row.name, row.rm, row.product, row.status, row.zone, row.id].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [search]);

  return (
    <div className={`app-shell ${mobileOpen ? "is-menu-open" : ""}`}>
      <Sidebar active={active} role={role} onRoleChange={changeRole} onChange={setActive} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="app-main">
        <Topbar
          role={role}
          setRole={changeRole}
          onOpenMenu={() => setMobileOpen(true)}
          onSecurity={() => setSecurityOpen(true)}
          search={search}
          setSearch={setSearch}
        />
        <main className="page-content">
          {active === "Kunjungan" ? (
            <VisitPage role={role} onAddVisit={() => setVisitOpen(true)} />
          ) : active === "Ringkasan" ? (
            <Dashboard
              role={role}
              filteredRows={filteredRows}
              onSelect={setSelected}
              onAdd={() => setAddOpen(true)}
              onGoPipeline={() => setActive("Pipeline")}
            />
          ) : active === "Pipeline" ? (
            <PipelinePage rows={filteredRows} onSelect={setSelected} onAdd={() => setAddOpen(true)} />
          ) : active === "Laporan" ? (
            <ReportsPage role={role} />
          ) : active === "Manajemen Data" ? (
            role === "Pemimpin Cabang" ? <DataManagementPage /> : <VisitPage role={role} onAddVisit={() => setVisitOpen(true)} />
          ) : (
            <ModulePage module={active as ModuleKey} />
          )}
        </main>
      </div>
      <MobileBottomNav active={active} onChange={setActive} onAddVisit={() => setVisitOpen(true)} onMore={() => setMobileOpen(true)} />
      {selected ? <DetailDrawer row={selected} onClose={() => setSelected(null)} /> : null}
      {addOpen ? <AddPipelineModal onClose={() => setAddOpen(false)} /> : null}
      {visitOpen ? <VisitFormModal onClose={() => setVisitOpen(false)} /> : null}
      {securityOpen ? <SecurityModal onClose={() => setSecurityOpen(false)} /> : null}
    </div>
  );
}
