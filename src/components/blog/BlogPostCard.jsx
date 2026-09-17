import { Link } from "react-router-dom";
import { Car } from "lucide-react";

export default function BlogPostCard({ post }) {
  return (
    <Link
      to={`/blog/${post.id}`}
      className="group rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden block hover:border-teal-accent/50 transition-colors"
    >
      <div className="h-40 flex items-center justify-center bg-gradient-to-b from-teal-accent/10 to-transparent">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Car size={48} className="text-teal-accent" strokeWidth={1.1} />
        )}
      </div>
      <div className="p-5">
        <p className="text-xs text-gray-500 mb-2">{post.date}</p>
        <h3 className="font-medium mb-2">{post.title}</h3>
        <p className="text-xs text-gray-400 line-clamp-3">{post.excerpt}</p>
      </div>
    </Link>
  );
}
