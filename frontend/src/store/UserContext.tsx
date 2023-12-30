import { Dispatch, SetStateAction, createContext, useState } from "react";
import { UserType } from "../types/types";

interface UserContextInterface {
  userData: UserType | null;
  setUserData: Dispatch<SetStateAction<UserType | null>>;
}

const cartContextDefaultValue: UserContextInterface = {
  userData: null,
  setUserData: () => null
};

export const UserContext = createContext<UserContextInterface>(
  cartContextDefaultValue
);

type ProviderProps = {
  children: JSX.Element;
};

export const UserProvider = ({ children }: ProviderProps) => {
  const [userData, setUserData] = useState<UserType | null>(null);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
