import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import coverImage from '/assets/images/user-grid-bg1.png';
import avatarImage from '/assets/images/user-grid-img14.png';
import { Avatar, Divider, Box } from '@mui/material';
import CardComponent from '../../../components/card/Card';
import StudentDetailTab from './StudentDetailTab';
import theme from '../../../styles/theme';
import { apiRequest } from '../../../utils/ApiRequest';
import { ApiRoutes } from '../../../constants/ApiConstants';
import Customtext from '../../../components/customtext/Customtext';


export default function StudentDetailUI() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await apiRequest({
          url: `${ApiRoutes.GETSTUDENTBYID}/${id}`,
          method: 'get',
        });

        if (response) {
          setStudent(response);
        } else {
        }
      } catch (error) {
        console.error("Failed to fetch student:", error);
        navigate('/students/list');
      }
    };

    if (id) fetchStudent();
  }, [id, navigate]);


  const personalInfo = {
    fullName: `${student?.first_name} ${student?.last_name}`,
    email: student?.email,
    phoneNumber: student?.mobile_number,
    program:
      student?.program_id == '1500038' ? (
        <Box component="span">
          Bachelor Of Science
          <br />
          (Hons) (Data Science)
        </Box>
      ) : (
        '-'
      ),
    department: student?.department,
    batch: student?.batch,
    year: student?.year,
    registration_no: student?.registration_no
  };

  const infoList = [
    ['Full Name', personalInfo.fullName],
    ['Email', personalInfo.email],
    ['Phone Number', personalInfo.phoneNumber],
    ['Program', personalInfo.program],
    ['Department', 'CDOE'],
    ['Batch', 'July'],
    ['Year', '2025'],
  ];

  return (
    <Box className="grid grid-cols-1 lg:grid-cols-12 gap-6 m-2 mt-4"
      sx={{ maxWidth: { xs: '350px', sm: '900px', md: '1300px' }, mx: 'auto' }}>
      {/* Left Column */}
      <Box className="col-span-12 lg:col-span-4 my-1">
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
              <Customtext
                fieldName={personalInfo.fullName}
                sx={{
                  mt: 1,
                  mb: 0,
                  width: { xs: '100%', sm: '50%' },
                  color: theme.palette.text.primary,
                  fontSize: { xs: '14px', sm: '16px' },
                  fontWeight: 'bold',
                  wordBreak: 'break-word', // wrap if label is long
                }}
              />
              <Customtext
                fieldName={personalInfo.registration_no}

                sx={{
                  mb: 2,
                  wordBreak: 'break-word',
                  whiteSpace: 'normal',
                  color: theme.palette.custom.accent,
                }}
              />
            </Box>


            <Divider sx={{ my: 2 }} />

            <Box sx={{ mt: 3 }}>
              <Customtext
                fieldName='Personal Info'

                sx={{
                  mb: 2,
                  fontSize: { xs: '14px', sm: '16px' },
                  fontWeight: 'bold',
                  color:theme.palette.text.primary
                }}
              />

              {/* Two-column responsive grid */}
              <Box
                display="grid"
                gridTemplateColumns={{ xs: '1fr', sm: '1fr' }} // 1 column on mobile, 2 columns on small+
                gap={0.5} // gap between rows/columns
              >
                {infoList.map(([label, value], index) => (
                  <Box
                    key={index}
                    display="flex"
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    py={0.5}
                    gap={1}
                  >
                    {/* Label */}
                    <Customtext
                      fieldName={label}
                      sx={{
                        width: { xs: '100%', sm: '50%' },
                        color: theme.palette.custom.accent,
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        wordBreak: 'break-word', // wrap if label is long
                      }}
                    />

                    {/* Value */}
                    <Customtext
                      fieldName={value}
                      sx={{
                        width: { xs: '100%', sm: '50%' },
                        color: theme.palette.secondary.main,
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        wordBreak: 'break-word', // wrap if label is long
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>

          </Box>

        </CardComponent>
      </Box>

      {/* Right Column */}
      <Box className="col-span-12 lg:col-span-8 my-1">
        <StudentDetailTab student={student} activeTab={activeTab} setActiveTab={setActiveTab} />
      </Box>
    </Box>
  );
}

