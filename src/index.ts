import WebSocket from "ws";

export default {
  register(/*{ strapi }*/) {},
  bootstrap({ strapi }) {
    const wss = new WebSocket.Server({ noServer: true });

    strapi.server.httpServer.on("upgrade", (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    });

    wss.on("connection", (socket) => {
      console.log("Client connected");

      socket.on("message", async (data) => {
        const { message } = JSON.parse(data);
        console.log("Got a message from client: " + message);
        try {
          console.log("Simply storing that message in database...");
          await strapi.entityService.create("api::message.message", {
            data: {
              text: message,
            },
          });
          console.log("Successfully stored message in database.");
        } catch (error) {
          console.error("Error storing message in database:", error.message);
        }
      });

      socket.on("close", () => {
        console.log("Client disconnected");
      });
    });
  },
};
