import React from "react";

type Address = {
  country: string;
  state: string;
  city: string;
};

type AddressItemProps = {
  type: string;
  field: string;
};

type ProfileBoardAboutProps = {
  email: string;
  phone: string;
  birthday: string;
  address: Address;
};

const ProfileBoardAbout: React.FC<ProfileBoardAboutProps> = ({
  email,
  phone,
  birthday,
  address,
}) => {
  const formattedBirthday = new Date(birthday).toLocaleDateString("en-UK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full px-4 flex flex-col items-center text-gray-600 dark:text-gray-300 overflow-x-auto">
      <h2 className="text-2xl font-semibold w-full text-center">Details</h2>
      <div className="w-full px-4 grid grid-cols-3 place-items-center">
        <div className="mt-4">
          <p>
            <span className="text-md font-semibold">Email: </span>
            {email}
          </p>
        </div>
        <div className="mt-4">
          <p>
            <span className="text-md font-semibold">Phone: </span>
            {phone}
          </p>
        </div>
        <div className="mt-4">
          <p>
            <span className="text-md font-semibold">Birthday: </span>
            {formattedBirthday}
          </p>
        </div>
      </div>
      <AddressSection {...address} />
    </div>
  );
};

export default ProfileBoardAbout;

const AddressSection: React.FC<Address> = ({ country, state, city }) => {
  if (!country && !state && !city) return null;
  return (
    <div className="mt-4 w-full">
      <h2 className="text-2xl font-semibold w-full text-center">Address</h2>
      <div className="grid grid-cols-3 place-items-center w-full ">
        <AddressItem field={country} type="Country" />
        <AddressItem field={state} type="State" />
        <AddressItem field={city} type="City" />
      </div>
    </div>
  );
};

const AddressItem: React.FC<AddressItemProps> = ({ type, field }) => {
  if (!field) return null;
  return (
    <div className="mt-4">
      <p>
        <span className="font-bold">{`${type}: `}</span>
        {`${field}`}
      </p>
    </div>
  );
};
