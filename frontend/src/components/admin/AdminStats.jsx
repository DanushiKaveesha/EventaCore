import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

const AdminStats = ({ events = [] }) => {
  
  // Data for Events Status Pie Chart
  const statusData = [
    { name: 'Upcoming', value: events.filter(e => e.status === 'upcoming').length, color: '#0EA5E9' }, // sky-500
    { name: 'Ongoing', value: events.filter(e => e.status === 'ongoing').length, color: '#10B981' },   // emerald-500
    { name: 'Completed', value: events.filter(e => e.status === 'completed').length, color: '#64748B' } // slate-500
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-2xl rounded-2xl border border-gray-100">
          <p className="text-sm font-black text-gray-900">{`${payload[0].name}`}</p>
          <p className="text-xl font-black text-blue-600">
            {payload[0].value} <span className="text-xs text-gray-400 uppercase tracking-widest ml-1 font-bold">Events</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-white p-10 flex flex-col md:flex-row items-center relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-32 -mt-32 group-hover:bg-blue-500/10 transition-colors" />
      
      <div className="md:w-1/2 mb-10 md:mb-0 relative z-10">
        <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">Status Distribution</h3>
        <p className="text-gray-400 font-black text-[10px] uppercase tracking-[4px]">Live Platform Overview</p>
        
        <div className="mt-10 space-y-3">
          {statusData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-gray-100/50 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs font-black text-gray-600 uppercase tracking-widest">{item.name}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-900">{item.value}</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Units</span>
              </div>
            </div>
          ))}
          {statusData.length === 0 && (
            <div className="py-10 text-center bg-gray-50/30 rounded-3xl border border-dashed border-gray-200">
              <p className="text-xs font-black text-gray-300 uppercase tracking-widest tracking-widest">No Active Data</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="md:w-1/2 h-[320px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={10}
              dataKey="value"
              stroke="none"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global</p>
          <p className="text-3xl font-black text-gray-900">{events.length}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
