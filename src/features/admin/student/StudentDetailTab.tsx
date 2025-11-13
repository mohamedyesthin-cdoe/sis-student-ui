import { Box, Divider, Grid, IconButton, useTheme } from '@mui/material';
import CardComponent from '../../../components/card/Card';
import Customtext from '../../../components/customtext/Customtext';
import { getValue } from '../../../utils/localStorageUtil';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DownloadIcon from '@mui/icons-material/Download';
import type { JSX } from 'react';
import StudentIdCard from '../../student/profilecard/profilecard';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

type TabContent = {
  title: string;
  items: [string, any][];
  customRender?: () => JSX.Element;
};

type StudentDetailTabsProps = {
  student: any;
  activeTab: number;
  setActiveTab: (index: number) => void;
};

export default function StudentDetailTab({
  student,
  activeTab,
  setActiveTab,
}: StudentDetailTabsProps) {
  const theme = useTheme();
  const rollid = Number(getValue('rollid'));

  const field = (label: string, value: any) => (
    <Box
      className="border-b border-gray-300 last:border-b-0"
      display="flex"
      flexDirection={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      py={0.5}
      gap={0.5}
    >
      <Customtext
        fieldName={label}
        sx={{
          width: { xs: '100%', sm: '50%' },
          color: theme.palette.custom.accent,
          wordBreak: 'break-word',
        }}
      />
      <Customtext
        fieldName={value || '-'}
        sx={{
          flex: 1,
          width: { xs: '100%', sm: 'auto' },
          color: theme.palette.text.secondary,
          wordBreak: 'break-word',
          whiteSpace: 'normal',
        }}
      />
    </Box>
  );

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'file';
    link.click();
  };

  const renderTabContent = (tab: TabContent) => {
    if (tab.customRender) return tab.customRender();

    if (tab.title === 'Documents') {
      const sampleDocs = tab.items.length
        ? tab.items
        : [
          { name: 'Aadhaar Card', fileUrl: '/sample-aadhaar.pdf' },
          { name: 'Passport', fileUrl: '/sample-passport.pdf' },
        ];

      return (
        <CardComponent>
          <Box className="py-2 px-3">
            <Customtext fieldName={tab.title} sx={{ mb: 0 }} />
          </Box>
          <Divider sx={{ borderColor: '#899000' }} />
          <CardComponent mb={3} p={2} sx={{ boxShadow: 'none', mb: 0, border: 'none' }}>
            <Box display="flex" flexDirection="column" gap={1}>
              {sampleDocs.length ? (
                sampleDocs.map((doc: any) => (
                  <Box
                    key={doc.name}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    p={1}
                    sx={{
                      borderBottom: '1px solid #e0e0e0',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Customtext
                      fieldName={doc.name}
                      sx={{
                        color: theme.palette.custom.accent
                      }}
                    />
                    <IconButton
                      onClick={() => handleDownload(doc.fileUrl)}
                      size="small"
                      sx={{ color: theme.palette.primary.main }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Box>
                ))
              ) : (
                <Customtext
                  fieldName="No Documents Available"
                />
              )}
            </Box>
          </CardComponent>
        </CardComponent>
      );
    }

    return (
      <CardComponent>
        <Box className="py-2 px-3">
          <Customtext fieldName={tab.title} sx={{ mb: 0 }} />
        </Box>
        <Divider sx={{ borderColor: '#899000' }} />
        <CardComponent mb={3} p={2} sx={{ boxShadow: 'none', mb: 0, border: 'none' }}>
          <Box className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tab.items.length
              ? tab.items.map(([label, value]) => <Box key={label}>{field(label, value)}</Box>)
              : (
                <Customtext
                  fieldName="No Data Available"
                />
              )}
          </Box>
        </CardComponent>
      </CardComponent>
    );
  };

  // Tabs
  const admintabs = ['Basic Info', 'Academic', 'DEB', 'Documents', 'ID Card'];
  const studenttabs = ['Basic Info', 'DEB', 'ID Card'];
  const tabs = rollid === 2 ? studenttabs : admintabs;
  const formattedDate = new Date(student?.date_of_birth).toLocaleDateString("en-GB") // dd/mm/yyyy
  // Tab Contents
  const basicInfoTab: TabContent = {
    title: 'Basic Info',
    items: [
      ['Gender', student?.gender],
      ['Date of Birth', formattedDate],
      ['Blood Group', student?.blood_group],
      ['Whatsapp Number', student?.whatsapp_number],
      ['Marital Status', student?.marital_status],
      ['Religion', student?.religion],
      ['Aadhar Number', student?.aadhaar_number],
      ['Personal EmailId', student?.email],
      ['Nationality', student?.nationality == '101' ? 'Indian' : 'Others'],
    ],
    customRender: () => (
      <>
        {/* Basic Details */}
        <CardComponent>
          <Box className="py-2 px-3">
            <Customtext fieldName="Basic Details" sx={{ mb: 0 }} />
          </Box>
          <Divider sx={{ borderColor: '#899000' }} />
          <CardComponent mb={3} p={2} sx={{ boxShadow: 'none', mb: 0, border: 'none' }}>
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                ['Gender', student?.gender],
                ['Date of Birth', formattedDate],
                ['Blood Group', student?.blood_group],
                ['Whatsapp Number', student?.whatsapp_number],
                ['Marital Status', student?.marital_status],
                ['Religion', student?.religion],
                ['Aadhar Number', student?.aadhaar_number],
                ['Personal EmailId', student?.email],
                ['Nationality', student?.nationality == '101' ? 'Indian' : 'Others'],
              ].map(([label, value]) => (
                <Box key={label}>{field(label, value)}</Box>
              ))}
            </Box>
          </CardComponent>
        </CardComponent>

        {/* Address */}
        <CardComponent>
          <Box className="py-2 px-3">
            <Customtext fieldName="Address" sx={{ mb: 0 }} />
          </Box>
          <Divider sx={{ borderColor: '#899000' }} />
          <CardComponent mb={3} p={2} sx={{ boxShadow: 'none', mb: 0, border: 'none' }}>
            {[
              {
                title: 'Current Address',
                value: `${student?.address_details?.corr_addr1}, ${student?.address_details?.corr_addr2}, ${student?.address_details?.corr_city} - ${student?.address_details?.corr_pin}`,
                icon: <LocationOnIcon sx={{ color: '#105c8e', fontSize: 32 }} />,
              },
              {
                title: 'Permanent Address',
                value: `${student?.address_details?.perm_addr1}, ${student?.address_details?.perm_addr2}, ${student?.address_details?.perm_city} - ${student?.address_details?.perm_pin}`,
                icon: <LocationOnIcon sx={{ color: '#BF2728', fontSize: 32 }} />,
              },
            ].map((card, index) => (
              <Grid container spacing={2} key={index}>
                <Box
                  sx={{
                    backgroundColor: 'white',
                    p: 1,
                    width: '100%',
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.palette.background.default,
                        borderRadius: 3,
                        mr: 2,
                        mb: 1,
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Box>
                      <Customtext
                        fieldName={card.title}
                        sx={{
                          width: { xs: '100%', sm: '50%' },
                          color: theme.palette.custom.accent,
                          mb: 0,
                        }}
                      />
                      <Customtext
                        fieldName={card.value}
                        sx={{
                          color: theme.palette.text.primary
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </CardComponent>
        </CardComponent>
      </>
    ),
  };

  const academicTab: TabContent = {
    title: 'Academic Details',
    items: [
      ['SSC School', student?.academic_details?.ssc_school],
      ['SSC Scheme', student?.academic_details?.ssc_scheme],
      ['SSC Score', student?.academic_details?.ssc_score],
      ['SSC Year', student?.academic_details?.ssc_year],
      ['After SSC', student?.academic_details?.after_ssc],
      ['HSC School', student?.academic_details?.hsc_school],
      ['HSC Result', student?.academic_details?.hsc_result],
      ['HSC Scheme', student?.academic_details?.hsc_scheme],
      ['HSC Score', student?.academic_details?.hsc_score],
      ['HSC Year', student?.academic_details?.hsc_year],
    ],
  };

  const debTab: TabContent = {
    title: 'DEB Details',
    items: [
      ['DEB ID', student?.deb_details?.deb_id],
      // ['Name', student?.deb_details?.deb_name],
      // ['Gender', student?.deb_details?.deb_gender],
      // ['DOB', student?.deb_details?.deb_date_of_birth],
      ['ABC ID', student?.deb_details?.deb_abcid],
      // ['Status', student?.deb_details?.deb_status],
    ],
  };

  const documentsTab: TabContent = {
    title: 'Documents',
    items: [],
    customRender: () => {
      const theme = useTheme();
      const docs = [
        { label: 'Aadhar', value: student?.document_details?.aadhar },
        { label: 'Class 10th Marksheet', value: student?.document_details?.class_10th_marksheet },
        { label: 'Class 12th Marksheet', value: student?.document_details?.class_12th_marksheet },
        { label: 'Diploma Marksheet', value: student?.document_details?.diploma_marksheet },
        { label: 'Graduation Marksheet', value: student?.document_details?.graduation_marksheet },
        { label: 'Passport', value: student?.document_details?.passport },
        { label: 'Signature', value: student?.document_details?.signature },
        { label: 'Work Experience Certificates', value: student?.document_details?.work_experience_certificates },
      ];

      const availableDocs = docs.filter(doc => doc.value);

      return (
        <CardComponent>
          <Box className="py-2 px-3">
            <Customtext fieldName="Documents" sx={{ mb: 0 }} />
          </Box>
          <Divider sx={{ borderColor: '#899000' }} />
          <CardComponent mb={3} p={2} sx={{ boxShadow: 'none', border: 'none' }}>
            {availableDocs.length ? (
              <Box display="flex" flexDirection="column" gap={1}>
                {availableDocs.map(doc => (
                  <Box
                    key={doc.label}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={1}
                    sx={{
                      backgroundColor: theme.palette.background.default,
                      borderRadius: 1,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          backgroundColor: theme.palette.grey[100],
                          borderRadius: '4px',
                          p: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <PictureAsPdfIcon sx={{ color: theme.palette.grey[500], fontSize: '18px' }} />
                      </Box>
                      <Customtext
                        fieldName={doc.label}
                        sx={{color: theme.palette.text.primary }}
                      />
                    </Box>
                    <IconButton
                      onClick={() => window.open(doc.value, '_blank')}
                      sx={{
                        backgroundColor: 'black',
                        color: theme.palette.grey[300],
                        p: 0.6,
                        '&:hover': { backgroundColor: 'black' },
                      }}
                    >
                      <FileDownloadIcon sx={{ fontSize: '18px' }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            ) : (
              <Customtext fieldName="No Documents Available" sx={{color: theme.palette.text.secondary }} />
            )}
          </CardComponent>
        </CardComponent>
      );
    },
  };

  const IDCardTab: TabContent = {
    title: 'ID Card',
    items: [],
    customRender: () => (
      <CardComponent>
        <Box className="py-2 px-3">
          <Customtext fieldName="ID Card" sx={{ mb: 0 }} />
        </Box>
        <Divider sx={{ borderColor: '#899000' }} />
        {/* ✅ Pass student as prop */}
        <StudentIdCard />
      </CardComponent>
    ),
  };

  // ✅ Corrected tab content mapping for both roles
  const tabContents =
    rollid === 2
      ? [basicInfoTab, debTab, IDCardTab]
      : [basicInfoTab, academicTab, debTab, documentsTab, IDCardTab];

  return (
    <>
      {/* Tab Headers */}
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
              fontSize: '0.9rem',
              color: activeTab === index ? theme.palette.background.default : theme.palette.text.primary,
              backgroundColor: activeTab === index ? theme.palette.secondary.main : 'transparent',
              '&:hover': {
                backgroundColor:
                  activeTab === index
                    ? theme.palette.primary.main
                    : theme.palette.custom.highlight,
              },
            }}
          >
            {tabLabel}
          </Box>
        ))}
      </Box>

      {/* Tab Content */}
      {tabContents[activeTab] && renderTabContent(tabContents[activeTab])}
    </>
  );
}
