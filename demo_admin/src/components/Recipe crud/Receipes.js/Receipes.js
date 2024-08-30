import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Receipe = () => {
    const [recipe, setRecipe] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/getRecipe', { withCredentials: true })
            .then((response) => {
                console.log(response.data);
                setRecipe(response.data);
            }).catch(err => console.log(err));
    }, []);

    return (
        <div className="p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Welcome to the Home Page</h1>
            <div className="flex flex-wrap justify-center gap-6">
                {
                    recipe.map((item) => {
                        return (
                            <div key={item._id} className="border p-4 rounded-lg shadow-lg">
                                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                                <p><strong>Description:</strong> {item.description}</p>
                                <p><strong>Difficulty:</strong> {item.difficulty}</p>
                                <p><strong>Ingredients:</strong> {item.ingredients.join(', ')}</p>
                                <p><strong>Cooking Method:</strong> {item.cookingMethod}</p>
                                <p><strong>Cook Time:</strong> {item.cookTime} minutes</p>
                                <p><strong>Serving Person:</strong> {item.servingPerson}</p>
                                {item.image && <img src={item.image} alt={item.name} className="mt-2 w-full h-auto" />}
                                {item.video && <video controls src={item.video} className="mt-2 w-full h-auto" />}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default Receipe;
