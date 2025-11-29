import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { CloudUpload, Close, CloudDownload } from "@mui/icons-material";
import * as XLSX from "xlsx";
import theme from "../../styles/theme";
import Customtext from "../inputs/customtext/Customtext";

interface UploadExcelDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

const UploadExcelDialog: React.FC<UploadExcelDialogProps> = ({ open, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
  // };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
      onClose();
    }
  };

  const sampleData = [
    {
      group_id: 1,
      username: "johndoe",
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "9876543210",
      student_id: 1001,
    },
    {
      group_id: 1,
      username: "janesmith",
      first_name: "Jane",
      last_name: "Smith",
      email: "janesmith@example.com",
      phone: "9876501234",
      student_id: 1002,
    },
  ];

  // 📥 Download Sample Excel or CSV
  const handleDownloadSample = (format: "xlsx" | "csv") => {
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SampleData");

    if (format === "csv") {
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Sample_Student_Data.csv";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      XLSX.writeFile(workbook, "Sample_Student_Data.xlsx");
    }

    setAnchorEl(null);
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
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: { xs: "0.95rem", sm: "1.1rem" },
            flex: 1,
            m: 0,
            textAlign: "left",
            pl: 0,
          }}
        >
          Upload File
        </DialogTitle>

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
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              fontSize: { xs: "0.7rem", sm: "0.8rem" },
              textTransform: "none",
              py: 0.5,
            }}
          >
            Download Sample Data
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => handleDownloadSample("xlsx")}>
              Download Excel (.xlsx)
            </MenuItem>
            <MenuItem onClick={() => handleDownloadSample("csv")}>
              Download CSV (.csv)
            </MenuItem>
          </Menu>
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
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <CloudUpload fontSize="medium" color="primary" />
          <Box mt={0.5}>
            {file ? (
              <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                <Customtext
                  fieldName={file.name}
                />
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  sx={{
                    minWidth: "auto",
                    p: "2px 6px",
                    fontSize: { xs: "0.6rem", sm: "0.7rem" },
                    textTransform: "none",
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening file dialog
                    setFile(null);
                  }}
                >
                  Remove
                </Button>
              </Box>
            ) : (
              <Customtext
                fieldName={'Click or drag file to upload'}
                sx={{color:theme.palette.text.primary}}
              />
            )}
          </Box>

            <Customtext
                fieldName={'Supported formats: .xlsx, .xls, .csv, .pdf'}
                sx={{color:theme.palette.custom.accent}}
              />

          <input
            id="file-input"
            type="file"
            accept=".xlsx,.xls,.csv,.pdf"
            hidden
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setFile(e.target.files[0]);
                e.target.value = ""; // Reset input to allow re-upload same file
              }
            }}
          />
        </Box>

      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: { xs: 1, sm: 1.5 }, pb: 1.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          sx={{
            fontSize: { xs: "0.7rem", sm: "0.8rem" },
            textTransform: "none",
            py: 0.5,
          }}
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
