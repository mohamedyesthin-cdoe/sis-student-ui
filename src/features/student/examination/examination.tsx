import CardComponent from "../../../components/card/Card";
import { ComingSoonUI } from "../../../components/card/errorUi/ComingSoonUI";

export default function Examination() {

  return (
    <>
      {
        <CardComponent
          sx={{
            width: "100%",
            maxWidth: { xs: "350px", sm: "900px", md: "1300px" },
            mx: "auto",
            p: 3,
            mt: 3,
          }}
        >
          <ComingSoonUI />
        </CardComponent>
      }
    </>
  )
}
