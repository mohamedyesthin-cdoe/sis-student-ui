import { Box, Typography, useTheme } from '@mui/material';
import CardComponent from '../../../components/card/Card';
import Subheader from '../../../components/subheader/Subheader';

type StudentDetailTabsProps = {
  student: any;
  activeTab: number;
  setActiveTab: (index: number) => void;
};

export default function StudentDetailTab({ student, activeTab, setActiveTab }: StudentDetailTabsProps) {
  const theme = useTheme();
  const field = (label: string, value: any) => (
    <Box className="border-b border-gray-300 last:border-b-0">
      <Typography variant="subtitle2" sx={{ color: theme.palette.custom.accent, fontSize: '0.85rem' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>
        {value || '-'}
      </Typography>
    </Box>
  );

  const renderTabContent = (items: [string, any][]) => (
    <CardComponent mb={0} p={2}>
      <Box className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.length
          ? items.map(([label, value]) => (
            <Box key={label}>{field(label, value)}</Box>
          ))
          : <Typography className="text-gray-500">No data available</Typography>}
      </Box>
    </CardComponent>
  );

  const tabs = ['Basic Info', 'Academic', 'DEB', 'Documents'];

  return (
    <>
      <Box className="flex overflow-x-auto space-x-2 rounded mb-4 px-2">
        {tabs.map((tabLabel, index) => (
          <Box
            key={tabLabel}
            onClick={() => setActiveTab(index)}
            sx={{
              cursor: 'pointer',
              px: 2,
              py: 1,
              whiteSpace: 'nowrap',
              borderRadius: '0.5rem',
              fontWeight: '500',
              fontSize: '0.875rem',
              color: activeTab === index ? theme.palette.background.default : theme.palette.text.primary,
              backgroundColor: activeTab === index ? theme.palette.secondary.main : 'transparent',
              '&:hover': {
                backgroundColor: activeTab === index ? theme.palette.primary.main : theme.palette.custom.highlight,
              },
            }}>
            {tabLabel}
          </Box>

        ))}
      </Box>


      {/* <Box className="flex-1 overflow-y-auto"> */}
      {activeTab === 0 && (
        <>
          {/* Basic Details */}
          <CardComponent mb={3} p={2}>
            <Subheader fieldName="Basic Details"></Subheader>
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                ['Gender', student.gender],
                ['Date of Birth', student.date_of_birth],
                ['Blood Group', student.blood_group],
                ['Nationality', student.nationality],
              ].map(([label, value]) => (
                <Box key={label}>{field(label, value)}</Box>
              ))}
            </Box>
          </CardComponent>
          {/* Addresses */}
          <CardComponent mb={0} p={2}>
            <Subheader fieldName="Temporary Address"></Subheader>
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                ['Address', `${student.address_details.corr_addr1}, ${student.address_details.corr_addr2}, ${student.address_details.corr_city} - ${student.address_details.corr_pin}`],
                ['District', student.address_details.corr_district],
                ['State', student.address_details.corr_state],
                ['Country', student.address_details.corr_country],
              ].map(([label, value]) => (
                <Box key={label}>{field(label, value)}</Box>
              ))}
            </Box>
            <Subheader fieldName="Permanent Address" sx={{mt:2}}></Subheader>
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                ['Address', `${student.address_details.perm_addr1}, ${student.address_details.perm_addr2}, ${student.address_details.perm_city} - ${student.address_details.perm_pin}`],
                ['District', student.address_details.perm_district],
                ['State', student.address_details.perm_state],
                ['Country', student.address_details.perm_country],
              ].map(([label, value]) => (
                <Box key={label}>{field(label, value)}</Box>
              ))}
            </Box>
          </CardComponent>
        </>
      )}

      {activeTab === 1 && renderTabContent([
        ['SSC Board ID', student.academic_details.ssc_board_id],
        ['SSC School', student.academic_details.ssc_school],
        ['SSC Scheme', student.academic_details.ssc_scheme],
        ['SSC Score', student.academic_details.ssc_score],
        ['SSC Year', student.academic_details.ssc_year],
        ['After SSC', student.academic_details.after_ssc],
        ['HSC Board ID', student.academic_details.hsc_board_id],
        ['HSC School', student.academic_details.hsc_school],
        ['HSC Result', student.academic_details.hsc_result],
        ['HSC Scheme', student.academic_details.hsc_scheme],
        ['HSC Score', student.academic_details.hsc_score],
        ['HSC Year', student.academic_details.hsc_year],
      ])}

      {activeTab === 2 && renderTabContent([
        ['DEB ID', student.deb_details.deb_id],
        ['Name', student.deb_details.deb_name],
        ['Gender', student.deb_details.deb_gender],
        ['DOB', student.deb_details.deb_date_of_birth],
        ['ABC ID', student.deb_details.deb_abcid],
        ['Status', student.deb_details.deb_status],
      ])}
    </>
  );
}





























