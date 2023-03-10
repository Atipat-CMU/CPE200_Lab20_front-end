import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Client } from "@stomp/stompjs";
import uuid from "react-uuid";
import "./App.css";
import Canvas from "./components/Canvas";

function App() {
  const [playerX, setPlayerX] = useState("");
  const [playerO, setPlayerO] = useState("");
  const [turn, setTurn] = useState("");
  const [winner, setWinner] = useState("");
  const [client, setClient] = useState(null);
  const [grid, setGrid] = useState([[]]);
  const [playerID, setPlayerID] = useState(uuid());

  useEffect(() => {
    if (!client) {
      const client = new Client({
        brokerURL: "ws://localhost:8080/tic-tac-toe",
        onConnect: () => {
          client.subscribe("/app/game", (message) => {
            const body = JSON.parse(message.body);
            setPlayerX(body["playerX"]);
            setPlayerO(body["playerO"]);
            setGrid(body["grid"]);
            setTurn(body["turn"]);
            setWinner(body["winner"]);
          });
          client.subscribe("/topic/game", (message) => {
            const body = JSON.parse(message.body);
            setPlayerX(body["playerX"]);
            setPlayerO(body["playerO"]);
            setGrid(body["grid"]);
            setTurn(body["turn"]);
            setWinner(body["winner"]);
          });
        },
      });
      client.activate();
      setClient(client);
    }
  }, []);

  const select = (type) => {
    if (
      (playerO != null && type === "O") ||
      (playerX != null && type === "X")
    ) {
      return;
    }
    if (client) {
      if (client.connected) {
        client.publish({
          destination: "/app/select",
          body: JSON.stringify({
            player: playerID, // random color
            type: type,
          }),
        });
      }
    }
  };

  const mark = (x, y) => {
    if (client) {
      if (client.connected) {
        client.publish({
          destination: "/app/mark",
          body: JSON.stringify({
            player: playerID, // random color
            posX: x,
            posY: y,
          }),
        });
      }
    }
  };

  const reset = () => {
    if (client) {
      if (client.connected) {
        client.publish({
          destination: "/app/reset",
        });
      }
    }
  };

  const status = (player) => {
    if (winner != null) {
      if (winner === player) {
        return "??????????????????????????????";
      } else {
        return "??????????????????????????????";
      }
    } else {
      if (turn === player) {
        return "??????????????????????????????????????????";
      } else {
        return "?????????????????????????????? " + (player === "O" ? "X" : "O");
      }
    }
  };

  return (
    <div className="container">
      <div className="content">
        {playerO === null || playerX === null ? (
          <div className="select-xo">
            <div className="header">?????????????????????????????????????????????????????????????????????</div>
            <div className="full">
              <Button
                variant="dark"
                disabled={playerO !== null}
                onClick={() => select("O")}
              >
                O
              </Button>
              <Button
                variant="dark"
                disabled={playerX !== null}
                onClick={() => select("X")}
              >
                X
              </Button>
            </div>
          </div>
        ) : (
          <>
            {playerO === playerID && (
              <div className="header">????????????????????? O {status("O")}</div>
            )}
            {playerX === playerID && (
              <div className="header">????????????????????? X {status("X")}</div>
            )}
            {playerX !== playerID && playerO !== playerID && (
              <div className="header">
                ????????????????????????????????????????????????????????????????????? ???????????????????????????????????????????????????????????????????????????
              </div>
            )}
            <Canvas grid={grid} mark={mark}></Canvas>
            <Button variant="dark" onClick={() => reset()}>
              ???????????????????????????
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
