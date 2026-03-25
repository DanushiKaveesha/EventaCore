import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById } from '../services/eventService';
import { getEventReviews, addReview } from '../services/reviewService';
import {
    CalendarIcon,
    MapPinIcon,
    CurrencyDollarIcon,
    StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

const EventDetails = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [reviewStatsCount, setReviewStatsCount] = useState(0);
    
    // Form state
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Fetch event details
                const eventData = await getEventById(eventId);
                setEvent(eventData);

                // Fetch reviews
                const reviewsData = await getEventReviews(eventId);
                setReviews(reviewsData.reviews || []);
                setAverageRating(reviewsData.averageRating || 0);
                setReviewStatsCount(reviewsData.count || 0);
            } catch (err) {
                console.error("Failed to load event or reviews", err);
            }
        };
        fetchDetails();
    }, [eventId]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            setErrorMsg("Please select a rating.");
            return;
        }
        if (!message.trim()) {
            setErrorMsg("Please write a review message.");
            return;
        }

        setErrorMsg('');
        setIsSubmitting(true);

        try {
            // Using a hardcoded mock user for now, since auth is not specified
            const newReview = await addReview({
                eventId: eventId,
                userId: 'user_123',
                userName: 'John Doe',
                rating: rating,
                message: message
            });

            // Add the new review to the top of the list locally
            const updatedReviews = [newReview, ...reviews];
            setReviews(updatedReviews);
            
            // Recalculate average locally
            const newCount = reviewStatsCount + 1;
            const newTotal = (averageRating * reviewStatsCount) + rating;
            setAverageRating(Number((newTotal / newCount).toFixed(1)));
            setReviewStatsCount(newCount);

            // Reset form
            setRating(0);
            setMessage('');
            setHoverRating(0);
        } catch (err) {
            console.error(err);
            setErrorMsg("Failed to submit review. Make sure the backend is running.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!event) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen py-12 font-sans">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* EVENT HERO SECTION */}
                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden mb-12 border border-gray-100">
                    <div className="h-64 sm:h-96 w-full relative bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center overflow-hidden">
                        {event.imageUrl ? (
                            <img src={`http://localhost:5000/${event.imageUrl}`} alt={event.name} className="w-full h-full object-cover opacity-60" />
                        ) : (
                            <div className="absolute inset-0 bg-blue-600 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
                        )}
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-900/90 to-transparent p-8 sm:p-12 pb-8">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-sm font-bold tracking-widest uppercase mb-4 backdrop-blur-md">
                                {event.status || 'Event'}
                            </span>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg tracking-tight">{event.name}</h1>
                        </div>
                    </div>
                    
                    <div className="p-8 sm:p-12">
                        <div className="flex flex-wrap gap-y-6 gap-x-12 mb-8 pb-8 border-b border-gray-100">
                            <div className="flex items-center text-gray-700">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex justify-center items-center mr-4 text-blue-600">
                                    <CalendarIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date & Time</p>
                                    <p className="font-bold text-lg">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex justify-center items-center mr-4 text-purple-600">
                                    <MapPinIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</p>
                                    <p className="font-bold text-lg">{event.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex justify-center items-center mr-4 text-emerald-600">
                                    <CurrencyDollarIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Price</p>
                                    <p className="font-bold text-lg text-emerald-600">${event.price?.toFixed(2) || 'Free'}</p>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">About this Event</h3>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            {event.description || 'Join us for an amazing experience. Discover what makes this event special and connect with our community.'}
                        </p>
                    </div>
                </div>

                {/* RATINGS AND REVIEWS SECTION */}
                <div className="bg-white rounded-[2rem] shadow-xl p-8 sm:p-12 border border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-gray-100">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ratings & Reviews</h2>
                            <p className="text-gray-500 mt-2">See what others are saying about {event.name}</p>
                        </div>
                        <div className="mt-4 sm:mt-0 bg-amber-50 px-6 py-4 rounded-3xl border border-amber-100 flex items-center">
                            <span className="text-4xl font-black text-amber-500 mr-4">{averageRating}</span>
                            <div>
                                <div className="flex text-amber-400 mb-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <StarIconSolid key={star} className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-amber-400' : 'text-amber-200'}`} />
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-amber-700">{reviewStatsCount} {reviewStatsCount === 1 ? 'Review' : 'Reviews'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Write a Review Form */}
                        <div className="lg:col-span-1 bg-gray-50 p-8 rounded-3xl border border-gray-200 h-fit">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 font-sans">Leave a Review</h3>
                            {errorMsg && <div className="p-3 bg-red-100 text-red-700 text-sm rounded-xl mb-4 font-semibold">{errorMsg}</div>}
                            <form onSubmit={handleSubmitReview}>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Your Rating</label>
                                    <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const isFilled = star <= (hoverRating || rating);
                                            return (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className={`transition-transform duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full ${isFilled ? 'text-amber-400' : 'text-gray-300'}`}
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                >
                                                    {isFilled ? 
                                                        <StarIconSolid className="w-10 h-10" /> : 
                                                        <StarIconOutline className="w-10 h-10 stroke-2" />
                                                    }
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Your Experience</label>
                                    <textarea
                                        rows="4"
                                        className="w-full px-4 py-3 rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 resize-none transition-shadow"
                                        placeholder="Tell us what you loved or what could be improved..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        style={{ border: '1px solid #d1d5db' }}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5"
                                >
                                    {isSubmitting ? 'Posting...' : 'Post Review'}
                                </button>
                            </form>
                        </div>

                        {/* Reviews List */}
                        <div className="lg:col-span-2 space-y-6">
                            {reviews.length === 0 ? (
                                <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                                    <StarIconOutline className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
                                    <p className="text-gray-500 max-w-sm mx-auto">Be the first to share your thoughts about this event! Rate your experience and let the community know.</p>
                                </div>
                            ) : (
                                reviews.map((review) => (
                                    <div key={review._id} className="p-6 sm:p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-extrabold text-lg mr-4 shadow-inner">
                                                    {review.userName ? review.userName.charAt(0).toUpperCase() : 'A'}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-lg">{review.userName || 'Anonymous'}</h4>
                                                    <p className="text-sm text-gray-500 font-medium">
                                                        {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <StarIconSolid key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-amber-400' : 'text-amber-200'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed text-lg bg-gray-50/50 p-4 rounded-2xl">
                                            "{review.message}"
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
