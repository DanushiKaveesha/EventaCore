import React, { useEffect, useMemo, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { deleteReview, getAllReviews, updateReview } from '../../services/reviewService';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [editReview, setEditReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  useEffect(() => {
    const search = searchTerm.toLowerCase();
    const filtered = reviews.filter((review) => (
      review.userName?.toLowerCase().includes(search) ||
      review.userId?.toLowerCase().includes(search) ||
      String(review.eventId || '').toLowerCase().includes(search) ||
      review.message?.toLowerCase().includes(search) ||
      String(review.rating || '').includes(search)
    ));

    setFilteredReviews(filtered);
  }, [searchTerm, reviews]);

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      const data = await getAllReviews();
      setReviews(Array.isArray(data) ? data : []);
      setFilteredReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching all reviews:', error);
      setReviews([]);
      setFilteredReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await deleteReview(reviewId);
      const updatedReviews = reviews.filter((review) => review._id !== reviewId);
      setReviews(updatedReviews);
      if (selectedReview?._id === reviewId) setSelectedReview(null);
      if (editReview?._id === reviewId) setEditReview(null);
    } catch (error) {
      console.error('Error deleting review:', error);
      alert(error?.response?.data?.message || 'Failed to delete review');
    }
  };

  const handleEditClick = (review) => {
    setEditReview({
      ...review,
      rating: Number(review.rating) || 1,
      message: review.message || '',
    });
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const updated = await updateReview(editReview._id, {
        rating: Number(editReview.rating),
        message: editReview.message,
      });

      const updatedReviews = reviews.map((review) => (
        review._id === updated._id ? updated : review
      ));

      setReviews(updatedReviews);
      setEditReview(null);
      if (selectedReview?._id === updated._id) setSelectedReview(updated);
    } catch (error) {
      console.error('Error updating review:', error);
      alert(error?.response?.data?.message || 'Failed to update review');
    } finally {
      setSubmitting(false);
    }
  };

  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = total > 0
      ? (reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / total).toFixed(1)
      : '0.0';

    return {
      total,
      avg,
      fiveStar: reviews.filter((review) => Number(review.rating) === 5).length,
      lowRatings: reviews.filter((review) => Number(review.rating) <= 2).length,
    };
  }, [reviews]);

  const renderStars = (rating) => {
    const numericRating = Number(rating) || 0;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-base transition-transform duration-200 ${star <= numericRating ? 'text-amber-400' : 'text-slate-300'}`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-sm font-semibold text-slate-600">{numericRating}/5</span>
      </div>
    );
  };

  // ONLY showing changed StatCard part + icons (rest of your code stays SAME)

  const StatCard = ({ title, value, icon, bg }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
        </div>

        {/* UPDATED ICON STYLE */}
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg} text-white shadow-md`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-slate-50 flex overflow-hidden">
      <AdminSidebar activeOverride="ratings" />
  
      <div className="relative flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-20 top-0 h-56 w-56 rounded-full bg-sky-200/25 blur-3xl animate-pulse" />
          <div className="absolute right-10 top-24 h-64 w-64 rounded-full bg-violet-200/20 blur-3xl animate-pulse" />
        </div>

        <div className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-white via-sky-50 to-indigo-50 p-6 shadow-sm">
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-sky-200/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-20 w-20 rounded-full bg-indigo-200/20 blur-2xl" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 shadow-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                Review Control Center
              </div>
              <h1 className="text-3xl font-bold text-slate-800 lg:text-4xl">Rating & Review Management</h1>
              <p className="mt-2 max-w-2xl text-slate-500">
                View, update, and remove customer ratings and reviews with a cleaner modern dashboard experience.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Live Insights</p>
                <p className="text-sm font-semibold text-slate-700">Monitor review quality in real time</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

          <StatCard
            title="Total Reviews"
            value={stats.total}
            bg="bg-gradient-to-br from-sky-500 to-blue-600"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
            }
          />

          <StatCard
            title="Average Rating"
            value={stats.avg}
            bg="bg-gradient-to-br from-indigo-500 to-purple-600"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor">
                <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            }
          />

          <StatCard
            title="5 Star Reviews"
            value={stats.fiveStar}
            bg="bg-gradient-to-br from-amber-400 to-yellow-500"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 6v12M6 12h12" />
              </svg>
            }
          />

          <StatCard
            title="Low Ratings"
            value={stats.lowRatings}
            bg="bg-gradient-to-br from-rose-500 to-red-600"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v4m0 4h.01" />
              </svg>
            }
          />

        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                Customer Reviews
              </h2>
              <p className="mt-1 text-sm text-slate-500">Manage all platform review records.</p>
            </div>

            <div className="relative w-full lg:w-96">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by user, event ID, message, rating..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-black placeholder-gray-400 shadow-sm transition-all duration-300 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-slate-100/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600">User Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600">User ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Event ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Rating</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Review Message</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Created At</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-600">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-slate-500">
                      <div className="inline-flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full bg-sky-500 animate-bounce" />
                        Loading reviews...
                      </div>
                    </td>
                  </tr>
                ) : filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-slate-500">
                      No reviews found.
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((review) => (
                    <tr key={review._id} className="transition-all duration-200 hover:bg-sky-50/40">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">{review.userName || 'Unknown User'}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{review.userId || '-'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{review.eventId || '-'}</td>
                      <td className="px-6 py-4">{renderStars(review.rating)}</td>
                      <td className="px-6 py-4">
                        <p className="max-w-xs truncate text-sm text-slate-700">{review.message || 'No message'}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {review.createdAt ? new Date(review.createdAt).toLocaleString() : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedReview(review)}
                            className="rounded-xl bg-sky-100 px-3 py-2 text-sm font-medium text-sky-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-200"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEditClick(review)}
                            className="rounded-xl bg-amber-100 px-3 py-2 text-sm font-medium text-amber-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="rounded-xl bg-red-100 px-3 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-6">
                <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Review Details
                </h3>
                <button onClick={() => setSelectedReview(null)} className="text-xl text-slate-400 hover:text-slate-600">×</button>
              </div>

              <div className="space-y-5 p-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div><p className="mb-1 text-sm font-semibold text-slate-500">User Name</p><p className="font-medium text-slate-800">{selectedReview.userName || '-'}</p></div>
                  <div><p className="mb-1 text-sm font-semibold text-slate-500">User ID</p><p className="font-medium text-slate-800">{selectedReview.userId || '-'}</p></div>
                  <div><p className="mb-1 text-sm font-semibold text-slate-500">Event ID</p><p className="font-medium text-slate-800">{selectedReview.eventId || '-'}</p></div>
                  <div><p className="mb-1 text-sm font-semibold text-slate-500">Rating</p><div>{renderStars(selectedReview.rating)}</div></div>
                  <div><p className="mb-1 text-sm font-semibold text-slate-500">Created At</p><p className="font-medium text-slate-800">{selectedReview.createdAt ? new Date(selectedReview.createdAt).toLocaleString() : '-'}</p></div>
                  <div><p className="mb-1 text-sm font-semibold text-slate-500">Updated At</p><p className="font-medium text-slate-800">{selectedReview.updatedAt ? new Date(selectedReview.updatedAt).toLocaleString() : '-'}</p></div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-500">Review Message</p>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 leading-relaxed text-slate-700">
                    {selectedReview.message || 'No message provided.'}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
                <button onClick={() => setSelectedReview(null)} className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:bg-slate-100">Close</button>
                <button onClick={() => { setSelectedReview(null); handleEditClick(selectedReview); }} className="rounded-xl bg-amber-500 px-4 py-2 text-white transition-colors hover:bg-amber-600">Edit Review</button>
              </div>
            </div>
          </div>
        )}

        {editReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-6">
                <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 20h9" strokeLinecap="round" />
                      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Edit Review
                </h3>
                <button onClick={() => setEditReview(null)} className="text-xl text-slate-400 hover:text-slate-600">×</button>
              </div>

              <form onSubmit={handleUpdateReview} className="space-y-5 p-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-600">User Name</label>
                  <input type="text" value={editReview.userName || ''} disabled className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm text-slate-500" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-600">Event ID</label>
                  <input type="text" value={editReview.eventId || ''} disabled className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm text-slate-500" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-600">Rating</label>
                  <select
                    value={editReview.rating}
                    onChange={(e) => setEditReview({ ...editReview, rating: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100"
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-600">Review Message</label>
                  <textarea
                    rows="5"
                    value={editReview.message}
                    onChange={(e) => setEditReview({ ...editReview, message: e.target.value })}
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100"
                    placeholder="Update review message"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setEditReview(null)} className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:bg-slate-100">Cancel</button>
                  <button type="submit" disabled={submitting} className="rounded-xl bg-sky-500 px-4 py-2 text-white transition-colors hover:bg-sky-600 disabled:opacity-60">
                    {submitting ? 'Saving...' : 'Update Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;