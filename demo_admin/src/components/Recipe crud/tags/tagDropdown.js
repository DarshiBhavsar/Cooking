import React, { useState } from 'react';

const TagDropdown = ({ options, selectedTags, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => setIsOpen(!isOpen);

    const handleSelect = (tagId) => {
        const newSelectedTags = selectedTags.includes(tagId)
            ? selectedTags.filter(id => id !== tagId)
            : [...selectedTags, tagId];
        onChange(newSelectedTags);
        setIsOpen(false); // Close the dropdown after selection
    };

    const getSelectedTagNames = () => {
        return options
            .filter(option => selectedTags.includes(option._id))
            .map(option => option.name)
            .join(', ');
    };

    return (
        <div className="tag-dropdown">
            <div className="dropdown-header" onClick={handleToggle}>
                {selectedTags.length > 0 ? getSelectedTagNames() : 'Select tags'}
                <span className="tags-dropdown-icon">▼</span> {/* Adjust the icon as needed */}
            </div>
            {isOpen && (
                <div className="dropdown-menu">
                    {options.map((option) => (
                        <div
                            key={option._id}
                            className={`dropdown-item ${selectedTags.includes(option._id) ? 'selected' : ''}`}
                            onClick={() => handleSelect(option._id)}
                        >
                            {option.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TagDropdown;
