// import DashboardStudent from "../features/dashboard/DashboardStudent";
import DashboardAdmin from "../features/admin/dashboard/DashboardAdmin";
import StudentList from "../features/admin/student/StudentList";
import StudentDetail from "../features/admin/student/StudentDetail";
import Faculty from "../features/admin/faculty/Faculty";
import ProgramAdd from "../features/admin/programs/ProgramAdd";
import ProgramList from "../features/admin/programs/ProgramList";
import DashboardStudent from "../features/student/dashboard/DashboardStudent";
import FeesDetail from "../features/student/fees/Feesdetail";
import FeesReceipt from "../features/student/fees/feesreceipt";
import Onlinegrievances from "../features/student/grievances/onlinegrievances";
import Offlinegrievances from "../features/student/grievances/offlinegrievances";
import Grievanceadd from "../features/student/grievances/grievanceadd";
import StudentIdCard from "../features/student/profilecard/profilecard";

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
    // breadcrumb: 'Students List',
    children: [
      {
        path: 'list',
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
  {
    path: '/fees',
    // breadcrumb: 'Fees',
    children: [
      {
        path: 'detail/:id',
        element: <FeesDetail />,
        breadcrumb: 'Fees Detail',
      },
      {
        path: 'receipt',
        element: <FeesReceipt />,
        breadcrumb: 'Fees Receipt',
      }
    ]
  },
  {
    path: '/grievances',
    // breadcrumb: 'Fees',
    children: [
      {
        path: 'online',
        element: <Onlinegrievances />,
        breadcrumb: 'Online Grievances',
      },
      {
        path: 'offline',
        element: <Offlinegrievances />,
        breadcrumb: 'Offline Grievances',
      },
      {
        path: 'add',
        element: <Grievanceadd />,
        breadcrumb: 'Grievance Add',
      }
    ]
  },
  {
    path: '/examinations',
    element: <StudentIdCard />,
    breadcrumb: 'Examinations',
  },
];
