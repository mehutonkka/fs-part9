import { isNotNumber } from './utils.ts';

interface ExerciseResult {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

export const calculateExercises = (dailyExerciseHours: number[], target: number): ExerciseResult => {
    const periodLength = dailyExerciseHours.length;
    const trainingDays = dailyExerciseHours.filter(hours => hours > 0).length;

    const totalHours = dailyExerciseHours.reduce((sum, hours) => sum + hours, 0);
    const average = totalHours / periodLength;

    const success = average >= target;

    let rating: number;
    let ratingDescription: string;

    if (average < target * 0.5) {
        rating = 1;
        ratingDescription = 'work harder';
    } else if (average < target) {
        rating = 2;
        ratingDescription = 'not too bad but could be better';
    } else {
        rating = 3;
        ratingDescription = 'good job you reached your target';
    }

    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    };
};

const parseArguments = (args: string[]): { target: number, dailyExerciseHours: number[] } => {
    if (args.length < 4) throw new Error('Not enough arguments');
    
    const values = args.slice(2);

    if (values.some(isNotNumber)) {
        throw new Error('Provided values were not numbers!');
    }

    const target = Number(values[0]);

    const dailyExerciseHours = values.slice(1).map((value) => Number(value));

    if (target <= 0) {
        throw new Error('target must be a positive number');
    }

    if (dailyExerciseHours.some(hours => hours < 0)) {
        throw new Error('daily exercise hours must be 0 or positive numbers');
    }

    return {
        target,
        dailyExerciseHours
    };
};

if (process.argv[1] === import.meta.filename) {
    try {
        const { target, dailyExerciseHours } = parseArguments(process.argv);
        console.log(calculateExercises(dailyExerciseHours, target));
    } catch (error: unknown) {
      let errorMessage = 'Something bad happened.';
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
      }
      console.log(errorMessage);
    }
}
