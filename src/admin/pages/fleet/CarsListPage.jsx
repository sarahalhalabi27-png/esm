import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  Briefcase,
  CarFront,
  Fuel,
  FolderCog,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import Can from "../../components/Can.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import Switch from "../../components/Switch.jsx";
import {
  ADMIN_BUTTON,
  ADMIN_BUTTON_GHOST,
  ADMIN_CARD,
  ADMIN_CARD_RICH,
  ADMIN_INPUT,
} from "../../components/ui.js";
import {
  useDeleteCarMutation,
  useGetCarsQuery,
  useGetCategoriesQuery,
  useUpdateCarMutation,
} from "../../api/fleetApi.js";
import useCan from "../../hooks/useCan.js";
import useUrlFilters, { useSearchBox } from "../../hooks/useUrlFilters.js";
import { P } from "../../permissions.js";
import { categoryName } from "../../utils/fleet.js";
import CategoriesDialog from "./CategoriesDialog.jsx";

// One colour per category (by its place in the list): the line along a car
// card's top, the wash behind its photo, its category tag and price, and the
// dot on the category's tab.
const TONES = [
  {
    bar: "from-teal-accent light:from-teal-500",
    wash: "from-teal-accent/20 light:from-teal-500/20",
    chip: "bg-teal-accent/15 text-teal-accent light:bg-teal-500/15 light:text-teal-700",
    dot: "bg-teal-accent light:bg-teal-500",
  },
  {
    bar: "from-sky-400 light:from-sky-500",
    wash: "from-sky-400/20",
    chip: "bg-sky-400/15 text-sky-300 light:bg-sky-500/15 light:text-sky-700",
    dot: "bg-sky-400 light:bg-sky-500",
  },
  {
    bar: "from-violet-400 light:from-violet-500",
    wash: "from-violet-400/20",
    chip: "bg-violet-400/15 text-violet-300 light:bg-violet-500/15 light:text-violet-700",
    dot: "bg-violet-400 light:bg-violet-500",
  },
  {
    bar: "from-amber-400 light:from-amber-500",
    wash: "from-amber-400/20",
    chip: "bg-amber-400/15 text-amber-300 light:bg-amber-500/15 light:text-amber-700",
    dot: "bg-amber-400 light:bg-amber-500",
  },
  {
    bar: "from-rose-400 light:from-rose-500",
    wash: "from-rose-400/20",
    chip: "bg-rose-400/15 text-rose-300 light:bg-rose-500/15 light:text-rose-700",
    dot: "bg-rose-400 light:bg-rose-500",
  },
  {
    bar: "from-emerald-400 light:from-emerald-500",
    wash: "from-emerald-400/20",
    chip: "bg-emerald-400/15 text-emerald-300 light:bg-emerald-500/15 light:text-emerald-700",
    dot: "bg-emerald-400 light:bg-emerald-500",
  },
];

// The fleet: a card per car with its photo, price and whether it shows on
// the website, filtered by category and name (kept in the URL).
export default function CarsListPage() {
  const { t, i18n } = useTranslation("admin");
  const can = useCan();
  const location = useLocation();
  const linkState = { listSearch: location.search };
  const { get, update } = useUrlFilters();
  const category = get("category");
  const q = get("q");
  const search = useSearchBox(q, (text) => update({ q: text }));

  const { data, isLoading, isFetching, isError, refetch } = useGetCarsQuery({
    category,
    q,
  });
  const { data: categories = [] } = useGetCategoriesQuery();
  const [updateCar, { isLoading: isUpdating, originalArgs }] =
    useUpdateCarMutation();
  const [deleteCar, { isLoading: isDeleting }] = useDeleteCarMutation();
  const [carToDelete, setCarToDelete] = useState(null);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [actionFailed, setActionFailed] = useState(false);

  const run = async (action) => {
    setActionFailed(false);
    try {
      await action().unwrap();
      return true;
    } catch {
      setActionFailed(true);
      return false;
    }
  };

  const confirmDelete = async () => {
    await run(() => deleteCar(carToDelete.id));
    setCarToDelete(null);
  };

  const totalCars = categories.reduce((sum, c) => sum + c.carCount, 0);
  const tabs = [
    { value: "", label: t("common.all"), count: totalCars },
    ...categories.map((c) => ({
      value: c.id,
      label: categoryName(c, i18n.language),
      count: c.carCount,
    })),
  ];
  const categoriesById = Object.fromEntries(categories.map((c) => [c.id, c]));
  const toneOf = (categoryId) =>
    TONES[
      Math.max(
        0,
        categories.findIndex((c) => c.id === categoryId)
      ) % TONES.length
    ];

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div
          role="tablist"
          className="flex flex-1 gap-2 overflow-x-auto pb-1 min-w-0"
        >
          {tabs.map((tab) => {
            const active = category === tab.value;
            return (
              <button
                key={tab.value || "all"}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => update({ category: tab.value })}
                className={`inline-flex items-center gap-2 h-10 px-4 shrink-0 rounded-full text-sm transition-colors ${
                  active
                    ? "bg-teal-accent text-page font-semibold"
                    : "border border-line/15 text-fg/75 hover:text-fg hover:bg-surface/[0.05]"
                }`}
              >
                {tab.value && (
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 rounded-full ${toneOf(tab.value).dot}`}
                  />
                )}
                {tab.label}
                <span
                  className={`min-w-6 h-6 px-1.5 grid place-items-center rounded-full text-xs ${
                    active ? "bg-page/20" : "bg-surface/[0.08]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <Can permission={P.fleet.update}>
            <button
              type="button"
              onClick={() => setCategoriesOpen(true)}
              className={`${ADMIN_BUTTON_GHOST} h-11`}
            >
              <FolderCog size={17} />
              {t("fleet.manageCategories")}
            </button>
          </Can>
          <Can permission={P.fleet.create}>
            <Link to="new" className={ADMIN_BUTTON}>
              <Plus size={18} />
              {t("fleet.addCar")}
            </Link>
          </Can>
        </div>
      </div>

      <label className="relative mt-4 block md:max-w-sm">
        <span className="sr-only">{t("fleet.searchPlaceholder")}</span>
        <Search
          size={18}
          className="absolute top-1/2 -translate-y-1/2 start-3.5 text-muted pointer-events-none"
        />
        <input
          type="search"
          value={search.value}
          onChange={search.onChange}
          placeholder={t("fleet.searchPlaceholder")}
          className={`${ADMIN_INPUT} ps-10`}
        />
      </label>

      {actionFailed && (
        <p
          role="alert"
          className="mt-3 text-sm text-red-400 light:text-red-600"
        >
          {t("common.actionFailed")}
        </p>
      )}

      <div className="mt-5">
        {isError && !data ? (
          <div className={ADMIN_CARD}>
            <AdminMessage
              icon={AlertCircle}
              title={t("common.loadFailed")}
              action={
                <button
                  type="button"
                  className={ADMIN_BUTTON}
                  onClick={refetch}
                >
                  {t("common.retry")}
                </button>
              }
            />
          </div>
        ) : isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className={`${ADMIN_CARD} h-[300px] animate-pulse`}
              />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <div className={ADMIN_CARD}>
            <AdminMessage icon={CarFront} title={t("fleet.empty")} />
          </div>
        ) : (
          <ul
            className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-3 transition-opacity ${
              isFetching ? "opacity-60" : ""
            }`}
          >
            {data.items.map((car) => {
              const tone = toneOf(car.categoryId);
              return (
                <li
                  key={car.id}
                  className={`${ADMIN_CARD_RICH} relative flex flex-col overflow-hidden transition-colors hover:border-teal-accent/40`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 top-0 z-10 h-0.5 bg-gradient-to-r to-transparent ${tone.bar}`}
                  />
                  <Link
                    to={car.id}
                    state={linkState}
                    className={`relative block aspect-[16/10] bg-gradient-to-b to-transparent ${tone.wash}`}
                  >
                    {car.image ? (
                      <img
                        src={car.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-contain p-3"
                      />
                    ) : (
                      <span className="flex h-full flex-col items-center justify-center gap-2 text-sm text-muted">
                        <CarFront size={28} />
                        {t("fleet.noPhoto")}
                      </span>
                    )}
                    <span
                      className={`absolute top-3 start-3 rounded-full px-3 py-1 text-xs font-medium ${tone.chip}`}
                    >
                      {categoryName(
                        categoriesById[car.categoryId],
                        i18n.language
                      )}
                    </span>
                    {!car.published && (
                      <span className="absolute top-3 end-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                        {t("fleet.hidden")}
                      </span>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col p-4">
                    <Link
                      to={car.id}
                      state={linkState}
                      className="font-semibold text-fg hover:text-teal-accent"
                    >
                      {car.name}
                    </Link>
                    <p
                      className={`mt-2 inline-flex w-fit rounded-lg px-3 py-1 text-[15px] font-semibold tabular-nums ${tone.chip}`}
                    >
                      {t("fleet.perHour", { price: car.pricePerHour })}
                    </p>
                    <ul
                      title={t("fleet.specs", {
                        passengers: car.passengers,
                        luggage: car.luggage,
                      })}
                      className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-fg/75"
                    >
                      <li className="inline-flex items-center gap-1.5">
                        <Users size={15} className="text-muted" />
                        {car.passengers}
                      </li>
                      <li className="inline-flex items-center gap-1.5">
                        <Briefcase size={15} className="text-muted" />
                        {car.luggage}
                      </li>
                      <li className="inline-flex items-center gap-1.5">
                        <Fuel size={15} className="text-muted" />
                        {t(`fleet.fuels.${car.fuel}`)}
                      </li>
                    </ul>

                    {/* Pinned to the card's bottom, 16px clear of the text. */}
                    <div className="mt-auto pt-4" />
                    <div className="flex items-center justify-between gap-3 border-t border-line/10 pt-4">
                      {can(P.fleet.update) ? (
                        <label
                          className={`flex items-center gap-2.5 text-sm ${car.published ? "text-emerald-300 light:text-emerald-700" : "text-muted"}`}
                        >
                          <Switch
                            checked={car.published}
                            disabled={isUpdating && originalArgs?.id === car.id}
                            onChange={(published) =>
                              run(() => updateCar({ id: car.id, published }))
                            }
                            label={t("fleet.showOnSite")}
                          />
                          {car.published
                            ? t("fleet.published")
                            : t("fleet.hidden")}
                        </label>
                      ) : (
                        <span className="text-sm text-muted">
                          {car.published
                            ? t("fleet.published")
                            : t("fleet.hidden")}
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <Link
                          to={car.id}
                          state={linkState}
                          className="h-9 px-3 inline-flex items-center rounded-lg text-sm text-teal-accent hover:bg-teal-accent/10"
                        >
                          {can(P.fleet.update)
                            ? t("fleet.edit")
                            : t("fleet.view")}
                        </Link>
                        <Can permission={P.fleet.delete}>
                          <button
                            type="button"
                            onClick={() => setCarToDelete(car)}
                            aria-label={`${t("fleet.deleteCar")}: ${car.name}`}
                            title={t("fleet.deleteCar")}
                            className="grid h-9 w-9 place-items-center rounded-lg text-rose-400 light:text-rose-700 hover:bg-rose-500/10"
                          >
                            <Trash2 size={17} />
                          </button>
                        </Can>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Can permission={P.fleet.delete}>
        <ConfirmDialog
          open={Boolean(carToDelete)}
          title={t("fleet.deleteTitle", { name: carToDelete?.name })}
          body={t("fleet.deleteBody")}
          confirmLabel={t("common.delete")}
          busy={isDeleting}
          onConfirm={confirmDelete}
          onClose={() => setCarToDelete(null)}
        />
      </Can>
      <Can permission={P.fleet.update}>
        <CategoriesDialog
          open={categoriesOpen}
          onClose={() => setCategoriesOpen(false)}
        />
      </Can>
    </>
  );
}
