import React, {useEffect, useState} from 'react';
import './ChatPage.css';
import Logo from '../../static/icon/logo.svg';
import ChatWindow from "./ChatWindow";
import axios from "axios";

function ChatPage({JWT, gameId }) {
    const [gameInfo, setGameInfo] = useState(
        [
            {gameTitle : 'dummy', problem : 'dummy problem'}
        ]
    );
    const [query, setQuery] = useState("");
    const [queries, setQueries] = useState([]);
    const [canSubmit, setCanSubmit] = useState(true);

    useEffect(() => {
        const fetchGameInfo = async () => {
            axios.get(`http://localhost:8000/gameinfo`, {
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
        };
        fetchGameInfo();
    }, [JWT, gameId]);


    //쿼리 set
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const fetchGptResponse = async () => {
        try {
            const response = await axios.post(`http://localhost:8000/chat`,
                { game_id: gameId, query: query }, {
                    headers: {
                        'Authorization': `Bearer ${JWT}`,
                        'Content-Type': 'application/json'
                    }
                });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch recent items:', error);
            return null;
        }
    };

    //submit event
    const handleSubmit = async (e) => {
        e.preventDefault();
        setQuery("");  // 입력 필드 초기화
        const inputLength = query.length;
        if (!canSubmit || inputLength < 1 || inputLength > 200)
            return;
        setCanSubmit(false);
        const newQueryText = query;  // query 값을 복사하여 새로운 변수에 저장
        console.log(newQueryText);
        const dummyQuery = { queryId: "dummyId", query: newQueryText, response: "" };
        setQueries([...queries, dummyQuery]);
        const response = await fetchGptResponse();
        if (response) {
            const updatedQuery = {...dummyQuery, queryId: response.queryId, response: response.response};
            setQueries([...queries.slice(0, -1), updatedQuery]);
        }
        else
            alert("해당 게임의 모든 기회를 소진하셨습니다.");
        setCanSubmit(true);
    };

    //enter submit
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit(event);
        }
    };

    return (
        <div className="chat-container">
            <div className="quiz-problem">
                {`Problem : ${gameInfo.problem}`}
            </div>
            <div className="chat-group">
                <ChatWindow queries={queries} query={query}/>
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
            </div>
        </div>
    );
}

export default ChatPage;
