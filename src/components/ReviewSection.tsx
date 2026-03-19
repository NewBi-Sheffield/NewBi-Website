"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Review, insertReview } from "@/lib/db";
import StarRating from "./StarRating";

type Props = {
  providerId: string;
  reviews: Review[];
};

export default function ReviewSection({ providerId, reviews }: Props) {
  const { isLoggedIn, userId, name } = useAuth();
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hovered, setHovered] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  function handleWriteReview() {
    if (!isLoggedIn) {
      router.push(`/login?from=/providers/${providerId}`);
    } else {
      setShowForm(true);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const { error } = await insertReview({
      provider_id: providerId,
      user_id: userId!,
      author: name ?? "Anonymous",
      rating,
      comment,
    });

    setSubmitting(false);

    if (error) {
      setSubmitError(error);
    } else {
      setSubmitted(true);
      setShowForm(false);
      router.refresh();
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Reviews</h2>
        {!submitted && !showForm && (
          <button
            onClick={handleWriteReview}
            className="flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r from-[#45c97a] to-[#3d88c4] text-white px-4 py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Write a Review
          </button>
        )}
      </div>

      {/* Review form */}
      {showForm && (
        <div className="bg-[#0f2236] rounded-2xl border border-white/10 p-5 mb-5">
          <h3 className="font-bold text-white mb-4">Leave your review</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Star picker */}
            <div>
              <p className="text-xs font-semibold text-slate-300 mb-2">Rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(star)}
                    className="text-2xl leading-none transition-transform hover:scale-110"
                    aria-label={`${star} star`}
                  >
                    <span className={(hovered || rating) >= star ? "text-yellow-400" : "text-slate-600"}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="review-comment">
                Your review
              </label>
              <textarea
                id="review-comment"
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#45c97a]/40 focus:border-transparent resize-none"
              />
            </div>

            {submitError && (
              <p className="text-xs text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">{submitError}</p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={rating === 0 || submitting}
                className="bg-gradient-to-r from-[#45c97a] to-[#3d88c4] text-white text-sm font-semibold px-5 py-2 rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? "Submitting..." : "Submit review"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-sm text-slate-400 px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success banner */}
      {submitted && (
        <div className="bg-green-900/30 border border-green-700/30 text-green-300 rounded-2xl px-5 py-4 text-sm font-medium mb-5">
          Thanks for your review! It will appear here once approved.
        </div>
      )}

      {/* Existing reviews */}
      {reviews.length === 0 && !submitted ? (
        <p className="text-slate-500 text-sm">No reviews yet. Be the first!</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-[#0f2236] rounded-2xl border border-white/10 p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-bold text-white text-sm">{review.author}</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {new Date(review.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <StarRating rating={review.rating} size="md" />
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mt-3">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
