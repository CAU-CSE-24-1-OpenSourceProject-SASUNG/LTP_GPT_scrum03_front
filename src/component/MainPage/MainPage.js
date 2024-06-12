import React, {useEffect, useState} from 'react';
import UserInfo from './UserInfo';
import RecentButton from './RecentButton';
import RiddleList from './RiddleList';
import FeedbackModal from "./FeedbackModal";
import './MainPage.css';
import axios from "axios";

function MainPage({ JWT, userInfo, setUserInfo, setGameId, riddles, setRiddles }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/user/info`, {
            headers: {
                'Authorization': `Bearer ${JWT}`
            }
        }).then((response) => {
            setUserInfo({...userInfo,
                riddleTicket: response.data.riddleTicket,
                gameTicket: response.data.gameTicket,
                experience: response.data.experience
            });
        }).catch((error) => {
            console.error("Fail to fetch userinfo : ", error);
        });
    }, [JWT]);

    useEffect(() => {
        const fetchRiddleItems = async () => {
            axios.get(`${process.env.REACT_APP_API_URL}/riddle/list`, {
                headers: {
                    'Authorization': `Bearer ${JWT}`
                }
            }).then((response) => {
                setRiddles(response.data);
            }).catch ((error) => {
                console.error('Failed to fetch recent items:', error);
            })
        };
        fetchRiddleItems();
    }, [JWT, setRiddles]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="main-page">
            <div className="main-center">
                <UserInfo userInfo={userInfo} />
                <RecentButton JWT={JWT} setGameId={setGameId} />
                <button className="open-modal-btn" onClick={openModal}>
                    Leave Feedback
                </button>
                {isModalOpen && <FeedbackModal JWT={JWT} closeModal={closeModal} />}            </div>
            <div className="riddle-section">
                <RiddleList JWT={JWT} userInfo={userInfo} setGameId={setGameId} riddles={riddles} />
            </div>
        </div>
    );
}

export default MainPage;
