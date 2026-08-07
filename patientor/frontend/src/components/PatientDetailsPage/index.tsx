import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Divider } from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import axios from "axios";
import { Patient, Diagnosis, HealthCheckRating, type HealthCheckRatingType, type EntryWithoutId } from "../../types";

import patientService from "../../services/patients";

import EntryDetails from '../EntryDetails';


interface Props {
    diagnoses: Diagnosis[];
}
interface ErrorResponse {
  error: {
    path: (string | number)[];
    message: string;
  }[];
}


const PatientDetailsPage = ({ diagnoses }: Props) => {
    const { id } = useParams<{ id: string }>();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [specialist, setSpecialist] = useState("");
    const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRatingType>(HealthCheckRating.Healthy);
    const [entryType, setEntryType] = useState<"HealthCheck" | "Hospital" | "OccupationalHealthcare">("HealthCheck");
    const [dischargeDate, setDischargeDate] = useState("");
    const [dischargeCriteria, setDischargeCriteria] = useState("");
    const [employerName, setEmployerName] = useState("");
    const [sickLeaveStartDate, setSickLeaveStartDate] = useState("");
    const [sickLeaveEndDate, setSickLeaveEndDate] = useState("");

    
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const submitNewEntry = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        if (!patient) {
            return;
        }

        let newEntry: EntryWithoutId;

        switch (entryType) {
            case "HealthCheck":
                newEntry = {
                    type: "HealthCheck",
                    description,
                    date,
                    specialist,
                    healthCheckRating
                };
                break;
            case "Hospital":
                newEntry = {
                    type: "Hospital",
                    description,
                    date,
                    specialist,
                    discharge: {
                        date: dischargeDate,
                        criteria: dischargeCriteria
                    }
                };
                break;
            case "OccupationalHealthcare":
                newEntry = {
                    type: "OccupationalHealthcare", 
                    description,
                    date,
                    specialist,
                    employerName,
                    sickLeave: {
                        startDate: sickLeaveStartDate,
                        endDate: sickLeaveEndDate
                    }
                };
                break;
        }

        try {
            const addedEntry = await patientService.addEntry(patient.id, newEntry);

            setPatient({
                ...patient,
                entries: [...patient.entries, addedEntry]
            });

            setDescription("");
            setDate("");
            setSpecialist("");
            setHealthCheckRating(HealthCheckRating.Healthy);
            setDischargeDate("");
            setDischargeCriteria("");
            setEmployerName("");
            setSickLeaveStartDate("");
            setSickLeaveEndDate("");
            setErrorMessage(null);
        } catch (error: unknown) {
            if (axios.isAxiosError<ErrorResponse>(error) && error.response) {
            const message = error.response.data.error
                .map((issue) => {
                const field = issue.path.join(".");
                return `${field}: ${issue.message}`;
                })
                .join(", ");
            
            setErrorMessage(message);
            } else {
            setErrorMessage("Unknown error");
            }
        }
    };

    useEffect(() => {
        if (!id) {
            return;
        }

        void patientService.getById(id).then((data) => {
            setPatient(data);
        });
    }, [id]);

    if (!id) {
        return <div>patient id missing</div>;
    }

    if (!patient) {
        return <div>loading...</div>;
    }

    return (
        <div className="App">
            <Box>
              <Typography
                align="left"
                variant="h6"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {patient.name}
            
                {patient.gender === 'female' ? (
                  <FemaleIcon sx={{ fontSize: '1em' }} />
                ) : patient.gender === 'male' ? (
                  <MaleIcon sx={{ fontSize: '1em' }} />
                ) : (
                  <span>(gender: {patient.gender})</span>
                )}
              </Typography>
            
              <p>ssn: {patient.ssn}</p>
              <p>occupation: {patient.occupation}</p>
              <h4>New Entry</h4>

              {errorMessage && (
                  <div style={{ color: "red" }}>
                  {errorMessage}
                  </div>
              )}
              
              <form onSubmit={submitNewEntry}>
                    <select value={entryType} onChange={(event) => setEntryType(
                          event.target.value as
                            | "HealthCheck"
                            | "Hospital"
                            | "OccupationalHealthcare"
                        )}>
                      <option value="HealthCheck">
                        Health Check
                      </option>
                      <option value="Hospital">
                        Hospital
                      </option>
                      <option value="OccupationalHealthcare">
                        Occupational Healthcare
                      </option>
                    </select>
                  <div>
                    date
                    <input value={date} onChange={(event) => setDate(event.target.value)} />
                  </div>

                  <div>
                    description
                    <input value={description} onChange={(event) => setDescription(event.target.value)} />
                  </div>
                  
                  <div>
                    specialist
                    <input value={specialist} onChange={(event) => setSpecialist(event.target.value)} />
                  </div>
                  
                  

                  {entryType === "Hospital" && (
                  <div>  
                    <div>
                      discharge date
                      <input value={dischargeDate} onChange={(event) => setDischargeDate(event.target.value)} />
                    </div>
                    <div>
                        discharge criteria
                        <input value={dischargeCriteria} onChange={(event) => setDischargeCriteria(event.target.value)} />
                    </div>
                  </div>
                  )}

                  {entryType === "OccupationalHealthcare" && (
                  <div>
                    <div>
                      employer name
                      <input value={employerName} onChange={(event) => setEmployerName(event.target.value)} />
                    </div>
                    <div>
                        sick leave start date
                        <input value={sickLeaveStartDate} onChange={(event) => setSickLeaveStartDate(event.target.value)} />
                    </div>
                    <div>
                        sick leave end date
                        <input value={sickLeaveEndDate} onChange={(event) => setSickLeaveEndDate(event.target.value)} />
                    </div>
                  </div>
                  )}

                  {entryType === "HealthCheck" && (
                    <div>
                        health check rating
                        <input value={healthCheckRating} onChange={(event) => setHealthCheckRating(Number(event.target.value) as HealthCheckRatingType)} />
                    </div>
                  )}
                  
                  <button type="submit">Add</button>
              </form>
              <h4>entries</h4>
              <Divider sx={{ mt: 2 }} />
                {patient.entries.length === 0 ? (
                    <p>no entries for {patient.name}</p>
                ) : (
                    <div>
                    {patient.entries.map((entry) => (
                        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
                    ))}
                    </div>
                )}
            </Box>
        </div>
  );
};

export default PatientDetailsPage;