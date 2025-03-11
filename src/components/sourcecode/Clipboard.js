import React from 'react';

const Clipboard = ({ sourceCode }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(sourceCode)
            .then(() => alert('Source code copied to clipboard!'))
            .catch(() => alert('Failed to copy!'));
    };

    return (
        <div className="clipboard">
            <button onClick={handleCopy}>Copy Source Code</button>
        </div>
    );
};

export default Clipboard;
