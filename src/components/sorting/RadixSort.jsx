import React, { useState, useEffect } from 'react';
import './RadixSort.css';
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

// Radix Sort visualization component
export default function RadixSort({ numbers, speed, range }) {
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
        setSteps(radixSortSteps(initialArray));
    }, [numbers, range]);

    // Function to perform radix sort and generate steps
    const radixSortSteps = (arr) => {
        const steps = [];
        const getMax = (array) => Math.max(...array);

        // Counting sort function used as a subroutine
        const countingSort = (array, exp) => {
            const n = array.length;
            const output = new Array(n); // Output array
            const count = new Array(10).fill(0); // Initialize count array

            // Store count of occurrences
            for (let i = 0; i < n; i++) {
                const index = Math.floor(array[i] / exp) % 10;
                count[index]++;
            }

            // Change count[i] to be the position of this digit in output[]
            for (let i = 1; i < 10; i++) {
                count[i] += count[i - 1];
            }

            // Build the output array and capture each step
            for (let i = n - 1; i >= 0; i--) {
                const index = Math.floor(array[i] / exp) % 10;
                output[count[index] - 1] = array[i];
                count[index]--;

                // Capture the current state after placing each element
                steps.push({ array: [...output], highlights: [n - 1 - count[index]] });
            }

            // Copy the output array to arr[] so that arr[] now contains sorted numbers
            for (let i = 0; i < n; i++) {
                array[i] = output[i];
            }

            // Record the current state of the array for visualization
            steps.push({ array: [...array], highlights: [] });
        };

        // Main radix sort implementation
        const max = getMax(arr);
        for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
            countingSort(arr, exp);
        }

        return steps;
    };

    // Explanation generator
    const generateExplanation = (step, currentStep, totalSteps) => {
        const stepDescription = `Step ${currentStep + 1} of ${totalSteps}: `;
        const currentState = `Current array state: [${step.array.join(', ')}].`;

        return `${stepDescription}${currentState}`;
    };

    // Function to move to the next step of the radix sort visualization
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
        setSteps(radixSortSteps(initialArray));
    };

    // Calculate dynamic width for each bar
    const barWidth = `${Math.min(100 / arr.length, 100 / 10)}%`;

    const sourceCode = {
        cpp: `
    #include <iostream>
    #include <vector>
    #include <algorithm>
    using namespace std;
    
    void countingSortForRadix(int array[], int n, int exp) {
        int output[n];
        int count[10] = {0};
    
        for (int i = 0; i < n; i++) {
            count[(array[i] / exp) % 10]++;
        }
    
        for (int i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }
    
        for (int i = n - 1; i >= 0; i--) {
            output[count[(array[i] / exp) % 10] - 1] = array[i];
            count[(array[i] / exp) % 10]--;
        }
    
        for (int i = 0; i < n; i++) {
            array[i] = output[i];
        }
    }
    
    void radixSort(int array[], int n) {
        int maxElement = *max_element(array, array + n);
    
        for (int exp = 1; maxElement / exp > 0; exp *= 10) {
            countingSortForRadix(array, n, exp);
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
    
        radixSort(array, n);
    
        cout << "Your Radix sorted Array is: " << endl;
        for (int i = 0; i < n; i++) {
            cout << array[i] << " ";
        }
        cout << endl;
    }
        `,
        java: `
    import java.util.Scanner;
    import java.util.Arrays;
    
    public class RadixSort {
        public static void countingSortForRadix(int[] array, int n, int exp) {
            int[] output = new int[n];
            int[] count = new int[10];
    
            for (int i = 0; i < n; i++) {
                count[(array[i] / exp) % 10]++;
            }
    
            for (int i = 1; i < 10; i++) {
                count[i] += count[i - 1];
            }
    
            for (int i = n - 1; i >= 0; i--) {
                output[count[(array[i] / exp) % 10] - 1] = array[i];
                count[(array[i] / exp) % 10]--;
            }
    
            System.arraycopy(output, 0, array, 0, n);
        }
    
        public static void radixSort(int[] array, int n) {
            int maxElement = Arrays.stream(array).max().getAsInt();
    
            for (int exp = 1; maxElement / exp > 0; exp *= 10) {
                countingSortForRadix(array, n, exp);
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
    
            radixSort(array, n);
    
            System.out.println("Your Radix sorted Array is:");
            for (int num : array) {
                System.out.print(num + " ");
            }
            System.out.println();
        }
    }
        `,
        python: `
    def counting_sort_for_radix(array, exp):
        n = len(array)
        output = [0] * n
        count = [0] * 10
    
        for i in range(n):
            count[(array[i] // exp) % 10] += 1
    
        for i in range(1, 10):
            count[i] += count[i - 1]
    
        for i in range(n - 1, -1, -1):
            output[count[(array[i] // exp) % 10] - 1] = array[i]
            count[(array[i] // exp) % 10] -= 1
    
        for i in range(n):
            array[i] = output[i]
    
    def radix_sort(array):
        max_element = max(array)
    
        exp = 1
        while max_element // exp > 0:
            counting_sort_for_radix(array, exp)
            exp *= 10
    
    if __name__ == "__main__":
        n = int(input("Enter the array size: "))
        array = [int(input(f"Enter element {i + 1}: ")) for i in range(n)]
    
        radix_sort(array)
        print("Your Radix sorted Array is:")
        print(" ".join(map(str, array)))
        `,
        javaScript: `
    function countingSortForRadix(array, exp) {
        const n = array.length;
        const output = new Array(n);
        const count = new Array(10).fill(0);
    
        for (let i = 0; i < n; i++) {
            count[Math.floor(array[i] / exp) % 10]++;
        }
    
        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }
    
        for (let i = n - 1; i >= 0; i--) {
            output[count[Math.floor(array[i] / exp) % 10] - 1] = array[i];
            count[Math.floor(array[i] / exp) % 10]--;
        }
    
        for (let i = 0; i < n; i++) {
            array[i] = output[i];
        }
    }
    
    function radixSort(array) {
        const maxElement = Math.max(...array);
        let exp = 1;
    
        while (Math.floor(maxElement / exp) > 0) {
            countingSortForRadix(array, exp);
            exp *= 10;
        }
    }
    
    const array = [];
    const n = parseInt(prompt("Enter the array size: "));
    for (let i = 0; i < n; i++) {
        array.push(parseInt(prompt(\`Enter element \${i + 1}: \`)));
    }
    
    radixSort(array);
    console.log("Your Radix sorted Array is:");
    console.log(array);
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
        <div className="radix-sort-visualization">
            <h3>Radix Sort Visualization</h3>
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
                <h2>Radix Sort Algorithm</h2>

                <h3>How it Works:</h3>
                <p>
                    Radix Sort is a non-comparative sorting algorithm that sorts numbers digit by digit, starting from the least significant digit (LSD) to the most significant digit (MSD).
                    It uses a stable sub-sorting algorithm like Counting Sort to sort the numbers at each digit level.
                </p>
                <ol>
                    <li>Find the maximum number in the array to determine the number of digits.</li>
                    <li>Sort the numbers based on each digit, starting from the least significant digit.</li>
                    <li>Use Counting Sort as a stable sorting algorithm for each digit place.</li>
                    <li>Repeat the process for the next significant digit until all digits are sorted.</li>
                </ol>

                <h3>Example Walkthrough:</h3>
                <p>
                    For a list [170, 45, 75, 90, 802, 24, 2, 66]:
                </p>
                <ol>
                    <li>Find max element: <b>802</b> (3 digits, so we sort by 1s, 10s, and 100s places)</li>

                    <li>Sorting by the least significant digit (1s place):
                        <ul>
                            <li>Bucket for 0: [170, 90]</li>
                            <li>Bucket for 2: [802, 2]</li>
                            <li>Bucket for 4: [24]</li>
                            <li>Bucket for 5: [75, 45]</li>
                            <li>Bucket for 6: [66]</li>
                        </ul>
                        Sorted list: [802, 2, 24, 45, 75, 66, 170, 90]
                    </li>

                    <li>Sorting by the 10s place:
                        <ul>
                            <li>Bucket for 0: [2]</li>
                            <li>Bucket for 2: [802, 24]</li>
                            <li>Bucket for 4: [45]</li>
                            <li>Bucket for 6: [66]</li>
                            <li>Bucket for 7: [170, 75]</li>
                            <li>Bucket for 9: [90]</li>
                        </ul>
                        Sorted list: [2, 802, 24, 45, 66, 75, 170, 90]
                    </li>

                    <li>Sorting by the 100s place:
                        <ul>
                            <li>Bucket for 0: [2, 24, 45, 66, 75, 90]</li>
                            <li>Bucket for 1: [170]</li>
                            <li>Bucket for 8: [802]</li>
                        </ul>
                        Final sorted list: [2, 24, 45, 66, 75, 90, 170, 802]
                    </li>
                </ol>

                <h3>Time Complexity:</h3>
                <ol>
                    <li>Best Case: <b>O(nk)</b></li>
                    <li>Average Case: <b>O(nk)</b></li>
                    <li>Worst Case: <b>O(nk)</b></li>
                </ol>

                <h3>Advantages:</h3>
                <ol>
                    <li>Fast for numbers with a small range of digits</li>
                    <li>Stable sorting algorithm</li>
                    <li>Performs better than comparison-based sorting for large lists with small digits</li>
                </ol>

                <h3>Disadvantages:</h3>
                <ol>
                    <li>Not suitable for large-digit numbers</li>
                    <li>Requires extra space for bucket storage</li>
                    <li>Only works for numbers (or fixed-length strings)</li>
                </ol>
            </div>

        </div>
    );
}
