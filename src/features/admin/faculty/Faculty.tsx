import * as React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CardComponent from '../../../components/card/Card';
import { useNavigate } from 'react-router-dom';
import ReusableTable from '../../../components/table/table';
import TableToolbar from '../../../components/tabletoolbar/tableToolbar';
import TablePagination from '../../../components/tablepagination/tablepagination';
import { exportToExcel } from '../../../constants/excelExport';
import { apiRequest } from '../../../utils/ApiRequest';
import { ApiRoutes } from '../../../constants/ApiConstants';
import TableSkeleton from '../../../components/card/skeletonloader/Tableskeleton';
import { useGlobalError } from '../../../context/ErrorContext';
import { useLoader } from '../../../context/LoaderContext';


export default function Faculty() {
  const navigate = useNavigate();
  const handleView = () => navigate(`/programs/add`);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState('');
  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showSearch] = React.useState(true);

  const [programs, setPrograms] = React.useState<any[]>([]);
  const { error } = useGlobalError();
  const { loading } = useLoader()

  // Fetch programs from API on component mount
  React.useEffect(() => {
    apiRequest({ url: ApiRoutes.GETFACULTYLIST, method: 'get' })
      .then((data) => setPrograms(Array.isArray(data) ? data : data.data))
      .catch(() => setPrograms([]));
  }, []);

  // Filtered programs based on search text
  const filteredPrograms = programs.filter((c) => {
    const combinedText = `${c.programe_code} ${c.programe} ${c.duration}`.toLowerCase();
    return combinedText.includes(searchText.toLowerCase());
  });


  // Excel export
  const handleExportExcel = () => {
    exportToExcel(
      filteredPrograms,
      [
        { header: 'S.No', key: 'sno' },
        { header: 'Program ID', key: 'programe_code' },
        { header: 'Program Name', key: 'programe' },
        { header: 'Duration', key: 'duration' },
      ],
      'Programs',
      'Programs'
    );
  };


  return (
    <>
      {error.type === "NONE" && (
        loading ? (
          <TableSkeleton />
        )
          : (
            <CardComponent
              sx={{
                width: '100%',
                maxWidth: { xs: '350px', sm: '900px', md: '1300px' },
                mx: 'auto',
                p: 3,
                mt: 3,
              }}
            >
              {/* Filters & Export */}
              <TableToolbar
                filters={[
                  {
                    key: "search",
                    label: "Search",
                    type: "text",
                    value: searchText,
                    onChange: (val) => setSearchText(val),
                    placeholder: "Search all fields",
                    visible: showSearch,
                  }
                ]}
                actions={[
                  {
                    label: 'Export Excel',
                    color: 'secondary',
                    startIcon: <FileDownloadIcon />,
                    onClick: handleExportExcel,
                  },
                  {
                    label: 'Add User',
                    color: 'primary',
                    onClick: handleView,
                  },
                ]}
              />


              <ReusableTable
                columns={[
                  { key: "programe_code", label: "Employee ID" },
                  { key: "programe", label: "Full Name" },
                  { key: "duration", label: "Email" },
                  { key: "duration", label: "Mobile" },
                  { key: "duration", label: "Roll" },
                ]}
                data={filteredPrograms}
                page={page}
                rowsPerPage={rowsPerPage}
                actions={[
                  {
                    label: "Edit", icon: <EditIcon fontSize="small" />, onClick: (row) => {
                      navigate(`/programs/add/${row.id}`);
                    }, color: "primary",
                  },
                  { label: "Delete", icon: <DeleteIcon fontSize="small" />, onClick: () => { }, color: "error", },
                ]}
              />

              {/* Pagination */}
              <TablePagination
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={filteredPrograms.length}
                onPageChange={(newPage) => setPage(newPage)}
              />


            </CardComponent >
          )
      )}
    </>
  )
}