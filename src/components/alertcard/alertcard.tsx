import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { CloudUpload, Close } from "@mui/icons-material";

interface UploadExcelDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

const UploadExcelDialog: React.FC<UploadExcelDialogProps> = ({ open, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <Box display="flex" alignItems="center" justifyContent="space-between" pr={1}>
        <DialogTitle sx={{ fontWeight: 600 }}>Upload Excel File</DialogTitle>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent>
        <Box
          sx={{
            border: "2px dashed #1976d2",
            borderRadius: 2,
            py: 4,
            textAlign: "center",
            cursor: "pointer",
            "&:hover": { backgroundColor: "#f8f9fa" },
          }}
          onClick={() => document.getElementById("excel-input")?.click()}
        >
          <CloudUpload fontSize="large" color="primary" />
          <Typography variant="body1" mt={1}>
            {file ? file.name : "Click or drag file to upload"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Supported formats: .xlsx, .xls
          </Typography>
          <input
            id="excel-input"
            type="file"
            accept=".xlsx,.xls"
            hidden
            onChange={handleFileChange}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!file}
          sx={{
            backgroundColor: "#1976d2",
            textTransform: "none",
            "&:hover": { backgroundColor: "#115293" },
          }}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadExcelDialog;
