import React, { useState, useEffect } from 'react';
import './MergeSort.css';
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


    const sourceCode = {
        cpp: `
    #include <iostream>
    using namespace std;
    
    void merge(int array[], int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;
        
        int leftArray[n1], rightArray[n2];
        
        for (int i = 0; i < n1; i++)
            leftArray[i] = array[left + i];
        
        for (int j = 0; j < n2; j++)
            rightArray[j] = array[mid + 1 + j];
        
        int i = 0, j = 0, k = left;
        
        while (i < n1 && j < n2) {
            if (leftArray[i] <= rightArray[j]) {
                array[k] = leftArray[i];
                i++;
            } else {
                array[k] = rightArray[j];
                j++;
            }
            k++;
        }
        
        while (i < n1) {
            array[k] = leftArray[i];
            i++;
            k++;
        }
        
        while (j < n2) {
            array[k] = rightArray[j];
            j++;
            k++;
        }
    }
    
    void mergeSort(int array[], int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            
            mergeSort(array, left, mid);
            mergeSort(array, mid + 1, right);
            
            merge(array, left, mid, right);
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
        
        mergeSort(array, 0, n - 1);
        
        cout << "Your Merge sorted Array is: " << endl;
        for (int i = 0; i < n; i++) {
            cout << array[i] << " ";
        }
        cout << endl;
    }
        `,
        java: `
    import java.util.Scanner;
    
    public class MergeSort {
        public static void merge(int[] array, int left, int mid, int right) {
            int n1 = mid - left + 1;
            int n2 = right - mid;
            
            int[] leftArray = new int[n1];
            int[] rightArray = new int[n2];
            
            System.arraycopy(array, left, leftArray, 0, n1);
            System.arraycopy(array, mid + 1, rightArray, 0, n2);
            
            int i = 0, j = 0, k = left;
            
            while (i < n1 && j < n2) {
                if (leftArray[i] <= rightArray[j]) {
                    array[k] = leftArray[i];
                    i++;
                } else {
                    array[k] = rightArray[j];
                    j++;
                }
                k++;
            }
            
            while (i < n1) {
                array[k] = leftArray[i];
                i++;
                k++;
            }
            
            while (j < n2) {
                array[k] = rightArray[j];
                j++;
                k++;
            }
        }
        
        public static void mergeSort(int[] array, int left, int right) {
            if (left < right) {
                int mid = left + (right - left) / 2;
                
                mergeSort(array, left, mid);
                mergeSort(array, mid + 1, right);
                
                merge(array, left, mid, right);
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
            
            mergeSort(array, 0, n - 1);
            
            System.out.println("Your Merge sorted Array is:");
            for (int num : array) {
                System.out.print(num + " ");
            }
            System.out.println();
        }
    }
        `,
        python: `
    def merge(array, left, mid, right):
        n1 = mid - left + 1
        n2 = right - mid
        
        left_array = array[left:mid + 1]
        right_array = array[mid + 1:right + 1]
        
        i = 0
        j = 0
        k = left
        
        while i < n1 and j < n2:
            if left_array[i] <= right_array[j]:
                array[k] = left_array[i]
                i += 1
            else:
                array[k] = right_array[j]
                j += 1
            k += 1
        
        while i < n1:
            array[k] = left_array[i]
            i += 1
            k += 1
        
        while j < n2:
            array[k] = right_array[j]
            j += 1
            k += 1
    
    def merge_sort(array, left, right):
        if left < right:
            mid = left + (right - left) // 2
            
            merge_sort(array, left, mid)
            merge_sort(array, mid + 1, right)
            
            merge(array, left, mid, right)
    
    if __name__ == "__main__":
        n = int(input("Enter the array size: "))
        array = [int(input(f"Enter element {i + 1}: ")) for i in range(n)]
        
        merge_sort(array, 0, n - 1)
        print("Your Merge sorted Array is:")
        print(" ".join(map(str, array)))
        `,
        javaScript: `
    function merge(array, left, mid, right) {
        const n1 = mid - left + 1;
        const n2 = right - mid;
        
        const leftArray = array.slice(left, mid + 1);
        const rightArray = array.slice(mid + 1, right + 1);
        
        let i = 0, j = 0, k = left;
        
        while (i < n1 && j < n2) {
            if (leftArray[i] <= rightArray[j]) {
                array[k] = leftArray[i];
                i++;
            } else {
                array[k] = rightArray[j];
                j++;
            }
            k++;
        }
        
        while (i < n1) {
            array[k] = leftArray[i];
            i++;
            k++;
        }
        
        while (j < n2) {
            array[k] = rightArray[j];
            j++;
            k++;
        }
    }
    
    function mergeSort(array, left, right) {
        if (left < right) {
            const mid = left + Math.floor((right - left) / 2);
            
            mergeSort(array, left, mid);
            mergeSort(array, mid + 1, right);
            
            merge(array, left, mid, right);
        }
    }
    
    const array = [];
    const n = parseInt(prompt("Enter the array size: "));
    for (let i = 0; i < n; i++) {
        array.push(parseInt(prompt(\`Enter element \${i + 1}: \`)));
    }
    
    mergeSort(array, 0, n - 1);
    console.log("Your Merge sorted Array is:");
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
