import React from "react";
import { CardContent,Checkbox } from "@mui/material";
import CardComponent from "../card/Card";
import Customtext from "../customtext/Customtext";
import theme from "../../styles/theme";

interface Assignment {
  title: string;
  due: string;
}

const assignments: Assignment[] = [
  { title: "Do The Research", due: "Due in 9 days" },
  { title: "PHP Development", due: "Due in 2 days" },
  { title: "Graphic Design", due: "Due in 5 days" },
];

const Assignments: React.FC = () => {
  return (
    <CardComponent className="rounded-2xl shadow-sm">
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <Customtext
            fieldName={'Assignments'}
            variantName="h6"
          />
          <Customtext
            fieldName={'See All'}
            variantName="body2"
            sx={{ color: theme.palette.primary.main, cursor: 'pointer' }}
          />
        </div>
        <div className="flex flex-col gap-2">
          {assignments.map((a, i) => (
            <div key={i} className="flex items-center justify-between border rounded-lg p-2">
              <div className="flex items-center gap-2">
                <Checkbox size="small" />
                <div>
                  <Customtext
                    fieldName={a.title}
                    variantName="body1"
                  />
                  <Customtext
                    fieldName={a.due}
                    variantName="caption"
                    sx={{ color: theme.palette.custom.accent }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </CardComponent>
  );
};

export default Assignments;
