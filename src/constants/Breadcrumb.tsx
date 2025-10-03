// import { Box, Chip } from "@mui/material";
// import { Link as RouterLink, useLocation } from "react-router-dom";
// import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import { routesConfig } from "./routeconfig";

// // Map full paths to breadcrumb names
// const generateRouteMap = (routes: any[], parentPath = ''): Record<string, string> => {
//     let map: Record<string, string> = {};
//     routes.forEach(route => {
//         const fullPath = `${parentPath}${route.path}`.replace(/\/+/g, '/');
//         if (route.breadcrumb) {
//             map[fullPath] = route.breadcrumb;
//         }
//         if (route.children) {
//             map = { ...map, ...generateRouteMap(route.children, fullPath.endsWith('/') ? fullPath : fullPath + '/') };
//         }
//     });
//     return map;
// };

// const routeMap = generateRouteMap(routesConfig);

// const Breadcrumb = () => {
//     const location = useLocation();
//     const pathnames = location.pathname.split('/').filter(x => x);
//     const currentPath = `/${pathnames.join('/')}`;

//     // Generate breadcrumb paths incrementally
//     const breadcrumbPaths: string[] = [];
//     pathnames.forEach((_, idx) => {
//         const path = `/${pathnames.slice(0, idx + 1).join('/')}`;
//         // Match dynamic routes (:id)
//         const matchedRoute = Object.keys(routeMap).find(routeKey => {
//             const pattern = routeKey.replace(/:\w+/g, '[^/]+');
//             return new RegExp(`^${pattern}$`).test(path);
//         });
//         if (matchedRoute) breadcrumbPaths.push(matchedRoute);
//     });

//     // Always include dashboard at start
//     const allPaths = ['/dashboard', ...breadcrumbPaths];

//     return (
//         <Box
//             sx={{
//                 display: 'flex',
//                 flexWrap: 'wrap',
//                 alignItems: 'center',
//                 gap: 1.5,
//                 p: 2,
//             }}
//         >
//             {allPaths.map((to, index, arr) => {
//                 const text = routeMap[to] || 'Dashboard';
//                 const isLast = index === arr.length - 1;

//                 // Dashboard is clickable only if we are NOT on dashboard page
//                 const isDashboard = to === '/dashboard';
//                 const clickable = !isLast && (!isDashboard || currentPath !== '/dashboard');

//                 return (
//                     <Box key={to} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                         <Chip
//                             component={clickable ? RouterLink : undefined}
//                             to={clickable ? to : undefined}
//                             label={text}
//                             clickable={clickable}
//                             color={isLast ? 'secondary' : 'default'}
//                             size="small"
//                             sx={{
//                                 fontWeight: isLast ? 'bold' : 'normal',
//                                 textTransform: 'capitalize',
//                                 py: 1.5,
//                                 px: 1.2,
//                                 borderRadius:'5px'
//                             }}
//                         />
//                         {!isLast && <NavigateNextIcon fontSize="small" />}
//                     </Box>
//                 );
//             })}
//         </Box>
//     );
// };

// export default Breadcrumb;



import { Box, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { routesConfig } from "./Routeconfig";
import theme from "../styles/theme";

// Generate route map
const generateRouteMap = (routes: any[], parentPath = ''): Record<string, string> => {
  let map: Record<string, string> = {};
  routes.forEach(route => {
    const fullPath = `${parentPath}${route.path}`.replace(/\/+/g, '/');
    if (route.breadcrumb) map[fullPath] = route.breadcrumb;
    if (route.children) {
      map = { ...map, ...generateRouteMap(route.children, fullPath.endsWith('/') ? fullPath : fullPath + '/') };
    }
  });
  return map;
};

const routeMap = generateRouteMap(routesConfig);

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);
  const breadcrumbPaths: string[] = [];

  pathnames.forEach((_, idx) => {
    const path = `/${pathnames.slice(0, idx + 1).join('/')}`;
    const matchedRoute = Object.keys(routeMap).find(routeKey => {
      const pattern = routeKey.replace(/:\w+/g, '[^/]+');
      return new RegExp(`^${pattern}$`).test(path);
    });
    if (matchedRoute) breadcrumbPaths.push(matchedRoute);
  });

  const allPaths = ['/dashboard', ...breadcrumbPaths];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5, p: 1 ,m:2  
    }}>
      {allPaths.map((to, index) => {
        const text = routeMap[to] || 'Dashboard';
        const isLast = index === allPaths.length - 1;

        return (
          <Box key={to} sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
            <Typography
              component={isLast ? 'span' : RouterLink}
              to={isLast ? undefined : to}
              sx={{
                fontWeight: isLast ? 'bold' : 500,
                color: isLast ? theme.palette.secondary.main : '#555',
                fontSize: 14,
                textDecoration: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  color: !isLast ? theme.palette.secondary.main : undefined,
                  transform: !isLast ? 'scale(1.05)' : undefined,
                },
              }}
            >
              {text}
            </Typography>
            {!isLast && (
              <NavigateNextIcon
                fontSize="small"
                sx={{ color: '#999', transition: 'color 0.2s' }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default Breadcrumb;

