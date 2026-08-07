import patients from "../../data/patients.ts";
import type { NonSensitivePatient, Patient, NewPatient, Entry, EntryWithoutId } from "../types.ts";
import { v1 as uuid } from 'uuid';


const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatient): Patient => {
    const newPatient = {
        id: uuid(),
        entries: [],
        ...entry
    };
    patients.push(newPatient);
    return newPatient;
};

const addEntry = (patientId: string, entry: EntryWithoutId): Entry | undefined => {
    const patient = patients.find(p => p.id === patientId);

    if (!patient) {
        return undefined;
    }

    const newEntry = {
        id: uuid(),
        ...entry
    };

    patient.entries.push(newEntry);
    return newEntry;
};


export default {
    getPatients,
    getNonSensitivePatients,
    addPatient,
    addEntry
};
