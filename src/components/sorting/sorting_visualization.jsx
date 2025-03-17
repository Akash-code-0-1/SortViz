import React, { useState, useRef, useEffect } from 'react';
import Navbar from "../navbar/navbar";
import '../navbar/navbar.css';
import '../sorting/sorting_visualization.css';
import '../footer/footer.css';
import { useTheme } from '../theme/ThemeContext';
import BubbleSort from './BubbleSort';
import SelectionSort from './SelectionSort';
import InsertionSort from './InsertionSort';
import MergeSort from './MergeSort';
import QuickSort from './QuickSort';
import HeapSort from './HeapSort';
import RadixSort from './RadixSort';
import BucketSort from './BucketSort';
import CountingSort from './CountingSort';

const algorithmComponents = {
    'Bubble Sort': BubbleSort,
    'Selection Sort': SelectionSort,
    'Insertion Sort': InsertionSort,
    'Merge Sort': MergeSort,
    'Quick Sort': QuickSort,
    'Heap Sort': HeapSort,
    'Radix Sort': RadixSort,
    'Bucket Sort': BucketSort,
    'Counting Sort': CountingSort

};

export default function Sorting_Visualization() {
    const { theme, toggleTheme } = useTheme();
    const [speed, setSpeed] = useState(0);
    const [range, setRange] = useState(5);
    const [numbers, setNumbers] = useState([]);
    const [isRandom, setIsRandom] = useState(true);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
    const [selectedNumbersType, setSelectedNumbersType] = useState(null);
    const [sort, setSort] = useState(false);

    // Create a ref to scroll to the visualization
    const visualizationRef = useRef(null);

    const handleSpeedChange = (newSpeed) => {
        setSpeed(newSpeed);
    };

    const handleRangeChange = (newRange) => {
        setRange(newRange);
    };

    const handleNumberInput = (event) => {
        const newNumbers = event.target.value.split(',').map(Number);
        setNumbers(newNumbers);
        setIsRandom(false);
        setSort(false); // Reset sorting when input changes
    };

    const handleAlgorithmSelect = (algorithm) => {
        setSelectedAlgorithm(algorithm);
        setSort(false); // Reset sorting when a new algorithm is selected
    };

    const handleNumbersSelect = (numberstype) => {
        setSelectedNumbersType(numberstype);
        if (numberstype === "Random Numbers") {
            setIsRandom(true);
            setNumbers([]);
        }
        setSort(false); // Reset sorting when number type changes
    };

    const handleSortClick = () => {
        setSort(true);
    };

    // Scroll to the visualization section when `sort` becomes true
    useEffect(() => {
        if (sort && visualizationRef.current) {
            visualizationRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [sort]);

    // Get the selected algorithm component
    const SelectedAlgorithmComponent = selectedAlgorithm ? algorithmComponents[selectedAlgorithm] : null;

    return (
        <div className="sorting" data-theme={theme}>
           

            <div className="welcome_section">
                {/* <h1>Let's Start Sorting Visualization</h1> */}
                {/* <h4>Select your desired sorting algorithm</h4> */}
                <div className="sorting_algorithms">
                    {['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort', 'Heap Sort', 'Radix Sort', 'Bucket Sort', 'Counting Sort'].map((algorithm) => (
                        <button
                            key={algorithm}
                            onClick={() => handleAlgorithmSelect(algorithm)}
                            style={{ backgroundColor: selectedAlgorithm === algorithm ? 'rgb(51, 255, 11)' : '', color: 'black', fontWeight: 'bolder' }}
                        >
                            {algorithm}
                        </button>
                    ))}
                </div>
            </div>
            <div className="sorting_action">
                <div className="controls">
                    <h3>Customize as You Like</h3>
                    <div className="range_input">
                        <label>Speed: -4x</label>
                        <input
                            type="range"
                            min={-4}
                            max={4}
                            value={speed}
                            onChange={(event) => handleSpeedChange(parseInt(event.target.value))}
                        />
                        <p>{speed}x</p>
                        <label>Range: 5</label>
                        <input
                            type="range"
                            min={5}
                            max={100}
                            value={range}
                            onChange={(event) => handleRangeChange(parseInt(event.target.value))}
                        />
                        <p>{range}</p>
                    </div>
                    <div className="sorting_type">
                        {['Random Numbers', 'Input Numbers'].map((numberstype) => (
                            <button
                                key={numberstype}
                                onClick={() => handleNumbersSelect(numberstype)}
                                style={{ backgroundColor: selectedNumbersType === numberstype ? 'rgb(51, 255, 11)' : '', color: 'black', fontWeight: 'bolder', marginInlineEnd: '10px' }}
                            >
                                {numberstype}
                            </button>
                        ))}
                    </div>
                    <div className="input_numbers">
                        <input
                            type="text"
                            placeholder="Enter numbers (comma-separated)"
                            value={isRandom ? '' : numbers.join(',')}
                            onChange={handleNumberInput}
                            style={{ cursor: selectedNumbersType === "Random Numbers" ? '' : '' }}
                        />
                    </div>
                    <button
                        className="final_action"
                        onClick={handleSortClick}
                        style={{ backgroundColor: sort === true ? 'rgb(51, 255, 11)' : '#2563EB', color: sort === true ? 'black' : 'white', marginBottom:'51px' }}
                    >
                        Sort
                    </button>
                </div>

                {/* Visualization section with ref */}
                <div ref={visualizationRef}>
                    {sort && SelectedAlgorithmComponent && (
                        <SelectedAlgorithmComponent numbers={isRandom ? [] : numbers} speed={speed} range={range} />
                    )}
                </div>
            </div>
        </div>
    );
}
