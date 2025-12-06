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
      sx={{
        // FIXED HEIGHT
        "& .MuiOutlinedInput-root": {
          height: "45px",
          display: "flex",
          alignItems: "center",
        },

        // CENTER VALUE TEXT
        "& .MuiSelect-select": {
          padding: "0 14px !important",
          display: "flex",
          alignItems: "center",
        },

        // CENTER ARROW
        "& .MuiSvgIcon-root": {
          top: "50%",
          transform: "translateY(-50%)",
        },

        // CENTER LABEL BEFORE FLOAT
        "& .MuiInputLabel-root": {
          lineHeight: "45px",
          top: "-2px",
        },

        // FLOATING LABEL
        "& .MuiInputLabel-shrink": {
          top: "0px",
          lineHeight: "normal",
        }
      }}
    >
      {normalizedOptions.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
