import DashboardHome from "../features/dashboard/DashboardHome";
import StudentList from "../features/student/StudentList";
import StudentDetail from "../features/student/StudentDetail";
import Faculty from "../features/faculty/Faculty";

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
];
