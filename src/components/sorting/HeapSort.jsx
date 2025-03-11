import React, { useState, useEffect } from 'react';
import './HeapSort.css';
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

export default function HeapSort({ numbers, speed, range }) {
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
        setSteps(heapSortSteps(initialArray));
    }, [numbers, range]);

    // Function to perform heap sort and generate steps
    const heapSortSteps = (arr) => {
        const steps = [];
        const n = arr.length;

        // Helper function to heapify
        const heapify = (array, n, i) => {
            let largest = i; // Initialize largest as root
            const left = 2 * i + 1; // left = 2*i + 1
            const right = 2 * i + 2; // right = 2*i + 2

            // If left child is larger than root
            if (left < n && array[left] > array[largest]) {
                largest = left;
            }

            // If right child is larger than largest so far
            if (right < n && array[right] > array[largest]) {
                largest = right;
            }

            // If largest is not root
            if (largest !== i) {
                [array[i], array[largest]] = [array[largest], array[i]]; // Swap

                // Record the current state of the array for visualization
                steps.push({ array: [...array], highlights: [i, largest] });

                // Recursively heapify the affected sub-tree
                heapify(array, n, largest);
            }
        };

        // Build a maxheap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }

        // One by one extract elements from heap
        for (let i = n - 1; i > 0; i--) {
            [arr[0], arr[i]] = [arr[i], arr[0]]; // Swap
            steps.push({ array: [...arr], highlights: [0, i] }); // Record the swap state
            heapify(arr, i, 0);
        }

        return steps;
    };

    // Explanation generator
    const generateExplanation = (step, currentStep, totalSteps) => {
        const stepDescription = `Step ${currentStep + 1} of ${totalSteps}: `;
        const currentState = `Current array state: [${step.array.join(', ')}].`;

        const highlightedIndices = step.highlights;
        if (highlightedIndices.length === 2) {
            const [index1, index2] = highlightedIndices;
            return `${stepDescription}Swapping elements at indices ${index1} and ${index2} (${step.array[index1]} and ${step.array[index2]}). ${currentState}`;
        }

        return `${stepDescription}${currentState}`;
    };

    // Function to move to the next step of the heap sort visualization
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
        setSteps(heapSortSteps(initialArray));
    };

    // Calculate dynamic width for each bar
    const barWidth = `${Math.min(100 / arr.length, 100 / 10)}%`;

    return (
        <div className="heap-sort-visualization">
            <h3>Heap Sort Visualization</h3>
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
