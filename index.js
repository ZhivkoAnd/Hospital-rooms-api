const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3001;

server.use(middlewares);
server.use(router);

// Custom route handler for the delete endpoint
server.delete("/urology/:urologyId/patients/:patientId", (req, res) => {
  const { urologyId, patientId } = req.params;

  // Find the urology entry in the JSON data
  const urology = router.db
    .get("urology")
    .find({ id: parseInt(urologyId) })
    .value();

  if (urology) {
    // Find the patient in the patients array
    const updatedPatients = urology.patients.filter(
      (patient) => patient.id !== parseInt(patientId)
    );

    // Update the patients array for the urology entry
    urology.patients = updatedPatients;

    // Return a success status
    res.sendStatus(204);
  } else {
    // Return a not found status if urology not found
    res.sendStatus(404);
  }
});

server.put("/urology/:urologyId/patients/:patientId", (req, res) => {
  const { urologyId, patientId } = req.params;
  const updatedPatient = req.body;

  // Find the urology entry in the JSON data
  const urology = router.db
    .get("urology")
    .find({ id: parseInt(urologyId) })
    .value();

  if (urology) {
    // Find the patient in the patients array
    const patient = urology.patients.find(
      (patient) => patient.id === parseInt(patientId)
    );

    if (patient) {
      // Update the patient's data
      Object.assign(patient, updatedPatient);

      // Return the updated patient
      res.json(patient);
    } else {
      // Return a not found status if patient not found
      res.sendStatus(404);
    }
  } else {
    // Return a not found status if urology not found
    res.sendStatus(404);
  }
});

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
