import express, {type Response, type Request, type NextFunction} from "express";
import patientService from "../services/patientService.ts";
import { type NewPatient, type Patient, type NonSensitivePatient, EntryWithoutIdSchema } from "../types.ts";
import { newPatientParser, errorMiddleware } from "../middleware.ts";

const router = express.Router();

export const newEntryParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    req.body = EntryWithoutIdSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
  const data = patientService.getNonSensitivePatients();
  res.send(data);
});

router.post("/", newPatientParser, (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);    
});

router.get("/:id", (req: Request<{ id: string }>, res: Response<Patient | { error: string }>) => {
    const patient = patientService.getPatients().find(p => p.id === req.params.id);
    if (patient) {
        res.json(patient);
    } else {
        res.status(404).json({ error: "invalid patient id" });
    }
});

router.post("/:id/entries", newEntryParser, (req: Request<{ id: string }>, res: Response) => {
    const patientId = req.params.id;

    const newEntry = EntryWithoutIdSchema.parse(req.body);

    const addedEntry = patientService.addEntry(patientId, newEntry);

    if (!addedEntry) {
        return res.status(404).json({ error: "invalid patient id" });
    }

    return res.json(addedEntry);
});

router.use(errorMiddleware);

export default router;