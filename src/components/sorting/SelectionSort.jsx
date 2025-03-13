import React, { useState, useEffect } from 'react';
import './SelectionSort.css';
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

export default function SelectionSort({ numbers, speed, range }) {
    const [arr, setArr] = useState([]);
    const [normalizedArr, setNormalizedArr] = useState([]);
    const [sorting, setSorting] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [minIndex, setMinIndex] = useState(-1);
    const [swappingIndices, setSwappingIndices] = useState([]);
    const [explanation, setExplanation] = useState("");
    const [isPaused, setIsPaused] = useState(true);

    // Initialize array based on user input or random generation
    useEffect(() => {
        const initialArray = numbers.length ? [...numbers] : generateRandomArray(range, range);
        setArr(initialArray);
        setNormalizedArr(normalizeArray(initialArray));
        setCurrentStep(0);
        setSorting(false);
        setIsPaused(true);
        setMinIndex(-1);
        setSwappingIndices([]);
        setExplanation("Press play to start the sorting process.");
    }, [numbers, range]);

    // Automatically start sorting when the sort button is clicked
    useEffect(() => {
        if (sorting && currentStep < arr.length - 1) {
            setIsPaused(false);
        }
    }, [sorting]);

    // Function to perform a single step of Selection Sort
    const selectionSortStep = (arr, step) => {
        let minIdx = step;
        for (let i = step + 1; i < arr.length; i++) {
            if (arr[i] < arr[minIdx]) {
                minIdx = i;
            }
        }
        if (minIdx !== step) {
            [arr[step], arr[minIdx]] = [arr[minIdx], arr[step]];
            setSwappingIndices([step, minIdx]);
        } else {
            setSwappingIndices([]);
        }
        return minIdx;
    };

    // Effect to handle sorting process
    useEffect(() => {
        if (sorting && !isPaused && currentStep < arr.length - 1) {
            const delay = speed >= 0 ? Math.max(500 / (speed + 1), 50) : Math.abs(speed) * 400;

            const intervalId = setInterval(() => {
                handleNextStep();
            }, delay);

            return () => clearInterval(intervalId);
        }
    }, [sorting, isPaused, arr, currentStep, speed]);

    // Move to the next step of the sorting
    const handleNextStep = () => {
        const newArr = [...arr];
        const newMinIndex = selectionSortStep(newArr, currentStep);
        setArr(newArr);
        setNormalizedArr(normalizeArray(newArr));
        setMinIndex(newMinIndex);

        // Update explanation based on current step
        if (newMinIndex === currentStep) {
            setExplanation(
                `Step ${currentStep + 1}: Element at index ${currentStep} is already the smallest in the unsorted section.`
            );
        } else {
            setExplanation(
                `Step ${currentStep + 1}: Swapping element at index ${currentStep} (${newArr[newMinIndex]}) with the smallest element found (${newArr[currentStep]}).`
            );
        }

        setCurrentStep((prev) => prev + 1);

        if (currentStep >= newArr.length - 1) {
            setSorting(false);
            setIsPaused(true);
            setSwappingIndices([]);
            setExplanation("Sorting complete! All elements are now in order.");
        }
    };

    // Move to the previous step
    const handlePreviousStep = () => {
        if (currentStep > 0) {
            const newStep = currentStep - 1;
            const newArr = [...arr];
            // Recreate the array up to the previous step to simulate the previous state
            for (let step = 0; step < newStep; step++) {
                selectionSortStep(newArr, step);
            }
            setArr(newArr);
            setNormalizedArr(normalizeArray(newArr));
            setCurrentStep(newStep);
            setExplanation(`Rewinding to step ${newStep + 1}.`);
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
        setMinIndex(-1);
        setSwappingIndices([]);
    };

    // Calculate dynamic width for each bar
    const barWidth = `${Math.min(100 / arr.length, 100 / 10)}%`;

    // Source code for different languages
    const [activeTab, setActiveTab] = useState("cpp"); // Tracks the active tab
    const [copied, setCopied] = useState(false); // Tracks copy status
    const sourceCode = {
        cpp: `
            #include <iostream>
            using namespace std;
          
            void swap(int array[], int i, int j) {
                int temp = array[i];
                array[i] = array[j];
                array[j] = temp;
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
          
                for (int i = 0; i < n - 1; i++) {
                    int minIndex = i;
                    for (int j = i + 1; j < n; j++) {
                        if (array[j] < array[minIndex]) {
                            minIndex = j;
                        }
                    }
                    if (minIndex != i) {
                        swap(array, i, minIndex);
                    }
                }
          
                cout << "Your Selection sorted Array is: " << endl;
                for (int i = 0; i < n; i++) {
                    cout << array[i] << endl;
                }
            }
            `,
        java: `
            import java.util.Scanner;
          
            public class SelectionSort {
                public static void swap(int[] array, int i, int j) {
                    int temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
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
          
                    for (int i = 0; i < n - 1; i++) {
                        int minIndex = i;
                        for (int j = i + 1; j < n; j++) {
                            if (array[j] < array[minIndex]) {
                                minIndex = j;
                            }
                        }
                        if (minIndex != i) {
                            swap(array, i, minIndex);
                        }
                    }
          
                    System.out.println("Your Selection sorted Array is:");
                    for (int i = 0; i < n; i++) {
                        System.out.println(array[i]);
                    }
                }
            }
            `,
        python: `
            def selection_sort(array):
                n = len(array)
                for i in range(n - 1):
                    min_index = i
                    for j in range(i + 1, n):
                        if array[j] < array[min_index]:
                            min_index = j
                    if min_index != i:
                        array[i], array[min_index] = array[min_index], array[i]
          
            if __name__ == "__main__":
                n = int(input("Enter the array size: "))
                array = [int(input(f"Enter element {i + 1}: ")) for i in range(n)]
          
                selection_sort(array)
                print("Your Selection sorted Array is:")
                print(array)
            `,
        javaScript: `
            function selectionSort(array) {
                const n = array.length;
                for (let i = 0; i < n - 1; i++) {
                    let minIndex = i;
                    for (let j = i + 1; j < n; j++) {
                        if (array[j] < array[minIndex]) {
                            minIndex = j;
                        }
                    }
                    if (minIndex !== i) {
                        [array[i], array[minIndex]] = [array[minIndex], array[i]];
                    }
                }
                return array;
            }
          
            const array = [];
            const n = parseInt(prompt("Enter the array size: "));
            for (let i = 0; i < n; i++) {
                array.push(parseInt(prompt(\`Enter element \${i + 1}: \`)));
            }
          
            console.log("Your Selection sorted Array is:");
            console.log(selectionSort(array));
            `
    };


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
        <div className="selection-sort-visualization">
            <h3>Selection Sort Visualization</h3>
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
                <button onClick={handleNextStep} disabled={currentStep >= arr.length - 1}>
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
                            index === minIndex ? 'min' :
                                index < currentStep ? 'sorted' : ''
                            }`}
                        style={{
                            height: `${value}%`,
                            width: barWidth,
                            backgroundColor: swappingIndices.includes(index)
                                ? 'red'
                                : index === minIndex
                                    ? 'orange'
                                    : index < currentStep
                                        ? 'green'
                                        : 'blue',
                        }}
                    >
                        <p>{arr[index]}</p>
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
                <h2>Selection Sort Algorithm</h2>

                <h3>How it Works:</h3>
                <p>
                    Selection Sort is a simple comparison-based sorting algorithm. It works by dividing the list into two parts: a sorted and an unsorted section.
                    The algorithm repeatedly selects the smallest element from the unsorted section and places it at the end of the sorted section.
                </p>
                <ol>
                    <li>Start at the beginning of the list.</li>
                    <li>Find the smallest element in the unsorted section.</li>
                    <li>Swap it with the first element of the unsorted section.</li>
                    <li>Repeat the process for the next position.</li>
                    <li>Continue until the entire list is sorted.</li>
                </ol>

                <h3>Example Walkthrough:</h3>
                <p>
                    For a list [5, 3, 8, 4, 2]:
                </p>
                <ol>
                    <li>First pass (i = 0):
                        <ul>
                            <li>Find the smallest element in [5, 3, 8, 4, 2]</li>
                            <li>Minimum value is 2 at index 4</li>
                            <li>Swap 5 and 2 → [2, 3, 8, 4, 5]</li>
                        </ul>
                    </li>
                    <li>Second pass (i = 1):
                        <ul>
                            <li>Find the smallest element in [3, 8, 4, 5]</li>
                            <li>Minimum value is 3 at index 1</li>
                            <li>No swap needed → [2, 3, 8, 4, 5]</li>
                        </ul>
                    </li>
                    <li>Third pass (i = 2):
                        <ul>
                            <li>Find the smallest element in [8, 4, 5]</li>
                            <li>Minimum value is 4 at index 3</li>
                            <li>Swap 8 and 4 → [2, 3, 4, 8, 5]</li>
                        </ul>
                    </li>
                    <li>Fourth pass (i = 3):
                        <ul>
                            <li>Find the smallest element in [8, 5]</li>
                            <li>Minimum value is 5 at index 4</li>
                            <li>Swap 8 and 5 → [2, 3, 4, 5, 8]</li>
                        </ul>
                    </li>
                    <li>Final sorted list: [2, 3, 4, 5, 8]</li>
                </ol>


                <h3>Time Complexity:</h3>
                <ol>
                    <li>Best Case: <b>O(n²)</b></li>
                    <li>Average Case: <b>O(n²)</b></li>
                    <li>Worst Case: <b>O(n²)</b></li>
                </ol>

                <h3>Advantages:</h3>
                <ol>
                    <li>Simple to understand and implement</li>
                    <li>In-place sorting with minimal memory usage</li>
                </ol>

                <h3>Disadvantages:</h3>
                <ol>
                    <li>Inefficient on large lists due to O(n²) time complexity</li>
                    <li>Not adaptive to the initial order of the elements</li>
                </ol>
            </div>


        </div>
    );
}
