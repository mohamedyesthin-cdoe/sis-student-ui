import { TextField, MenuItem } from "@mui/material";

type OptionType = string | { label: string; value: any };

interface CustomSelectProps {
  label: string;
  field: any;
  options: OptionType[];
  error?: any;
  helperText?: string;
}

export default function CustomSelect({
  label,
  field,
  options,
  error,
  helperText
}: CustomSelectProps) {
  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  return (
    <TextField
      {...field}
      fullWidth
      size="small"
      select
      label={label}
      error={!!error}
      helperText={helperText}
    >
      {normalizedOptions.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
