import React, { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { RxCross2 } from 'react-icons/rx';
import 'react-toastify/dist/ReactToastify.css';
import '../createReceipe/createReceipe.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import TagDropdown from '../tags/tagDropdown';
import BASE_URL from '../../../config/config';

const UpdateReceipe = () => {
    // const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state || {};
    const [users, setUsers] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [tag_names, setTagsName] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState(['']);
    const [image, setImage] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [cookingMethod, setCookingMethod] = useState('');
    const [cooktime, setCooktime] = useState('');
    const [category, setCategory] = useState('');
    const [category_name, setCategoryName] = useState('');
    const [servingPerson, setServingPerson] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [video, setVideo] = useState('');

    const notify = () => toast.success('Updated successfully!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
    });

    useEffect(() => {
        const token = window.localStorage.getItem('token');
        axios.get(`${BASE_URL}/tags/getTags`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(result => setAllTags(result.data))
            .catch(err => console.log(err));
    }, []);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImage(files);
        setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    };

    const handleRemoveImage = (imageUrl) => {
        const filename = imageUrl.split('/').pop();
        const token = window.localStorage.getItem('token');
        axios.delete(`${BASE_URL}/recipe/deleteImage`, {
            params: { filename },
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(response => {
                console.log('Image deleted successfully:', response.data);
                setImagePreviews(prev => prev.filter(preview => preview !== imageUrl));
                setImage(prev => prev.filter(file => file.name !== filename));
            })
            .catch(error => console.error('Error deleting image:', error));
    };


    const handleIngredientChange = (index, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, '']);
    };

    const handleRemoveIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    useEffect(() => {
        const token = window.localStorage.getItem('token');
        axios.get(`${BASE_URL}/getCategory`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(result => setUsers(result.data))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        const token = window.localStorage.getItem('token');
        axios.get(`${BASE_URL}/recipe/getReceipe/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(result => {
                const data = result.data;
                setName(data.name);
                setDescription(data.description);
                setIngredients(data.ingredients || ['']);
                setCookingMethod(data.cookingMethod);
                setCooktime(data.cooktime);
                setServingPerson(data.servingPerson);
                setDifficulty(data.difficulty);
                setVideo(data.video);
                setSelectedTags(data.tags || []);
                setCategory(data.category);
                setCategoryName(data.category_name)
                setImagePreviews(data.image || []);
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleTagChange = (newTags) => {
        setSelectedTags(newTags);
        const tagNames = allTags
            .filter(tag => newTags.includes(tag._id))
            .map(tag => tag.name);
        setTagsName(tagNames);
    };

    const handleCKEditorChange = (event, editor) => {
        const data = editor.getData();
        setCookingMethod(data);
    };

    const submit = (e) => {
        e.preventDefault();
        const token = window.localStorage.getItem('token');
        const formData = new FormData();
        formData.append('name', name);
        image.forEach((file) => {
            formData.append('image', file);
        });
        ingredients.forEach((ingredient, index) => formData.append(`ingredients[${index}]`, ingredient));
        formData.append('description', description);
        formData.append('difficulty', difficulty);
        formData.append('video', video);
        formData.append('cooktime', cooktime);
        formData.append('servingPerson', servingPerson);
        formData.append('cookingMethod', cookingMethod);
        formData.append('category', category);
        formData.append('category_name', category_name);
        selectedTags.forEach(tag => formData.append('tags', tag));
        tag_names.forEach(tagName => formData.append('tag_names', tagName));

        axios.put(`${BASE_URL}/recipe/updateUser/${id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(() => {
                setName('');
                setDescription('');
                setIngredients(['']);
                setImage([]);
                setImagePreviews([]);
                setCookingMethod('');
                setCooktime('');
                setServingPerson('');
                setDifficulty('');
                setCategory('');
                setCategoryName('')
                setVideo('');
                setSelectedTags([]);
                setTagsName([])
                notify();
                navigate('/dashboard/receipe');
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="full-screen-container">
            <Col xs={12} md={8} lg={6}>
                <h2 className="form-title">Update Recipe</h2>
                <Form onSubmit={submit}>
                    <Form.Group controlId="formName" className="form-control1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formFile" className="form-control1">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            multiple
                            onChange={handleImageChange}
                            id="fileInput"
                            style={{ display: 'block', width: '80vw' }}
                        />
                        <div className="image-preview-container" style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {imagePreviews.length > 0 ? (
                                imagePreviews.map((preview, index) => (
                                    <div key={index} className="image-preview-wrapper" style={{ position: 'relative', margin: '5px' }}>
                                        <img
                                            src={preview}
                                            alt={`Preview ${index}`}
                                            className="image-preview"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        />
                                        <div
                                            className="image-edit-icon"
                                            onClick={() => handleRemoveImage(preview)}
                                            style={{
                                                position: 'absolute',
                                                top: '0',
                                                right: '0',
                                                backgroundColor: 'white',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                padding: '5px',
                                                boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)'
                                            }}
                                        >
                                            <RxCross2 size={16} />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>No images to display</div>
                            )}
                        </div>
                    </Form.Group>

                    <Form.Group controlId="formDescription" className="form-control1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formDifficulty" className="form-control1">
                        <Form.Label>Difficulty</Form.Label>
                        <Form.Select
                            aria-label="Default select example"
                            name="difficulty"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                        >
                            <option>Select</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="formCategory" className="form-control1">
                        <Form.Label>Choose Category</Form.Label>
                        <Form.Select
                            aria-label="Default select example"
                            name="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select a category</option>
                            {users.map((option, index) => (
                                <option key={index} value={option._id}>
                                    {option.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="formCookingMethod" className="form-control1">
                        <Form.Label>Cooking Method</Form.Label>
                        <div style={{ width: '80vw', marginBottom: '0rem' }}>
                            <CKEditor
                                editor={ClassicEditor}
                                data={cookingMethod}
                                onChange={handleCKEditorChange}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group controlId="formCooktime" className="form-control1">
                        <Form.Label>Cook Time</Form.Label>
                        <Form.Control
                            type="time"
                            placeholder="Enter cook time"
                            name="cooktime"
                            value={cooktime}
                            onChange={(e) => setCooktime(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formServingPerson" className="form-control1">
                        <Form.Label>Serving Person</Form.Label>
                        <Form.Control
                            type="number"
                            min={'1'}
                            max={'50'}
                            placeholder="Enter number of serving persons"
                            name="servingPerson"
                            value={servingPerson}
                            onChange={(e) => setServingPerson(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formTags" className="mb-3 form-control1">
                        <Form.Label>Tags</Form.Label>
                        <TagDropdown
                            options={allTags}
                            selectedTags={selectedTags}
                            onChange={handleTagChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formIngredients" className="form-control1">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '80vw' }}>
                            <Form.Label style={{ marginBottom: '0' }}>Ingredients</Form.Label>
                            <Button
                                variant="secondary"
                                onClick={handleAddIngredient}
                                className="mt-2"
                                style={{ borderRadius: '4px 4px 4px 4px', padding: '6px 10px' }}
                            >
                                Add Ingredient
                            </Button>
                        </div>

                        {ingredients.map((ingredient, index) => (
                            <div key={index} className="d-flex align-items-center mt-2" style={{ width: '80vw' }}>
                                <Form.Control
                                    type="text"
                                    placeholder={`Ingredient ${index + 1}`}
                                    name={`ingredients-${index}`}
                                    value={ingredient}
                                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                                />
                                <Button
                                    variant="danger"
                                    onClick={() => handleRemoveIngredient(index)}
                                    style={{ marginLeft: '5px' }}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}

                    </Form.Group>


                    <Form.Group controlId="formVideo" className="form-control1">
                        <Form.Label>Video URL</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter video URL"
                            name="video"
                            value={video}
                            onChange={(e) => setVideo(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="submit-button mt-2">
                        Update
                    </Button>
                </Form>
            </Col>
        </div>
    );
};

export default UpdateReceipe;
