import React from "react";

type UniversalHeaderSidebarButtonProps = {
  action: () => void;
  text?: string;
  icon?: React.ReactNode;
};

const UniversalHeaderSidebarButton: React.FC<
  UniversalHeaderSidebarButtonProps
> = ({ action, text, icon }) => {
  const textCssClasses =
    "text-center text-white no-underline dark:hover:text-darkgoldenrod hover:text-orange-700 hover:cursor-pointer";
  const buttonCssClasses =
    "hover:text-white bg-orange-400 dark:bg-[#2e2e2e] hover:bg-orange-700 dark:hover:bg-darkgoldenrod";

  if (text && icon)
    return (
      <p className="text-red-500">You can&apos;t put both text and icon</p>
    );

  if (!text && !icon)
    return <p className="text-red-500">You must put either text or icon</p>;

  if (text) {
    return (
      <a onClick={action} className={textCssClasses}>
        {text}
      </a>
    );
  }

  return (
    <button onClick={action} className={buttonCssClasses}>
      {icon}
    </button>
  );
};

export default UniversalHeaderSidebarButton;
