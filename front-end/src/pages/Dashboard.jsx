import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Receipt, Plus, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Modal from '../components/ui/Modal';

const AddExpenseModal = ({ isOpen, onClose }) => {
  const today = new Date().toLocaleDateString('fr-FR');
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Expense">
      <form onSubmit={e => { e.preventDefault(); onClose(); }} className="space-y-4">
        <div>
          <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">Amount *</label>
          <input 
            type="number" step="0.01" placeholder="0.00" 
            className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-[13px] text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">Category *</label>
          <select className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-[13px] text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer">
            <option value="">Select a category</option>
            <option>Food &amp; Drinks</option>
            <option>Transport</option>
            <option>Entertainment</option>
            <option>Healthcare</option>
            <option>Shopping</option>
            <option>Housing</option>
          </select>
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">Date *</label>
          <input 
            type="text" defaultValue={today} 
            className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-[13px] text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">Description</label>
          <textarea 
            placeholder="Add a note about this expense..." 
            className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-[13px] text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all min-h-[80px] resize-y font-sans"
          />
        </div>
        <div className="flex gap-3 mt-6">
          <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-md shadow-blue-500/20">
            Add Expense
          </button>
          <button type="button" onClick={onClose} className="px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    total_expenses: 0.0,
    total_expenses_count: 0,
    total_expenses_current_month: 0.0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [expensesByCategory, setExpensesByCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshAccessToken = async () => {
    const refresh = localStorage.getItem('refresh');
    const refreshResponse = await fetch("http://127.0.0.1:8000/auth/jwt/refresh/", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refresh: refresh
      })
    })
    const data = await refreshResponse.json();
    localStorage.setItem("token", data.access)

    return data.access
  }

  const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#f43f5e', '#06b6d4', '#84cc16'];

  const stats = [
    { label: 'Total Expenses', amount: `${parseFloat(dashboardData.total_expenses || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, sub: 'All time', icon: DollarSign, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'This Month', amount: `${parseFloat(dashboardData.total_expenses_current_month || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, sub: 'Current month', icon: TrendingUp, iconBg: 'bg-green-50', iconColor: 'text-green-500' },
    { label: 'Transactions', amount: String(dashboardData.total_expenses_count), sub: 'Total records', icon: Receipt, iconBg: 'bg-fuchsia-50', iconColor: 'text-fuchsia-500' },
  ];

  const handleGet = async () => {
    try {
      setLoading(true);
      let access = localStorage.getItem('token');
      if (!access) return;

      const verification = await fetch("http://127.0.0.1:8000/auth/jwt/verify/", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: access
        })
      })
      
      if (!verification.ok) {
        access = await refreshAccessToken()
        localStorage.setItem("token", access)
      }

      const [dashboardRes, expensesRes, categoriesRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/dashboard/", {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch("http://127.0.0.1:8000/expenses/", {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch("http://127.0.0.1:8000/dashboard/expenses-by-category/", {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (dashboardRes.ok) {
        const data = await dashboardRes.json();
        setDashboardData(data);
      }

      if (expensesRes.ok) {
        const data = await expensesRes.json();
        setRecentTransactions(data.slice(0, 5)); // Get last 5 transactions
      }

      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setExpensesByCategory(data);
      }

    } catch (err) {
      console.error("Erreur lors de la récupération des données:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGet();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 text-sm font-medium gap-3">
        <div className="w-6 h-6 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        Chargement du tableau de bord...
      </div>
    );
  }

  return (
    <div className="font-sans">
      <AddExpenseModal isOpen={showModal} onClose={() => setShowModal(false)} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-[26px] font-bold text-slate-800 font-display mb-1">Dashboard</h2>
          <p className="text-[13px] text-slate-500">Overview of your expenses</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all w-fit"
        >
          <Plus size={16} />
          Add Expense
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 flex justify-between items-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div>
              <p className="text-[13px] text-slate-500 mb-2">{stat.label}</p>
              <p className="text-[28px] font-bold text-slate-800 mb-1 tracking-tight">{stat.amount}</p>
              <p className="text-[12px] text-slate-400">{stat.sub}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.iconBg} ${stat.iconColor}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Expenses by Category */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-slate-800">Expenses by Category</h3>
          </div>
          <div className="p-4 flex flex-col items-center justify-center min-h-[300px]">
            {expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="Expense_by_category"
                    nameKey="name"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    formatter={(value) => `${parseFloat(value).toLocaleString('fr-FR')} €`}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium mb-1">No expense data available</p>
                <p className="text-xs text-slate-300">Add your first expense to see the chart</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-slate-800">Recent Transactions</h3>
            <button 
              onClick={() => navigate('/expenses')}
              className="text-[13px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All
            </button>
          </div>
          <div className={`p-5 flex flex-col ${recentTransactions.length > 0 ? 'justify-start' : 'justify-center items-center'} min-h-[300px]`}>
            {recentTransactions.length > 0 ? (
              <div className="flex flex-col gap-2.5 w-full">
                {recentTransactions.map((tx, i) => (
                  <div key={tx.id || i} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3.5 border-none">
                      <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: `${tx.category_color || '#3b82f6'}15`, color: tx.category_color || '#3b82f6' }}>
                        <Receipt size={18} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-semibold text-slate-800">{tx.description || tx.category_name}</p>
                        <p className="text-[11px] font-medium text-slate-400">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      -{parseFloat(tx.amount || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium mb-1">No transactions yet</p>
                <p className="text-xs text-slate-300">Start adding your expenses to see them here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

