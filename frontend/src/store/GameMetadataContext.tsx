import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState
} from "react";
import useHttp from "../hooks/use-http";
import {
  GameMetadataType,
  GenreType,
  LanguageType,
  PlatformType,
  TagType
} from "../types/types";

interface GameMetadataContextInterface {
  gameMetadata: GameMetadataType;
  setGameMetadata: Dispatch<SetStateAction<GameMetadataType>>;
}

const gameMetadataContextDefaultValue: GameMetadataContextInterface = {
  gameMetadata: {
    genres: null,
    languages: null,
    platforms: null,
    tags: null
  },
  setGameMetadata: () => null
};

export const GameMetadataContext = createContext<GameMetadataContextInterface>(
  gameMetadataContextDefaultValue
);

type ProviderProps = {
  children: JSX.Element;
};

export const GameMetadataProvider = ({ children }: ProviderProps) => {
  const [gameMetadata, setGameMetadata] = useState<GameMetadataType>({
    genres: null,
    languages: null,
    platforms: null,
    tags: null
  });
  const { sendRequest } = useHttp();

  const applyData = (
    getResponse: (GenreType | LanguageType | PlatformType | TagType)[],
    requestId: string
  ) => {
    setGameMetadata((prevMetadata) => {
      return {
        ...prevMetadata,
        [requestId]: getResponse
      };
    });
  };

  useEffect(() => {
    const routes = ["genres", "languages", "tags", "platforms"];
    for (const route of routes) {
      sendRequest(
        {
          url: `http://localhost:3000/${route}/getAll`,
          method: "GET",
          headers: {},
          id: `${route}`
        },
        applyData
      );
    }
  }, [sendRequest]);

  return (
    <GameMetadataContext.Provider value={{ gameMetadata, setGameMetadata }}>
      {children}
    </GameMetadataContext.Provider>
  );
};
