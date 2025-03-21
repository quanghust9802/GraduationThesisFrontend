import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5000/notificationHub")
  .configureLogging(signalR.LogLevel.Information)
  .build();

connection.on("ReceiveNotification", (message) => {
  console.log("New Notification:", message);
});

connection.start().catch(err => console.error(err));

export default connection;
