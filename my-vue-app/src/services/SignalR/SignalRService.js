import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7244/notificationHub")
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Information)
  .build();

export async function startSignalR() {
  try {
    await connection.start();
    console.log("SignalR Connected.");
  } catch (err) {
    console.error("SignalR Connection Error:", err);
    setTimeout(startSignalR, 5000);
  }
}

export function onNotificationReceived(callback) {
  connection.on("ReceiveNotification", (message) => {
    callback(message);
  });
}

export default connection;
