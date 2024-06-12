// FeedbackModal.js
import React, {useEffect, useState} from 'react';
import './FeedbackModal.css';
import axios from "axios";

const FeedbackModal = ({ JWT, closeModal }) => {
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const fetchPastTotalFeedback = () => {
            axios.get(`${process.env.REACT_APP_API_URL}/totalfeedback`, {
                headers: {
                    Authorization: `Bearer ${JWT}`
                }
            }).then(response => {
                setFeedback(response.data.gameId);
            }).catch(error => {
                console.error('Failed to fetch recent items:', error);
            });
        }
        fetchPastTotalFeedback();
    }, [JWT, setFeedback]);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${process.env.REACT_APP_API_URL}/totalfeedback/new`, {
            headers: {
                Authorization: `Bearer ${JWT}`
            },
            content : feedback
        }).then(response => {
            setFeedback(response.data.gameId);
        }).catch(error => {
            console.error('Failed to fetch recent items:', error);
        });

        console.log('Feedback submitted:', feedback);

        setFeedback('');
        closeModal();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Leave Your Feedback</h2>
                    <button className="close-btn" onClick={closeModal}></button>
                </div>
                <form
                    className="modal-form"
                    onSubmit={handleSubmit}>
          <textarea
              className="modal-textarea"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback here..."
              required
          />
                    <button
                        className="modal-button"
                        type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default FeedbackModal;
