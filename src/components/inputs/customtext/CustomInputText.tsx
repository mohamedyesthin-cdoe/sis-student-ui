import { TextField } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface CustomInputTextProps {
  label: string;
  field: any;
  error?: boolean;
  helperText?: string;
  sx?: SxProps<Theme>;
  disabled?: boolean;
  type?: string;
  defaultValue?: any;
  multiline?: boolean;       // <-- new
  rows?: number;             // <-- new
}

export default function CustomInputText({
  label,
  field,
  error = false,
  helperText = "",
  sx = {},
  disabled = false,
  type = "text",
  defaultValue = "",
  multiline = false,
  rows = 1,
}: CustomInputTextProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = type === "number" ? Number(e.target.value) : e.target.value;
    field.onChange(value);
  };

  return (
    <TextField
      {...field}
      label={label}
      fullWidth
      size="small"
      type={type}
      disabled={disabled}
      error={error}
      helperText={helperText}
      sx={sx}
      value={field.value ?? defaultValue}
      onChange={handleChange}
      multiline={multiline}
      rows={rows}
    />
  );
}
