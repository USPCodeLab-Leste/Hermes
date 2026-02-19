import NotificationIcon from "../assets/icons/notification.svg?react";

export default function NotificationButton() {
  const handleClick = () => {

  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="bg-transparent border-none cursor-pointer"
    >
			<NotificationIcon className="text-paper size-7" />
    </button>
  );
}
