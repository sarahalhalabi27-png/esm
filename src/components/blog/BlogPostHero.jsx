import { Car } from "lucide-react";

export default function BlogPostHero({ post }) {
  return (
    <section className="relative border-b border-white/5">
      <div className="max-w-content mx-auto px-6 pt-16 pb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-semibold max-w-3xl mx-auto mb-10">
          {post.title}
        </h1>
        <div className="h-64 md:h-80 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center overflow-hidden max-w-2xl mx-auto">
          {post.heroImage ? (
            <img
              src={post.heroImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Car size={72} className="text-teal-accent" strokeWidth={1} />
          )}
        </div>
      </div>
    </section>
  );
}
