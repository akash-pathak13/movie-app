import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddMovieModal, setShowAddMovieModal] = useState(false);
    const [showAddReviewModal, setShowAddReviewModal] = useState(false);
    const [showEditMovieModal, setShowEditMovieModal] = useState(false);
    const [newMovie, setNewMovie] = useState({ name: '', releaseDate: '' });
    const [newReview, setNewReview] = useState({ movieId: '', reviewerName: '', rating: '', comments: '' });
    const [currentMovieId, setCurrentMovieId] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5000/movies")
            .then((response) => setMovies(response.data))
            .catch((error) => console.error("Error fetching movies:", error));
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDeleteMovie = (id) => {
        axios.delete(`http://localhost:5000/movies/${id}`)
            .then(() => {
                setMovies(movies.filter(movie => movie.id !== id));
            })
            .catch((error) => console.error("Error deleting movie:", error));
    };

    const handleEditMovieClick = (movie) => {
        setCurrentMovieId(movie.id);
        setNewMovie({ name: movie.name, releaseDate: movie.releaseDate });
        setShowEditMovieModal(true);
    };

    const handleAddMovie = () => {
        axios.post("http://localhost:5000/movies", newMovie)
            .then((response) => {
                setMovies([...movies, response.data]);
                setShowAddMovieModal(false);
                setNewMovie({ name: '', releaseDate: '' });
            })
            .catch((error) => console.error("Error adding movie:", error));
    };

    const handleUpdateMovie = () => {
        if (!newMovie.name || !newMovie.releaseDate) {
            alert("Please fill in all fields before updating.");
            return;
        }

        axios.put(`http://localhost:5000/movies/${currentMovieId}`, newMovie)
            .then((response) => {
                const updatedMovies = movies.map(movie =>
                    movie.id === currentMovieId ? response.data : movie
                );
                setMovies(updatedMovies);
                setShowEditMovieModal(false);
                setNewMovie({ name: '', releaseDate: '' });
            })
            .catch((error) => {
                console.error("Error updating movie:", error);
                alert("Failed to update movie. Please try again.");
            });
    };

    const handleAddReview = () => {
        axios.post("http://localhost:5000/reviews", newReview)
            .then((response) => {
                setShowAddReviewModal(false);
                setNewReview({ movieId: '', reviewerName: '', rating: '', comments: '' });
            })
            .catch((error) => console.error("Error adding review:", error));
    };

    return (
        <div className="container mx-auto p-6">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">MOVIECRITIC</h1>
                <div className="flex space-x-2">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => setShowAddMovieModal(true)}>
                        Add new movie
                    </button>
                    <button
                        onClick={() => setShowAddReviewModal(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded">
                        Add Review
                    </button>
                </div>
            </header>

            <h2 className="text-3xl mb-4">The best movie reviews site!</h2>

            <div className="relative mb-8">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search for your favourite movie"
                    className="border border-gray-300 rounded p-2 w-full"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-4">
                {movies
                    .filter((movie) =>
                        movie.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((movie) => (
                        <div key={movie.id} className="relative bg-indigo-100 p-4 rounded-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:bg-indigo-200">
                            <Link to={`/movies/${movie.id}`} className="block">
                                <h3 className="text-xl font-semibold">{movie.name}</h3>
                                <p className="text-gray-600 mt-2">Released: {new Date(movie.releaseDate).toLocaleDateString()}</p>
                                <p className="text-gray-600 mt-2">Rating: {movie.averageRating || "No ratings yet"}/10</p>
                            </Link>
                            <div className="absolute top-2 right-2 flex space-x-2">
                                <button onClick={() => handleEditMovieClick(movie)} className="text-blue-600">
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDeleteMovie(movie.id)} className="text-red-600">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
            </div>

            {showAddMovieModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-2xl mb-4">Add New Movie</h2>
                        <input
                            type="text"
                            placeholder="Movie Name"
                            value={newMovie.name}
                            onChange={(e) => setNewMovie({ ...newMovie, name: e.target.value })}
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                        />
                        <input
                            type="date"
                            value={newMovie.releaseDate}
                            onChange={(e) => setNewMovie({ ...newMovie, releaseDate: e.target.value })}
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={handleAddMovie}>
                            Add Movie
                        </button>
                        <button
                            className="ml-2 px-4 py-2 rounded border border-gray-400"
                            onClick={() => setShowAddMovieModal(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showEditMovieModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-2xl mb-4">Edit Movie</h2>
                        <input
                            type="text"
                            placeholder="Movie Name"
                            value={newMovie.name}
                            onChange={(e) => setNewMovie({ ...newMovie, name: e.target.value })}
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                        />
                        <input
                            type="date"
                            value={newMovie.releaseDate}
                            onChange={(e) => setNewMovie({ ...newMovie, releaseDate: e.target.value })}
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={handleUpdateMovie}>
                            Update Movie
                        </button>
                        <button
                            className="ml-2 px-4 py-2 rounded border border-gray-400"
                            onClick={() => setShowEditMovieModal(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showAddReviewModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-2xl mb-4">Add Review</h2>
                        <select
                            value={newReview.movieId}
                            onChange={(e) => setNewReview({ ...newReview, movieId: e.target.value })}
                            className="border border-gray-300 rounded p-2 w-full mb-4">
                            <option value="">Select a Movie</option>
                            {movies.map((movie) => (
                                <option key={movie.id} value={movie.id}>{movie.name}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={newReview.reviewerName}
                            onChange={(e) => setNewReview({ ...newReview, reviewerName: e.target.value })}
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                        />
                        <input
                            type="number"
                            placeholder="Rating (out of 10)"
                            value={newReview.rating}
                            onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                        />
                        <textarea
                            placeholder="Review Comment"
                            value={newReview.comments}
                            onChange={(e) => setNewReview({ ...newReview, comments: e.target.value })}
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={handleAddReview}>
                            Add Review
                        </button>
                        <button
                            className="ml-2 px-4 py-2 rounded border border-gray-400"
                            onClick={() => setShowAddReviewModal(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
