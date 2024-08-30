import React, { useEffect, useState } from 'react';
import { Form, Button, Col, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import '../createReceipe/createReceipe.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import TagDropdown from './customDropdown';
import BASE_URL from '../../../config/config';

const CreateReceipe = () => {
    const [receipe, setReceipe] = useState({
        name: '',
        description: '',
        ingredients: [''],
        image: [], // Changed to an array
        cookingMethod: '',
        cooktime: '',
        servingPerson: '',
        difficulty: '',
        video: '',
        category: '',
        tags: [],
        tag_names: [],
        userId: window.localStorage.getItem('id')
    });
    const handleTagSelect = (tag) => {
        setSelectedTags(prev => {
            const newTags = prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag];
            setReceipe({ ...receipe, tags: newTags });
            return newTags;
        });
    };

    const [Category, setCategory] = useState([]);
    const [Tag, setTag] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]); // Changed to an array
    const [error, setError] = useState({});
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const notify = () => toast.success('Recipe Created successfully!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });

    const addIngredientField = () => {
        setReceipe({ ...receipe, ingredients: [...receipe.ingredients, ''] });
    };
    const handleRemoveIngredient = (index) => {
        setReceipe(prevReceipe => ({
            ...prevReceipe,
            ingredients: prevReceipe.ingredients.filter((_, i) => i !== index)
        }));
    };

    useEffect(() => {
        const token = window.localStorage.getItem('token');
        axios.get(`${BASE_URL}/getCategory`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(result => setCategory(result.data))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        const token = window.localStorage.getItem('token');
        axios.get(`${BASE_URL}/tags/getTags`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(result => setTag(result.data))
            .catch(err => console.log(err));
    }, []);


    const handleChange = (event) => {
        const { name, value, type, files, selectedOptions } = event.target;

        if (type === 'file') {
            const selectedFiles = Array.from(files);
            setReceipe({ ...receipe, [name]: selectedFiles });
            setImagePreviews(selectedFiles.map(file => URL.createObjectURL(file))); // Preview multiple image
            setError(prevError => ({ ...prevError, image: '' }));
        } else if (name.startsWith('ingredients')) {
            const index = parseInt(name.split('-')[1], 10);
            const updatedIngredients = [...receipe.ingredients];
            updatedIngredients[index] = value;
            setReceipe({ ...receipe, ingredients: updatedIngredients });
            setError(prevError => ({ ...prevError, ingredients: '' }));
        } else if (name === 'tags') {
            const selectedTags = Array.from(selectedOptions, option => option.value);
            setReceipe({ ...receipe, tags: selectedTags, tag_name: selectedTags });
            setError(prevError => ({ ...prevError, tags: '' }));
        } else {
            setReceipe({ ...receipe, [name]: value });
            setError(prevError => ({ ...prevError, [name]: '' }));
        }
    };

    const handleCKEditorChange = (event, editor) => {
        const data = editor.getData();
        setReceipe({ ...receipe, cookingMethod: data });
        if (data.trim()) {
            setError(prevError => ({ ...prevError, cookingMethod: '' }));
        }
    };

    const validateForm = () => {
        const validationError = {};
        if (!receipe.name.trim()) validationError.name = "Name is required";
        if (!receipe.image.length) validationError.image = "At least one image is required";
        if (!receipe.description.trim()) validationError.description = "Description is required";
        if (!receipe.difficulty.trim()) validationError.difficulty = "Difficulty is required";
        if (receipe.ingredients.every(ingredient => !ingredient.trim())) validationError.ingredients = "At least one ingredient is required";
        if (!receipe.cooktime.trim()) validationError.cooktime = "Cook time is required";
        if (!receipe.servingPerson.trim()) validationError.servingPerson = "Number of serving persons is required";
        if (!receipe.video.trim()) validationError.video = "Video URL is required";
        if (!receipe.category.trim()) validationError.category = "Category is required";
        if (receipe.tags.length === 0) validationError.tags = "At least one tag is required"; // Check if there are any tags selected
        if (!receipe.cookingMethod.trim()) validationError.cookingMethod = "Cooking method is required";
        return validationError;
    };

    const submit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        const errors = validateForm();
        setError(errors);

        if (Object.keys(errors).length === 0) {
            const formData = new FormData();
            formData.append('name', receipe.name);
            receipe.image.forEach((image) => formData.append('image', image)); // Append multiple images
            formData.append('description', receipe.description);
            formData.append('difficulty', receipe.difficulty);
            receipe.ingredients.forEach((ingredient) => formData.append('ingredients[]', ingredient)); // Append multiple ingredients
            formData.append('video', receipe.video);
            formData.append('cooktime', receipe.cooktime);
            formData.append('servingPerson', receipe.servingPerson);
            formData.append('cookingMethod', receipe.cookingMethod);
            formData.append('category', receipe.category);
            receipe.tags.forEach(tag => formData.append('tags', tag)); // Append tags
            receipe.tag_names.forEach(tagName => formData.append('tag_names', tagName)); // Append tag names
            formData.append('userId', receipe.userId);

            try {
                const token = window.localStorage.getItem('token');
                const result = await axios.post(`${BASE_URL}/recipe/createReceipe`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(result);
                setReceipe({
                    name: '',
                    description: '',
                    ingredients: [''], // Initialize with one empty ingredient
                    image: [], // Reset image
                    cookingMethod: '',
                    cooktime: '',
                    servingPerson: '',
                    difficulty: '',
                    video: '',
                    category: '',
                    tags: [], // Reset tags
                    tag_name: [], // Reset tag names
                    userId: window.localStorage.getItem('id')
                });
                setImagePreviews([]); // Reset image previews
                notify(); // Ensure this line is reached
                navigate('/dashboard/receipe'); // Redirect to a different route or home
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <div className="full-screen-container">
            <Col xs={12} md={8} lg={6}>
                <h2 className="form-title">Create Recipe</h2>
                <Form onSubmit={submit}>
                    <Form.Group controlId="formName" className="form-control1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            name="name"
                            value={receipe.name}
                            onChange={handleChange}
                            style={{
                                borderColor: isSubmitted && error.name ? 'red' : '#ced4da',
                                borderWidth: '1px',
                                borderRadius: '4px',
                                padding: '0.375rem 0.75rem',
                            }}
                        />
                        {isSubmitted && error.name && (
                            <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                {error.name}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group controlId="formFile" className="form-control1">
                        <Form.Label>image</Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            multiple
                            onChange={handleChange}
                        />
                        {imagePreviews.length > 0 && (
                            <div className="mt-2">
                                {imagePreviews.map((preview, index) => (
                                    <img
                                        key={index}
                                        src={preview}
                                        alt={`Preview ${index}`}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            marginRight: '10px'
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                        {isSubmitted && error.image && (
                            <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                {error.image}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group controlId="formDescription" className="form-control1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter description"
                            name="description"
                            value={receipe.description}
                            onChange={handleChange}
                            style={{
                                borderColor: isSubmitted && error.description ? 'red' : '#ced4da',
                                borderWidth: '1px',
                                borderRadius: '4px',
                                padding: '0.375rem 0.75rem',
                            }}
                        />
                        {isSubmitted && error.description && (
                            <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                {error.description}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group controlId="formDifficulty" className="form-control1">
                        <Form.Label>Difficulty</Form.Label>
                        <Form.Select
                            aria-label="Default select example"
                            name="difficulty"
                            value={receipe.difficulty}
                            onChange={handleChange}
                            style={{
                                borderColor: isSubmitted && error.difficulty ? 'red' : '#ced4da',
                                borderWidth: '1px',
                                borderRadius: '4px',
                                padding: '0.375rem 0.75rem',
                            }}
                        >
                            <option>Select</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </Form.Select>
                        {isSubmitted && error.difficulty && (
                            <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                {error.difficulty}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group controlId="formcategory" className="form-control1">
                        <Form.Label>Choose Category</Form.Label>
                        <Form.Select
                            aria-label="Default select example"
                            name="category"
                            value={receipe.category}
                            onChange={handleChange}
                            style={{
                                borderColor: isSubmitted && error.category ? 'red' : '#ced4da',
                                borderWidth: '1px',
                                borderRadius: '4px',
                                padding: '0.375rem 0.75rem',
                            }}
                        >
                            <option value="">Select a Category</option>
                            {Category.map((option, index) => (
                                <option key={index} value={option._id}>
                                    {option.name}
                                </option>
                            ))}
                        </Form.Select>
                        {isSubmitted && error.category && (
                            <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                {error.category}
                            </div>
                        )}
                    </Form.Group>


                    <Form.Group controlId="formCookingMethod" className="form-control1">
                        <Form.Label>Cooking Method</Form.Label>
                        <div className='ckeditor'>
                            <CKEditor
                                editor={ClassicEditor}
                                data={receipe.cookingMethod}
                                onChange={handleCKEditorChange}
                            />
                        </div>
                        {isSubmitted && error.cookingMethod && (
                            <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                {error.cookingMethod}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group controlId="formCooktime" className="form-control1">
                        <Form.Label>Cook Time</Form.Label>
                        <Form.Control
                            type="time"
                            placeholder="Enter cook time"
                            name="cooktime"
                            value={receipe.cooktime}
                            onChange={handleChange}
                            style={{
                                borderColor: isSubmitted && error.cooktime ? 'red' : '#ced4da',
                                borderWidth: '1px',
                                borderRadius: '4px',
                                padding: '0.375rem 0.75rem',
                            }}
                        />
                        {isSubmitted && error.cooktime && (
                            <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                {error.cooktime}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group controlId="formServingPerson" className="form-control1">
                        <Form.Label>Serving Person</Form.Label>
                        <Form.Control
                            type="number"
                            min={'1'}
                            max={'50'}
                            placeholder="Enter number of serving persons"
                            name="servingPerson"
                            value={receipe.servingPerson}
                            onChange={handleChange}
                            style={{
                                borderColor: isSubmitted && error.servingPerson ? 'red' : '#ced4da',
                                borderWidth: '1px',
                                borderRadius: '4px',
                                padding: '0.375rem 0.75rem',
                            }}
                        />
                        {isSubmitted && error.servingPerson && (
                            <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                {error.servingPerson}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group controlId="formTags" className="form-control1">
                        <Form.Label>Tags</Form.Label>
                        <TagDropdown
                            tags={Tag}
                            selectedTags={selectedTags}
                            onTagSelect={handleTagSelect}
                            onToggle={() => setShowTagDropdown(!showTagDropdown)}
                            showTagDropdown={showTagDropdown}  // Pass this prop
                        />
                        {isSubmitted && error.tags && (
                            <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                {error.tags}
                            </div>
                        )}
                    </Form.Group>


                    <InputGroup className="mb-0 input-group">
                        <Form.Group controlId="formIngredients" className="form-control1">
                            <Form.Label>Ingredients</Form.Label>
                            {receipe.ingredients.map((ingredient, index) => (
                                <InputGroup key={index} className="mb-2">
                                    <Form.Control
                                        type="text"
                                        placeholder={`Ingredient ${index + 1}`}
                                        name={`ingredients-${index}`}
                                        value={ingredient}
                                        onChange={handleChange}
                                        style={{
                                            borderColor: isSubmitted && error.ingredients ? 'red' : '#ced4da',
                                            borderWidth: '1px',
                                            borderRadius: '4px',
                                            padding: '0.375rem 0.75rem',
                                            marginRight: '0'
                                        }}
                                    />
                                    {index === 0 && (
                                        <Button
                                            variant="secondary"
                                            onClick={addIngredientField}
                                            className="Add"
                                            style={{ borderRadius: '0 4px 4px 0' }}
                                        >
                                            Add
                                        </Button>
                                    )}
                                    <Button
                                        variant="danger"
                                        onClick={() => handleRemoveIngredient(index)}
                                        style={{ marginLeft: '5px' }}
                                    >
                                        Remove
                                    </Button>
                                </InputGroup>

                            ))}

                            {isSubmitted && error.ingredients && (
                                <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                    {error.ingredients}
                                </div>
                            )}
                        </Form.Group>
                    </InputGroup>

                    <Form.Group controlId="formVideo" className="form-control1">
                        <Form.Label>Video URL</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter video URL"
                            name="video"
                            value={receipe.video}
                            onChange={handleChange}
                            style={{
                                borderColor: isSubmitted && error.video ? 'red' : '#ced4da',
                                borderWidth: '1px',
                                borderRadius: '4px',
                                padding: '0.375rem 0.75rem',
                            }}
                        />
                        {isSubmitted && error.video && (
                            <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                {error.video}
                            </div>
                        )}
                    </Form.Group>

                    <Button variant="primary" type="submit" className="submit-button mt-2">
                        Submit
                    </Button>
                </Form>
                {/* <ToastContainer /> */}
            </Col>
        </div>
    );
};

export default CreateReceipe;