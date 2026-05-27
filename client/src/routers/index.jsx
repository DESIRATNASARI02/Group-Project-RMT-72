import { createBrowserRouter } from "react-router-dom";
import Lobby from "../pages/Lobby";
import PlaceShips from "../pages/PlaceShips";
import Battle from "../pages/Battle";
import Result from "../pages/Result";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Lobby />,
  },
  {
    path: "/place",
    element: <PlaceShips />,
  },
  {
    path: "/battle",
    element: <Battle />,
  },
  {
    path: "/result",
    element: <Result />,
  },
]);

export default router;