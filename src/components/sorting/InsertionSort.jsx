import React, { useState, useEffect } from 'react';
import './InsertionSort.css';
import './sortContent.css';
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


    const sourceCode = {
        cpp: `
    #include <iostream>
    using namespace std;
    
    void insertionSort(int array[], int n) {
        for (int i = 1; i < n; i++) {
            int key = array[i];
            int j = i - 1;
            while (j >= 0 && array[j] > key) {
                array[j + 1] = array[j];
                j--;
            }
            array[j + 1] = key;
        }
    }
    
    int main() {
        int n;
        cout << "Enter the array size: ";
        cin >> n;
        int array[n];
    
        cout << "Enter the array elements: " << endl;
        for (int i = 0; i < n; i++) {
            cin >> array[i];
        }
    
        insertionSort(array, n);
    
        cout << "Your Insertion sorted Array is: " << endl;
        for (int i = 0; i < n; i++) {
            cout << array[i] << endl;
        }
    }
        `,
        java: `
    import java.util.Scanner;
    
    public class InsertionSort {
        public static void insertionSort(int[] array, int n) {
            for (int i = 1; i < n; i++) {
                int key = array[i];
                int j = i - 1;
                while (j >= 0 && array[j] > key) {
                    array[j + 1] = array[j];
                    j--;
                }
                array[j + 1] = key;
            }
        }
    
        public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);
    
            System.out.print("Enter the array size: ");
            int n = scanner.nextInt();
            int[] array = new int[n];
    
            System.out.println("Enter the array elements:");
            for (int i = 0; i < n; i++) {
                array[i] = scanner.nextInt();
            }
    
            insertionSort(array, n);
    
            System.out.println("Your Insertion sorted Array is:");
            for (int i = 0; i < n; i++) {
                System.out.println(array[i]);
            }
        }
    }
        `,
        python: `
    def insertion_sort(array):
        n = len(array)
        for i in range(1, n):
            key = array[i]
            j = i - 1
            while j >= 0 and array[j] > key:
                array[j + 1] = array[j]
                j -= 1
            array[j + 1] = key
    
    if __name__ == "__main__":
        n = int(input("Enter the array size: "))
        array = [int(input(f"Enter element {i + 1}: ")) for i in range(n)]
    
        insertion_sort(array)
        print("Your Insertion sorted Array is:")
        print(array)
        `,
        javaScript: `
    function insertionSort(array) {
        const n = array.length;
        for (let i = 1; i < n; i++) {
            let key = array[i];
            let j = i - 1;
            while (j >= 0 && array[j] > key) {
                array[j + 1] = array[j];
                j--;
            }
            array[j + 1] = key;
        }
        return array;
    }
    
    const array = [];
    const n = parseInt(prompt("Enter the array size: "));
    for (let i = 0; i < n; i++) {
        array.push(parseInt(prompt(\`Enter element \${i + 1}: \`)));
    }
    
    console.log("Your Insertion sorted Array is:");
    console.log(insertionSort(array));
        `
    };
    const [activeTab, setActiveTab] = useState("cpp"); // Tracks the active tab
    const [copied, setCopied] = useState(false); // Tracks copy status

    // Copy code to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(sourceCode[activeTab].trim());
        setCopied(true);

        // Reset the "Copied" state after 5 seconds
        setTimeout(() => {
            setCopied(false);
        }, 5000);
    };


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
                        <p className='index'>{arr[index]}</p>

                    </div>
                ))}
            </div>

            <div className="source_code">
                {/* Tabs for language selection */}
                <div className="tabs">
                    <button
                        onClick={() => setActiveTab("cpp")}
                        style={{
                            backgroundColor: activeTab === "cpp" ? "rgb(51, 255, 11)" : "blue",
                            color: activeTab === "cpp" ? "black" : "white",
                            padding: "8px 16px",

                            cursor: "pointer",
                            marginRight: "5px"
                        }}
                    >
                        C++
                    </button>
                    <button
                        onClick={() => setActiveTab("java")}
                        style={{
                            backgroundColor: activeTab === "java" ? "rgb(51, 255, 11)" : "blue",
                            color: activeTab === "java" ? "black" : "white",
                            padding: "8px 16px",

                            cursor: "pointer",
                            marginRight: "5px"
                        }}
                    >
                        Java
                    </button>
                    <button
                        onClick={() => setActiveTab("python")}
                        style={{
                            backgroundColor: activeTab === "python" ? "rgb(51, 255, 11)" : "blue",
                            color: activeTab === "python" ? "black" : "white",
                            padding: "8px 16px",

                            cursor: "pointer",
                            marginRight: "5px"
                        }}
                    >
                        Python
                    </button>
                    <button
                        onClick={() => setActiveTab("javaScript")}
                        style={{
                            backgroundColor: activeTab === "javaScript" ? "rgb(51, 255, 11)" : "blue",
                            color: activeTab === "javaScript" ? "black" : "white",
                            padding: "8px 16px",

                            cursor: "pointer",
                            marginRight: "5px"
                        }}
                    >
                        JavaScript
                    </button>

                    <button
                        className={`copybutton ${copied ? "copied" : ""}`}
                        onClick={handleCopy}
                        style={{
                            backgroundColor: copied ? "rgb(51, 255, 11)" : "blue",
                            color: copied ? "black" : "white",
                            padding: "8px 16px",

                            cursor: "pointer"
                        }}
                    >
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>

                {/* Source code display */}
                <pre>
                    <code>{sourceCode[activeTab]}</code>
                </pre>


            </div>


            <div className="sorting-content">
                <h2>Insertion Sort Algorithm</h2>

                <h3>How it Works:</h3>
                <p>
                    Insertion Sort is a simple comparison-based sorting algorithm that builds the sorted list one element at a time.
                    It works by taking one element from the unsorted section and inserting it into its correct position in the sorted section.
                </p>
                <ol>
                    <li>Start with the second element (index 1) as the first element is already "sorted".</li>
                    <li>Compare it with the elements in the sorted section (left side) and shift larger elements to the right.</li>
                    <li>Insert the selected element into its correct position.</li>
                    <li>Repeat the process for all remaining elements.</li>
                    <li>Continue until the entire list is sorted.</li>
                </ol>

                <h3>Example Walkthrough:</h3>
                <p>
                    For a list [7, 4, 5, 2, 9]:
                </p>
                <ol>
                    <li>First pass (i = 1):
                        <ul>
                            <li>Compare 4 with 7</li>
                            <li>4 is smaller, so shift 7 to the right → [7, 7, 5, 2, 9]</li>
                            <li>Insert 4 at index 0 → [4, 7, 5, 2, 9]</li>
                        </ul>
                    </li>
                    <li>Second pass (i = 2):
                        <ul>
                            <li>Compare 5 with 7</li>
                            <li>5 is smaller, so shift 7 to the right → [4, 7, 7, 2, 9]</li>
                            <li>Compare 5 with 4 (no shift needed)</li>
                            <li>Insert 5 at index 1 → [4, 5, 7, 2, 9]</li>
                        </ul>
                    </li>
                    <li>Third pass (i = 3):
                        <ul>
                            <li>Compare 2 with 7, shift 7 → [4, 5, 7, 7, 9]</li>
                            <li>Compare 2 with 5, shift 5 → [4, 5, 5, 7, 9]</li>
                            <li>Compare 2 with 4, shift 4 → [4, 4, 5, 7, 9]</li>
                            <li>Insert 2 at index 0 → [2, 4, 5, 7, 9]</li>
                        </ul>
                    </li>
                    <li>Fourth pass (i = 4):
                        <ul>
                            <li>Compare 9 with 7 (no shift needed)</li>
                            <li>9 remains in place → [2, 4, 5, 7, 9]</li>
                        </ul>
                    </li>
                    <li>Final sorted list: [2, 4, 5, 7, 9]</li>
                </ol>

                <h3>Time Complexity:</h3>
                <ol>
                    <li>Best Case (already sorted): <b>O(n)</b></li>
                    <li>Average Case: <b>O(n²)</b></li>
                    <li>Worst Case (reverse sorted): <b>O(n²)</b></li>
                </ol>

                <h3>Advantages:</h3>
                <ol>
                    <li>Simple to understand and implement</li>
                    <li>Efficient for small or nearly sorted datasets</li>
                    <li>In-place sorting with minimal memory usage</li>
                </ol>

                <h3>Disadvantages:</h3>
                <ol>
                    <li>Inefficient on large lists due to O(n²) time complexity</li>
                    <li>More swaps and shifts compared to Selection Sort</li>
                </ol>
            </div>

        </div>
    );
}
