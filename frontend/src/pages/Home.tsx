import { useEffect } from "react";
import useHttp from "../hooks/use-http";

export default function Home() {
  const { sendRequest } = useHttp();

  const applyData = (data: object) => {
    console.log(data);
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

  return <div>Home</div>;
}
