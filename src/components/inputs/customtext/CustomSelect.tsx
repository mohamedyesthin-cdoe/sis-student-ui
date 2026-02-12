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
  options: OptionType[];
  error?: any;
  helperText?: string;
}

export default function CustomSelect({
  label,
  field,
  options,
  error,
  helperText,
}: CustomSelectProps) {
  const normalizedOptions = options.map((opt) => {
    // string[] → value/label
    if (typeof opt === "string") {
      return { value: opt, label: opt };
    }

    // { value, label }
    if (opt.value !== undefined && opt.label) {
      return { value: opt.value, label: opt.label };
    }

    // { id, name }
    if (opt.id !== undefined && opt.name) {
      return { value: opt.id, label: opt.name };
    }

    // { id, programe } (YOUR PROGRAM LIST)
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
      {normalizedOptions.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
