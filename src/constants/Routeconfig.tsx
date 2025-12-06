// import DashboardStudent from "../features/dashboard/DashboardStudent";
import DashboardAdmin from "../features/admin/dashboard/DashboardAdmin";
import StudentList from "../features/admin/student/StudentList";
import StudentDetail from "../features/admin/student/StudentDetail";
import ProgramAdd from "../features/admin/programs/ProgramAdd";
import ProgramList from "../features/admin/programs/ProgramList";
import DashboardStudent from "../features/student/dashboard/DashboardStudent";
import FeesDetail from "../features/student/fees/Feesdetail";
import FeesReceipt from "../features/student/fees/feesreceipt";
import Onlinegrievances from "../features/student/grievances/onlinegrievances";
import Grievanceadd from "../features/student/grievances/grievanceadd";
import DocumemtsCard from "../features/student/documents/documents"
import StudentCounselling from "../features/student/counselling/counselling";
import ChangePasswordForm from "../features/student/passwordmang/ChangePasswordForm";
import Examination from "../features/student/examination/examination";
import FacultyList from "../features/admin/faculty/FacultyList";
import FacultyAdd from "../features/admin/faculty/FacultyAdd";
import SyllabusList from "../features/admin/master/syllabus/SyllabusList";
import SyllabusAdd from "../features/admin/master/syllabus/syllabusadd";

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
        path: 'detail',
        element: <StudentDetail />,
        breadcrumb: 'Student Detail',
      },
    ],
  },
  {
    path: '/faculty',
    breadcrumb: 'Faculty List',
    children: [
      {
        path: '',
        element: <FacultyList />,
        breadcrumb: 'Faculty List',
      },
      {
        path: 'add',
        element: <FacultyAdd />,
        breadcrumb: 'Faculty Add',
      },
      {
        path: 'add/:id',   // ✅ edit program route
        element: <FacultyAdd />,
        breadcrumb: 'Faculty Edit',
      },
    ],
  },
  {
    path: '/syllabus',
    breadcrumb: 'Syllabus List',
    children: [
      {
        path: '',
        element: <SyllabusList />,
        breadcrumb: 'Syllabus List',
      },
      {
        path: 'add',
        element: <SyllabusAdd />,
        breadcrumb: 'Syllabus Add',
      }
    ],
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
        path: 'detail',
        element: <FeesDetail />,
        breadcrumb: 'Fees Detail',
      },
      {
        path: 'receipt/:id',
        element: <FeesReceipt />,
        breadcrumb: 'Fees Receipt',
      }
    ]
  },
  {
    path: '/grievances',
    breadcrumb: 'Grievances',
    children: [
      {
        path: '',
        element: <Onlinegrievances />,
        // breadcrumb: 'Online Grievances',
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
    element: <Examination />,
    breadcrumb: 'Examinations',
  },
  {
    path: '/documents',
    element: <DocumemtsCard />,
    breadcrumb: 'Documents',
  },
  {
    path: '/counselling',
    element: <StudentCounselling />,
    breadcrumb: 'Student Counselling',
  },
  {
    path: '/passwordmang',
    element: <ChangePasswordForm />,
    breadcrumb: 'Password Managment',
  },
];
