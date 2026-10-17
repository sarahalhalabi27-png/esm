import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const ACTIONS = ["view", "create", "update", "delete"];
const key = (resource, action) => `${resource}.${action}`;

// One colour per action: its dot in the column heading and its checkboxes.
const ACTION_COLORS = {
  view: {
    dot: "bg-sky-400 light:bg-sky-500",
    box: "accent-sky-400 light:accent-sky-600",
  },
  create: {
    dot: "bg-emerald-400 light:bg-emerald-500",
    box: "accent-emerald-400 light:accent-emerald-600",
  },
  update: {
    dot: "bg-amber-400 light:bg-amber-500",
    box: "accent-amber-400 light:accent-amber-600",
  },
  delete: {
    dot: "bg-rose-400 light:bg-rose-500",
    box: "accent-rose-400 light:accent-rose-600",
  },
};
const ALL_BOX = "accent-[rgb(var(--accent))]";

// A checkbox whose third, "some" state (indeterminate) is set from a prop.
function Checkbox({ checked, indeterminate = false, color, ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      className={`h-[18px] w-[18px] cursor-pointer disabled:cursor-not-allowed ${color}`}
      {...props}
    />
  );
}

// The role editor's table: a row per section (from the backend's catalog),
// a column per action, and a "whole row" box. Giving create/edit/delete also
// gives view; taking view away takes the rest of that row with it.
// `value` is the list of permission keys; onChange gets the new list.
export default function PermissionMatrix({
  catalog,
  value,
  onChange,
  disabled,
}) {
  const { t } = useTranslation("admin");
  const selected = new Set(value);

  const commit = (next) =>
    // Keep the catalog's order so saved lists are tidy and stable.
    onChange(
      catalog.flatMap(({ resource, actions }) =>
        actions
          .map((action) => key(resource, action))
          .filter((k) => next.has(k))
      )
    );

  const toggle = (resource, action, on) => {
    const next = new Set(selected);
    const actions = catalog.find((row) => row.resource === resource).actions;
    if (on) {
      next.add(key(resource, action));
      if (action !== "view" && actions.includes("view"))
        next.add(key(resource, "view"));
    } else if (action === "view") {
      actions.forEach((a) => next.delete(key(resource, a)));
    } else {
      next.delete(key(resource, action));
    }
    commit(next);
  };

  const toggleRow = (resource, actions, on) => {
    const next = new Set(selected);
    actions.forEach((a) =>
      on ? next.add(key(resource, a)) : next.delete(key(resource, a))
    );
    commit(next);
  };

  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <table className="w-full min-w-[520px] text-[15px]">
        <thead>
          <tr className="border-b border-line/10 text-xs uppercase tracking-wider text-muted">
            <th scope="col" className="py-3 pe-4 text-start font-medium">
              {t("roles.permissions")}
            </th>
            {ACTIONS.map((action) => (
              <th
                key={action}
                scope="col"
                className="w-20 py-3 text-center font-medium"
              >
                <span className="inline-flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 rounded-full ${ACTION_COLORS[action].dot}`}
                  />
                  {t(`roles.actions.${action}`)}
                </span>
              </th>
            ))}
            <th scope="col" className="w-16 py-3 text-center font-medium">
              {t("common.all")}
            </th>
          </tr>
        </thead>
        <tbody>
          {catalog.map(({ resource, actions }) => {
            const section = t(`roles.resources.${resource}`, {
              defaultValue: resource,
            });
            const count = actions.filter((a) =>
              selected.has(key(resource, a))
            ).length;
            return (
              <tr
                key={resource}
                className={`border-b border-line/[0.06] last:border-0 transition-colors ${
                  count > 0 ? "bg-teal-accent/[0.05]" : ""
                }`}
              >
                <th
                  scope="row"
                  className="py-3 ps-2 pe-4 text-start font-normal text-fg"
                >
                  <span className="flex items-center gap-2.5">
                    {section}
                    {count > 0 && (
                      <span className="rounded-full bg-teal-accent/15 px-2 py-0.5 text-xs font-medium text-teal-accent tabular-nums">
                        {count}/{actions.length}
                      </span>
                    )}
                  </span>
                </th>
                {ACTIONS.map((action) => (
                  <td key={action} className="py-3 text-center">
                    {actions.includes(action) ? (
                      <Checkbox
                        color={ACTION_COLORS[action].box}
                        checked={selected.has(key(resource, action))}
                        disabled={disabled}
                        onChange={(event) =>
                          toggle(resource, action, event.target.checked)
                        }
                        aria-label={`${section}: ${t(`roles.actions.${action}`)}`}
                      />
                    ) : (
                      <span aria-hidden="true" className="text-muted/50">
                        –
                      </span>
                    )}
                  </td>
                ))}
                <td className="py-3 text-center">
                  <Checkbox
                    color={ALL_BOX}
                    checked={count === actions.length}
                    indeterminate={count > 0 && count < actions.length}
                    disabled={disabled}
                    onChange={(event) =>
                      toggleRow(resource, actions, event.target.checked)
                    }
                    aria-label={t("roles.allOfSection", { section })}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
