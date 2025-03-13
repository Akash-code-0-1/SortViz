import React, { useState, useEffect } from 'react';
import './BucketSort.css';
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

// Bucket Sort visualization component
export default function BucketSort({ numbers, speed, range }) {
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
        setSteps(bucketSortSteps(initialArray));
    }, [numbers, range]);

    const bucketSortSteps = (arr) => {
        const steps = [];
        const n = arr.length;
        const numBuckets = Math.floor(Math.sqrt(n)); // Create approximately √n buckets

        // Initialize buckets as empty arrays
        const buckets = Array.from({ length: numBuckets }, () => []);

        // Step 1: Place array elements into different buckets
        const max = Math.max(...arr);
        for (let i = 0; i < n; i++) {
            // Ensure bucketIndex stays within bounds
            const bucketIndex = Math.min(Math.floor((arr[i] / max) * numBuckets), numBuckets - 1);
            buckets[bucketIndex].push(arr[i]);

            // Capture the state of placing elements into buckets
            steps.push({ array: [...arr], highlights: [i], explanation: `Placed ${arr[i]} into bucket ${bucketIndex + 1}` });
        }

        // Step 2: Sort individual buckets and visualize the sorting of each bucket
        for (let i = 0; i < numBuckets; i++) {
            buckets[i].sort((a, b) => a - b);

            // Capture the state after sorting the bucket
            steps.push({ array: [...arr], highlights: [], explanation: `Sorted bucket ${i + 1}` });
        }

        // Step 3: Concatenate all buckets into the main array
        let index = 0;
        for (let i = 0; i < numBuckets; i++) {
            for (let j = 0; j < buckets[i].length; j++) {
                arr[index] = buckets[i][j];

                // Capture the state after concatenating each element
                steps.push({ array: [...arr], highlights: [index], explanation: `Moved ${buckets[i][j]} from bucket ${i + 1} to main array` });
                index++;
            }
        }

        return steps;
    };



    // Explanation generator
    const generateExplanation = (step, currentStep, totalSteps) => {
        const stepDescription = `Step ${currentStep + 1} of ${totalSteps}: `;
        const currentState = `Current array state: [${step.array.join(', ')}].`;

        return `${stepDescription}${step.explanation || ''} ${currentState}`;
    };

    // Function to move to the next step of the bucket sort visualization
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
        setSteps(bucketSortSteps(initialArray));
    };

    // Calculate dynamic width for each bar
    const barWidth = `${Math.min(100 / arr.length, 100 / 10)}%`;

    // Source code for different languages
    const sourceCode = {
        cpp: `
    #include <iostream>
    #include <vector>
    #include <algorithm>
    using namespace std;
    
    void bucketSort(float array[], int n) {
        vector<float> buckets[n];
    
        for (int i = 0; i < n; i++) {
            int index = n * array[i];
            buckets[index].push_back(array[i]);
        }
    
        for (int i = 0; i < n; i++) {
            sort(buckets[i].begin(), buckets[i].end());
        }
    
        int index = 0;
        for (int i = 0; i < n; i++) {
            for (float num : buckets[i]) {
                array[index++] = num;
            }
        }
    }
    
    int main() {
        int n;
        cout << "Enter the array size: ";
        cin >> n;
        float array[n];
    
        cout << "Enter the array elements (between 0 and 1): " << endl;
        for (int i = 0; i < n; i++) {
            cin >> array[i];
        }
    
        bucketSort(array, n);
    
        cout << "Your Bucket sorted Array is: " << endl;
        for (int i = 0; i < n; i++) {
            cout << array[i] << endl;
        }
    }
        `,
        java: `
    import java.util.ArrayList;
    import java.util.Collections;
    import java.util.Scanner;
    
    public class BucketSort {
        public static void bucketSort(float[] array, int n) {
            ArrayList<Float>[] buckets = new ArrayList[n];
            
            for (int i = 0; i < n; i++) {
                buckets[i] = new ArrayList<>();
            }
    
            for (float num : array) {
                int index = (int) (n * num);
                buckets[index].add(num);
            }
    
            for (ArrayList<Float> bucket : buckets) {
                Collections.sort(bucket);
            }
    
            int index = 0;
            for (ArrayList<Float> bucket : buckets) {
                for (float num : bucket) {
                    array[index++] = num;
                }
            }
        }
    
        public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);
    
            System.out.print("Enter the array size: ");
            int n = scanner.nextInt();
            float[] array = new float[n];
    
            System.out.println("Enter the array elements (between 0 and 1):");
            for (int i = 0; i < n; i++) {
                array[i] = scanner.nextFloat();
            }
    
            bucketSort(array, n);
    
            System.out.println("Your Bucket sorted Array is:");
            for (float num : array) {
                System.out.println(num);
            }
        }
    }
        `,
        python: `
    import math
    
    def bucket_sort(array):
        n = len(array)
        buckets = [[] for _ in range(n)]
    
        for num in array:
            index = math.floor(n * num)
            buckets[index].append(num)
    
        for bucket in buckets:
            bucket.sort()
    
        sorted_array = [num for bucket in buckets for num in bucket]
        return sorted_array
    
    if __name__ == "__main__":
        n = int(input("Enter the array size: "))
        array = [float(input(f"Enter element {i + 1} (between 0 and 1): ")) for i in range(n)]
    
        sorted_array = bucket_sort(array)
        print("Your Bucket sorted Array is:")
        print(sorted_array)
        `,
        javaScript: `
    function bucketSort(array) {
        const n = array.length;
        const buckets = Array.from({ length: n }, () => []);
    
        for (let num of array) {
            let index = Math.floor(n * num);
            buckets[index].push(num);
        }
    
        for (let bucket of buckets) {
            bucket.sort((a, b) => a - b);
        }
    
        return buckets.flat();
    }
    
    const array = [];
    const n = parseInt(prompt("Enter the array size: "));
    for (let i = 0; i < n; i++) {
        array.push(parseFloat(prompt(\`Enter element \${i + 1} (between 0 and 1): \`)));
    }
    
    console.log("Your Bucket sorted Array is:");
    console.log(bucketSort(array));
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
        <div className="bucket-sort-visualization">
            <h3>Bucket Sort Visualization</h3>
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
                <h2>Bucket Sort Algorithm</h2>

                <h3>How it Works:</h3>
                <p>
                    Bucket Sort is a comparison-based sorting algorithm that works by distributing the elements of the list into several "buckets."
                    Each bucket is then sorted individually, either using another sorting algorithm or by recursively applying Bucket Sort.
                    The sorted buckets are then combined to form the sorted list.
                </p>
                <ol>
                    <li>Divide the elements into different buckets based on their range.</li>
                    <li>Sort each bucket individually.</li>
                    <li>Concatenate the sorted buckets to form the final sorted list.</li>
                </ol>

                <h3>Example Walkthrough:</h3>
                <p>
                    For a list [0.23, 0.56, 0.12, 0.43, 0.87]:
                </p>
                <ol>
                    <li>Step 1: Divide the list into 5 buckets based on ranges (0.0 to 0.2, 0.2 to 0.4, 0.4 to 0.6, etc.).</li>
                    <li>Bucket 1: [0.12], Bucket 2: [0.23], Bucket 3: [0.43], Bucket 4: [0.56], Bucket 5: [0.87]</li>
                    <li>Step 2: Sort each bucket (since each bucket has only one element, they're already sorted).</li>
                    <li>Step 3: Concatenate the sorted buckets:
                        <ul>
                            <li>Final sorted list: [0.12, 0.23, 0.43, 0.56, 0.87]</li>
                        </ul>
                    </li>
                </ol>

                <h3>Time Complexity:</h3>
                <ol>
                    <li>Best Case: <b>O(n + k)</b> (where n is the number of elements and k is the number of buckets)</li>
                    <li>Average Case: <b>O(n + k)</b></li>
                    <li>Worst Case: <b>O(n²)</b> (if all elements end up in a single bucket)</li>
                </ol>

                <h3>Advantages:</h3>
                <ol>
                    <li>Works well when input is uniformly distributed over a range.</li>
                    <li>Can be very efficient when the number of buckets is small and the data is well distributed.</li>
                </ol>

                <h3>Disadvantages:</h3>
                <ol>
                    <li>Not suitable for data that is not uniformly distributed.</li>
                    <li>Requires additional memory for buckets.</li>
                    <li>In the worst case, can degrade to O(n²) if all elements fall into the same bucket.</li>
                </ol>
            </div>



        </div>
    );
}
