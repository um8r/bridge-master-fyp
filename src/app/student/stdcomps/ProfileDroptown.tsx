// "use client";

// import React, { Fragment } from "react";
// import { Menu, Transition } from "@headlessui/react";
// import { FaUserCircle, FaUserEdit, FaSignOutAlt, FaImage, FaLock, FaChevronDown } from "react-icons/fa";
// import Link from "next/link";

// interface UserProfile {
//   userId: string;
//   firstName: string;
//   lastName: string;
//   role: string;
//   imageData: string;
// }

// interface ProfileDropdownProps {
//   userProfile: UserProfile;
//   onLogoutClick: () => void;
// }

// const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ userProfile, onLogoutClick }) => {
//   const navigationItems = [
//     {
//       name: "View Profile",
//       href: "/student/profile",
//       icon: <FaUserCircle className="mr-2 h-5 w-5 text-gray-400" />,
//     },
//     {
//       name: "Edit Profile",
//       href: "/student/profile/edit",
//       icon: <FaUserEdit className="mr-2 h-5 w-5 text-gray-400" />,
//     },
//     {
//       name: "Upload Image",
//       href: "/student/profile/management",
//       icon: <FaImage className="mr-2 h-5 w-5 text-gray-400" />,
//     },
//     {
//       name: "Update Password",
//       href: "/student/profile/update-password",
//       icon: <FaLock className="mr-2 h-5 w-5 text-gray-400" />,
//     },
//   ];

//   return (
//     <Menu as="div" className="relative inline-block text-left">
//       <div>
//         <Menu.Button
//           className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           aria-label="User menu"
//         >
//           {userProfile.imageData ? (
//             <img
//               src={`data:image/jpeg;base64,${userProfile.imageData}`}
//               alt={`${userProfile.firstName} ${userProfile.lastName}`}
//               className="w-10 h-10 rounded-full border-2 border-indigo-500"
//             />
//           ) : (
//             <FaUserCircle className="w-10 h-10 text-gray-400" />
//           )}
//           <FaChevronDown className="ml-2 h-4 w-4 text-gray-600" />
//         </Menu.Button>
//       </div>

//       <Transition
//         as={Fragment}
//         enter="transition ease-out duration-200"
//         enterFrom="opacity-0 translate-y-1"
//         enterTo="opacity-100 translate-y-0"
//         leave="transition ease-in duration-150"
//         leaveFrom="opacity-100 translate-y-0"
//         leaveTo="opacity-0 translate-y-1"
//       >
//         <Menu.Items
//           className="absolute right-0 mt-2 w-56 origin-top-right bg-gray-800 border border-gray-700 divide-y divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
//           aria-labelledby="user-menu"
//         >
//           {/* User Information */}
//           <div className="px-4 py-3">
//             <p className="text-sm font-medium text-white">
//               {userProfile.firstName} {userProfile.lastName}
//             </p>
//             <p className="text-sm text-gray-400">{userProfile.role}</p>
//           </div>

//           {/* Navigation Links */}
//           <div className="py-1">
//             {navigationItems.map((item) => (
//               <Menu.Item key={item.name}>
//                 {({ active }) => (
//                   <Link
//                     href={item.href}
//                     className={`flex items-center px-4 py-2 text-sm ${
//                       active
//                         ? "bg-indigo-600 text-white"
//                         : "text-gray-300 hover:bg-indigo-500 hover:text-white"
//                     }`}
//                   >
//                     {item.icon}
//                     {item.name}
//                   </Link>
//                 )}
//               </Menu.Item>
//             ))}
//           </div>

//           {/* Logout Button */}
//           <div className="py-1">
//             <Menu.Item>
//               {({ active }) => (
//                 <button
//                   onClick={onLogoutClick}
//                   className={`flex items-center w-full px-4 py-2 text-sm ${
//                     active
//                       ? "bg-indigo-600 text-red-500"
//                       : "text-red-500 hover:bg-indigo-500 hover:text-white"
//                   }`}
//                 >
//                   <FaSignOutAlt className="mr-2 h-5 w-5 text-red-400" />
//                   Logout
//                 </button>
//               )}
//             </Menu.Item>
//           </div>
//         </Menu.Items>
//       </Transition>
//     </Menu>
//   );
// };

// export default ProfileDropdown;
