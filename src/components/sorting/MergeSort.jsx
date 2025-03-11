import React, { useState, useEffect } from 'react';
import './MergeSort.css';
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

export default function MergeSort({ numbers, speed, range }) {
    const [arr, setArr] = useState([]);
    const [normalizedArr, setNormalizedArr] = useState([]);
    const [sorting, setSorting] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [mergedIndices, setMergedIndices] = useState([]);
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
        setMergedIndices([]);
        setExplanation("Press play to start the sorting process.");
        setSteps(mergeSortSteps(initialArray));
    }, [numbers, range]);

    // Function to perform merge sort and generate steps
    const mergeSortSteps = (arr) => {
        const steps = [];
        const mergeSort = (array, left, right) => {
            if (left < right) {
                const mid = Math.floor((left + right) / 2);
                mergeSort(array, left, mid);
                mergeSort(array, mid + 1, right);
                merge(array, left, mid, right);
            }
        };

        const merge = (array, left, mid, right) => {
            let i = left;
            let j = mid + 1;
            const tempArray = [];
            const mergingIndices = [];

            while (i <= mid && j <= right) {
                mergingIndices.push(i, j);
                if (array[i] <= array[j]) {
                    tempArray.push(array[i]);
                    i++;
                } else {
                    tempArray.push(array[j]);
                    j++;
                }
            }

            while (i <= mid) {
                mergingIndices.push(i);
                tempArray.push(array[i]);
                i++;
            }

            while (j <= right) {
                mergingIndices.push(j);
                tempArray.push(array[j]);
                j++;
            }

            for (let k = 0; k < tempArray.length; k++) {
                array[left + k] = tempArray[k];
            }

            steps.push({ array: [...array], mergingIndices: [...mergingIndices] });
        };

        const arrayCopy = [...arr];
        mergeSort(arrayCopy, 0, arrayCopy.length - 1);
        return steps;
    };

    // Function to move to the next step of the merge sort visualization
    const handleNextStep = () => {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            const newArr = step.array;
            setArr(newArr);
            setNormalizedArr(normalizeArray(newArr));
            setMergedIndices(step.mergingIndices || []);
            setCurrentStep((prev) => prev + 1);
            
            setExplanation(
                `Step ${currentStep + 1}: Merging elements at indices ${step.mergingIndices.join(
                    ', '
                )}.`
            );

            // Stop sorting if we've reached the end
            if (currentStep + 1 >= steps.length) {
                setSorting(false);
                setIsPaused(true);
                setMergedIndices([]);
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
            setMergedIndices(step.mergingIndices || []);
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
        setMergedIndices([]);
        setSteps(mergeSortSteps(initialArray));
    };

    // Calculate dynamic width for each bar
    const barWidth = `${Math.min(100 / arr.length, 100 / 10)}%`;

    return (
        <div className="merge-sort-visualization">
            <h3>Merge Sort Visualization</h3>
            <div className="explanation">
                <p>{explanation}</p>
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
                        className={`array-bar ${mergedIndices.includes(index) ? 'merged' : ''}`}
                        style={{
                            height: `${value}%`,
                            width: barWidth,
                            backgroundColor: mergedIndices.includes(index)
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
