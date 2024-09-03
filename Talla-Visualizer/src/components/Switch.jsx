// import React, { useState } from "react";

// export default function Switch({children}) {
//     const [isSelect, setIsSelect] = useState(false);
//   return (
//       <div className="flex flex-row  items-center space-x-2">
//         <label
//               className="inline-block  hover:cursor-pointer"
//               htmlFor="flexSwitchCheckDefault"
//         >{children}</label>
//         <input
//               className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-dark-grey before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-dark-grey after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-secondary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-secondary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-secondary checked:focus:bg-secondary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-secondary/70 dark:checked:after:bg-secondary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
//               type="checkbox"
//               role="switch"
//               onClick={() => setIsSelect(!isSelect)}
//               id="flexSwitchCheckDefault" />
          
//       </div>
//   );
// }
import React, { useState } from "react";

export default function Switch({ children,handleSwitch }) {
  
  return (
    <div className="flex flex-row items-center space-x-2">
      <label className="inline-block" htmlFor="flexSwitchCheckDefault">
        {children}
      </label>
      <input
        className="mr-2 mt-[0.3rem] h-4 w-8  rounded-[0.4375rem] bg-neutral-600 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-400 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-secondary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-secondary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] focus:outline-none focus:ring-0 focus:bg-dark-grey focus:border-transparent hover:bg-dark-grey hover:border-transparent dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-secondary/70 dark:checked:after:bg-secondary"
        type="checkbox"
        role="switch"
        onClick={() => handleSwitch()}
        id="flexSwitchCheckDefault"
        defaultChecked
      />
    </div>
  );
}

