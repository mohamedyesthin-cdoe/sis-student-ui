import { useParams, useNavigate } from 'react-router-dom';
import { sampleStudents } from './sampleData';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { useEffect, useState } from 'react';

export default function StudentDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    const filteredStudents = sampleStudents.filter((s)=>{console.log(s);
    });
    console.log("---",filteredStudents);
    
    const foundStudent = filteredStudents.length > 0 ? filteredStudents[0] : null;

    if (foundStudent) {
      setStudent(foundStudent)
    } else {
      navigate('/students');  // Redirect if student not found
    }
  }, [id, navigate])

  if (!student) return null;

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Student Details</Typography>

      {/* Basic Details */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Basic Details</Typography>
        <Typography><strong>Name:</strong> {student.first_name} {student.last_name}</Typography>
        <Typography><strong>Gender:</strong> {student.gender}</Typography>
        <Typography><strong>DOB:</strong> {student.date_of_birth}</Typography>
        <Typography><strong>Email:</strong> {student.email}</Typography>
        <Typography><strong>Mobile:</strong> {student.mobile_number}</Typography>
      </Box>

      <Divider />

      {/* Declaration Details */}
      <Box sx={{ my: 3 }}>
        <Typography variant="h6">Declaration Details</Typography>
        <Typography><strong>Applicant Name:</strong> {student.declaration_details.applicant_name}</Typography>
        <Typography><strong>Parent Name:</strong> {student.declaration_details.parent_name}</Typography>
        <Typography><strong>Declaration Date:</strong> {student.declaration_details.declaration_date}</Typography>
        <Typography><strong>Place:</strong> {student.declaration_details.place}</Typography>
      </Box>

      <Divider />

      {/* Deb Details */}
      <Box sx={{ my: 3 }}>
        <Typography variant="h6">Deb Details</Typography>
        <Typography><strong>Deb ID:</strong> {student.deb_details.deb_id}</Typography>
        <Typography><strong>Deb Name:</strong> {student.deb_details.deb_name}</Typography>
        <Typography><strong>Deb Gender:</strong> {student.deb_details.deb_gender}</Typography>
        <Typography><strong>Deb DOB:</strong> {student.deb_details.deb_date_of_birth}</Typography>
      </Box>

      <Divider />

      {/* Document Details */}
      <Box sx={{ my: 3 }}>
        <Typography variant="h6">Document Details</Typography>
        <Typography><strong>10th Marksheet:</strong> <a href={student.document_details.class_10th_marksheet} target="_blank" rel="noopener noreferrer">View</a></Typography>
        <Typography><strong>12th Marksheet:</strong> <a href={student.document_details.class_12th_marksheet} target="_blank" rel="noopener noreferrer">View</a></Typography>
        <Typography><strong>Aadhar:</strong> <a href={student.document_details.aadhar} target="_blank" rel="noopener noreferrer">View</a></Typography>
        <Typography><strong>Signature:</strong> <a href={student.document_details.signature} target="_blank" rel="noopener noreferrer">View</a></Typography>
      </Box>

      <Divider />

      {/* Academic Details */}
      <Box sx={{ my: 3 }}>
        <Typography variant="h6">Academic Details</Typography>
        <Typography><strong>SSC School:</strong> {student.academic_details.ssc_school}</Typography>
        <Typography><strong>SSC Score:</strong> {student.academic_details.ssc_score}</Typography>
        <Typography><strong>HSC School:</strong> {student.academic_details.hsc_school}</Typography>
        <Typography><strong>HSC Score:</strong> {student.academic_details.hsc_score}</Typography>
      </Box>

      <Divider />

      {/* Address Details */}
      <Box sx={{ my: 3 }}>
        <Typography variant="h6">Address Details</Typography>
        <Typography><strong>Corr Address:</strong> {student.address_details.corr_addr1}, {student.address_details.corr_addr2}, {student.address_details.corr_city}, {student.address_details.corr_state}, {student.address_details.corr_district}, {student.address_details.corr_country}, {student.address_details.corr_pin}</Typography>
        <Typography><strong>Perm Address:</strong> {student.address_details.perm_addr1}, {student.address_details.perm_addr2}, {student.address_details.perm_city}, {student.address_details.perm_state}, {student.address_details.perm_district}, {student.address_details.perm_country}, {student.address_details.perm_pin}</Typography>
      </Box>
    </Paper>
  );
}
