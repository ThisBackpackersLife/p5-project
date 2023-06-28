// import React from "react";
import { createContext } from "react";
// import httpClient from "./httpClient";


export const UserContext = createContext( null )

// function UserProvider({ children }) {


//     if (user === null) {
//         return null;
//     }
    
//     return (
//         <UserContext.Provider 
//             value={{ user, changeSetUser, userData, changeSetUserData }}
//         >
//             { children }
//         </UserContext.Provider>
//     )
// }

// export default UserProvider;