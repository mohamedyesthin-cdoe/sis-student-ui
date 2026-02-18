import { TextField } from "@mui/material";

type GlobalNumberInputProps = {
  label: string;
  value: number | string;
  readOnly?: boolean;
  error?: boolean;
  helperText?: string;
  onChange?: (value: number | string) => void;

  // ✅ OPTIONAL PROPS
  maxLength?: number;
  min?: number;
  max?: number;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export default function CustomNumberInput({
  label,
  value,
  readOnly = false,
  error = false,
  helperText = "",
  onChange,
  maxLength,
  min,
  max,
  inputProps = {},
}: GlobalNumberInputProps) {
  return (
    <TextField
      label={label}
      value={value}
      fullWidth
      size="small"
      type="text"
      error={error}
      helperText={helperText}
      InputProps={{
        readOnly: readOnly,
      }}
      inputProps={{
        maxLength,
        min,
        max,
        ...inputProps,
      }}
      onChange={(e) => {
        if (!readOnly && onChange) {
          const numericValue = e.target.value.replace(/\D/g, "");
          onChange(numericValue);
        }
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          height: 45,
        },
        "& .MuiOutlinedInput-input": {
          height: 45,
          padding: "0 14px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
        },
      }}
    />

  );
}
