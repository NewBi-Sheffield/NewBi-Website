"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Review, insertReview } from "@/lib/db";
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
        <h2 className="text-xl font-bold text-[#2D1A1F]">Reviews</h2>
        {!submitted && !showForm && (
          <button
            onClick={handleWriteReview}
            className="flex items-center gap-1.5 text-sm font-semibold bg-[#C4909A] text-white px-4 py-2 rounded-xl hover:bg-[#A87580] active:scale-95 transition-all"
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
        <div className="bg-[#FFF5F0] rounded-2xl border border-[#2D1A1F]/10 p-5 mb-5">
          <h3 className="font-bold text-[#2D1A1F] mb-4">Leave your review</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6B4550] mb-1" htmlFor="review-comment">
                Your review
              </label>
              <textarea
                id="review-comment"
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full text-sm bg-[#FAF0E6] border border-[#2D1A1F]/10 text-[#2D1A1F] placeholder-[#B09098] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C4909A]/40 focus:border-transparent resize-none"
              />
            </div>

            {submitError && (
              <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{submitError}</p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#C4909A] text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-[#A87580] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? "Submitting..." : "Submit review"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-sm text-[#9E7580] px-4 py-2 rounded-xl border border-[#2D1A1F]/10 hover:border-[#2D1A1F]/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success banner */}
      {submitted && (
        <div className="bg-[#C4909A]/10 border border-[#C4909A]/25 text-[#A87580] rounded-2xl px-5 py-4 text-sm font-medium mb-5">
          Thanks for your review! It will appear here once approved.
        </div>
      )}

      {/* Existing reviews */}
      {reviews.length === 0 && !submitted ? (
        <p className="text-[#B09098] text-sm">No reviews yet. Be the first!</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-[#FFF5F0] rounded-2xl border border-[#2D1A1F]/10 p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-bold text-[#2D1A1F] text-sm">{review.author}</p>
                  <p className="text-[#B09098] text-xs mt-0.5">
                    {new Date(review.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <p className="text-[#6B4550] text-sm leading-relaxed mt-3">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
