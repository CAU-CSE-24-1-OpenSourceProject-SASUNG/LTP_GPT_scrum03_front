import React, {useState} from 'react';
import './FeedbackModal.css';
import axios from "axios";

const FeedbackModal = ({ JWT, closeModal }) => {
    const [feedback, setFeedback] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.patch(`${process.env.REACT_APP_API_URL}/totalfeedback/update`, {
                content : feedback,
            },
            {
                headers: {
                    Authorization: `Bearer ${JWT}`
                },
            }).then(response => {
            alert('피드백이 정상적으로 제출되었습니다!')
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
                    <button className="close-btn" onClick={closeModal}>
                        <i className="fas fa-times"></i>
                    </button>
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
