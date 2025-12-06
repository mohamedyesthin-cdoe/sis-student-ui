import { Autocomplete, TextField } from "@mui/material";

export default function CustomAutoComplete({
    label,
    field,
    options,
    error,
    helperText,
}) {
    const selectedOption =
        options.find((opt) => opt.value === field.value) || null;

    return (
        <Autocomplete
            options={options}
            value={selectedOption}
            getOptionLabel={(option) => option.label || ""}
            onChange={(_, newValue) => {
                field.onChange(newValue ? newValue.value : "");
            }}
            sx={{
                // === FIX HEIGHT ===
                "& .MuiOutlinedInput-root": {
                    height: "45px",
                    alignItems: "center", // ★ centers the content vertically
                },

                // === CENTER THE LABEL BEFORE FLOATING ===
                "& .MuiInputLabel-root": {
                    lineHeight: "20px",        // ★ vertically centers label
                    top: "-2px",               // ★ fine-tuned to look perfect
                },

                // === FLOATED LABEL ===
                "& .MuiInputLabel-shrink": {
                    top: "0px",
                    lineHeight: "normal",
                },

                // === CENTER ARROW ===
                "& .MuiAutocomplete-endAdornment": {
                    top: "50%",
                    transform: "translateY(-50%)",
                },

                // Input text padding fix
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
