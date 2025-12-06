import { TextField } from "@mui/material";

type GlobalNumberInputProps = {
  label: string;
  value: number | string;
  readOnly?: boolean;
  error?: boolean;
  helperText?: string;
  onChange?: (value: number) => void;
};

export default function CustomNumberInput({
  label,
  value,
  readOnly = false,
  error = false,
  helperText = "",
  onChange
}: GlobalNumberInputProps) {
  return (
    <TextField
      label={label}
      value={value}
      fullWidth
      size="small"
      type="number"
      InputProps={readOnly ? { readOnly: true } : {}}
      error={error}
      helperText={helperText}
      onChange={(e) => {
        if (!readOnly && onChange) {
          const val = Number(e.target.value) || 0;
          onChange(val);
        }
      }}
      sx={{
        // FIXED HEIGHT
        "& .MuiOutlinedInput-root": {
          height: "45px",
          display: "flex",
          alignItems: "center",
        },

        // CENTER TEXT VERTICALLY
        "& .MuiInputBase-input": {
          padding: "0 14px !important",
        },

        // FLOATING LABEL FIX
        "& .MuiInputLabel-root": {
          lineHeight: "45px",
          top: "-2px",
        },

        "& .MuiInputLabel-shrink": {
          top: "0px",
          lineHeight: "normal",
        }
      }}
    />
  );
}
