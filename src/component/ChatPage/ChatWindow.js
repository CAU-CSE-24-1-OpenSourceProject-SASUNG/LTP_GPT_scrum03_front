import React, {useRef, useEffect, useState} from 'react';
import './ChatWindow.css';
import ResponseFeedbackModal from "./ResponseFeedbackModal";

const ChatWindow = ({ JWT, queries, clear }) => {
    const chatEndRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [queries]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="chat-window">
            {queries.map((item, index) => (
                <div className="message-group" key={index}>
                    <div className="message user-message">{item.query}</div>
                    {item.response !== "" ? (
                        <div className="gpt-message-group">
                            <div className="message gpt-message">
                                {item.response}
                            </div>
                            {clear &&
                                <div>
                                    <button className="response-feedback" onClick={openModal}>
                                        <i className="fas fa-comment"></i>
                                    </button>
                                    {isModalOpen &&
                                        <ResponseFeedbackModal JWT={JWT} closeModal={closeModal} />}
                                </div>
                            }
                        </div>
                    ) : (
                        <div className="message gpt-message">
                            {"질문을 판단하고 있습니다...  "}
                            <div className="loading-spinner"></div>
                        </div>
                    )}
                </div>
            ))}
            <div ref={chatEndRef} /> {/* 스크롤 위치를 조정하는 데 쓰임 */}
        </div>
    );
};

export default ChatWindow;
