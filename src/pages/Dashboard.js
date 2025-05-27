import React, { useEffect, useState } from 'react';
import supabase from '../services/supabase';
import FeedbackForm from '../components/FeedbackForm';
import { sendReminder } from '../services/messenger';

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');
  const [sendingId, setSendingId] = useState(null);

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true });

    if (error) console.error('Fetch appointments error:', error);
    else setAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSendReminder = async (appt) => {
    const reminderMessage = `Hello ${appt.name}, this is a reminder for your appointment on ${appt.date} at ${appt.time}. Please take care!`;

    setSendingId(appt.id);
    try {
      await sendReminder(appt, reminderMessage);

      // Update appointment as sent
      await supabase
        .from('appointments')
        .update({ sent: true, status: 'sent' })
        .eq('id', appt.id);

      fetchAppointments();
      setMessage(`Reminder sent to ${appt.name} successfully!`);
    } catch (error) {
      setMessage(`Failed to send reminder: ${error.message}`);
    }
    setSendingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">CareConnect Dashboard</h1>

      {message && (
        <div className="bg-blue-100 text-blue-700 p-2 mb-4 rounded">{message}</div>
      )}

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Phone</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Time</th>
            <th className="border border-gray-300 p-2">Channel</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id}>
              <td className="border border-gray-300 p-2">{appt.name}</td>
              <td className="border border-gray-300 p-2">{appt.phone}</td>
              <td className="border border-gray-300 p-2">{appt.date}</td>
              <td className="border border-gray-300 p-2">{appt.time}</td>
              <td className="border border-gray-300 p-2">{appt.channel}</td>
              <td className="border border-gray-300 p-2">{appt.status}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleSendReminder(appt)}
                  disabled={sendingId === appt.id || appt.sent}
                  className={`px-2 py-1 rounded text-white ${
                    appt.sent
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {appt.sent ? 'Sent' : sendingId === appt.id ? 'Sending...' : 'Send Reminder'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Feedback</h2>
        {appointments
          .filter((a) => a.sent)
          .map((appt) => (
            <div key={`fb-${appt.id}`} className="mb-4">
              <h3 className="font-semibold">{appt.name}'s Feedback</h3>
              <FeedbackForm appointmentId={appt.id} />
            </div>
          ))}
      </div>
    </div>
  );
}
