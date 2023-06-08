const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3001;

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === "POST" && req.originalUrl === "/patients") {
    // Generate a unique ID for the new patient
    req.body.id = Date.now().toString();
  }
  next();
});

// Custom route for getting a specific patient
server.get("/patients/:patientId", (req, res) => {
  const patientId = req.params.patientId;
  const patients = router.db
    .get("urology")
    .flatMap((urology) => urology.patients)
    .value();
  const patient = patients.find((patient) => patient.id === patientId);

  if (patient) {
    res.json(patient);
  } else {
    res.status(404).json({ error: "Patient not found" });
  }
});

// Custom route for adding a new patient
server.post("/patients", (req, res) => {
  const patient = req.body;
  router.db
    .get("urology")
    .find({ id: patient.urologyId })
    .get("patients")
    .push(patient)
    .write();

  res.status(201).json(patient);
});

// Custom route for deleting a patient
server.delete("/patients/:patientId", (req, res) => {
  const patientId = req.params.patientId;
  const patients = router.db
    .get("urology")
    .flatMap((urology) => urology.patients)
    .value();
  const index = patients.findIndex((patient) => patient.id === patientId);

  if (index !== -1) {
    router.db
      .get("urology")
      .flatMap((urology) => urology.patients)
      .splice(index, 1)
      .write();
    res.status(200).json({ message: "Patient deleted" });
  } else {
    res.status(404).json({ error: "Patient not found" });
  }
});

server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
