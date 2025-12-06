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
  multiline?: boolean;
  rows?: number;
  value?: string | number;
  onChange?: (...event: any[]) => void;
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
      multiline={multiline}
      rows={rows}
      value={field.value ?? defaultValue}
      onChange={handleChange}
      sx={{
        // APPLY DEFAULT HEIGHT
        "& .MuiOutlinedInput-root": {
          height: !multiline ? "45px" : "auto", // ⬅️ only single-line inputs
          display: "flex",
          alignItems: "center",
        },

        "& .MuiInputBase-input": {
          padding: "0 14px !important", // fixes vertical alignment
        },

        // merge custom sx (user override)
        ...sx,
      }}
    />
  );
}
