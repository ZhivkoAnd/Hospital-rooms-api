const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3001;

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom routes for individual rooms and patients
server.get("/urology/room/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  const rooms = router.db.get("urology.rooms").find({ id: roomId }).value();
  res.json(rooms);
});

server.post("/urology/room/:roomId/patient", (req, res) => {
  const roomId = req.params.roomId;
  const newPatient = req.body;
  const rooms = router.db.get("urology.rooms").find({ id: roomId }).value();
  rooms.patients.push(newPatient);
  router.db.write();
  res.status(201).json(newPatient);
});

server.get("/urology/room/:roomId/patient/:patientId", (req, res) => {
  const roomId = req.params.roomId;
  const patientId = req.params.patientId;
  const rooms = router.db.get("urology.rooms").find({ id: roomId }).value();
  const patient = rooms.patients.find((patient) => patient.id === patientId);
  if (patient) {
    res.json(patient);
  } else {
    res.sendStatus(404);
  }
});

server.delete("/urology/room/:roomId/patient/:patientId", (req, res) => {
  const roomId = req.params.roomId;
  const patientId = req.params.patientId;
  const rooms = router.db.get("urology.rooms").find({ id: roomId }).value();
  const patientIndex = rooms.patients.findIndex(
    (patient) => patient.id === patientId
  );
  if (patientIndex !== -1) {
    rooms.patients.splice(patientIndex, 1);
    router.db.write();
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
