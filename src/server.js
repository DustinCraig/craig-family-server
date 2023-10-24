import dotenv from "dotenv";
dotenv.config();
import express from "express";
import twilio from "twilio";
import schedule from "node-schedule";
import { parseWeather, weatherToText } from "./lib/parse-weather.js";

const app = express();
const port = 4000;

const weatherApi = process.env.WEATHER_API;
const twilioAuth = process.env.TWILIO_AUTH;
const twilioSID = process.env.TWILIO_SID;
const twilioPN = process.env.TWILIO_PN;
const numberList = process.env.NUMBER_LIST;
const twilioClient = twilio(twilioSID, twilioAuth);

const sendReport = async () => {
  const weatherResponse = await fetch(
    `http://api.openweathermap.org/data/3.0/onecall?lat=${35.9606}&lon=${-83.926453}&appid=${weatherApi}&exclude=minutely,hourly&units=imperial`
  );
  const jokeResponse = await fetch("https://icanhazdadjoke.com/", {
    headers: {
      Accept: "application/json",
    },
  });
  const { joke } = await jokeResponse.json();
  const weather = await weatherResponse.json();
  const numbers = numberList.split(";");
  numbers.map((num) => {
    twilioClient.messages
      .create({
        from: twilioPN,
        to: num,
        body: `${weatherToText(parseWeather(weather))}\n${joke}`,
      })
      .then((_) => {
        console.log("message sent");
      })
      .catch((err) => {
        console.log("err ", err);
      });
  });
};

app.get("/healthcheck", async (req, res) => {
  res.send("OK");
});

app.get("/weather", async (req, res) => {
  try {
    await sendReport();
  } catch (err) {
    console.log("err ", err);
    res.status(500).send({
      err: "An error occurred while attempting to retrieve weather",
      success: false,
    });
  }
});

app.listen(port, () => {
  console.info(`App started on port: ${port}`);
});

schedule.scheduleJob("0 0 * * *", async () => {
  await sendReport();
});
