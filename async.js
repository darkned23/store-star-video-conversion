const async = require("async");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const FormData = require("form-data");
const fetch = require("node-fetch");
const colors = require("colors");
require("dotenv").config();

ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
ffmpeg.setFfprobePath(process.env.FFPROBE_PATH);

const tempVideoPath = path.join(__dirname, "temp/video-temp");
const tempAudioPath = path.join(__dirname, "temp/audio-temp");
const tempOutputVideoPath = path.join(__dirname, "temp/temp-video-finish");

function streamFusion(tempVideo, tempAudio, Output, clientID) {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(tempVideo)
      .input(tempAudio)
      .inputFormat("mp4")
      .inputFormat("mp3")
      .addOption("-r", "60")
      .audioCodec("aac") // Copia el códec de audio del archivo original
      .addOption("-shortest")
      .addOption("-vf", "scale=1080:720") // Finaliza la salida cuando la entrada más corta termina
      .toFormat("mp4")
      .save(Output)
      .on("end", () => {
        fs.unlinkSync(tempVideo);
        fs.unlinkSync(tempAudio);
        videoSender(Output, clientID);
        resolve("Exitoso");
      })
      .on("error", function (err, stdout, stderr) {
        console.error("Error al unir video y texto:", err);
        console.error("Salida de error de FFmpeg:", stderr);
        reject(err);
      });
  });
}

function videoSender(output, clientID) {
  const formData = new FormData();

  formData.append("file", fs.readFileSync(output), {
    filename: "video.mp4",
    contentType: "video/mp4",
  });

  formData.append("client_id", clientID);

  fetch(process.env.SERVER_URL, {
    method: "POST",
    body: formData,
    headers: {
      ...formData.getHeaders(),
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("Server response:", data);
      fs.unlinkSync(output);
    })
    .catch((error) => {
      console.error("Error sending video:", error);
    });
}

var ColaProcesamiento = async.queue(function (data, callback) {
  let tempVideo = `${tempVideoPath}-${data.clientID}.mp4`;
  let tempAudio = `${tempAudioPath}-${data.clientID}.mp3`;
  let outputVideo = `${tempOutputVideoPath}-${data.clientID}.mp4`;

  if (data.video == 0 || data.audio == 0) {
    console.log(`${colors.red(data.clientID)} ha enviado video o audio de 0 bytes`);
    callback();
    return;
  }
  require("fs").writeFileSync(tempVideo, data.video);
  require("fs").writeFileSync(tempAudio, data.audio);
  streamFusion(tempVideo, tempAudio, outputVideo, data.clientID).then(() => {
    console.log(`video del cliente ${data.clientID} procesado!`);
    callback();
  });
}, 3);

module.exports = ColaProcesamiento;
