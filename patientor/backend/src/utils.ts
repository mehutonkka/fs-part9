import { type NewPatient, Gender } from "./types.ts";

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const parseString = (string: unknown, fieldName: string): string => {
    if (!isString(string)) {
        throw new Error(`Incorrect or missing ${fieldName}: ` + string);
    }
    return string;
};

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
    if (!isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date: ' + date);
    }
    return date;
};

const isGender = (param: string): param is Gender => {
    return (Object.values(Gender) as string[]).includes(param);
};

const parseGender = (gender: unknown): Gender => {
    if (!isString(gender) || !isGender(gender)) {
        throw new Error('Incorrect or missing gender: ' + gender);
    }
    return gender;
};

const parseNewPatient = (object: unknown): NewPatient => {
    if ( !object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }

    if (
        'name' in object &&
        'dateOfBirth' in object &&
        'ssn' in object &&
        'gender' in object &&
        'occupation' in object
    ) {
        const newPatient: NewPatient = {
            name: parseString(object.name, 'name'),
            dateOfBirth: parseDate(object.dateOfBirth),
            ssn: parseString(object.ssn, 'ssn'),
            gender: parseGender(object.gender),
            occupation: parseString(object.occupation, 'occupation')
        };

        return newPatient;
    }

    throw new Error('Incorrect data: some fields are missing');
};



export default parseNewPatient;