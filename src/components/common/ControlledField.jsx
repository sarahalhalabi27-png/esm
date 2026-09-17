import { Controller } from "react-hook-form";

// Bridges react-hook-form to the project's controlled field components
// (TextField, SelectField, TextAreaField, DatePicker, TimePicker), and
// renders the validation error beneath the field when present.
//
// `transform` optionally sanitizes each keystroke before it reaches the form
// state (e.g. keep letters-only for names). It receives the raw string value.
//
// Usage: <ControlledField control={control} name="email" as={TextField} label="Email" />
export default function ControlledField({
  control,
  name,
  as: Field,
  transform,
  ...fieldProps
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div>
          <Field
            {...fieldProps}
            name={name}
            value={field.value ?? ""}
            onChange={
              transform
                ? (event) => {
                    const raw = event?.target ? event.target.value : event;
                    field.onChange(transform(raw));
                  }
                : field.onChange
            }
            onBlur={field.onBlur}
          />
          {fieldState.error ? (
            <p className="mt-1 text-xs text-red-400">
              {fieldState.error.message}
            </p>
          ) : null}
        </div>
      )}
    />
  );
}
