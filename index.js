const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router({
  urology: [
    {
      id: "1",
      patients: [
        {
          id: "1",
          name: "Ivan",
          notes: "hehe",
          medicine: "Sirop",
          research: "hello",
          consultations: "None",
          date: "12.05.2023",
        },
        {
          id: "2",
          name: "Petko",
          notes: "hehe",
          medicine: "Sirop",
          research: "hello",
          consultations: "None",
          date: "12.05.2023",
        },
        {
          id: "3",
          name: "Koko",
          notes: "hehe",
          medicine: "Sirop",
          research: "hello",
          consultations: "None",
          date: "12.05.2023",
        },
      ],
    },
    {
      id: "2",
      patients: [
        {
          id: "1",
          name: "Gega",
          notes: "hehe",
          medicine: "Sirop",
          research: "hello",
          consultations: "None",
          date: "12.05.2023",
        },
        {
          id: "2",
          name: "Stamat",
          notes: "hehe",
          medicine: "Sirop",
          research: "hello",
          consultations: "None",
          date: "12.05.2023",
        },
      ],
    },
  ],
});
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3001;

server.use(middlewares);
server.use(jsonServer.bodyParser); // Add this line to parse request body as JSON
server.use(router);

// Dynamic route handler for GET, DELETE, PUT operations on patients
server.use("/urology/:urologyId/patients/:patientId", (req, res) => {
  const { urologyId, patientId } = req.params;

  // Find the urology entry in the JSON data
  const urology = router.db.get("urology").find({ id: urologyId }).value();

  if (urology) {
    // Find the patient in the patients array
    const patient = urology.patients.find(
      (patient) => patient.id === patientId
    );

    if (patient) {
      if (req.method === "GET") {
        // Return the patient
        res.json(patient);
      } else if (req.method === "DELETE") {
        // Delete the patient from the patients array
        urology.patients = urology.patients.filter(
          (patient) => patient.id !== patientId
        );

        // Return a success status
        res.sendStatus(204);
      } else if (req.method === "PUT") {
        // Update the patient's data
        Object.assign(patient, req.body);

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
