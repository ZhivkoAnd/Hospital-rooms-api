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
  const room = router.db.get("urology.room").find({ id: roomId }).value();
  res.json(room);
});

server.post("/urology/room/:roomId/patient", (req, res) => {
  const roomId = req.params.roomId;
  const newPatient = req.body;
  const room = router.db.get("urology.room").find({ id: roomId }).value();
  room.patients.push(newPatient);
  router.db.write();
  res.status(201).json(newPatient);
});

server.get("/urology/room/:roomId/patient/:patientId", (req, res) => {
  const roomId = req.params.roomId;
  const patientId = req.params.patientId;
  const room = router.db.get("urology.room").find({ id: roomId }).value();
  const patient = room.patients.find((patient) => patient.id === patientId);
  if (patient) {
    res.json(patient);
  } else {
    res.sendStatus(404);
  }
});

server.delete("/urology/room/:roomId/patient/:patientId", (req, res) => {
  const roomId = req.params.roomId;
  const patientId = req.params.patientId;
  const room = router.db.get("urology.room").find({ id: roomId }).value();
  const patientIndex = room.patients.findIndex(
    (patient) => patient.id === patientId
  );
  if (patientIndex !== -1) {
    room.patients.splice(patientIndex, 1);
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
