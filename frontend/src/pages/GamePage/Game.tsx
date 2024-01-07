import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import { GameType } from "../../types/types";
import styles from "./Game.module.scss";

export default function Game() {
  const { gameId } = useParams();
  const { sendRequest } = useHttp();
  const [game, setGame] = useState<GameType>();

  useEffect(() => {
    if (gameId) {
      sendRequest(
        {
          url: `http://localhost:3000/games/getGameById?gameId=${gameId}`,
          method: "GET",
          headers: {},
          id: `games`
        },
        (data: GameType) => setGame(data)
      );
    }
  }, [sendRequest, gameId]);

  if (!game) return <></>;

  return (
    <div className={styles.gamePage}>
      <Link to={`/upload/1/${game._id}`}>EDIT</Link>
      <iframe
        id={game._id}
        title={game.title}
        width={1024}
        height={768}
        src={`http://localhost:3000/${game.gameFile}`}
      ></iframe>
    </div>
  );
}
