import express, {type Response, type Request} from "express";
import patientService from "../services/patientService.ts";
import { type NewPatient, type Patient, type NonSensitivePatient } from "../types.ts";
import { newPatientParser, errorMiddleware } from "../middleware.ts";

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
  const data = patientService.getNonSensitivePatients();
  res.send(data);
});

router.post("/", newPatientParser, (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);    
});

router.use(errorMiddleware);

export default router;