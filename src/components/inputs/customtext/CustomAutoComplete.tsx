import { Autocomplete, TextField } from "@mui/material";
import type { ControllerRenderProps } from "react-hook-form";

interface AutoCompleteOption {
  label: string;
  value: string | number;
}

interface CustomAutoCompleteProps {
  label: string;
  field: ControllerRenderProps<any, any>;
  options: AutoCompleteOption[];
  error?: any;
  helperText?: string;
}

export default function CustomAutoComplete({
  label,
  field,
  options,
  error,
  helperText,
}: CustomAutoCompleteProps) {
  const selectedOption =
    options.find((opt) => opt.value === field.value) || null;

  return (
    <Autocomplete
      options={options}
      value={selectedOption}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) =>
        option.value === value?.value
      }
      onChange={(_, newValue) => {
        field.onChange(newValue ? newValue.value : "");
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          height: "45px",
          alignItems: "center",
        },
        "& .MuiInputLabel-root": {
          lineHeight: "20px",
          top: "-2px",
        },
        "& .MuiInputLabel-shrink": {
          top: "0px",
          lineHeight: "normal",
        },
        "& .MuiAutocomplete-endAdornment": {
          top: "50%",
          transform: "translateY(-50%)",
        },
        "& .MuiAutocomplete-input": {
          padding: "0 !important",
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!!error}
          helperText={helperText}
        />
      )}
    />
  );
}
