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
import SyllabusAdd from "../features/admin/master/syllabus/SyllabusAdd";
import SyllabusList from "../features/admin/master/syllabus/SyllabusList";
import SyllabusTabView from "../features/admin/master/syllabus/SyllabusTabView";
import MarksEntryScreen from "../features/admin/master/syllabus/MarksEntry";
import RoleList from "../features/admin/master/role/RoleList";
import DepartmentList from "../features/admin/master/department/Department";
import FeesList from "../features/admin/student/FeesList";
import SchemesList from "../features/admin/master/schemes/SchemesList";
import SchemesAdd from "../features/admin/master/schemes/SchemesAdd";
import SemestersList from "../features/admin/master/semester/SemesterList";
import SemestersAdd from "../features/admin/master/semester/SemestersAdd";
import CourseList from "../features/admin/master/course/CourseList";
import CourseAdd from "../features/admin/master/course/CourseAdd";
import CourseComponentsList from "../features/admin/master/coursecomponent/CourseComponentList";
import CourseComponentAdd from "../features/admin/master/coursecomponent/CourseComponentAdd";

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
      {
        path: 'feeslist',
        element: <FeesList />,
        breadcrumb: 'Fees List',
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
      },
      {
        path: 'add/:id',   // ✅ edit program route
        element: <SyllabusAdd />,
        breadcrumb: 'Syllabus Add',
      },
      {
        path: 'view/:id',   // ✅ edit program route
        element: <SyllabusTabView />,
        breadcrumb: 'Syllabus Edit',
      },
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
  {
    path: '/marks-entry',
    element: <MarksEntryScreen />,
    breadcrumb: 'Marks Entry',
  },
  {
    path: '/role-list',
    element: <RoleList />,
    breadcrumb: 'Role List',
  },
  {
    path: '/department-list',
    element: <DepartmentList />,
    breadcrumb: 'Department List',
  },
  {
    path: '/schemes',
    // breadcrumb: 'Fees',
    children: [
       {
        path: 'list',
        element: <SchemesList />,
        breadcrumb: 'Schemes List',
      },
      {
        path: 'add',
        element: <SchemesAdd />,
        breadcrumb: 'Scheme Add',
      },
      {
        path: 'edit/:id',   // ✅ edit program route
        element: <SchemesAdd/>,
        breadcrumb: 'Scheme Edit',
      },
    ]
  },
  {
    path: '/semesters',
    children: [
      {
        path: 'list',
        element: <SemestersList />,
        breadcrumb: 'Semesters List',
      },
      {
        path: 'add',
        element: <SemestersAdd />,
        breadcrumb: 'Semester Add',
      },
      {
        path: 'edit/:id',   // ✅ edit program route
        element: <SemestersAdd />,
        breadcrumb: 'Semester Edit',
      },
    ]
  },
  {
    path:'/courses',
    children: [
      {
        path: 'list',
        element: <CourseList />,
        breadcrumb: 'Courses List',
      },
      {
        path: 'add',
        element: <CourseAdd />,
        breadcrumb: 'Courses Add',
      },
      {
        path: 'edit/:id',
        element: <CourseAdd />,
        breadcrumb: 'Courses Edit',
      },
    ]
  },
  {
    path:'/course-components',
    children: [
      {
        path: 'list',
        element: <CourseComponentsList />,
        breadcrumb: 'Course Components List',
      },
      {
        path: 'add',
        element: <CourseComponentAdd />,
        breadcrumb: 'Course Components Add',
      },
      {
        path: 'edit/:id',
        element: <CourseComponentAdd />,
        breadcrumb: 'Course Components Edit',
      },
    ]
  }
];
