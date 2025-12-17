import { TextField, MenuItem } from "@mui/material";

type OptionType = string | { id: any; name: string };

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
  const normalizedOptions = options.map(opt =>
    typeof opt === "string"
      ? { label: opt, value: opt }
      : { label: opt.name, value: opt.id }
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
      InputLabelProps={{
        shrink: Boolean(field.value), // ⭐ FIX LABEL POSITION ⭐
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          height: "45px",
          display: "flex",
          alignItems: "center",
        },
        "& .MuiSelect-select": {
          padding: "0 14px !important",
          display: "flex",
          alignItems: "center",
        },
        "& .MuiSvgIcon-root": {
          top: "50%",
          transform: "translateY(-50%)",
        },
      }}
    >
      {normalizedOptions.map(opt => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
