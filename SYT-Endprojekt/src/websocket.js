import { WebSocketServer } from 'ws';

let wss;

export function initWebSocket(server) {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('Ein Client ist verbunden');

    // Warte bis die Verbindung offen ist
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({
        type: 'info',
        message: 'Willkommen beim Wetterdienst!'
      }));
    } else {
      ws.on('open', () => {
        ws.send(JSON.stringify({
          type: 'info',
          message: 'Willkommen beim Wetterdienst!'
        }));
      });
    }
  });
}


export function broadcastWarning(message) {
  if (!wss) return;
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ type: 'unwetterwarnung', message }));
    }
  });
}
