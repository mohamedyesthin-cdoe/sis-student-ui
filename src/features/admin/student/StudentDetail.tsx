import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import coverImage from '/assets/images/user-grid-bg1.png';
import maleimage from '/assets/images/male-logo.jpg'
import femaleimage from '/assets/images/female-logo.jpg'
import { Avatar, Divider, Box } from '@mui/material';
import CardComponent from '../../../components/card/Card';
import StudentDetailTab from './StudentDetailTab';
import theme from '../../../styles/theme';
import { apiRequest } from '../../../utils/ApiRequest';
import { ApiRoutes } from '../../../constants/ApiConstants';
import { getValue } from '../../../utils/localStorageUtil';
import { useGlobalError } from '../../../context/ErrorContext';
import { useLoader } from '../../../context/LoaderContext';
import ProfileSkeleton from '../../../components/card/skeletonloader/Profileskeleton';
import Customtext from '../../../components/inputs/customtext/Customtext';

export default function StudentDetailUI() {
  const navigate = useNavigate();
  const student_id = getValue("student_id")
  const [student, setStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);
  const { error } = useGlobalError();
  const { loading } = useLoader();


  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await apiRequest({
          url: `${ApiRoutes.GETSTUDENTBYID}/${student_id}`,
          method: 'get',
        });

        if (response) {
          setStudent(response);
        } else {
        }
      } catch (error) {
        console.error("Failed to fetch student:", error);
      }
    };

    if (student_id) fetchStudent();
  }, [student_id, navigate]);


  const personalInfo = {
    fullName: `${student?.first_name} ${student?.last_name}`,
    email: student?.email,
    phoneNumber: student?.mobile_number,
    program:
      student?.program_id == '1500038' ? (
        <Box component="span">
          B.Sc (Hons) - (Data Science)
        </Box>
      ) : (
        '-'
      ),
    department: student?.department,
    batch: student?.batch,
    year: student?.year,
    registration_no: student?.registration_no,
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
  const gender = getValue("gender");
  const userimage = gender == "Female" ? femaleimage : maleimage;

  return (
    <>
      {
        error.type === "NONE" && (
          <Box className="grid grid-cols-1 lg:grid-cols-12 gap-6 m-2 mt-4"
            sx={{ maxWidth: { xs: '350px', sm: '900px', md: '1300px' }, mx: 'auto' }}>
            {/* Left Column */}


            <Box className="col-span-12 lg:col-span-4 my-1">
              {loading ?
                <>
                  <ProfileSkeleton />
                </> : (
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
                          src={userimage}
                          sx={{
                            width: 80,
                            height: 80,
                            border: `2px solid ${theme.palette.secondary.main}`,
                            mt: -6, // Negative margin to lift it over the cover image
                            backgroundColor: 'white'
                          }}
                        />
                        <Customtext
                          fieldName={personalInfo.fullName}
                          sx={{
                            mt: 1,
                            mb: 0,
                            width: { xs: '100%', sm: '50%' },
                            color: theme.palette.text.primary,
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


                      <Divider sx={{ my: { xs: 2, sm: 2, md: 2, lg: 0, xl: 2 } }} />

                      <Box sx={{ mt: { xs: 3, sm: 3, md: 3, lg: 2, xl: 3 } }}>
                        <Customtext
                          fieldName='Personal Info'

                          sx={{
                            mb: 2,
                            color: theme.palette.text.primary
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
                                  wordBreak: 'break-word', // wrap if label is long
                                }}
                              />

                              {/* Value */}
                              <Customtext
                                fieldName={value}
                                sx={{
                                  width: { xs: '100%', sm: '50%' },
                                  color: theme.palette.secondary.main,
                                  wordBreak: 'break-word', // wrap if label is long
                                  textAlign: 'left',
                                }}
                              />
                            </Box>
                          ))}
                        </Box>
                      </Box>

                    </Box>
                  </CardComponent>
                )}
            </Box>

            {/* Right Column */}
            <Box className="col-span-12 lg:col-span-8 my-1">
              <StudentDetailTab student={student} activeTab={activeTab} setActiveTab={setActiveTab} />
            </Box>
          </Box>
        )
      }


    </>
  );
}

