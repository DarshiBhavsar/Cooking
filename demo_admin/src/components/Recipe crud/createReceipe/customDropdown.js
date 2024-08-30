import React from 'react';

const TagDropdown = ({ tags, selectedTags, onTagSelect, onToggle, showTagDropdown }) => {
    // Create a map from tag IDs to names
    const tagNameMap = tags.reduce((map, tag) => {
        map[tag._id] = tag.name;
        return map;
    }, {});

    // Function to handle tag selection and close the dropdown
    const handleTagClick = (tagId) => {
        onTagSelect(tagId);
        onToggle(); // Close the dropdown
    };

    return (
        <div className="custom-dropdown">
            <div className="dropdown-toggle" onClick={onToggle}>
                <span className="selected-tags">
                    {selectedTags.length > 0
                        ? selectedTags.map(id => tagNameMap[id]).join(', ')
                        : 'Select Tags'}
                </span>
                <span className="dropdown-icon">▼</span> {/* Adjust the icon as needed */}
            </div>
            {showTagDropdown && (
                <div className="dropdown-menu">
                    {tags.map(tag => (
                        <div
                            key={tag._id}
                            className={`dropdown-item ${selectedTags.includes(tag._id) ? 'selected' : ''}`}
                            onClick={() => handleTagClick(tag._id)}
                        >
                            {tag.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TagDropdown;
