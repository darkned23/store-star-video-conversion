const { performance } = require("perf_hooks");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const colors = require("colors");
require("dotenv").config();

const ColaProcesamiento = require("./async");

const app = express();

const port = process.env.APP_PORT;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // Max File Size 50 mb
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para manejar la carga de video
app.post(
  "/upload-endpoint",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  (req, res) => {
    // Verifica si se ha enviado un archivos
    if (!req.files || req.body.client_id === undefined) {
      return res.send({ error: "NO video, audio or Client ID uploaded" });
    }

    ColaProcesamiento.push({
      clientID: req.body.client_id,
      video: req.files["file"][0].buffer,
      audio: req.files["audio"][0].buffer,
    });
    res.status(200).json({ mensaje: "Operación en cola para procesar." });
  }
);

// Inicia el servidor
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
