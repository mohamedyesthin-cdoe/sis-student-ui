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
      onChange={(e) => field.onChange(e.target.value)} // ✅ STRING ONLY
      sx={{
        "& .MuiOutlinedInput-root": {
          height: !multiline ? "45px" : "auto",
          display: "flex",
          alignItems: "center",
        },
        "& .MuiInputBase-input": {
          padding: "0 14px !important",
        },
        ...sx,
      }}
    />
  );
}
