import React, { useState } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import './navbar.css';
import { useNavigate } from 'react-router-dom';

function Navbar({ handleToggleTheme, theme }) {
    const [isSelect, setIsSelect] = useState(false);

    const toggleChangeIcon = () => {
        setIsSelect(!isSelect);
    };

    const navigate = useNavigate();

    const handleIconClick = (page) => {
        navigate(page);
    };



    return (
        <div className="navbar">
            <h1 className="title">Viz</h1>

            <div className="menu_icon" onClick={toggleChangeIcon}>
                {isSelect ? <CloseIcon /> : <MenuIcon />}
            </div>
            <ul className={`menu-items ${isSelect ? 'show' : ''}`}>
                <li onClick={() => handleIconClick("/")}>Home</li>
                <li onClick={() => handleIconClick('/sorting')}>Sorting Algorithms</li>
                {/* <li onClick={() => handleIconClick('/graph')}>Graph Algorithms</li> */}
            </ul>

            <div className="search-bar">
                <div className="mode" onClick={handleToggleTheme}>
                    {theme === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                </div>

                {/* <input type="text" placeholder="Search..." />
                <div className="search">
                    <SearchIcon />
                </div> */}
            </div>
        </div>
    );
}


export default Navbar;