import { TextField, MenuItem } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

type OptionType =
  | string
  | {
      id?: string | number;
      name?: string;
      programe?: string;
      value?: string | number;
      label?: string;
    };

interface CustomSelectProps {
  label: string;
  field?: any;              // ✅ optional for safe usage
  options?: OptionType[];   // ✅ optional
  error?: boolean;
  helperText?: string;
  sx?: SxProps<Theme>;
  disabled?: boolean;
}

export default function CustomSelect({
  label,
  field = { value: "", onChange: () => {} }, // ✅ default safe field
  options = [],
  error = false,
  helperText = "",
  sx = {},
  disabled = false,
}: CustomSelectProps) {
  // Ensure options is always an array
  const safeOptions = Array.isArray(options) ? options : [];

  // Normalize all options into { value, label }
  const normalizedOptions = safeOptions.map((opt) => {
    if (typeof opt === "string") return { value: opt, label: opt };

    if (opt.value !== undefined && opt.label) return { value: opt.value, label: opt.label };
    if (opt.id !== undefined && opt.name) return { value: opt.id, label: opt.name };
    if (opt.id !== undefined && opt.programe) return { value: opt.id, label: opt.programe };

    return { value: "", label: "" };
  });

  return (
    <TextField
      {...field}                     // ✅ safe spread
      fullWidth
      size="small"
      select
      label={label}
      error={error}
      helperText={helperText}
      value={field.value ?? ""}      // ✅ fallback prevents crashes
      onChange={(e) => field.onChange?.(e.target.value)} // ✅ safe even if field undefined
      disabled={disabled}
      InputLabelProps={{ shrink: Boolean(field.value) }}
      sx={{
        "& .MuiOutlinedInput-root": {
          height: "45px",
          display: "flex",
          alignItems: "center",
        },
        ...sx,
      }}
    >
      {/* Default empty option */}
      <MenuItem value="">
        <em>Select</em>
      </MenuItem>

      {normalizedOptions.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
}