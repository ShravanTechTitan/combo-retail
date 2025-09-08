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
  {/* Logo + Title */}
  <div className="flex items-center gap-2 cursor-pointer" onClick={HandleClickLogo}>
    <img
      src="/UniversalCombo.jpg"
      alt="Universal Combo Logo"
      className="h-10 w-10 rounded-full"
    />
    <h1 className="text-xl sm:text-2xl font-bold text-white">Universal Combo</h1>
  </div>

  {/* Profile Icon */}
  {!hideProfileIcon && <ProfileIcon />}
</header>

  )
}