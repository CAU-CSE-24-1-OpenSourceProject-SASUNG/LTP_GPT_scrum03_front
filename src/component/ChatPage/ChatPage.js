import React, { useEffect, useState } from 'react';
import './ChatPage.css';
import Logo from '../../static/icon/logo.svg';
import ChatWindow from "./ChatWindow";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import {useNavigate} from "react-router-dom";

function ChatPage({ JWT, gameId }) {
    const [gameInfo, setGameInfo] = useState(
        [
            { gameTitle: 'dummy', problem: 'dummy problem', queryCount: 30, progress: 0 }
        ]
    );
    const [query, setQuery] = useState("");
    const [queries, setQueries] = useState([]);
    const [canSubmit, setCanSubmit] = useState(false);
    const [clear, setClear] = useState(false);

    useEffect(() => {
        const fetchGameInfo = async () => {
            axios.get(`${process.env.REACT_APP_API_URL}/game/info`, {
                params: { gameId: gameId },
                headers: {
                    'Authorization': `Bearer ${JWT}`
                }
            }).then((response) => {
                const gameInfo = response.data;
                const [gameDetails, ...queries] = gameInfo;
                setGameInfo(gameDetails);
                setQueries(queries);
            }).catch((error) => {
                console.error('Failed to fetch gameInfo:', error);
            });
            axios.get(`${process.env.REACT_APP_API_URL}/game/progress`, {
                    params:{
                        gameId: gameId
                    },
                    headers: {
                        'Authorization': `Bearer ${JWT}`
                    },
                },
            ).then((response) => {
                setGameInfo(prevGameInfo => ({
                    ...prevGameInfo,
                    progress: response.data.progress
                }));
                if (response.data.progress === 100)
                {
                    setClear(true)
                }
            }).catch((error) => {
                console.error('Failed to fetch game progress:', error);
            });
        };
        fetchGameInfo();
        setClear(gameInfo.progress === 100);
        setCanSubmit(!clear);
        if (clear){
            alert("이미 클리어한 게임입니다. 응답 별 피드백을 남길 수 있습니다.");
        }
    }, [JWT, gameId]);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const fetchGptResponse = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/chat`,
                { game_id: gameId, query: query },
                {
                    headers: {
                        'Authorization': `Bearer ${JWT}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            await axios.get(`${process.env.REACT_APP_API_URL}/game/progress`, {
                    params:{
                        gameId: gameId
                    },
                    headers: {
                        'Authorization': `Bearer ${JWT}`
                    },
                },
            ).then((response) => {
                setGameInfo(prevGameInfo => ({
                    ...prevGameInfo,
                    progress: response.data.progress
                }));
                if (response.data.progress === 100)
                {
                    setClear(true)
                }
            }).catch((error) => {
                console.error('Failed to fetch game progress:', error);
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch recent items:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setQuery("");
        const inputLength = query.length;
        if (!canSubmit || inputLength < 1 || inputLength > 200)
            return;
        setCanSubmit(false);
        const newQueryText = query;
        console.log(newQueryText);
        const dummyQuery = { queryId: "dummyId", query: newQueryText, response: "" };
        setQueries([...queries, dummyQuery]);
        try {
            const response = await fetchGptResponse();
            if (response) {
                const updatedQuery = { query: newQueryText, queryId: response.queryId, response: response.response };
                setGameInfo(prevGameInfo => ({
                    ...prevGameInfo,
                    queryCount: response.queryCount
                }));
                setQueries([...queries, updatedQuery]);
            } else {
                alert("해당 게임의 모든 기회를 소진하셨습니다.");
            }
        } catch (error) {
            alert("서버 요청 중에 오류가 발생했습니다.");
        }
        setCanSubmit(true);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit(event);
        }
    };

    return (
        <div className="chat-container">
            <div className="quiz-problem">
                <ReactMarkdown>{gameInfo.problem}</ReactMarkdown>
            </div>
            <div className="chat-group">
                <ChatWindow
                    JWT={JWT}
                    clear={clear}
                    queries={queries}
                />
                {!clear &&
                    <div className="input-group">
                    <textarea
                        id="userQuestion"
                        className="chat-input"
                        placeholder="Enter your question here..."
                        rows="4"
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />
                        <button
                            className="submit-button"
                            type="submit"
                            onClick={handleSubmit}
                            disabled={!canSubmit || query.length < 1 || query.length > 200}
                        >
                            <img className="logo" src={Logo} alt="Logo" />
                        </button>
                    </div>
                }
            </div>
            <div className="remaining-queries">
                남은 질문 횟수: {gameInfo.queryCount}
            </div>
            <div className="progress-bar">
                현재 진행도 : {gameInfo.progress}
                <progress value={gameInfo.progress} max="100"> </progress>
            </div>
        </div>
    );
}


export default ChatPage;