import DashboardHome from "../features/dashboard/DashboardHome";
import StudentList from "../features/student/StudentList";
import StudentDetail from "../features/student/StudentDetail";
import Faculty from "../features/faculty/Faculty";
import ProgramAdd from "../features/programs/ProgramAdd";
import ProgramList from "../features/programs/ProgramList";

export const routesConfig = [
  {
    path: '/dashboard',
    element: <DashboardHome />,
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
