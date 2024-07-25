import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const githubtoken = process.env.GITHUB_TOKEN;

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

var answers = [];

app.get("/get", async (req, res) => {
  const key = req.query.key;
  const data = answers[key];
  const result = {
    data: data || null,
  };
  res.send(JSON.stringify(result));
});

app.get("/set", async (req, res) => {
  const key = req.query.key;
  const value = req.query.value;
  answers[key] = value;
  res.send(`setting ${key} - ${value}`);
});

app.get("/launch", async (req, res) => {
  const key = req.query.workflow;
  const callback_url = req.query.callback_url;
  const uuid = crypto.randomUUID();

  const url = `https://api.github.com/repos/xunhuang/remote_terminal/actions/workflows/${key}/dispatches`;
  const data = {
    ref: "master",
    inputs: {
      response_id: uuid,
      callback_url: callback_url,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${githubtoken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  try {
    const body = await response.json();
    console.log(body);
  } catch {
    console.log(`github body/error: ${response.body}`);
  }

  const result = {
    response_id: uuid,
  };

  res.send(JSON.stringify(result));
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});
