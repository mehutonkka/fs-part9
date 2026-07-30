import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises } from './exerciseCalculator.ts';
import { isNotNumber } from './utils.ts';

const app = express();

app.use(express.json());

const PORT = 3000;

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const { height, weight } = req.query;

    if (
        typeof height !== 'string' ||
        typeof weight !== 'string' ||
        isNotNumber(height) ||
        isNotNumber(weight)
    ) {
        return res.status(400).json({
            error: 'malformatted parameters',
        });
    }

    const heightNum = Number(height);
    const weightNum = Number(weight);

    const bmi = calculateBmi(heightNum, weightNum);

    return res.json({ weight: weightNum, height: heightNum, bmi });

});

app.post('/exercises', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { daily_exercises, target } = req.body;
    
    if (daily_exercises === undefined || target === undefined) {
        return res.status(400).json({
            error: 'parameters missing',
        });
    }

    if (!Array.isArray(daily_exercises) || isNotNumber(target)) {
        return res.status(400).json({
            error: 'malformatted parameters',
        });
    }

    const dailyExercisesNum = daily_exercises.map((exercise: unknown) => {
        if (isNotNumber(exercise)) {
            return NaN;
        }
        return Number(exercise);
    });

    if (dailyExercisesNum.some(Number.isNaN)) {
        return res.status(400).json({
            error: 'malformatted parameters',
        });
    }

    const targetNum = Number(target);

    const result = calculateExercises(dailyExercisesNum, targetNum);

    return res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


