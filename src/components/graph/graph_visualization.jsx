import React, { useState, useRef, useEffect } from 'react';
import Navbar from "../navbar/navbar";
import '../navbar/navbar.css';
import '../graph/graph_visualization.css';
import '../footer/footer.css';
import { useTheme } from '../theme/ThemeContext';
import Dijkstra from './Dijkstra';
import AStar from './AStar';
import BFS from './BFS';
import DFS from './DFS';
import Kruskal from './Kruskal';
import Prim from './Prim';
import BellmanFord from './BellmanFord';

const algorithmComponents = {
    'Dijkstra': Dijkstra,
    'A*': AStar,
    'BFS': BFS,
    'DFS': DFS,
    'Kruskal': Kruskal,
    'Prim': Prim,
    'Bellman-Ford': BellmanFord,
};

export default function Graph_Visualization() {
    const { theme, toggleTheme } = useTheme();
    const [speed, setSpeed] = useState(1);
    const [density, setDensity] = useState(0.5);
    const [nodes, setNodes] = useState(10);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
    const [startNode, setStartNode] = useState('');
    const [endNode, setEndNode] = useState('');
    const [findPath, setFindPath] = useState(false);

    // Create a ref to scroll to the visualization
    const visualizationRef = useRef(null);

    const handleSpeedChange = (newSpeed) => {
        setSpeed(newSpeed);
    };

    const handleDensityChange = (newDensity) => {
        setDensity(newDensity);
    };

    const handleNodesChange = (newNodes) => {
        setNodes(newNodes);
    };

    const handleStartNodeChange = (event) => {
        setStartNode(event.target.value);
    };

    const handleEndNodeChange = (event) => {
        setEndNode(event.target.value);
    };

    const handleAlgorithmSelect = (algorithm) => {
        setSelectedAlgorithm(algorithm);
        setFindPath(false); // Reset pathfinding when a new algorithm is selected
    };

    const handleFindPathClick = () => {
        setFindPath(true);
    };

    // Scroll to the visualization section when `findPath` becomes true
    useEffect(() => {
        if (findPath && visualizationRef.current) {
            visualizationRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [findPath]);

    // Get the selected algorithm component
    const SelectedAlgorithmComponent = selectedAlgorithm ? algorithmComponents[selectedAlgorithm] : null;

    return (
        <div className="graph" data-theme={theme}>
            <Navbar handleToggleTheme={toggleTheme} theme={theme} />

            <div className="welcome_section">
                <h1>Explore Graph Algorithms</h1>
                <h3>Select your desired graph algorithm</h3>
                <div className="graph_algorithms">
                    {['Graph Traversal Algorithms', 'Shortest Path Algorithms', 'Minimum Spanning Tree Algorithms', 'Network Flow Algorithms', 'Clustering Algorithms'].map((algorithm) => (
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

            <div className="graph_action">
                <div className="controls">
                    <h3>Customize as You Like</h3>
                    <div className="range_input">
                        <label>Speed:</label>
                        <input
                            type="range"
                            min={1}
                            max={5}
                            value={speed}
                            onChange={(event) => handleSpeedChange(parseInt(event.target.value))}
                        />
                        <p>{speed}x</p>
                        <label>Density:</label>
                        <input
                            type="range"
                            min={0.1}
                            max={1}
                            step={0.1}
                            value={density}
                            onChange={(event) => handleDensityChange(parseFloat(event.target.value))}
                        />
                        <p>{(density * 100).toFixed(0)}%</p>
                        <label>Number of Nodes:</label>
                        <input
                            type="range"
                            min={5}
                            max={50}
                            value={nodes}
                            onChange={(event) => handleNodesChange(parseInt(event.target.value))}
                        />
                        <p>{nodes}</p>
                    </div>
                    <div className="node_inputs">
                        <input
                            type="text"
                            placeholder="Start Node"
                            value={startNode}
                            onChange={handleStartNodeChange}
                        />
                        <input
                            type="text"
                            placeholder="End Node"
                            value={endNode}
                            onChange={handleEndNodeChange}
                        />
                    </div>
                    <button
                        className="final_action"
                        onClick={handleFindPathClick}
                        style={{ backgroundColor: findPath === true ? 'rgb(51, 255, 11)' : '#2563EB', color: findPath === true ? 'black' : 'white' }}
                    >
                        Find Path
                    </button>
                </div>

                {/* Visualization section with ref */}
                <div ref={visualizationRef}>
                    {findPath && SelectedAlgorithmComponent && (
                        <SelectedAlgorithmComponent 
                            speed={speed} 
                            density={density} 
                            nodes={nodes} 
                            startNode={startNode} 
                            endNode={endNode} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
