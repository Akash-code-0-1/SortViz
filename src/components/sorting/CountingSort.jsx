import React, { useState, useEffect } from 'react';
import './CountingSort.css';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseIcon from '@mui/icons-material/Pause';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ReplayIcon from '@mui/icons-material/Replay';

// Helper function to generate random numbers
const generateRandomArray = (range, length) => {
    const randomArray = [];
    for (let i = 0; i < length; i++) {
        randomArray.push(Math.floor(Math.random() * range) + 1);
    }
    return randomArray;
};

// Helper function to normalize array values to a given range (1-100)
const normalizeArray = (array) => {
    const maxValue = Math.max(...array);
    if (maxValue === 0) return array;
    return array.map((value) => (value / maxValue) * 100);
};

// Counting Sort visualization component
export default function CountingSort({ numbers, speed, range }) {
    const [arr, setArr] = useState([]);
    const [normalizedArr, setNormalizedArr] = useState([]);
    const [sorting, setSorting] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [highlightIndices, setHighlightIndices] = useState([]);
    const [explanation, setExplanation] = useState("");
    const [isPaused, setIsPaused] = useState(true);
    const [steps, setSteps] = useState([]);

    // Initialize array based on user input or random generation
    useEffect(() => {
        const initialArray = numbers.length ? [...numbers] : generateRandomArray(range, range);
        setArr(initialArray);
        setNormalizedArr(normalizeArray(initialArray));
        setCurrentStep(0);
        setSorting(false);
        setIsPaused(true);
        setHighlightIndices([]);
        setExplanation("Press play to start the sorting process.");
        setSteps(countingSortSteps(initialArray));
    }, [numbers, range]);

    // Function to perform counting sort and generate steps
    const countingSortSteps = (arr) => {
        const steps = [];
        const max = Math.max(...arr);
        const n = arr.length;

        // Initialize count array
        const count = new Array(max + 1).fill(0);
        const output = new Array(n);

        // Step 1: Store count of each number
        for (let i = 0; i < n; i++) {
            count[arr[i]]++;
            steps.push({
                array: [...arr],
                highlights: [i],
                explanation: `Counting occurrences of ${arr[i]}.`
            });
        }

        // Step 2: Modify count array to get actual positions of numbers
        for (let i = 1; i <= max; i++) {
            count[i] += count[i - 1];
            steps.push({
                array: [...arr],
                highlights: [],
                explanation: `Cumulative count at ${i}: ${count[i]}`
            });
        }

        // Step 3: Build output array
        for (let i = n - 1; i >= 0; i--) {
            output[count[arr[i]] - 1] = arr[i];
            count[arr[i]]--;
            steps.push({
                array: [...output],
                highlights: [count[arr[i]]],
                explanation: `Placing ${arr[i]} at position ${count[arr[i]] + 1}.`
            });
        }

        // Step 4: Copy sorted array back to original array
        for (let i = 0; i < n; i++) {
            arr[i] = output[i];
            steps.push({
                array: [...arr],
                highlights: [i],
                explanation: `Copying ${output[i]} back to the array.`
            });
        }

        return steps;
    };

    // Explanation generator
    const generateExplanation = (step, currentStep, totalSteps) => {
        const stepDescription = `Step ${currentStep + 1} of ${totalSteps}: `;
        const currentState = `Current array state: [${step.array.join(', ')}].`;

        return `${stepDescription}${step.explanation || ''} ${currentState}`;
    };

    // Function to move to the next step of the counting sort visualization
    const handleNextStep = () => {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            setArr(step.array);
            setNormalizedArr(normalizeArray(step.array));
            setHighlightIndices(step.highlights);
            setCurrentStep((prev) => prev + 1);

            // Update explanation
            setExplanation(generateExplanation(step, currentStep, steps.length));

            // Stop sorting if we've reached the end
            if (currentStep + 1 >= steps.length) {
                setSorting(false);
                setIsPaused(true);
                setHighlightIndices([]);
                setExplanation("Sorting complete! All elements are now in order.");
            }
        }
    };

    // Effect to handle automatic visualization
    useEffect(() => {
        if (sorting && !isPaused && currentStep < steps.length) {
            const delay = speed >= 0 ? Math.max(500 / (speed + 1), 50) : Math.abs(speed) * 400;

            const intervalId = setInterval(() => {
                handleNextStep();
            }, delay);

            return () => clearInterval(intervalId);
        }
    }, [sorting, isPaused, steps, currentStep, speed]);

    // Move to the previous step
    const handlePreviousStep = () => {
        if (currentStep > 0) {
            const previousStep = currentStep - 1;
            const step = steps[previousStep];
            setArr(step.array);
            setNormalizedArr(normalizeArray(step.array));
            setHighlightIndices(step.highlights);
            setCurrentStep(previousStep);
            setExplanation(generateExplanation(step, previousStep, steps.length));
        }
    };

    // Start or pause the sorting
    const handlePlayPause = () => {
        setIsPaused(!isPaused);
        setSorting(true);
    };

    // Stop sorting and reset to the initial state
    const handleStop = () => {
        setIsPaused(true);
        setSorting(false);
        setCurrentStep(0);
        const initialArray = numbers.length ? [...numbers] : generateRandomArray(range, range);
        setArr(initialArray);
        setNormalizedArr(normalizeArray(initialArray));
        setExplanation("Sorting reset. Press play to start again.");
        setHighlightIndices([]);
        setSteps(countingSortSteps(initialArray));
    };

    // Calculate dynamic width for each bar
    const barWidth = `${Math.min(100 / arr.length, 100 / 10)}%`;

    return (
        <div className="counting-sort-visualization">
            <h3>Counting Sort Visualization</h3>
            <div className="explanation">
                <pre>{explanation}</pre>
            </div>
            <div className="user_controls">
                <button onClick={handlePreviousStep} disabled={currentStep === 0}>
                    <ArrowBackIosIcon />
                </button>
                <button onClick={handlePlayPause}>
                    {isPaused ? <PlayCircleOutlineIcon /> : <PauseIcon />}
                </button>
                <button onClick={handleNextStep} disabled={currentStep >= steps.length}>
                    <ArrowForwardIosIcon />
                </button>
                <button onClick={handleStop}>
                    <ReplayIcon />
                </button>
            </div>
            <div className="array-container">
                {normalizedArr.map((value, index) => (
                    <div
                        key={index}
                        className={`array-bar ${highlightIndices.includes(index) ? 'highlight' : ''}`}
                        style={{
                            height: `${value}%`,
                            width: barWidth,
                            backgroundColor: highlightIndices.includes(index)
                                ? 'red'
                                : 'blue',
                        }}
                    >
                        <p>{arr[index]}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
