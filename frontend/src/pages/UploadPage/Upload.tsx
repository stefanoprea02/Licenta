import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GameDetailsEditor from "../../components/game-details-editor/game-details-editor";
import GameUploadForm from "../../components/game-upload-form/game-upload-form";
import useHttp from "../../hooks/use-http";
import { GameType } from "../../types/types";
import styles from "./Upload.module.scss";

export default function Upload() {
  const { uploadStep, gameId } = useParams();
  const { sendRequest } = useHttp();
  const [gameData, setGameData] = useState<GameType>();

  useEffect(() => {
    if (gameId) {
      sendRequest(
        {
          url: `http://localhost:3000/games/getGameById?gameId=${gameId}`,
          method: "GET",
          headers: {},
          id: `games`
        },
        (data: GameType) => setGameData(data)
      );
    }
  }, [sendRequest, gameId]);

  if (gameId && !gameData) return;

  return (
    <div className={styles.uploadPage}>
      {uploadStep === "1" ? (
        <GameDetailsEditor
          gameId={gameId ? gameId : undefined}
          gameData={gameData}
        />
      ) : gameId ? (
        <GameUploadForm gameId={gameId}></GameUploadForm>
      ) : (
        <></>
      )}
    </div>
  );
}
