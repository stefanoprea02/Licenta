import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Game from "./pages/GamePage/Game";
import Home from "./pages/Home";
import Root from "./pages/Root";
import Upload from "./pages/UploadPage/Upload";
import { GameMetadataProvider } from "./store/GameMetadataContext";
import { UserProvider } from "./store/UserContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserProvider>
        <GameMetadataProvider>
          <Root />
        </GameMetadataProvider>
      </UserProvider>
    ),
    children: [
      { index: true, element: <Home /> },
      {
        path: "upload/:uploadStep/:gameId?",
        element: <Upload />
      },
      {
        path: "games/:gameId",
        element: <Game />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
