import React, {CSSProperties, useState} from "react";
import Modal from 'react-modal'


interface FeedbackFormProps {
    messageId: number;
}


const FeedbackForm: React.FC<FeedbackFormProps> = ({messageId}) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [feedbackType, setFeedbackType] = useState<'good' | 'bad' | null>(null); // new state for feedback type
    const [additionalFeedback, setAdditionalFeedback] = useState('');
    const closeModal = () => {
        setModalIsOpen(false);
    };
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
        const response = await fetch(`/feedback`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(feedbackData)
        });

        if (!response.ok) {
            const data = await response.text();
            console.error('Error sending feedback:', data);
        }

        // Close the modal
        setModalIsOpen(false);
    };

    type ModalStyles = {
        overlay?: CSSProperties;
        content?: CSSProperties;
    };

// Define the styles for the Modal component
    const modalStyles: ModalStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            maxHeight: '80vh',
            border: '1px solid #ccc',
            background: '#fff',
            borderRadius: '4px',
            outline: 'none',
            padding: '20px'
        }
    };
    return (
        <div>
            <button className="feedback-button feedback-button-thumbs-up" onClick={handleThumbsUp}>👍</button>
            <button className="feedback-button feedback-button-thumbs-down" onClick={handleThumbsDown}>👎</button>

            {feedbackType === 'good' && (
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyles}>
                    {/* thumbs up modal content */}
                    <form className="modal-content" onSubmit={handleSubmit}>
                        <label>
                            Additional feedback for 👍
                            <textarea className="feedback-textarea" value={additionalFeedback}
                                      onChange={e => setAdditionalFeedback(e.target.value)}/>
                        </label>
                        <button className="msger-send-btn" type="submit">Give feedback</button>
                    </form>
                </Modal>
            )}

            {feedbackType === 'bad' && (
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyles}>
                    <form className="modal-content" onSubmit={handleSubmit}>
                        <label>
                            Additional feedback for 👎
                            <textarea className="feedback-textarea" value={additionalFeedback}
                                      onChange={e => setAdditionalFeedback(e.target.value)}/>
                        </label>
                        <button className="msger-send-btn" type="submit">Give feedback</button>
                    </form>
                </Modal>
            )}
        </div>
    );

};

export default FeedbackForm;