import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState({});
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({ reviewerName: '', rating: '', comments: '' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {

        axios.get(`http://localhost:5000/movies/${id}`)
            .then((res) => setMovie(res.data))
            .catch(error => console.error("Error fetching movie:", error));


        axios.get(`http://localhost:5000/reviews?movieId=${id}`)
            .then((res) => {
                setReviews(res.data);
                setFilteredReviews(res.data);
            })
            .catch(error => console.error("Error fetching reviews:", error));
    }, [id]);

    useEffect(() => {
        const results = reviews.filter(review =>
            review.comments.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredReviews(results);
    }, [searchTerm, reviews]);

    const handleAddReview = () => {
        if (!reviewForm.reviewerName || !reviewForm.rating || !reviewForm.comments) {
            alert("Please fill in all fields.");
            return;
        }
        const newReview = { ...reviewForm, movieId: id };

        axios.post("http://localhost:5000/reviews", newReview)
            .then(() => {
                setReviews([...reviews, newReview]);
                setFilteredReviews([...filteredReviews, newReview]);
                setReviewForm({ reviewerName: '', rating: '', comments: '' });
            })
            .catch(error => console.error("Error adding review:", error));
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold mb-4">{movie.name}</h1>
            <p>Release Date: {new Date(movie.releaseDate).toLocaleDateString()}</p>
            <p>Average Rating: {movie.averageRating || "No ratings yet"}</p>

            <h2 className="text-2xl font-bold mt-6 mb-4">Search Reviews</h2>
            <input
                type="text"
                placeholder="Search for reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2 rounded mb-4"
            />

            <h2 className="text-2xl font-bold mt-6 mb-4">Reviews</h2>
            <div className="space-y-4">
                {filteredReviews.length ? filteredReviews.map((review) => (
                    <div key={review.id} className="bg-indigo-100 p-4 border rounded-lg">
                        <p><strong>{review.reviewerName || "Anonymous"}:</strong> {review.comments}</p>
                        <p>Rating: {review.rating}/10</p>
                    </div>
                )) : <p>No reviews found.</p>}
            </div>

            <h2 className="text-2xl font-bold mt-6 mb-4">Add a Review</h2>
            <div className="flex flex-col space-y-4">
                <input
                    type="text"
                    placeholder="Your Name"
                    value={reviewForm.reviewerName}
                    onChange={(e) => setReviewForm({ ...reviewForm, reviewerName: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Rating (1-10)"
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                />
                <textarea
                    placeholder="Your Comments"
                    value={reviewForm.comments}
                    onChange={(e) => setReviewForm({ ...reviewForm, comments: e.target.value })}
                />
                <button onClick={handleAddReview} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Submit Review
                </button>
            </div>
        </div>
    );
}

export default MovieDetails;
