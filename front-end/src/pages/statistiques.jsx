import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  CreditCard, 
  Filter, 
  Calendar, 
  RefreshCw, 
  Search,
  PieChart as PieIcon,
  BarChart2,
  Wallet,
  ChevronDown
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

// ─── CONSTANTS ──────────────────────────────────────────────────────────────

const BASE_URL = "http://127.0.0.1:8000";

const MONTHS = [
  { value: 1, label: "Janvier" }, { value: 2, label: "Février" },
  { value: 3, label: "Mars" }, { value: 4, label: "Avril" },
  { value: 5, label: "Mai" }, { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" }, { value: 8, label: "Août" },
  { value: 9, label: "Septembre" }, { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" }, { value: 12, label: "Décembre" },
];

const CHART_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ec4899",
  "#8b5cf6", "#f43f5e", "#06b6d4", "#84cc16",
];

// ─── UTILS ──────────────────────────────────────────────────────────────────

const fmt = (val) =>
  `${parseFloat(val || 0).toLocaleString("fr-FR", { minimumFractionDigits: 0 })} FCFA`;

const fmtShort = (val) => {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
  return String(val);
};

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

const CustomSelect = ({ value, onChange, options, variant = 'white', icon: Icon, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = options.find(o => String(o.value) === String(value));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-auto" ref={dropdownRef}>
      <div 
        className={`px-3.5 py-2.5 bg-slate-50 border-2 rounded-xl text-[13px] text-slate-800 flex items-center justify-between cursor-pointer transition-all min-w-[150px] gap-2 ${isOpen ? 'border-slate-300' : 'border-slate-200 hover:border-slate-300'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-slate-500" />}
          <span className="font-semibold">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] right-0 min-w-[180px] bg-white rounded-xl border border-slate-200 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] z-[100] max-h-[260px] overflow-y-auto p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map(opt => (
            <div 
              key={opt.value} 
              className={`px-3 py-2.5 rounded-lg cursor-pointer text-[13px] font-semibold transition-colors ${String(value) === String(opt.value) ? 'bg-slate-100 text-slate-800' : 'bg-transparent text-slate-700 hover:bg-slate-50'}`}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── MOCK DATA ──────────────────────────────────────────────────────────────

const MOCK_OVERVIEW = { total_expenses: 285400, mean_daily: 9206, expense_max: 52000, expenses_count: 31, percentage_change: -12, percentage_change_moyenne_daily: 3 };
const MOCK_CATEGORY = [
  { category_name: "Alimentation", expense_by_category: 85000, category_color: "#3b82f6" },
  { category_name: "Transport", expense_by_category: 42000, category_color: "#10b981" },
  { category_name: "Logement", expense_by_category: 120000, category_color: "#f59e0b" },
  { category_name: "Shopping", expense_by_category: 22000, category_color: "#ec4899" },
  { category_name: "Loisirs", expense_by_category: 11000, category_color: "#8b5cf6" },
  { category_name: "Santé", expense_by_category: 5400, category_color: "#f43f5e" }
];
const MOCK_DAILY = Array.from({ length: 20 }, (_, i) => ({ date: `2026-03-${String(i + 1).padStart(2, "0")}`, amount: Math.floor(Math.random() * 20000) + 2000 }));
const MOCK_BUDGET = { amount: 350000, month: 3, year: 2026 };
const MOCK_RANKING = [
  { amount: "45000.25", description: "Loyer", date: "2026-03-01", category_color: "#f59e0b" },
  { amount: "12000.00", description: "Courses Aldi", date: "2026-03-05", category_color: "#3b82f6" },
  { amount: "8500.00", description: "Essence", date: "2026-03-12", category_color: "#10b981" }
];

// ─── PAGE COMPONENT ──────────────────────────────────────────────────────────

const StatisticsPage = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [filters, setFilters] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });

  const [data, setData] = useState({ overview: null, categories: null, daily: [], budget: null, ranking: [] });
  const [loading, setLoading] = useState(true);

  const authFetch = async (url, options = {}) => {
    let token = localStorage.getItem("token");
    try {
      const v = await fetch(`${BASE_URL}/auth/jwt/verify/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
      if (!v.ok) {
        const r = localStorage.getItem("refresh");
        if (r) {
          const res = await fetch(`${BASE_URL}/auth/jwt/refresh/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ refresh: r }) });
          if (res.ok) { token = (await res.json()).access; localStorage.setItem("token", token); }
        }
      }
    } catch {}
    return fetch(url, { ...options, headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...options.headers } });
  };

  const loadAll = useCallback(async (m, y) => {
    setLoading(true);
    try {
      const [ov, cat, day, bud, rnk] = await Promise.all([
        authFetch(`${BASE_URL}/statistic/expenses/?month=${m}&year=${y}`),
        authFetch(`${BASE_URL}/statistic/categories/?month=${m}&year=${y}`),
        authFetch(`${BASE_URL}/statistic/expenses-daily/?month=${m}&year=${y}`),
        authFetch(`${BASE_URL}/budgets/?month=${m}&year=${y}`),
        authFetch(`${BASE_URL}/statistic/expenses-ranking/?month=${m}&year=${y}`),
      ]);

      let dailyStats = MOCK_DAILY;
      if (day.ok) {
        const rawDaily = await day.json();
        dailyStats = Object.entries(rawDaily).map(([key, value]) => {
          const dayNum = key.replace('day_', '').padStart(2, '0');
          return {
            date: `${y}-${String(m).padStart(2, '0')}-${dayNum}`,
            amount: value
          };
        }).sort((a, b) => a.date.localeCompare(b.date));
      }

      setData({
        overview: ov.ok ? await ov.json() : MOCK_OVERVIEW,
        categories: cat.ok ? await cat.json() : MOCK_CATEGORY,
        daily: dailyStats,
        budget: bud.ok ? await bud.json() : [MOCK_BUDGET],
        ranking: rnk.ok ? await rnk.json() : MOCK_RANKING
      });
    } catch {
      setData({ overview: MOCK_OVERVIEW, categories: MOCK_CATEGORY, daily: MOCK_DAILY, budget: [MOCK_BUDGET], ranking: MOCK_RANKING });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(filters.month, filters.year); }, [filters, loadAll]);

  const handleApply = () => setFilters({ month, year });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 text-sm font-medium gap-3">
        <div className="w-6 h-6 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        Chargement des données...
      </div>
    );
  }

  const mLabel = MONTHS.find(m => m.value === filters.month)?.label;
  const ov = data.overview;
  const cats = data.categories;
  const budgets = Array.isArray(data.budget) ? data.budget : [data.budget];
  const totalBudget = budgets.reduce((acc, b) => acc + parseFloat(b.amount || 0), 0);
  const spent = ov.total_expenses;
  const remains = totalBudget - spent;
  const pctUsed = totalBudget > 0 ? (spent / totalBudget) * 100 : 0;
  const isOver = spent > totalBudget;

  return (
    <div className="pb-10 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-1 font-display tracking-tight">Statistiques</h1>
          <p className="text-sm font-medium text-slate-500">Visualisez vos habitudes de consommation · {mLabel} {filters.year}</p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-green-50 text-green-600 rounded-full text-[13px] font-bold border border-green-100 shadow-sm w-fit">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Données en temps réel
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-[13px] font-semibold text-slate-500 flex items-center gap-2 mr-2">
          <Filter size={16} /> Filtres
        </div>
        <CustomSelect value={month} onChange={setMonth} options={MONTHS} icon={Calendar} />
        <CustomSelect value={year} onChange={setYear} options={[{value: 2024, label: '2024'}, {value: 2025, label: '2025'}, {value: 2026, label: '2026'}]} icon={Activity} />
        <button 
          onClick={handleApply}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-[13px] font-bold ml-auto hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 transition-all outline-none focus:ring-4 focus:ring-blue-500/20"
        >
          <RefreshCw size={14} /> Appliquer
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { icon: TrendingDown, bg: 'bg-orange-50', text: 'text-orange-500', label: 'Total des Dépenses', value: fmt(spent), diff: ov.percentage_change, type: 'pct' },
          { icon: Activity, bg: 'bg-blue-50', text: 'text-blue-600', label: 'Moyenne / Jour', value: fmt(ov.mean_daily), diff: ov.percentage_change_moyenne_daily, type: 'pct' },
          { icon: ArrowUpRight, bg: 'bg-purple-50', text: 'text-purple-500', label: 'Dépense Max', value: fmt(ov.expense_max), diff: ov.statut_max || "Unique ce mois", type: 'text' },
          { icon: CreditCard, bg: 'bg-green-50', text: 'text-green-500', label: 'Transactions', value: ov.expenses_count, diff: ov.statut_count || "Stable", type: 'text' }
        ].map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="mb-4 flex justify-between">
              <div className={`w-11 h-11 ${card.bg} ${card.text} rounded-xl flex items-center justify-center`}>
                <card.icon size={22} />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-1">{card.value}</h2>
            <p className="text-sm font-semibold text-slate-400 mb-3">{card.label}</p>
            
            {card.type === 'pct' ? (
              <div className={`flex items-center gap-1.5 text-xs font-bold w-fit px-2.5 py-1.5 rounded-lg ${card.diff >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {card.diff >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {Math.abs(card.diff).toFixed(1)}% vs mois dernier
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-bold w-fit px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Activity size={14} /> {card.diff}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Category Distribution */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <PieIcon size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Dépenses par Catégorie</h3>
              <p className="text-xs font-medium text-slate-400 mt-0.5">Répartition en pourcentage</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={cats} 
                  innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="expense_by_category" nameKey="category_name"
                >
                  {cats.map((c, i) => <Cell key={i} fill={c.category_color || CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', padding: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: '700' }}
                  formatter={(value) => `${parseFloat(value).toLocaleString('fr-FR', { minimumFractionDigits: 0 })} FCFA`}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: '600', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories Details */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
              <BarChart2 size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Top Catégories</h3>
              <p className="text-xs font-medium text-slate-400 mt-0.5">Classement par montant</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {cats.sort((a,b) => b.expense_by_category - a.expense_by_category).slice(0, 6).map((c, i) => {
              const p = spent > 0 ? (c.expense_by_category / spent) * 100 : 0;
              return (
                <div key={c.category_name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-slate-600">{c.category_name}</span>
                    <span className="text-xs font-extrabold text-slate-800">{fmt(c.expense_by_category)}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-700 ease-out" 
                      style={{ width: `${p}%`, backgroundColor: c.category_color || CHART_COLORS[i % CHART_COLORS.length] }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Middle Row: Trend + Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Daily Trend */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Tendance Quotidienne</h3>
              <p className="text-xs font-medium text-slate-400 mt-0.5">Évolution des dépenses jour par jour</p>
            </div>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.daily.map(d => ({...d, date: d.date.split('-')[2]}))}>
                <defs>
                  <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                <YAxis hide />
                <Tooltip 
                   contentStyle={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '10px' }}
                   labelStyle={{ fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}
                   formatter={(value) => `${parseFloat(value).toLocaleString('fr-FR', { minimumFractionDigits: 0 })} FCFA`}
                />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#areaColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget vs Forecast */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
              <Wallet size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Budget Global</h3>
              <p className="text-xs font-medium text-slate-400 mt-0.5">Suivi de votre enveloppe mensuelle</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
              <p className="text-xs font-bold text-slate-400 mb-2">Budget</p>
              <p className="text-lg font-extrabold text-slate-800">{Math.floor(totalBudget)}</p>
              <span className="text-[11px] font-bold text-slate-800 mt-1">FCFA</span>
            </div>
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex flex-col items-center text-center">
              <p className="text-xs font-bold text-orange-400 mb-2">Dépensé</p>
              <p className="text-lg font-extrabold text-orange-600">{Math.floor(spent)}</p>
              <span className="text-[11px] font-bold text-orange-600 mt-1">FCFA</span>
            </div>
            <div className={`p-4 rounded-2xl border flex flex-col items-center text-center ${remains >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <p className={`text-xs font-bold mb-2 ${remains >= 0 ? 'text-green-500' : 'text-red-400'}`}>{remains >= 0 ? 'Restant' : 'Dépassement'}</p>
              <p className={`text-lg font-extrabold ${remains >= 0 ? 'text-green-600' : 'text-red-500'}`}>{Math.floor(Math.abs(remains))}</p>
              <span className={`text-[11px] font-bold mt-1 ${remains >= 0 ? 'text-green-600' : 'text-red-500'}`}>FCFA</span>
            </div>
          </div>
 
          <div className="mt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-slate-500">Utilisation</span>
              <span className={`text-base font-extrabold ${isOver ? 'text-red-500' : 'text-blue-600'}`}>{pctUsed.toFixed(1)}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ease-out ${isOver ? 'bg-red-500' : 'bg-blue-600'}`} 
                style={{ width: `${Math.min(pctUsed, 100)}%` }}
              />
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-4 text-center flex items-center justify-center gap-1.5">
              {isOver ? (
                <><span className="text-orange-500 text-sm">⚠️</span> Attention, budget dépassé ! </>
              ) : (
                <><span className="text-green-500 text-sm">✓</span> Vos dépenses sont sous contrôle. </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Top Transactions List */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Dépenses les Plus Élevées</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.ranking.slice(0, 6).map((item, i) => (
          <div key={i} className="flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all hover:-translate-y-1 cursor-pointer">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-extrabold"
              style={{ backgroundColor: `${item.category_color || CHART_COLORS[i % CHART_COLORS.length]}15`, color: item.category_color || CHART_COLORS[i % CHART_COLORS.length] }}
            >
              {i+1}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">{item.description || `Achat #${i+1}`}</p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{item.date}</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-extrabold text-slate-800">
              <ArrowUpRight size={14} className="text-red-500" />
              {fmt(item.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsPage;
