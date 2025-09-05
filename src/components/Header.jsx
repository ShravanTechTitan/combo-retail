import ProfileIcon from "./profileIcon";
import { Link ,useNavigate,useLocation } from "react-router-dom";
 



export default function Header(){

  const location = useLocation(); 
  const navigate = useNavigate()


const HandleClickLogo = ()=>{
  navigate("/")

}
const hideProfileIcon = location.pathname === "/login"

  return(
    <header className="h-16 flex justify-between items-center bg-indigo-600 dark:bg-gray-800 px-6 shadow">
        <h1 className="text-xl sm:text-2xl font-bold text-white"><span className="cursor-pointer" onClick={HandleClickLogo}>📱 </span  > <span>Universal Combo</span></h1>
           {!hideProfileIcon && <ProfileIcon></ProfileIcon>}
    </header>
  )
}