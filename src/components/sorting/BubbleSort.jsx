import React, { useState, useEffect } from 'react';
import './BubbleSort.css';
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

export default function BubbleSort({ numbers, speed, range }) {
    const [arr, setArr] = useState([]);
    const [normalizedArr, setNormalizedArr] = useState([]);
    const [sorting, setSorting] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [iteration, setIteration] = useState(0);
    const [history, setHistory] = useState([]);
    const [explanation, setExplanation] = useState("");
    const [isPaused, setIsPaused] = useState(true);
    const [currentIndices, setCurrentIndices] = useState([]);
    const [swappedIndices, setSwappedIndices] = useState([]);

    // Initialize array based on user input or random generation
    useEffect(() => {
        const initialArray = numbers.length ? [...numbers] : generateRandomArray(range, range);
        setArr(initialArray);
        setNormalizedArr(normalizeArray(initialArray));
        setHistory([initialArray]);
        setCurrentStep(0);
        setIteration(0);
        setSorting(false);
        setIsPaused(true);
        setCurrentIndices([]);
        setSwappedIndices([]);
    }, [numbers, range]);

    // Automatically start sorting when the sort button is clicked
    useEffect(() => {
        if (sorting && iteration < arr.length - 1) {
            setIsPaused(false);
        }
    }, [sorting]);

    // Function to perform a single step of Bubble Sort
    const bubbleSortStep = (arr, iteration, index) => {
        let swapped = false;

        if (index < arr.length - iteration - 1) {
            if (arr[index] > arr[index + 1]) {
                [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
                swapped = true;
            }

            setCurrentIndices([index, index + 1]);
            if (swapped) {
                setSwappedIndices([index, index + 1]);
                setExplanation(`Swapped elements at index ${index} and ${index + 1}: ${arr[index]} and ${arr[index + 1]}`);
            } else {
                setSwappedIndices([]);
                setExplanation(`Compared elements at index ${index} and ${index + 1}: No swap needed.`);
            }
        } else {
            setIteration((prev) => prev + 1);
            setCurrentStep(0);
            setExplanation(`Completed iteration ${iteration + 1}. Moving to the next iteration.`);
        }

        return swapped;
    };

    // Effect to handle sorting process
    useEffect(() => {
        if (sorting && !isPaused && iteration < arr.length - 1) {
            const delay = speed >= 0 ? Math.max(500 / (speed + 1), 50) : Math.abs(speed) * 400;

            const intervalId = setInterval(() => {
                handleNextStep();
            }, delay);

            return () => clearInterval(intervalId);
        }
    }, [sorting, isPaused, arr, currentStep, iteration, speed]);

    // Move to the next step of the sorting
    const handleNextStep = () => {
        const newArr = [...arr];
        const swapped = bubbleSortStep(newArr, iteration, currentStep);

        setArr(newArr);
        setNormalizedArr(normalizeArray(newArr));
        setHistory((prevHistory) => [...prevHistory, [...newArr]]);

        if (currentStep < newArr.length - iteration - 1) {
            setCurrentStep((prev) => prev + 1);
        } else if (iteration >= newArr.length - 1) {
            setSorting(false);
            setIsPaused(true);
            setExplanation("Sorting complete! All elements are now in order.");
        }
    };

    // Move to the previous step
    const handlePreviousStep = () => {
        if (history.length > 1) {
            const newHistory = [...history];
            newHistory.pop();
            const previousState = newHistory[newHistory.length - 1];

            setArr(previousState);
            setNormalizedArr(normalizeArray(previousState));
            setHistory(newHistory);
            setCurrentStep(currentStep > 0 ? currentStep - 1 : 0);
            setExplanation(`Rewinding to step ${currentStep}.`);
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
        setIteration(0);
        const initialArray = numbers.length ? [...numbers] : generateRandomArray(range, range);
        setArr(initialArray);
        setNormalizedArr(normalizeArray(initialArray));
        setHistory([initialArray]);
        setExplanation("Sorting reset. Press play to start again.");
        setCurrentIndices([]);
        setSwappedIndices([]);
    };

    // Calculate dynamic width for each bar
    const barWidth = `${Math.min(100 / arr.length, 100 / 10)}%`;



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
  
      for (int i = 0; i < n; i++) {
          bool swaped = false;
          for (int j = 0; j < n - i - 1; j++) {
              if (array[j + 1] < array[j]) {
                  swap(array, j + 1, j);
                  swaped = true;
              }
          }
          if (!swaped) {
              break;
          }
      }
  
      cout << "Your Bubble sorted Array is: " << endl;
      for (int i = 0; i < n; i++) {
          cout << array[i] << endl;
      }
  }
      `,
        java: `
  import java.util.Scanner;
  
  public class BubbleSort {
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
  
          for (int i = 0; i < n; i++) {
              boolean swapped = false;
              for (int j = 0; j < n - i - 1; j++) {
                  if (array[j + 1] < array[j]) {
                      swap(array, j + 1, j);
                      swapped = true;
                  }
              }
              if (!swapped) {
                  break;
              }
          }
  
          System.out.println("Your Bubble sorted Array is:");
          for (int i = 0; i < n; i++) {
              System.out.println(array[i]);
          }
      }
  }
      `,
        python: `
  def bubble_sort(array):
      n = len(array)
      for i in range(n):
          swapped = False
          for j in range(n - i - 1):
              if array[j] > array[j + 1]:
                  array[j], array[j + 1] = array[j + 1], array[j]
                  swapped = True
          if not swapped:
              break
  
  if __name__ == "__main__":
      n = int(input("Enter the array size: "))
      array = [int(input(f"Enter element {i + 1}: ")) for i in range(n)]
  
      bubble_sort(array)
      print("Your Bubble sorted Array is:")
      print(array)
      `,
        javaScript: `
      function bubbleSort(array) {
          const n = array.length;
          for (let i = 0; i < n; i++) {
              let swapped = false;
              for (let j = 0; j < n - i - 1; j++) {
                  if (array[j] > array[j + 1]) {
                      [array[j], array[j + 1]] = [array[j + 1], array[j]];
                      swapped = true;
                  }
              }
              if (!swapped) break;
          }
          return array;
      }
      
      const array = [];
      const n = parseInt(prompt("Enter the array size: "));
      for (let i = 0; i < n; i++) {
          array.push(parseInt(prompt(\`Enter element \${i + 1}: \`)));
      }
      
      console.log("Your Bubble sorted Array is:");
      console.log(bubbleSort(array));
      `

    };

    // Source code for different languages
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
        <div className="bubble-sort-visualization">
            <h3>Bubble Sort Visualization</h3>
            <div className="explanation">
                <p>{explanation}</p>
            </div>
            <div className="user_controls">
                <button onClick={handlePreviousStep} disabled={history.length <= 1}>
                    <ArrowBackIosIcon />
                </button>
                <button onClick={handlePlayPause}>
                    {isPaused ? <PlayCircleOutlineIcon /> : <PauseIcon />}
                </button>
                <button onClick={handleNextStep} disabled={iteration >= arr.length - 1 && currentStep >= arr.length - iteration - 1}>
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
                        className={`array-bar ${swappedIndices.includes(index) ? 'swapping' :
                            currentIndices.includes(index) ? 'comparing' :
                                index < arr.length - iteration ? 'sorted' : ''
                            }`}
                        style={{
                            height: `${value}%`,
                            width: barWidth,
                            backgroundColor: swappedIndices.includes(index)
                                ? 'red'
                                : currentIndices.includes(index)
                                    ? 'orange'
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


            <div className="bubble_Sort_content">
                <h2>Bubble Sort Algorithm</h2>

                <h3>How it Works:</h3>
                <p>
                    Bubble Sort is a simple comparison-based sorting algorithm. It works by stepping through the list,
                    comparing each pair of adjacent items, and swapping them if they are in the wrong order. This continues
                    until the list is sorted.
                </p>
                <ol>
                    <li>Start at the beginning of the list.</li>
                    <li>Compare the first two elements.</li>
                    <li>If the first is larger than the second, swap them.</li>
                    <li>Move to the next pair and repeat the comparison and swap if needed.</li>
                    <li>Repeat until no swaps are needed in a complete pass.</li>
                </ol>

                <h3>Example Walkthrough:</h3>
                <p>
                    For a list [5, 3, 8, 4, 2]:
                </p>
                <ol>
                    <li>First pass:
                        <ul>
                            <li>Compare 5 and 3 ➔ Swap (3, 5) → [3, 5, 8, 4, 2]</li>
                            <li>Compare 5 and 8 ➔ No swap → [3, 5, 8, 4, 2]</li>
                            <li>Compare 8 and 4 ➔ Swap (4, 8) → [3, 5, 4, 8, 2]</li>
                            <li>Compare 8 and 2 ➔ Swap (2, 8) → [3, 5, 4, 2, 8]</li>
                        </ul>
                    </li>
                    <li>Second pass:
                        <ul>
                            <li>Compare 3 and 5 ➔ No swap → [3, 5, 4, 2, 8]</li>
                            <li>Compare 5 and 4 ➔ Swap (4, 5) → [3, 4, 5, 2, 8]</li>
                            <li>Compare 5 and 2 ➔ Swap (2, 5) → [3, 4, 2, 5, 8]</li>
                        </ul>
                    </li>
                    <li>Third pass:
                        <ul>
                            <li>Compare 3 and 4 ➔ No swap → [3, 4, 2, 5, 8]</li>
                            <li>Compare 4 and 2 ➔ Swap (2, 4) → [3, 2, 4, 5, 8]</li>
                        </ul>
                    </li>
                    <li>Fourth pass:
                        <ul>
                            <li>Compare 3 and 2 ➔ Swap (2, 3) → [2, 3, 4, 5, 8]</li>
                        </ul>
                    </li>
                    <li>Final sorted list: [2, 3, 4, 5, 8]</li>
                </ol>


                <h3>Time Complexity:</h3>
                <ol >
                    <li>Best Case (Already sorted): <b>O(n)</b></li>
                    <li>Average Case: <b>O(n²)</b></li>
                    <li>Worst Case (Reversed order): <b>O(n²)</b></li>
                </ol>

                <h3>Advantages:</h3>
                <ol>
                    <li>Simple to understand and implement</li>
                    <li>In-place sorting with minimal memory usage</li>
                </ol>

                <h3>Disadvantages:</h3>
                <ol>
                    <li>Inefficient on large lists due to O(n²) time complexity</li>
                    <li>Other algorithms perform better on larger lists</li>
                </ol>
            </div>



        </div>
    );
}