import Navbar from "../navbar/navbar";
import '../navbar/navbar.css';
import '../home_page/home_page.css';
import '../footer/footer.css';
import SortingVisualization from '../sorting/sorting_visualization';
import '../sorting/sorting_visualization.css';
import CustomSlider from './slider';
import images from "../data/images";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import CopyrightIcon from '@mui/icons-material/Copyright';
import { useTheme } from '../theme/ThemeContext';


export default function Home_Page() {
    const { theme, toggleTheme } = useTheme(); // Use the custom hook

    return (
        <div className="home_page" data-theme={theme}>
            <Navbar handleToggleTheme={toggleTheme} theme={theme} />

            <div className="welcome_section">
                <h1>Welcome to Sorting Visualizer</h1>
                <h5>Explore, Customize, and Learn about Sorting Algorithms</h5>
            </div>

            <SortingVisualization />

            {/* <div className="default_section">
                <h1>Sorting Algorithms Visualizations</h1>
                <p>Get started with pre-built visualizations of popular sorting algorithms  like Bubble Sort, Merge Sort, and Quick Sort.<br /> Watch them in action with real-time animations.</p>

                <CustomSlider>
                    {images.map((image, index) => {
                        return <img key={index} src={image.imgURL} alt={image.imgAlt} />;
                    })}
                </CustomSlider>

                <button>Explore Sorting Visualizations</button>

            </div> */}

            {/* <div className="default_section">
                <h2>Graph Algorithms Visualizations</h2>
                <p>Dive into the world of graph algorithms with our interactive visualizations! Explore pre-built animations of essential graph algorithms such as Depth-First Search (DFS), Breadth-First Search (BFS), Dijkstra's Algorithm, and A* Search.</p>

                <CustomSlider>
                    {images.map((image, index) => {
                        return <img key={index} src={image.imgURL} alt={image.imgAlt} />;
                    })}
                </CustomSlider>

                <button>Explore Graph Visualizations</button>

            </div> */}


            {/* <div className="default_section">
                <h1>More on Data Structure and Algorithms</h1>
                <p>Get started with pre-built visualizations of popular sorting algorithms like Bubble Sort, Merge Sort, and Quick Sort. Watch them in action with real-time animations.</p>

                <CustomSlider>
                    {images.map((image, index) => {
                        return <img key={index} src={image.imgURL} alt={image.imgAlt} />;
                    })}
                </CustomSlider>

                <button>Let's Learn More</button>

            </div> */}

            <div className="footer">
                <div className="social_icons">
                    <a href="https://www.linkedin.com/in/md-tanvir-ahmed-akash-8ba50b2b9/" target="_blank" rel="noopener noreferrer">
                        <LinkedInIcon />
                    </a>
                    <a href="https://github.com/Akash-code-0-1?tab=overview&from=2025-03-01&to=2025-03-17" target="_blank" rel="noopener noreferrer">
                        <GitHubIcon />
                    </a>
                    <p>Dhaka, Bangladesh</p>
                </div>
            </div>


        </div>
    );
}
