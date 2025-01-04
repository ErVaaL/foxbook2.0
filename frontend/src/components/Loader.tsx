import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

type LoaderProps = {
  color?: string;
  size?: number;
  loading?: boolean;
};

const Loader: React.FC<LoaderProps> = ({
  color = "#000",
  size = 35,
  loading = true,
}) => {
  return (
    <div className="flex items-center justify-center h-full">
      <ClipLoader color={color} size={size} loading={loading} />
    </div>
  );
};

export default Loader;
