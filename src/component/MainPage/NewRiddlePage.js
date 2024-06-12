import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NewRiddlePage.css';

const NewRiddlePage = ({ JWT }) => {
    const [riddleTitle, setRiddleTitle] = useState('');
    const [problem, setProblem] = useState('');
    const [situationSentences, setSituationSentences] = useState(['']);
    const [answerSentences, setAnswerSentences] = useState(['']);
    const navigate = useNavigate();

    const handleAddSituationSentence = () => {
        if (situationSentences.length < 10) {
            setSituationSentences([...situationSentences, '']);
        }
    };

    const handleRemoveSituationSentence = (index) => {
        if (situationSentences.length > 1) {
            setSituationSentences(situationSentences.filter((_, i) => i !== index));
        }
    };

    const handleChangeSituationSentence = (index, value) => {
        const newSentences = [...situationSentences];
        newSentences[index] = value;
        setSituationSentences(newSentences);
    };

    const handleAddAnswerSentence = () => {
        if (answerSentences.length < 5) {
            setAnswerSentences([...answerSentences, '']);
        }
    };

    const handleRemoveAnswerSentence = (index) => {
        if (answerSentences.length > 1) {
            setAnswerSentences(answerSentences.filter((_, i) => i !== index));
        }
    };

    const handleChangeAnswerSentence = (index, value) => {
        const newSentences = [...answerSentences];
        newSentences[index] = value;
        setAnswerSentences(newSentences);
    };

    const validateInputs = () => {
        if (riddleTitle.length < 1 || riddleTitle.length > 1000) return false;
        if (problem.length < 1 || problem.length > 1000) return false;
        if (situationSentences.some(sentence => sentence.length < 1) || situationSentences.length < 1) return false;
        if (answerSentences.some(sentence => sentence.length < 1) || answerSentences.length < 1) return false;
        return true;
    };

    const handleCreateRiddle = () => {
        if (!validateInputs()) {
            alert('Please ensure all inputs are correctly filled out.');
            return;
        }

        const newRiddle = {
            riddleTitle: riddleTitle,
            problem: problem,
            situations: situationSentences.filter(sentence => sentence.length > 0),
            answers: answerSentences.filter(sentence => sentence.length > 0),
        };
        axios.post(`${process.env.REACT_APP_API_URL}/riddle/new`, newRiddle, {
            headers: { 'Authorization': `Bearer ${JWT}` }
        }).then(response => {
            navigate('/main');
            alert("새로운 수수께끼가 정상적으로 생성되었습니다!");
        }).catch(error => {
            alert("형식에 맞지 않거나, 새로운 수수께끼를 만들기 위한 수수께끼 티켓이 부족합니다!");
            console.error('Failed to create new riddle:', error);
        });
    };

    return (
        <div className="new-riddle-page">
            <h2>Create New Riddle</h2>
            <div className="form-container">
                <div className="new-input-group">
                    <label>Riddle Title</label>
                    <input type="text" placeholder="수수께끼의 제목을 정해주세요. (Write a title about riddle what you make.)" value={riddleTitle} onChange={e => setRiddleTitle(e.target.value)} />
                </div>
                <div className="new-input-group">
                    <label>Problem</label>
                    <textarea value={problem} placeholder="수수께끼의 문제 내용을 적어주세요. (Write a problem about this new riddle.)" onChange={e => setProblem(e.target.value)} />
                </div>
                <div className="new-input-group sentences-group">
                    <label>Situation Sentences</label>
                    {situationSentences.map((sentence, index) => (
                        <div key={index} className="sentence">
                            <input
                                type="text"
                                value={sentence}
                                placeholder="숨겨진 정보, 상황들을 한 문장씩 입력해주세요. (Write hidden situation information line by line.)"
                                onChange={e => handleChangeSituationSentence(index, e.target.value)}
                            />
                            {situationSentences.length > 1 && (
                                <button onClick={() => handleRemoveSituationSentence(index)} className="remove-button">Remove</button>
                            )}
                        </div>
                    ))}
                    {situationSentences.length < 10 && (
                        <div className="add-sentence-container">
                            <span>현재 작성된 문장의 개수: {situationSentences.length}</span>
                            <span>입력 최대 문장 개수: 10</span>
                            <button onClick={handleAddSituationSentence} className="add-button">Add Situation Sentence</button>
                        </div>
                    )}
                </div>
                <div className="new-input-group sentences-group">
                    <label>Answer Sentences</label>
                    {answerSentences.map((sentence, index) => (
                        <div key={index} className="sentence">
                            <input
                                type="text"
                                value={sentence}
                                placeholder="정답 상황을 한 줄씩 작성해주세요. (Write the answer situation specifically line by line.)"
                                onChange={e => handleChangeAnswerSentence(index, e.target.value)}
                            />
                            {answerSentences.length > 1 && (
                                <button onClick={() => handleRemoveAnswerSentence(index)} className="remove-button">Remove</button>
                            )}
                        </div>
                    ))}
                    {answerSentences.length < 5 && (
                        <div className="add-sentence-container">
                            <span>현재 작성된 문장의 개수: {answerSentences.length}</span>
                            <span>입력 최대 문장 개수: 5</span>
                            <button onClick={handleAddAnswerSentence} className="add-button">Add Answer Sentence</button>
                        </div>
                    )}
                </div>
                <button className="create-button" onClick={handleCreateRiddle}>Create New Riddle</button>
            </div>
        </div>
    );
};

export default NewRiddlePage;
