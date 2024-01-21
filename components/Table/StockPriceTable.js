import React, { useState, useRef } from "react";
import CollapsibleTable from "./CollapsibleTable";
import Button from "@mui/material/Button";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import "../../style.css";

const SOCKET_URL =
  "http://localhost:8083/price-engine-service/websocket/price-feed";

function StockPriceTable() {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const stompClient = useRef();

  const onMessageReceived = (msg) => {
    console.log("New Message Received!!", msg);
    setMessages(messages.concat(msg));
  };

  const connect = () => {
    var headers = { token: "123" };
    var socket = new SockJS(SOCKET_URL);
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect(headers, connectCallback, () => {
      console.log("error");
    });
    console.log(stompClient.current);
  };

  const connectCallback = (frame) => {
    console.log("connected 1");
    var url = stompClient.current.ws._transport.url;
    console.log("printing url");
    console.log("Your current full url is : " + url);
    url = url.replace(/^ws.*price-feed\//, "");
    url = url.replace("/websocket", "");
    url = url.replace(/^[0-9]+\//, "");
    console.log("Your current session is: " + url);
    var sessionId = url;

    console.log("Connected: " + frame);
    console.log("connected, session id: " + sessionId);
    stompClient.current.subscribe(
      "/secured/user/topic/price-feed-user" + sessionId,
      function (message) {
        onMessageReceived(message);
      }
    );
    console.log("subscribed 2");
  };

  const disconnect = () => {
    if (stompClient.current !== null) {
      stompClient.current.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
  };

  const handleSocketConnect = () => {
    var headers = { token: "123" };
    var socket = new SockJS(SOCKET_URL);
    console.log("socket created");
    stompClient = Stomp.over(socket);
    console.log("socket over");
    console.log("socket set");
    stompClient.connect(headers, connectCallback, () => {
      console.error("Sorry, I cannot connect to the server right now.");
    });
    console.log("socket set done");
  };

  const handleSocketDisconnect = () => {
    if (stompClient !== null) {
      console.log("sessionId " + sessionId);
      console.log("Disconnected 11");
      stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
  };

  const [columnNames, setColumnNames] = useState([
    "Stock Name",
    "Quantity",
    "Avg Price Per Share",
    "Total Cost",
    "Current Price",
    "Market Value",
    "Today Changes",
    "Today Change Percentage",
    "Total Gain/Loss",
    "Total Gain/Loss Percentage",
  ]);
  const listOfMessages = messages.map((msg) => <div>msg</div>);

  return (
    <div className="stock-price-table">
      <div className="stock-price-table-header">
        <h1>Price Feed</h1>
        <div className="socket-control">
          <Button
            variant="contained"
            color="secondary"
            className="socket-enable"
            onClick={connect}
          >
            Connect
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className="socket-disable"
            onClick={disconnect}
          >
            Disconnect
          </Button>
        </div>
      </div>
      <div>{listOfMessages}</div>
      {/* <CollapsibleTable columnNames={columnNames}></CollapsibleTable> */}
    </div>
  );
}

export default StockPriceTable;
