import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { useStock } from '../contexts/StockContext';
import { APP_CONFIG } from '../constants';
import { DollarSign, AlertTriangle, Package, TrendingUp } from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, trend, alert }: any) => (
  <div className={`bg-surface p-6 border border-surface-border relative overflow-hidden group hover:border-brand-500/50 transition-all`}>
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-3xl font-bold text-foreground font-mono">{value}</h3>
      </div>
      <div className={`p-3 border ${alert ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-brand-500/10 border-brand-500/20 text-brand-500'}`}>
        <Icon size={24} />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-xs font-mono text-brand-500 relative z-10">
        <TrendingUp size={14} className="mr-1" />
        <span>{trend} vs last month</span>
      </div>
    )}
    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-colors"></div>
  </div>
);

const Dashboard = () => {
  const { products, stats } = useStock();

  // Prepare data for charts
  const categoryData = products.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.quantity;
    } else {
      acc.push({ name: curr.category, value: curr.quantity });
    }
    return acc;
  }, []);

  const lowStockData = products
    .filter(p => p.quantity <= p.minThreshold * 1.5) // Show items near threshold
    .map(p => ({
      name: p.name.substring(0, 15) + '...',
      stock: p.quantity,
      threshold: p.minThreshold
    }))
    .slice(0, 7);

  const COLORS = ['#E2FF54', '#00E5FF', '#FF3366', '#B026FF', '#FF9900'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight">System Overview</h2>
        <span className="text-xs font-mono text-slate-500">LAST SYNC: {new Date().toLocaleTimeString()}</span>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Value" 
          value={`${APP_CONFIG.currency}${stats.totalValue.toLocaleString()}`} 
          icon={DollarSign}
          trend="+12%"
        />
        <KPICard 
          title="Critical Alerts" 
          value={stats.lowStockCount} 
          icon={AlertTriangle} 
          alert={stats.lowStockCount > 0}
        />
        <KPICard 
          title="Total Units" 
          value={stats.totalItems} 
          icon={Package} 
        />
        <KPICard 
          title="Categories" 
          value={stats.categoriesCount} 
          icon={TrendingUp} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Inventory Distribution */}
        <div className="bg-surface p-6 border border-surface-border">
          <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-6">Inventory Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111111', borderColor: '#222222', color: '#fff', fontFamily: 'JetBrains Mono' }}
                  itemStyle={{ color: '#E2FF54' }}
                />
                <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#888' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="bg-surface p-6 border border-surface-border">
          <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-6">Critical Stock Levels</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lowStockData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#222222" />
                <XAxis type="number" stroke="#888888" tick={{ fontFamily: 'JetBrains Mono', fontSize: 10 }} />
                <YAxis dataKey="name" type="category" width={100} stroke="#888888" tick={{ fontFamily: 'JetBrains Mono', fontSize: 10 }} />
                <Tooltip 
                  cursor={{fill: '#1a1a1a'}}
                  contentStyle={{ backgroundColor: '#111111', borderColor: '#222222', color: '#fff', fontFamily: 'JetBrains Mono' }}
                />
                <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }} />
                <Bar dataKey="stock" fill="#E2FF54" name="Current Stock" radius={[0, 2, 2, 0]} />
                <Bar dataKey="threshold" fill="#FF3366" name="Min Threshold" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
