import express from "express";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const VALID_ID = "suchy";

app.use((req, res, next) => {
  console.log(`[global] ${req.method} ${req.originalUrl}`);
  next();
});

app.param("id", (req, res, next, id) => {
  req.requestedId = String(id || "").toLowerCase();
  console.log(`[param] odebrane id: ${id}`);

  if (req.requestedId !== VALID_ID) {
    return res.status(403).send("403 Forbidden - nieprawidłowe nazwisko w URL.");
  }

  next();
});

const stepOne = (req, res, next) => {
  console.log("[middleware-1] etap 1");
  next();
};

const stepTwo = (req, res, next) => {
  console.log("[middleware-2] etap 2");
  next();
};

const finalHandler = (req, res) => {
  console.log("[handler] etap końcowy");
  res.send("Poprawna odpowiedź serwera dla użytkownika Suchy.");
};

app.get("/user/:id", stepOne, stepTwo, finalHandler);

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
  console.log("Przykład poprawny: /user/suchy");
  console.log("Przykład błędny: /user/inna-wartosc");
});
