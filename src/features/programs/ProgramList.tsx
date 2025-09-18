import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom";

const ProgramList = () => {
  const navigate = useNavigate()
  const handleView = () => navigate(`/programs/add`);
  return (
    <Button
      variant="contained"
      color="secondary"
      size="small"
      sx={{ ml: { xs: 0, sm: 'auto' }, width: { xs: '100%', sm: 'auto' } }}
      onClick={() => handleView()}
    >
      Add
    </Button>
  )
}

export default ProgramList