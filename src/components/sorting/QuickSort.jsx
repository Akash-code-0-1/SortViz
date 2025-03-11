import React, { useState, useEffect } from 'react';
import './QuickSort.css';
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

export default function QuickSort({ numbers, speed, range }) {
    const [arr, setArr] = useState([]);
    const [normalizedArr, setNormalizedArr] = useState([]);
    const [sorting, setSorting] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [pivotIndex, setPivotIndex] = useState(null);
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
        setPivotIndex(null);
        setExplanation("Press play to start the sorting process.");
        setSteps(quickSortSteps(initialArray));
    }, [numbers, range]);

    // Function to perform quick sort and generate steps
    const quickSortSteps = (arr) => {
        const steps = [];
        const quickSort = (array, low, high) => {
            if (low < high) {
                const pivotIdx = partition(array, low, high);
                steps.push({ array: [...array], pivot: pivotIdx });
                quickSort(array, low, pivotIdx - 1);
                quickSort(array, pivotIdx + 1, high);
            }
        };

        const partition = (array, low, high) => {
            const pivot = array[high]; // Choose the last element as pivot
            let i = low - 1;
            for (let j = low; j < high; j++) {
                if (array[j] <= pivot) {
                    i++;
                    [array[i], array[j]] = [array[j], array[i]]; // Swap if element is less than or equal to pivot
                }
            }
            [array[i + 1], array[high]] = [array[high], array[i + 1]]; // Place the pivot in the correct position
            return i + 1; // Return the index of the pivot
        };

        const arrayCopy = [...arr];
        quickSort(arrayCopy, 0, arrayCopy.length - 1);
        return steps;
    };

    // Function to move to the next step of the quick sort visualization
    const handleNextStep = () => {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            const newArr = step.array;
            setArr(newArr);
            setNormalizedArr(normalizeArray(newArr));
            setPivotIndex(step.pivot);
            setCurrentStep((prev) => prev + 1);

            // Explanation of the current step
            setExplanation(
                `Step ${currentStep + 1}: Pivot element at index ${step.pivot} is ${arr[step.pivot]}.\n` +
                `Current array state: [${newArr.join(', ')}].\n` +
                `Elements less than or equal to the pivot (${arr[step.pivot]}) are on the left, and those greater are on the right.`
            );

            // Stop sorting if we've reached the end
            if (currentStep + 1 >= steps.length) {
                setSorting(false);
                setIsPaused(true);
                setPivotIndex(null);
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
            setPivotIndex(step.pivot);
            setCurrentStep(previousStep);
            setExplanation(`Rewinding to step ${previousStep + 1}.`);
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
        setPivotIndex(null);
        setSteps(quickSortSteps(initialArray));
    };

    // Calculate dynamic width for each bar
    const barWidth = `${Math.min(100 / arr.length, 100 / 10)}%`;

    return (
        <div className="quick-sort-visualization">
            <h3>Quick Sort Visualization</h3>
            <div className="explanation">
                <p>{explanation}</p> {/* Use <pre> for preserving whitespace */}
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
                        className={`array-bar ${pivotIndex === index ? 'pivot' : ''}`}
                        style={{
                            height: `${value}%`,
                            width: barWidth,
                            backgroundColor: pivotIndex === index
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
