import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Sorting_Visualization from './components/sorting/sorting_visualization';
import Graph_Visualization from "./components/graph/graph_visualization";
import Home_Page from "./components/home_page/home_page";
import { ThemeProvider } from "./components/theme/ThemeContext";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider>
          <Routes>
            <Route index element={<Home_Page />} />
            <Route path="/sorting" element={<Sorting_Visualization />} />
            <Route path="/graph" element={<Graph_Visualization />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;