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
        brokerURL: "ws://localhost/tic-tac-toe",
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
        return "คุณชนะแล้ว";
      } else {
        return "คุณแพ้แล้ว";
      }
    } else {
      if (turn === player) {
        return "ตอนนี้ตาของคุณ";
      } else {
        return "ตานี้ตาของ " + (player === "O" ? "X" : "O");
      }
    }
  };

  return (
    <div className="container">
      <div className="content">
        {playerO === null || playerX === null ? (
          <div className="select-xo">
            <div className="header">เลือกฝ่ายที่ต้องการเล่น</div>
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
              <div className="header">คุณเป็น O {status("O")}</div>
            )}
            {playerX === playerID && (
              <div className="header">คุณเป็น X {status("X")}</div>
            )}
            {playerX !== playerID && playerO !== playerID && (
              <div className="header">
                ตอนนี้มีคนกำลังเล่นอยู่ กดเริ่มใหม่ถ้าคุณอยากเล่น
              </div>
            )}
            <Canvas grid={grid} mark={mark}></Canvas>
            <Button variant="dark" onClick={() => reset()}>
              เริ่มใหม่
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
