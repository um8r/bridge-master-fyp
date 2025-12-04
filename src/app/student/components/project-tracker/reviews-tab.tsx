"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import type { Review } from "../../types/project-tracker-types"

interface ReviewsTabProps {
  reviews: Review[]
  newReviewText: string
  setNewReviewText: (text: string) => void
  newReviewRating: number
  setNewReviewRating: (rating: number) => void
  onAddReview: () => void
}

const ReviewsTab = ({
  reviews,
  newReviewText,
  setNewReviewText,
  newReviewRating,
  setNewReviewRating,
  onAddReview,
}: ReviewsTabProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Project Reviews</h2>
      </div>

      {/* Existing Reviews */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-lg p-6 text-center mb-6 border border-gray-200">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No reviews have been submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-lg p-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">{review.reviewerName}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{new Date(review.datePosted).toLocaleDateString()}</span>
              </div>
              <p className="mt-3 text-gray-700">{review.review}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Review Form */}
      <div className="bg-white rounded-lg p-5 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add a Review</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-1">
              Your Review
            </label>
            <textarea
              id="review-text"
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              placeholder="Write your review..."
              className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setNewReviewRating(rating)}
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    newReviewRating >= rating
                      ? "bg-yellow-500 text-yellow-900"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onAddReview}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center"
          >
            <Star className="mr-2 h-5 w-5" />
            Submit Review
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewsTab
