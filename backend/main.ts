import express from "express";
import bodyParser from 'body-parser';

const app = express();
const port = 8080;
app.use(bodyParser.json());
app.post('/api/download', (req: Request, res: Response) => {
  const jsonData = req.body;
  res.json(jsonData);
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
