import { supabase } from "@/app/lib/supabase";
import { auth } from "@/auth";
import ReviewDeleteButton from "@/app/ui/components/reviews/DeleteReviewsButton";

type ReviewsListProps = {
  productId: number;
};

export default async function ReviewsList({
  productId,
}: ReviewsListProps) {
  const session = await auth();

  const currentUserId = session?.user?.id
    ? Number(session.user.id)
    : null;

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(`
      review_id,
      user_id,
      rating,
      comment,
      created_at,
      users!fk_reviews_user (
        user_id,
        first_name,
        last_name,
        username,
        role
      )
    `)
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching product reviews:", error);

    return (
      <section className="product-reviews">
        <div className="product-reviews-header">
          <div>
            <span className="section-eyebrow">Community</span>
            <h2>Customer Reviews</h2>
          </div>
        </div>

        <p className="reviews-empty">
          Reviews could not be loaded at this time.
        </p>
      </section>
    );
  }

  const reviewList = reviews ?? [];

  const reviewCount = reviewList.length;

  const averageRating =
    reviewCount > 0
      ? reviewList.reduce(
          (total, review) => total + Number(review.rating),
          0,
        ) / reviewCount
      : 0;

  return (
    <section className="product-reviews">
      <div className="product-reviews-header">
        <div>
          <span className="section-eyebrow">Community</span>

          <h2>Customer Reviews</h2>

          <p className="product-reviews-subtitle">
            See what other members think about this handcrafted
            product.
          </p>
        </div>

        {reviewCount > 0 && (
          <div className="reviews-summary">
            <span className="reviews-average">
              {averageRating.toFixed(1)}
            </span>

            <div className="reviews-summary-stars">
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  key={index}
                  className={
                    index < Math.round(averageRating)
                      ? "review-star filled"
                      : "review-star"
                  }
                >
                  ★
                </span>
              ))}
            </div>

            <span className="reviews-count">
              {reviewCount}{" "}
              {reviewCount === 1 ? "review" : "reviews"}
            </span>
          </div>
        )}
      </div>

      {reviewCount === 0 ? (
        <div className="reviews-empty">
          <span className="reviews-empty-icon">☆</span>

          <h3>No reviews yet</h3>

          <p>
            Be the first person to share your experience with this
            product.
          </p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviewList.map((review) => {
            const user = Array.isArray(review.users)
              ? review.users[0]
              : review.users;

            const fullName = user
              ? `${user.first_name} ${user.last_name}`.trim()
              : "Unknown user";

            const role =
              user?.role === "seller"
                ? "Seller"
                : "Customer";

            const isOwner =
              currentUserId === Number(review.user_id);

            return (
              <article
                key={review.review_id}
                className="review-card"
              >
                <div className="review-card-header">
                  <div className="review-user">
                    <div className="review-avatar">
                      {fullName.charAt(0).toUpperCase()}
                    </div>

                    <div className="review-user-info">
                      <div className="review-user-name-row">
                        <span className="review-user-name">
                          {fullName}
                        </span>

                        <span
                          className={`review-role-badge ${
                            role === "Seller"
                              ? "review-role-seller"
                              : "review-role-customer"
                          }`}
                        >
                          {role}
                        </span>
                      </div>

                      {user?.username && (
                        <span className="review-username">
                          @{user.username}
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className="review-rating"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {Array.from(
                      { length: 5 },
                      (_, starIndex) => (
                        <span
                          key={starIndex}
                          className={
                            starIndex < Number(review.rating)
                              ? "review-star filled"
                              : "review-star"
                          }
                        >
                          ★
                        </span>
                      ),
                    )}

                    <span className="review-rating-number">
                      {review.rating}/5
                    </span>
                  </div>
                </div>

                <p className="review-comment">
                  &quot;{review.comment}&quot;
                </p>

                {isOwner && (
                  <div className="review-actions">
                    <ReviewDeleteButton
                      reviewId={review.review_id}
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}