import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PostJob() {
  const { user } = useUser();
  const [form, setForm] = useState({ title: '', description: '', company: '', location: '', remote: true, salary: '', isPaid: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Create job in DB (without payment)
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const job = await res.json();

    if (form.isPaid) {
      // Create Stripe session and redirect
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id, priceId: 'price_XXXXXXXX' }), // your Stripe priceId
      });
      const { sessionId } = await checkoutRes.json();
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } else {
      alert('Job posted successfully!');
    }
    setLoading(false);
  };

  if (!user) return <p>Please sign in to post jobs.</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
      {/* Input fields for title, description, etc. */}
      <input
        type="text"
        placeholder="Job Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      {/* ... Other inputs for company, location, salary, remote checkbox */}
      <label>
        <input
          type="checkbox"
          checked={form.isPaid}
          onChange={(e) => setForm({ ...form, isPaid: e.target.checked })}
        />
        Paid Listing
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Posting...' : 'Post Job'}
      </button>
    </form>
  );
}
