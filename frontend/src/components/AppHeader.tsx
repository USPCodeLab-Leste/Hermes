import NotificationButton from "./NotificationButton";
import ProfilePic from "./ProfilePic";
export default function AppHeader() {
  const campus = "EACH";
  return (
    <header className="p-0">
      <div className="flex justify-between items-center w-full py-[28px] px-4 gap-[1%] bg-[#3A1F1A] rounded-b-[16px]">
      <div className="flex justify-start items-center flex-row gap-[1%]">
        <ProfilePic></ProfilePic>
        <div className="flex items-center flex-col" >
        <h2 className="text-[#F4F3F8] text-[120%] font-bold not-italic font-['Montserrat'] leading-[120%]">Hermes na</h2>

        <h3 className="text-[#F4F3F8] h-[20%] self-stretch"> {campus}</h3>
        </div>
      </div>
      <NotificationButton/>
      </div>

    </header>
  )
}