import { TextField } from "@mui/material";

export default function InputField({ label, type, value, onChange }) {
  return (
    <TextField
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      variant="outlined"
      fullWidth
      sx={{ marginBottom: 2 }}
    />
  );
}
