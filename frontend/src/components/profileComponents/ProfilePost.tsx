import React from "react";

type ProfilePostProps = {
  title: string;
  content: string;
};

const ProfilePost: React.FC<ProfilePostProps> = ({ title, content }) => {
  return (
    <div className="border p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-gray-500">{content}</p>
    </div>
  );
};

export default ProfilePost;
