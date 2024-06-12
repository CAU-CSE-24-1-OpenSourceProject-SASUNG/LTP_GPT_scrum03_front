import React, {useEffect, useState} from 'react';
import './RecentButton.css';
import axios from "axios";
import {useNavigate} from "react-router-dom"; // 스타일링을 위한 CSS 파일

function RecentButton({JWT, setGameId}) {
    const [recentGameId, setRecentGameId] = useState()
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecentGameId = () => {
            axios.get(`${process.env.REACT_APP_API_URL}/game/recent`, {
                headers: {
                    Authorization: `Bearer ${JWT}`
                }
            }).then(response => {
                setRecentGameId(response.data.gameId);
            }).catch(error => {
                console.error('Failed to fetch recent items:', error);
            });
        }
        fetchRecentGameId();
    }, [JWT, setGameId]);
    return (
        <div className="recent-button" onClick={() => {
            if (recentGameId !== undefined) {
                setGameId(recentGameId);
                navigate(`/game/${recentGameId}`);
            }
            else {
                alert("가장 최근에 플레이한 게임이 유효하지 않습니다!");
            }
        }}>
            {}
        </div>
    );
}

export default RecentButton;
