import { Checkbox, FormControlLabel, FormControl } from "@mui/material";

interface CustomCheckboxInputProps {
  label: string;
  field: any;            // RHF field
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

export default function CustomCheckboxInput({
  label,
  field,
  error = false,
  helperText = "",
  disabled = false,
}: CustomCheckboxInputProps) {
  return (
    <FormControl error={error} component="fieldset">
      <FormControlLabel
        control={
          <Checkbox
            {...field}
            checked={!!field.value}  // ensure boolean
            disabled={disabled}
          />
        }
        label={label}
      />
      {error && helperText && (
        <p style={{ color: "#d32f2f", fontSize: "0.75rem", marginTop: "4px" }}>
          {helperText}
        </p>
      )}
    </FormControl>
  );
}
