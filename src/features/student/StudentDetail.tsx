import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sampleStudents } from './sampleData';
import coverImage from '/assets/images/user-grid-bg1.png';
import avatarImage from '/assets/images/user-grid-img14.png';
import { Avatar, Divider, Typography, Box } from '@mui/material';
import CardComponent from '../../components/card/Card';
import StudentDetailTab from './StudentDetailTab';
import theme from '../../styles/theme';


export default function StudentDetailUI() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const filteredStudents = sampleStudents.filter((s: any) => s.id == id);
    const foundStudent = filteredStudents.length > 0 ? filteredStudents[0] : null;
    if (foundStudent) setStudent(foundStudent);
    else navigate('/students');
  }, [id, navigate]);

  if (!student) {
    return (
      <Box className="p-4 text-center">
        <Typography variant="h6">Loading Student Data...</Typography>
      </Box>
    );
  }

  const personalInfo = {
    fullName: `${student.first_name} ${student.last_name}`,
    email: student.email,
    phoneNumber: student.mobile_number,
    department: student.department,
    designation: student.designation,
    languages: student.languages,
    bio: student.bio,
  };
  const infoList = [
    ['Full Name', personalInfo.fullName],
    ['Email', personalInfo.email],
    ['Phone Number', personalInfo.phoneNumber],
    ['Department', personalInfo.department],
    ['Designation', personalInfo.designation],
    ['Languages', personalInfo.languages],
    ['Bio', personalInfo.bio],
  ];

  return (
    <Box className="grid grid-cols-1 lg:grid-cols-12 gap-6 m-2 mt-4">
      {/* Left Column */}
      <Box className="col-span-12 lg:col-span-4">
          <CardComponent mb={2} p={0} className="h-full">
            <img src={coverImage} alt="coverImage" className="w-full object-fit-cover" />
            <Box
              sx={{
                mx: { xs: 2, sm: 3 },
                pb: 4
              }}>
              <Box
                sx={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center', // Center horizontally
                  borderColor: 'neutral.200',
                  '@media (prefers-color-scheme: dark)': {
                    borderColor: 'neutral.600',
                  },
                }}
              >
                <Avatar
                  src={avatarImage}
                  sx={{
                    width: 80,
                    height: 80,
                    border: '2px solid white',
                    mt: -6, // Negative margin to lift it over the cover image
                  }}
                />

                <Typography
                  sx={{
                    fontSize: { xs: '14px', sm: '16px' },
                    fontWeight: 'bold',
                    mt: 2,
                    mb: 0,
                  }}
                >
                  {personalInfo.fullName}
                </Typography>
                <Typography
                  sx={{
                    mb: 2,
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                    color: theme.palette.custom.accent,
                  }}
                >
                  {personalInfo.email}
                </Typography>
              </Box>


              <Divider sx={{ my: 2 }} />

              <Box sx={{ mt: 3 }}>
                <Typography
                  sx={{
                    fontSize: { xs: '14px', sm: '16px' },
                    fontWeight: 'bold',
                    mb: 3,
                  }}
                >
                  Personal Info
                </Typography>

                <Box display="flex" flexDirection="column" gap={1}>
                  {infoList.map(([label, value], index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="flex-start"
                      mb={0}
                    >
                      <Typography
                        sx={{
                          width: { xs: '30%', sm: '30%', md: '35%' },
                          fontWeight: 600,
                          fontSize: { xs: '13px', sm: '13px' },
                          color: 'text.secondary',
                        }}
                      >
                        {label}
                      </Typography>

                      <Typography
                        sx={{
                          width: '20px',
                          fontWeight: 600,
                          fontSize: { xs: '13px', sm: '13px' },
                          textAlign: 'center',
                          color: 'text.secondary',
                        }}
                      >
                        :
                      </Typography>

                      <Typography
                        sx={{
                          flex: 1,
                          fontWeight: 500,
                          fontSize: { xs: '13px', sm: '14px' },
                          color: 'secondary.main',
                          wordBreak: 'break-word',
                          whiteSpace: 'normal',
                        }}
                      >
                        {value || '-'}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

          </CardComponent>
      </Box>

      {/* Right Column */}
      <Box className="col-span-12 lg:col-span-8">
        <StudentDetailTab student={student} activeTab={activeTab} setActiveTab={setActiveTab} />
      </Box>
    </Box>
  );
}

