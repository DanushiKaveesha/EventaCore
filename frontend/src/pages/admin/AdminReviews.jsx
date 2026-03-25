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
    const filtered = reviews.filter((review) => {
      const search = searchTerm.toLowerCase();

      return (
        review.userName?.toLowerCase().includes(search) ||
        review.userId?.toLowerCase().includes(search) ||
        String(review.eventId)?.toLowerCase().includes(search) ||
        review.message?.toLowerCase().includes(search) ||
        String(review.rating).includes(search)
      );
    });

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
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this review?'
    );

    if (!confirmDelete) return;

    try {
      await deleteReview(reviewId);

      const updatedReviews = reviews.filter((review) => review._id !== reviewId);
      setReviews(updatedReviews);

      if (selectedReview?._id === reviewId) {
        setSelectedReview(null);
      }

      if (editReview?._id === reviewId) {
        setEditReview(null);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const handleEditClick = (review) => {
    setEditReview({
      ...review,
      rating: review.rating || 1,
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

      const updatedReviews = reviews.map((review) =>
        review._id === updated._id ? updated : review
      );

      setReviews(updatedReviews);
      setEditReview(null);

      if (selectedReview?._id === updated._id) {
        setSelectedReview(updated);
      }
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review');
    } finally {
      setSubmitting(false);
    }
  };

  const stats = useMemo(() => {
    const total = reviews.length;
    const avg =
      total > 0
        ? (
            reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
            total
          ).toFixed(1)
        : '0.0';

    const fiveStar = reviews.filter((review) => Number(review.rating) === 5).length;
    const lowRatings = reviews.filter((review) => Number(review.rating) <= 2).length;

    return {
      total,
      avg,
      fiveStar,
      lowRatings,
    };
  }, [reviews]);

  const renderStars = (rating) => {
    const numericRating = Number(rating) || 0;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-base ${
              star <= numericRating ? 'text-amber-400' : 'text-slate-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-sm font-semibold text-slate-600">
          {numericRating}/5
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar activeOverride="reviews" />

      <div className="flex-1 p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Rating & Review Management
          </h1>
          <p className="text-slate-500 mt-2">
            View, update, and remove customer ratings and reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm font-medium text-slate-500">Total Reviews</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">
              {stats.total}
            </h3>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm font-medium text-slate-500">Average Rating</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">
              {stats.avg}
            </h3>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm font-medium text-slate-500">5 Star Reviews</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">
              {stats.fiveStar}
            </h3>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm font-medium text-slate-500">Low Ratings</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">
              {stats.lowRatings}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Customer Reviews
              </h2>
              <p className="text-sm text-slate-500">
                Manage all platform review records.
              </p>
            </div>

            <div className="w-full lg:w-96">
              <input
                type="text"
                placeholder="Search by user, event ID, message, rating..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                    User Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                    User ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                    Event ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                    Review Message
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Loading reviews...
                    </td>
                  </tr>
                ) : filteredReviews.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      No reviews found.
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((review) => (
                    <tr
                      key={review._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">
                          {review.userName || 'Unknown User'}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {review.userId || '-'}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {review.eventId || '-'}
                      </td>

                      <td className="px-6 py-4">
                        {renderStars(review.rating)}
                      </td>

                      <td className="px-6 py-4">
                        <p className="max-w-xs truncate text-sm text-slate-700">
                          {review.message || 'No message'}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleString()
                          : '-'}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedReview(review)}
                            className="px-3 py-2 rounded-lg text-sm font-medium bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors"
                          >
                            View
                          </button>

                          <button
                            onClick={() => handleEditClick(review)}
                            className="px-3 py-2 rounded-lg text-sm font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-800">
                  Review Details
                </h3>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="text-slate-400 hover:text-slate-600 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 mb-1">
                      User Name
                    </p>
                    <p className="text-slate-800 font-medium">
                      {selectedReview.userName || '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-500 mb-1">
                      User ID
                    </p>
                    <p className="text-slate-800 font-medium">
                      {selectedReview.userId || '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-500 mb-1">
                      Event ID
                    </p>
                    <p className="text-slate-800 font-medium">
                      {selectedReview.eventId || '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-500 mb-1">
                      Rating
                    </p>
                    <div>{renderStars(selectedReview.rating)}</div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-500 mb-1">
                      Created At
                    </p>
                    <p className="text-slate-800 font-medium">
                      {selectedReview.createdAt
                        ? new Date(selectedReview.createdAt).toLocaleString()
                        : '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-500 mb-1">
                      Updated At
                    </p>
                    <p className="text-slate-800 font-medium">
                      {selectedReview.updatedAt
                        ? new Date(selectedReview.updatedAt).toLocaleString()
                        : '-'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-2">
                    Review Message
                  </p>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700 leading-relaxed">
                    {selectedReview.message || 'No message provided.'}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
                <button
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedReview(null);
                    handleEditClick(selectedReview);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                >
                  Edit Review
                </button>
              </div>
            </div>
          </div>
        )}

        {editReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-800">
                  Edit Review
                </h3>
                <button
                  onClick={() => setEditReview(null)}
                  className="text-slate-400 hover:text-slate-600 text-xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUpdateReview} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">
                    User Name
                  </label>
                  <input
                    type="text"
                    value={editReview.userName || ''}
                    disabled
                    className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">
                    Event ID
                  </label>
                  <input
                    type="text"
                    value={editReview.eventId || ''}
                    disabled
                    className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">
                    Rating
                  </label>
                  <select
                    value={editReview.rating}
                    onChange={(e) =>
                      setEditReview({
                        ...editReview,
                        rating: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">
                    Review Message
                  </label>
                  <textarea
                    rows="5"
                    value={editReview.message}
                    onChange={(e) =>
                      setEditReview({
                        ...editReview,
                        message: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
                    placeholder="Update review message"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditReview(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-colors disabled:opacity-60"
                  >
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