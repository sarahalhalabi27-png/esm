import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const ACTIONS = ["view", "create", "update", "delete"];
const key = (resource, action) => `${resource}.${action}`;

// A checkbox whose third, "some" state (indeterminate) is set from a prop.
function Checkbox({ checked, indeterminate = false, ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      className="h-[18px] w-[18px] cursor-pointer accent-[rgb(var(--accent))] disabled:cursor-not-allowed"
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
                {t(`roles.actions.${action}`)}
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
                className="border-b border-line/[0.06] last:border-0"
              >
                <th
                  scope="row"
                  className="py-3 pe-4 text-start font-normal text-fg"
                >
                  {section}
                </th>
                {ACTIONS.map((action) => (
                  <td key={action} className="py-3 text-center">
                    {actions.includes(action) ? (
                      <Checkbox
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
