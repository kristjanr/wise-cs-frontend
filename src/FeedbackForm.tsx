import React, {useState} from "react";
import Modal from 'react-modal'
import axios from "axios";


interface FeedbackFormProps {
    messageId: number;
}

const backendUrl = `${process.env.REACT_APP_BACKEND_URL}`


const FeedbackForm: React.FC<FeedbackFormProps> = ({ messageId }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [feedbackType, setFeedbackType] = useState<'good'|'bad' | null>(null); // new state for feedback type
    const [additionalFeedback, setAdditionalFeedback] = useState('');

    const handleThumbsUp = () => {
        setModalIsOpen(true);
        setFeedbackType('good');
    };

    const handleThumbsDown = () => {
        setModalIsOpen(true);
        setFeedbackType('bad');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Construct the feedback object
        const feedbackData = {
            messageId: messageId,
            feedback: feedbackType,
            additionalFeedback: additionalFeedback
        };

        // Send the feedback to the backend
        try {
            const response = await axios.post(`${backendUrl}/feedback`, feedbackData, { withCredentials: true });
            console.log(response.data);
        } catch (error) {
            console.error('Error sending feedback:', error);
        }

        // Close the modal
        setModalIsOpen(false);
    };

    return (
        <div>
            <button className="feedback-button feedback-button-thumbs-up" onClick={handleThumbsUp}>👍</button>
            <button className="feedback-button feedback-button-thumbs-down" onClick={handleThumbsDown}>👎</button>

            {feedbackType === 'good' && (
                <Modal isOpen={modalIsOpen}>
                    {/* thumbs up modal content */}
                    <form onSubmit={handleSubmit}>
                        <label>
                            Additional feedback for thumbs up:
                            <textarea value={additionalFeedback} onChange={e => setAdditionalFeedback(e.target.value)} />
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                </Modal>
            )}

            {feedbackType === 'bad' && (
                <Modal isOpen={modalIsOpen}>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Additional feedback for thumbs down:
                            <textarea value={additionalFeedback} onChange={e => setAdditionalFeedback(e.target.value)} />
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default FeedbackForm;