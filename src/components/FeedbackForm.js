import React, { useState } from 'react';
import supabase from '../services/supabase';

export default function FeedbackForm({ appointmentId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitFeedback = async () => {
    try {
      await supabase.from('feedback').insert({
        appointment_id: appointmentId,
        rating: Number(rating),
        comments: comment,
        created_at: new Date().toISOString()
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Feedback submission error:', error);
    }
  };

  if (submitted) return <p>Thank you for your feedback!</p>;

  return (
    <div className="mt-4 p-3 border rounded bg-white shadow-sm max-w-md">
      <h4 className="font-semibold mb-2">Leave Feedback</h4>
      <input
        type="number"
        value={rating}
        onChange={e => setRating(e.target.value)}
        placeholder="Rate 1-5"
        min="1"
        max="5"
        className="p-2 border rounded mb-2 w-full"
      />
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Comments"
        className="p-2 border rounded w-full mb-2"
      />
      <button
        onClick={submitFeedback}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Submit
      </button>
    </div>
  );
}
