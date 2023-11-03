const express = require("express");
const cors = require('cors');
const mqtt = require('mqtt')
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const host = 'mqtt://broker.hivemq.com:1883'

const topic = 'Estação Meteorologica'

const client = mqtt.connect(host)

client.on('connect', () => {
  console.log('connected')

  client.subscribe(topic)
})

let mqttMessage = 'Dados'

client.on('message', async (topic, message) => {
  // Converte o buffer de bytes em uma string
  const messageString = message.toString();
  console.log('MQTT Received Topic:', topic, 'Message:', messageString);
  mqttMessage = messageString
})

app.get("/", (req, res) => {
  if (mqttMessage) {
    try {
      const mqttMessageJson = JSON.parse(mqttMessage);
      res.json(mqttMessageJson);
    } catch (error) {
      res.status(500).json({ error: "Erro ao fazer o parsing da mensagem MQTT" });
    }
  } else {
    res.status(404).json({ message: "Nenhuma mensagem MQTT recebida ainda" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

