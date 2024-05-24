import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './component/Sidebar/Sidebar';
import MainPage from "./component/MainPage/MainPage";
import ChatPage from "./component/ChatPage/ChatPage";
import { GoogleLoginPage } from './component/Login/GoogleLoginPage';
import NewRiddlePage from './component/MainPage/NewRiddlePage';

import "./App.css";

function App() {
    const [gameId, setGameId] = useState('main');
    const [riddles, setRiddles] = useState([]);
    const [isOpen, setIsOpen] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    const [JWT, setJWT] = useState();
    const [userInfo, setUserInfo] = useState(
        {name: "", email: "", picture: "", exp: 1, gameTicket: 40, riddleTicket: 3});

    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/login" element={
                        <GoogleLoginPage
                            setIsLogin={setIsLogin}
                            setUserInfo={setUserInfo}
                            setJWT={setJWT}
                        />
                    } />
                    <Route path="/main" element={
                        isLogin ? (
                            <div className="app">
                                <Sidebar
                                    JWT={JWT}
                                    userInfo={userInfo}
                                    gameId={gameId}
                                    setGameId={setGameId}
                                    isOpen={isOpen}
                                    setIsOpen={setIsOpen}
                                />
                                <div className={`main-content ${isOpen ? "" : "full"}`}>
                                    <MainPage
                                        JWT={JWT}
                                        userInfo={userInfo}
                                        setUserInfo={setUserInfo}
                                        setGameId={setGameId}
                                        riddles={riddles}
                                        setRiddles={setRiddles}
                                    />
                                </div>
                            </div>
                        ) : (
                            <Navigate to="/login" />
                        )
                    } />
                    <Route path="/game/:gameId" element={
                        isLogin ? (
                            <div className="app">
                                <Sidebar
                                    JWT={JWT}
                                    userInfo={userInfo}
                                    gameId={gameId}
                                    setGameId={setGameId}
                                    isOpen={isOpen}
                                    setIsOpen={setIsOpen}
                                />
                                <div className={`main-content ${isOpen ? "" : "full"}`}>
                                    <ChatPage
                                        JWT={JWT}
                                        gameId={gameId}
                                    />
                                </div>
                            </div>
                        ) : (
                            <Navigate to="/login" />
                        )
                    } />
                    <Route path="/newriddle" element={
                        isLogin ? (
                            <div className="app">
                                <Sidebar
                                    JWT={JWT}
                                    userInfo={userInfo}
                                    gameId={gameId}
                                    setGameId={setGameId}
                                    isOpen={isOpen}
                                    setIsOpen={setIsOpen}
                                />
                                <div className={`main-content ${isOpen ? "" : "full"}`}>
                                    <NewRiddlePage
                                        JWT={JWT} />
                                </div>
                            </div>
                        ) : (
                            <Navigate to="/login" />
                        )
                    } />
                    <Route path="*" element={<Navigate to={isLogin ? "/main" : "/login"} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
