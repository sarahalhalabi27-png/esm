import FleetCarCard from "./FleetCarCard.jsx";

export default function FleetCategorySection({ category }) {
  return (
    <div className="mb-14">
      <h2 className="text-sm font-medium text-teal-accent mb-5">
        {category.name}
      </h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {category.cars.map((car) => (
          <FleetCarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
}
