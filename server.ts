import app from "./api";

const PORT = process.env.PORT !== undefined ? process.env.PORT : 88;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
