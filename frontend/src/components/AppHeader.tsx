import NotificationButton from "./NotificationButton";
import ProfilePic from "./ProfilePic";

export default function AppHeader() {
  const campus = "EACH";

  return (
    <header className=" py-7 px-4 bg-violet-dark rounded-b-2xl">
      <div className="m-auto flex justify-between items-center w-9/10 max-w-2xl gap-4">
        <div className="flex items-center flex-row gap-4">
          <ProfilePic />
          <div className="flex items-center flex-col">
            <h2 className="text-paper text-[120%] font-bold not-italic leading-[120%]">Hermes na</h2>
            <h3 className="text-paper h-[20%] self-stretch">{campus}</h3>
          </div>
        </div>
        <NotificationButton />
      </div>
    </header>
  );
}
