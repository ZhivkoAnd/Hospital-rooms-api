const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3001;

server.use(middlewares);
server.use(jsonServer.bodyParser); // Add this line to parse request body as JSON
server.use(router);

// Dynamic route handler for delete and put operations on patients
server.use("/urology/:urologyId/patients/:patientId", (req, res) => {
  const { urologyId, patientId } = req.params;
  const updatedPatient = req.body;

  // Find the urology entry in the JSON data
  const urology = router.db
    .get("urology")
    .find({ id: urologyId }) // Compare id as string
    .value();

  if (urology) {
    // Find the patient in the patients array
    const patient = urology.patients.find(
      (patient) => patient.id === patientId // Compare id as string
    );

    if (patient) {
      if (req.method === "DELETE") {
        // Delete the patient from the patients array
        urology.patients = urology.patients.filter(
          (patient) => patient.id !== patientId // Compare id as string
        );

        // Return a success status
        res.sendStatus(204);
      } else if (req.method === "PUT") {
        // Update the patient's data
        Object.assign(patient, updatedPatient);

        // Return the updated patient
        res.json(patient);
      }
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
