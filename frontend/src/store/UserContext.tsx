import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState
} from "react";
import { UserDataType } from "../types/types";

interface UserContextInterface {
  gameMetadata: any;
  userData: UserDataType | null;
  setUserData: Dispatch<SetStateAction<UserDataType | null>>;
}

const userContextDefaultValue: UserContextInterface = {
  userData: null,
  setUserData: () => null
};

export const UserContext = createContext<UserContextInterface>(
  userContextDefaultValue
);

type ProviderProps = {
  children: JSX.Element;
};

function userOrNull() {
  const user = sessionStorage.getItem("user");
  if (!user) return null;
  try {
    const res = JSON.parse(user);
    return res;
  } catch (err) {
    return null;
  }
}

export const UserProvider = ({ children }: ProviderProps) => {
  const [userData, setUserData] = useState<UserDataType | null>(userOrNull);

  useEffect(() => {
    sessionStorage.setItem("user", JSON.stringify(userData));
  }, [userData]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
