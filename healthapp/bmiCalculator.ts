import { isNotNumber } from './utils.ts';

export const calculateBmi = (height: number, weight: number): string => {
    const heightMeters = height / 100;
    const bmi = weight / (heightMeters * heightMeters);

    if (bmi < 16) {
        return 'Underweight (Severe thinness)';
    }

    if (bmi < 17) {
        return 'Underweight (Moderate thinness)';
    }

    if (bmi < 18.5) {
        return 'Underweight (Mild thinness)';
    }

    if (bmi < 25) {
        return 'Normal range';
    }

    if (bmi < 30) {
        return 'Overweight (Pre-obese)';
    }

    if (bmi < 35) {
        return 'Obese (Class I)';
    }
    
    if (bmi < 40) {
        return 'Obese (Class II)';
    }

    return 'Obese (Class III)';
};

const parseArguments = (args: string[]): { height: number, weight: number } => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (args.length > 4) throw new Error('Too many arguments');

    if (isNotNumber(args[2]) || isNotNumber(args[3])) {
        throw new Error('Provided values were not numbers!');
    }

    const height = Number(args[2]);
    const weight = Number(args[3]);

    if (height <= 0 || weight <= 0) {
        throw new Error('height and weight must be positive numbers');
    }

    return {
        height,
        weight
    };
};
if (process.argv[1] === import.meta.filename) {
    try {
        const { height, weight } = parseArguments(process.argv);
        console.log(calculateBmi(height, weight));
    } catch (error: unknown) {
      let errorMessage = 'Something bad happened.';
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
      }
      console.log(errorMessage);
    }
}

