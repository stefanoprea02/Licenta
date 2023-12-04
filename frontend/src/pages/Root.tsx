import { Outlet } from "react-router-dom";
import NavigationBar from "../components/navigation-bar/navigation-bar";

export default function Root() {
  return (
    <>
      <NavigationBar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
