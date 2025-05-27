import React, { useEffect, useState } from 'react';
import supabase from '../services/supabase';

export default function Analytics() {
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    feedbacks: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: totalCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true });
      const { count: sentCount } = await supabase
        .from('appointments')
        .eq('status', 'sent')
        .select('*', { count: 'exact', head: true });
      const { count: feedbackCount } = await supabase
        .from('feedback')
        .select('*', { count: 'exact', head: true });

      setStats({
        total: totalCount ?? 0,
        sent: sentCount ?? 0,
        feedbacks: feedbackCount ?? 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">System Analytics</h2>
      <div className="bg-white p-6 rounded shadow space-y-4">
        <div>Total Appointments: <span className="font-semibold">{stats.total}</span></div>
        <div>Reminders Sent: <span className="font-semibold">{stats.sent}</span></div>
        <div>Feedback Received: <span className="font-semibold">{stats.feedbacks}</span></div>
      </div>
    </div>
  );
}
