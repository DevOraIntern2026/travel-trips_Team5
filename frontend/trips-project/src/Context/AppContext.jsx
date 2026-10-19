import { createContext, useContext, useState } from "react";
const AppContext = createContext();
export function AppProvider({children}){
    
    const [isLoggedIn, setIsLoggedIn] = useState(()=>{
        return Boolean(localStorage.getItem("accessToken"))
    });
    const [user, setUser] = useState(null);
    const value = {
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser
    };
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}
export function useAppContext(){
    const context = useContext(AppContext);
    if(!context){
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
}