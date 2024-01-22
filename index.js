import { config } from "dotenv";
import { createApp, finishApp } from "./app.js";

(async () => {
  config({ path: '.env' });

  const app = createApp();
  const port = 8000;

  app.get('/health-check', (req, res) => {
    res.send("App is healthy !");
  });

  finishApp(app);

  try {
    app.listen(port, () => {
      console.log(`Yes, the app is up and running at ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
})();