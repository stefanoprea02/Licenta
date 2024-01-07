import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useHttp from "../hooks/use-http";
import { GameType } from "../types/types";

export default function Home() {
  const { sendRequest } = useHttp();
  const [games, setGames] = useState<GameType[]>([]);
  const navigation = useNavigate();

  const applyData = (data: GameType[]) => {
    setGames(data);
  };

  useEffect(() => {
    sendRequest(
      {
        url: `http://localhost:3000/games/getAll`,
        method: "GET",
        headers: {},
        id: `games`
      },
      applyData
    );
  }, [sendRequest]);

  return (
    <div>
      {games.map((game) => {
        if (game.gameFile)
          return (
            <img
              key={game._id}
              width={300}
              height={200}
              src={`http://localhost:3000/${game.images[0]}`}
              onClick={() => navigation(`/games/${game._id}`)}
            />
          );
      })}
    </div>
  );
}
