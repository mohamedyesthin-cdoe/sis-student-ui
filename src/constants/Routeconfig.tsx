// import DashboardStudent from "../features/dashboard/DashboardStudent";
import DashboardAdmin from "../features/dashboard/DashboardAdmin";
import StudentList from "../features/student/StudentList";
import StudentDetail from "../features/student/StudentDetail";
import Faculty from "../features/faculty/Faculty";
import ProgramAdd from "../features/programs/ProgramAdd";
import ProgramList from "../features/programs/ProgramList";
import DashboardStudent from "../features/dashboard/DashboardStudent";

export const routesConfig = [
 {
    path: '/dashboard',
    children: [
      {
        path: '',
        element: <DashboardAdmin />, // default admin view
      },
      {
        path: 'student',
        element: <DashboardStudent />, // student view
      },
    ],
  },
  {
    path: '/students',
    breadcrumb: 'Students List',
    children: [
      {
        path: '',
        element: <StudentList />,
        breadcrumb: 'Students List',
      },
      {
        path: 'detail/:id',
        element: <StudentDetail />,
        breadcrumb: 'Student Detail',
      },
    ],
  },
  {
    path: '/faculty',
    element: <Faculty />,
    breadcrumb: 'Faculty List',
  },
  {
    path: '/programs',
    breadcrumb: 'Programs List',
    children: [
      {
        path: '',
        element: <ProgramList />,
        breadcrumb: 'Programs List',
      },
      {
        path: 'add',
        element: <ProgramAdd />,
        breadcrumb: 'Programs Add',
      },
      {
        path: 'add/:id',   // ✅ edit program route
        element: <ProgramAdd />,
        breadcrumb: 'Programs Edit',
      },
    ],
  },
];
