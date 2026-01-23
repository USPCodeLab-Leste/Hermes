import NotificationIcon from "../assets/icons/notification.svg?react";

export default function NotificationButton() {
  return (
    <button
      type="button"
      onClick={() => {
        console.log("notificacao clicada");
      }}
      className="bg-transparent border-none cursor-pointer"
    >
			<NotificationIcon className="text-paper size-7" />
    </button>
  );
}
