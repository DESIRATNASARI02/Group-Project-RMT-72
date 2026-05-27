import { createBrowserRouter } from "react-router-dom";
import Lobby from "../views/Lobby";
import PlaceShips from "../views/PlaceShips";
import Battle from "../views/Battle";
import Result from "../views/Result";

const router = createBrowserRouter(
  [
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
  ]
);

export default router;