import { RadioGroup, FormControlLabel, Radio, FormLabel, FormControl } from "@mui/material";

interface CustomRadioInputProps {
  label?: string;
  field: any;               // RHF field
  options: string[] | { label: string; value: string }[];
  row?: boolean;
  error?: boolean;
  helperText?: string;
}

export default function CustomRadioInput({
  label,
  field,
  options,
  row = true,
  error = false,
  helperText = ""
}: CustomRadioInputProps) {
  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  return (
    <FormControl error={error} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0 }}>
      <FormLabel>{label}</FormLabel>
      <RadioGroup
        {...field}
        row={row}
        sx={{
          "& .MuiFormControlLabel-root": {
            marginRight: "2px",  // reduce horizontal gap
            marginLeft: "0px",
          }
        }}
      >
        {normalizedOptions.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            control={<Radio />}
            label={opt.label}
          />
        ))}
      </RadioGroup>

      {error && (
        <p style={{ color: "#d32f2f", fontSize: "0.75rem", marginTop: "4px" }}>
          {helperText}
        </p>
      )}
    </FormControl>
  );
}
