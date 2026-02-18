import { TextField, MenuItem } from "@mui/material";

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
  field: any;
  options?: OptionType[]; // ✅ make optional
  error?: any;
  helperText?: string;
}

export default function CustomSelect({
  label,
  field,
  options = [], // ✅ default empty array
  error,
  helperText,
}: CustomSelectProps) {

  // ✅ Ensure options is always array
  const safeOptions = Array.isArray(options) ? options : [];

  const normalizedOptions = safeOptions.map((opt) => {
    if (typeof opt === "string") {
      return { value: opt, label: opt };
    }

    if (opt.value !== undefined && opt.label) {
      return { value: opt.value, label: opt.label };
    }

    if (opt.id !== undefined && opt.name) {
      return { value: opt.id, label: opt.name };
    }

    if (opt.id !== undefined && opt.programe) {
      return { value: opt.id, label: opt.programe };
    }

    return { value: "", label: "" };
  });

  return (
    <TextField
      {...field}
      fullWidth
      size="small"
      select
      label={label}
      error={!!error}
      helperText={helperText}
      value={field.value ?? ""} // ✅ prevent undefined crash
      InputLabelProps={{
        shrink: Boolean(field.value),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          height: "45px",
          display: "flex",
          alignItems: "center",
        },
      }}
    >
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
