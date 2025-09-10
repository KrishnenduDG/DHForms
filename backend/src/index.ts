import { app } from "./app";
import { db, PORT } from "./configurations";

app.listen(PORT, async () => {
  try {
    const result = await db.execute(`SELECT NOW()`);
    console.log("Connected to DB Successfully!");
    console.log(`Server listening at http://localhost:${PORT}`);
  } catch (error) {
    console.log("Connection to DB Failed!");
    process.exit(1);
  }
});
