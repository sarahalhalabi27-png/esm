import { companyStats } from "../../data/aboutTimelineData.js";

export default function CompanyStatsBar() {
  return (
    <section className="border-t border-white/5 bg-white/[0.015]">
      <div className="max-w-content mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {companyStats.map((stat) => (
          <div key={stat.id}>
            <p className="text-2xl md:text-3xl font-semibold text-teal-accent mb-1">
              {stat.value}
            </p>
            <p className="text-xs text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
