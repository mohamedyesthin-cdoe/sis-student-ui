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
      type="text" // 🔥 changed to text for better control
      error={error}
      helperText={helperText}
      InputProps={{
        readOnly: readOnly,
      }}
      inputProps={{
        maxLength,
        min,
        max,
        ...inputProps, // ✅ allow extra custom props
      }}
      onChange={(e) => {
        if (!readOnly && onChange) {
          const numericValue = e.target.value.replace(/\D/g, ""); // allow digits only
          onChange(numericValue);
        }
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          height: "45px",
          display: "flex",
          alignItems: "center",
        },
        "& .MuiInputBase-input": {
          padding: "0 14px !important",
        },
        "& .MuiInputLabel-root": {
          lineHeight: "45px",
          top: "-2px",
        },
        "& .MuiInputLabel-shrink": {
          top: "0px",
          lineHeight: "normal",
        },
      }}
    />
  );
}
