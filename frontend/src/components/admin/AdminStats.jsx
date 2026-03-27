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
    <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 mb-6 md:mb-0">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Status Distribution</h3>
        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-1">Live platform overview</p>
        
        <div className="mt-8 space-y-4">
          {statusData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">{item.name}</span>
              </div>
              <span className="text-lg font-black text-gray-900">{item.value}</span>
            </div>
          ))}
          {statusData.length === 0 && (
            <p className="text-gray-400 italic text-sm">No data available yet...</p>
          )}
        </div>
      </div>
      
      <div className="md:w-1/2 h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={8}
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
      </div>
    </div>
  );
};

export default AdminStats;
