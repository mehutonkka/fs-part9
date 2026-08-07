import type { Diagnosis, Entry } from "../../types";
import { Divider } from "@mui/material";

interface Props {
    entry: Entry;
    diagnoses?: Diagnosis[];
}

const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

const healthRatingText = (rating: number): string => {
    switch (rating) {
        case 0:
            return "Healthy";
        case 1:
            return "Low Risk";
        case 2:
            return "High Risk";
        case 3:
            return "Critical Risk";
        default:
            return "Unknown";
    }
};

const EntryDetails = ({ entry, diagnoses }: Props) => {
    switch (entry.type) {
        case 'Hospital':
            return (
                <div>
                    <div>
                        {entry.date} Hospital
                    </div>

                    <div>
                        <i>{entry.description}</i>
                    </div>

                    {entry.discharge && (
                        <div>
                            Discharged on {entry.discharge.date} with criteria: {entry.discharge.criteria}
                        </div>
                    )}

                    {entry.diagnosisCodes && diagnoses && (
                        <ul>
                            {entry.diagnosisCodes.map((code) => {
                                const diagnosis = diagnoses.find((d) => d.code === code);
                                return (
                                    <li key={code}>
                                        {code} {diagnosis?.name}
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    <div>
                        diagnose by {entry.specialist}
                    </div>
                    <Divider sx={{ mt: 2 }} />
                </div>
            );

        case 'OccupationalHealthcare':
            return (
                <div>
                    <div>
                        {entry.date} Occupational Healthcare
                    </div>

                    <div>
                        <i>{entry.description}</i>
                    </div>

                    <div>
                        employer: {entry.employerName}
                    </div>

                    {entry.sickLeave && (
                        <div>
                            sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
                        </div>
                    )}
                    {entry.diagnosisCodes && diagnoses && (
                        <ul>
                            {entry.diagnosisCodes.map((code) => {
                                const diagnosis = diagnoses.find((d) => d.code === code);
                                return (
                                    <li key={code}>
                                        {code} {diagnosis?.name}
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    <div>
                        diagnose by {entry.specialist}
                    </div>
                    <Divider sx={{ mt: 2 }} />
                </div>
            );
        
        case 'HealthCheck':

            return (
                <div>
                    <div>
                        {entry.date} Health Check
                    </div>

                    <div>
                        <i>{entry.description}</i>
                    </div>  

                    <div>
                        Health Check Rating: {healthRatingText(entry.healthCheckRating)}
                    </div>
                    {entry.diagnosisCodes && diagnoses && (
                        <ul>
                            {entry.diagnosisCodes.map((code) => {
                                const diagnosis = diagnoses.find((d) => d.code === code);
                                return (
                                    <li key={code}>
                                        {code} {diagnosis?.name}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    <div>
                        diagnose by {entry.specialist}
                    </div>
                    <Divider sx={{ mt: 2 }} />
                </div>
                

            );
        
        default:
            return assertNever(entry);
    }
};

export default EntryDetails;