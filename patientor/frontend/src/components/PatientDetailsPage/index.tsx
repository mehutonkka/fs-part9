import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

import { Patient } from "../../types";

import patientService from "../../services/patients";


const PatientDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [patient, setPatient] = useState<Patient | null>(null);

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
              <h4>entries</h4>
                {patient.entries.length === 0 ? (
                    <p>no entries for {patient.name}</p>
                ) : (
                    <div>
                    {patient.entries.map((entry) => (
                        <p key={entry.id}>
                            <p>{entry.date}: <i>{entry.description}</i></p>
                            <ul>
                                {entry.diagnosisCodes?.map((code) => (
                                    <li key={code}>{code}</li>
                                ))}
                            </ul>
                        </p>
                    ))}
                    </div>
                )}
            </Box>
        </div>
  );
};

export default PatientDetailsPage;