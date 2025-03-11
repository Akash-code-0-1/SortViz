import React, { useState, useEffect } from 'react';
import './InsertionSort.css';
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

export default function InsertionSort({ numbers, speed, range }) {
    const [arr, setArr] = useState([]);
    const [normalizedArr, setNormalizedArr] = useState([]);
    const [sorting, setSorting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [insertingIndex, setInsertingIndex] = useState(-1);
    const [swappingIndices, setSwappingIndices] = useState([]);
    const [explanation, setExplanation] = useState("");
    const [isPaused, setIsPaused] = useState(true);
    const [steps, setSteps] = useState([]);

    // Initialize array based on user input or random generation
    useEffect(() => {
        const initialArray = numbers.length ? [...numbers] : generateRandomArray(range, range);
        setArr(initialArray);
        setNormalizedArr(normalizeArray(initialArray));
        setCurrentStep(1);
        setSorting(false);
        setIsPaused(true);
        setInsertingIndex(-1);
        setSwappingIndices([]);
        setExplanation("Press play to start the sorting process.");
        setSteps([initialArray]);
    }, [numbers, range]);

    // Function to perform a single step of Insertion Sort
    const insertionSortStep = (arr, step) => {
        let tempArr = [...arr];
        let key = tempArr[step];
        let j = step - 1;

        // Find the correct position for the current element
        while (j >= 0 && tempArr[j] > key) {
            tempArr[j + 1] = tempArr[j]; // Move larger elements one step to the right
            j--;
        }
        tempArr[j + 1] = key; // Insert the element in its correct position

        setSwappingIndices([step, j + 1]);
        return tempArr;
    };

    // Move to the next step of the sorting
    const handleNextStep = () => {
        if (currentStep < arr.length) {
            const newArr = insertionSortStep(arr, currentStep);
            setArr(newArr);
            setNormalizedArr(normalizeArray(newArr));
            setSteps((prevSteps) => [...prevSteps, newArr]); // Save the new array state in the steps
            setCurrentStep((prev) => prev + 1);

            const key = arr[currentStep];
            const insertionIndex = swappingIndices.length > 0 ? swappingIndices[1] : currentStep;

            if (swappingIndices.length > 0) {
                setExplanation(
                    `Step ${currentStep + 1}: Comparing element ${key} with element ${arr[swappingIndices[0]]} at index ${swappingIndices[0]}. Moving ${arr[swappingIndices[0]]} one position to the right to make space for ${key}.`
                );
            } else {
                setExplanation(
                    `Step ${currentStep + 1}: Element ${key} is in its correct position. Inserted at index ${insertionIndex}.`
                );
            }

            // Stop sorting if we've reached the end
            if (currentStep >= newArr.length - 1) {
                setSorting(false);
                setIsPaused(true);
                setSwappingIndices([]);
                setExplanation("Sorting complete! All elements are now in order.");
            }
        }
    };

    // Effect to handle automatic visualization
    useEffect(() => {
        if (sorting && !isPaused && currentStep < arr.length) {
            const delay = speed >= 0 ? Math.max(500 / (speed + 1), 50) : Math.abs(speed) * 400;

            const intervalId = setInterval(() => {
                handleNextStep();
            }, delay);

            return () => clearInterval(intervalId);
        }
    }, [sorting, isPaused, arr, currentStep, speed]);

    // Move to the previous step
    const handlePreviousStep = () => {
        if (currentStep > 1) {
            const prevStepIndex = currentStep - 2; // Access previous step
            setCurrentStep(prevStepIndex + 1); // Update current step to be the previous step (1-based)
            setArr(steps[prevStepIndex]); // Restore the previous step from the steps array
            setNormalizedArr(normalizeArray(steps[prevStepIndex]));
            setExplanation(`Rewinding to step ${prevStepIndex + 1}.`);
            setSwappingIndices([]); // Reset swapping indices
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
        setCurrentStep(1);
        const initialArray = numbers.length ? [...numbers] : generateRandomArray(range, range);
        setArr(initialArray);
        setNormalizedArr(normalizeArray(initialArray));
        setExplanation("Sorting reset. Press play to start again.");
        setInsertingIndex(-1);
        setSwappingIndices([]);
        setSteps([initialArray]); // Reset the steps
    };

    // Calculate dynamic width for each bar
    const barWidth = `${Math.min(100 / arr.length, 100 / 10)}%`;

    return (
        <div className="insertion-sort-visualization">
            <h3>Insertion Sort Visualization</h3>
            <div className="explanation">
                <p>{explanation}</p>
            </div>
            <div className="user_controls">
                <button onClick={handlePreviousStep} disabled={currentStep === 1}>
                    <ArrowBackIosIcon />
                </button>
                <button onClick={handlePlayPause}>
                    {isPaused ? <PlayCircleOutlineIcon /> : <PauseIcon />}
                </button>
                <button onClick={handleNextStep} disabled={currentStep >= arr.length}>
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
                        className={`array-bar ${swappingIndices.includes(index) ? 'swapping' :
                            index < currentStep ? 'sorted' : ''
                            }`}
                        style={{
                            height: `${value}%`,
                            width: barWidth,
                            backgroundColor: swappingIndices.includes(index)
                                ? 'red'
                                : index < currentStep
                                    ? 'green'
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
