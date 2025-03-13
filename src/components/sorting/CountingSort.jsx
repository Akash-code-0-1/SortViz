import React, { useState, useEffect } from 'react';
import './CountingSort.css';
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


    const sourceCode = {
        cpp: `
    #include <iostream>
    #include <vector>
    using namespace std;
    
    void countingSort(int array[], int n) {
        int maxElement = *max_element(array, array + n);
        vector<int> count(maxElement + 1, 0);
        vector<int> output(n);
    
        for (int i = 0; i < n; i++) {
            count[array[i]]++;
        }
    
        for (int i = 1; i <= maxElement; i++) {
            count[i] += count[i - 1];
        }
    
        for (int i = n - 1; i >= 0; i--) {
            output[count[array[i]] - 1] = array[i];
            count[array[i]]--;
        }
    
        for (int i = 0; i < n; i++) {
            array[i] = output[i];
        }
    }
    
    int main() {
        int n;
        cout << "Enter the array size: ";
        cin >> n;
        int array[n];
    
        cout << "Enter the array elements (non-negative integers): " << endl;
        for (int i = 0; i < n; i++) {
            cin >> array[i];
        }
    
        countingSort(array, n);
    
        cout << "Your Counting sorted Array is: " << endl;
        for (int i = 0; i < n; i++) {
            cout << array[i] << " ";
        }
        cout << endl;
    }
        `,
        java: `
    import java.util.Scanner;
    import java.util.Arrays;
    
    public class CountingSort {
        public static void countingSort(int[] array, int n) {
            int maxElement = Arrays.stream(array).max().getAsInt();
            int[] count = new int[maxElement + 1];
            int[] output = new int[n];
    
            for (int num : array) {
                count[num]++;
            }
    
            for (int i = 1; i <= maxElement; i++) {
                count[i] += count[i - 1];
            }
    
            for (int i = n - 1; i >= 0; i--) {
                output[count[array[i]] - 1] = array[i];
                count[array[i]]--;
            }
    
            System.arraycopy(output, 0, array, 0, n);
        }
    
        public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);
    
            System.out.print("Enter the array size: ");
            int n = scanner.nextInt();
            int[] array = new int[n];
    
            System.out.println("Enter the array elements (non-negative integers):");
            for (int i = 0; i < n; i++) {
                array[i] = scanner.nextInt();
            }
    
            countingSort(array, n);
    
            System.out.println("Your Counting sorted Array is:");
            for (int num : array) {
                System.out.print(num + " ");
            }
            System.out.println();
        }
    }
        `,
        python: `
    def counting_sort(array):
        max_element = max(array)
        count = [0] * (max_element + 1)
        output = [0] * len(array)
    
        for num in array:
            count[num] += 1
    
        for i in range(1, len(count)):
            count[i] += count[i - 1]
    
        for num in reversed(array):
            output[count[num] - 1] = num
            count[num] -= 1
    
        return output
    
    if __name__ == "__main__":
        n = int(input("Enter the array size: "))
        array = [int(input(f"Enter element {i + 1}: ")) for i in range(n)]
    
        sorted_array = counting_sort(array)
        print("Your Counting sorted Array is:")
        print(" ".join(map(str, sorted_array)))
        `,
        javaScript: `
    function countingSort(array) {
        const maxElement = Math.max(...array);
        const count = new Array(maxElement + 1).fill(0);
        const output = new Array(array.length);
    
        for (let num of array) {
            count[num]++;
        }
    
        for (let i = 1; i <= maxElement; i++) {
            count[i] += count[i - 1];
        }
    
        for (let i = array.length - 1; i >= 0; i--) {
            output[count[array[i]] - 1] = array[i];
            count[array[i]]--;
        }
    
        return output;
    }
    
    const array = [];
    const n = parseInt(prompt("Enter the array size: "));
    for (let i = 0; i < n; i++) {
        array.push(parseInt(prompt(\`Enter element \${i + 1}: \`)));
    }
    
    console.log("Your Counting sorted Array is:");
    console.log(countingSort(array));
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
        </div>
    );
}
