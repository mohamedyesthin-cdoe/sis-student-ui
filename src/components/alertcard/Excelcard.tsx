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
import { CloudUpload, Close, CloudDownload } from "@mui/icons-material";
import * as XLSX from "xlsx";

interface UploadExcelDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

const UploadExcelDialog: React.FC<UploadExcelDialogProps> = ({ open, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
      onClose();
    }
  };

  const handleDownloadSample = () => {
    const sampleData = [
      {
        group_id: 1,
        username: "johndoe",
        first_name: "John",
        last_name: "Doe",
        email: "johndoe@example.com",
        phone: "9876543210",
        student_id: 1001
      },
      {
        group_id: 1,
        username: "janesmith",
        first_name: "Jane",
        last_name: "Smith",
        email: "janesmith@example.com",
        phone: "9876501234",
        student_id: 1002
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SampleData");
    XLSX.writeFile(workbook, "Sample_Student_Data.xlsx");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          width: { xs: "90%", sm: "450px" },
          p: { xs: 1, sm: 1.5 },
        },
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={{ xs: 1, sm: 1.5 }}
      >
        {/* Left-aligned title */}
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: { xs: "0.95rem", sm: "1.1rem" },
            flex: 1,       // take remaining space
            m: 0,          // remove default margin
            textAlign: "left",
            pl:0
          }}
        >
          Upload Excel File
        </DialogTitle>

        {/* Right-aligned close button */}
        <IconButton onClick={onClose} size="small">
          <Close fontSize="small" />
        </IconButton>
      </Box>


      <DialogContent sx={{ px: { xs: 1, sm: 1.5 }, py: 1.5 }}>
        {/* Download Sample Button */}
        <Box mb={1.5} display="flex" justifyContent="center">
          <Button
            variant="outlined"
            startIcon={<CloudDownload fontSize="small" />}
            onClick={handleDownloadSample}
            sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" }, textTransform: "none", py: 0.5 }}
          >
            Download Sample Data
          </Button>
        </Box>

        {/* Upload Area */}
        <Box
          sx={{
            border: "2px dashed #1976d2",
            borderRadius: 2,
            py: { xs: 2, sm: 2.5 },
            px: 1.5,
            textAlign: "center",
            cursor: "pointer",
            "&:hover": { backgroundColor: "#f8f9fa" },
          }}
          onClick={() => document.getElementById("excel-input")?.click()}
        >
          <CloudUpload fontSize="medium" color="primary" />
          <Typography variant="body1" mt={0.5} sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}>
            {file ? file.name : "Click or drag file to upload"}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
          >
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

      {/* Actions */}
      <DialogActions sx={{ px: { xs: 1, sm: 1.5 }, pb: 1.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" }, textTransform: "none", py: 0.5 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!file}
          sx={{
            backgroundColor: "#1976d2",
            textTransform: "none",
            fontSize: { xs: "0.7rem", sm: "0.8rem" },
            py: 0.5,
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
