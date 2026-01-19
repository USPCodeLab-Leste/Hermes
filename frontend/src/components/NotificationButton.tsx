
import NotificationIcon from "../assets/icons/notification.svg"
export default function NotificationButton(){
	return(
		<button type="button" onClick={()=> {console.log("notificacao clicada")}}  className="bg-transparent border-none cursor-pointer w-[10%] h-[10%] max-h-[50px] max-w-[50px]" >
            <img src={NotificationIcon} className="w-full h-full object-contain"/>
      	</button>
	)
}