// import './Loader.css';
// export default function Loader() {
//     return (
//         <div>

//             <div className="lava-lamp">
//                 <div className="bubble"></div>
//                 <div className="bubble1"></div>
//                 <div className="bubble2"></div>
//                 <div className="bubble3"></div>
//             </div>

//         </div>
//     )
// }
// import React from 'react';

// const BouncingDotsLoader = () => {
//   return (
//     <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
//       <div className="flex space-x-2">
//         <span className="w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-0"></span>
//         <span className="w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-150"></span>
//         <span className="w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-300"></span>
//       </div>
//     </div>
//   );
// };

// export default BouncingDotsLoader;

import './Loader.css';

export default function Loader() {
  return (
    <div className="loader-overlay">
      <div className="lava-lamp">
        <div className="bubble"></div>
        <div className="bubble1"></div>
        <div className="bubble2"></div>
        <div className="bubble3"></div>
      </div>
    </div>
  );
}
