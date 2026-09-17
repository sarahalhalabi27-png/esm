// TODO(api): replace with GET /api/blog-posts
export const blogPosts = [
  {
    id: "premium-car-rental-deals-1",
    title: "Premium Car Rental Deals",
    excerpt:
      "Experience Luxury And Comfort With ESM Limo. Discover This Month's Top Hybrid Rental Offer.",
    date: "12 May 2026",
    author: "ESM Limo",
    image: null,
  },
  {
    id: "premium-car-rental-deals-2",
    title: "Premium Car Rental Deals",
    excerpt:
      "Longer Our Newest SUV Fleet Now Available For Weekend City Tours And Family Getaways.",
    date: "05 May 2026",
    author: "ESM Limo",
    image: null,
  },
  {
    id: "premium-car-rental-deals-3",
    title: "Premium Car Rental Deals",
    excerpt:
      "Experience A Range Of ESM Limo, Now With Flexible Scheduling And Instant Booking Confirmation.",
    date: "28 Apr 2026",
    author: "ESM Limo",
    image: null,
  },
];

export function findBlogPostById(postId) {
  return blogPosts.find((post) => post.id === postId) || blogPosts[0];
}

// TODO(api): replace with GET /api/blog-posts/:postId
export const blogPostDetailFallback = {
  id: "experience-luxury-and-comfort",
  title:
    "Experience Luxury And Comfort With ESM Limo: Your Go-To Limousine Service",
  heroImage: null,
  sections: [
    {
      heading: "Why Choose ESM Limo?",
      body: "At ESM Limo, We Understand That Luxury Is Just As Important As Comfort. Our Fleet Of High-End Vehicles, Combined With Experienced Chauffeurs, Guarantees A Smooth And Stylish Ride. You Can Always Rely On Us To Deliver An Experience That Exceeds Expectations.",
    },
    {
      heading: "A Service For Every Occasion",
      body: "Whether You're Attending A Corporate Event, Touring The City, Or Need Airport Transfers, ESM Limo Offers Tailored Services To Meet Your Needs. We Ensure Every Ride Is Comfortable, Punctual, And Professional, No Matter The Purpose Of Your Trip.",
    },
    {
      heading: "Book Your Ride Today",
      body: "Ready To Experience The Ultimate In Luxury Transportation? Booking With ESM Limo Is Easy And Fast. Simply Visit Our Website Or Contact Our Customer Service Team, And Let Us Take Care Of The Rest. We Look Forward To Providing You With An Exceptional Journey.",
    },
  ],
};
