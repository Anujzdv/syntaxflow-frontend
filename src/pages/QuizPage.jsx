// src/pages/QuizPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Quiz.css';

const QuizPage = () => {
  const { language } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]); // Stores { questionId, answer }
  const [loading, setLoading] = useState(true);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300 seconds)
  const timerRef = useRef(null);

  // 1. Fetch questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/api/quiz/${language}`);
        setQuestions(res.data);
        setLoading(false);
        startTimer();
      } catch (err) {
        console.error('Failed to fetch questions', err);
        alert('Could not load quiz.');
        navigate('/quiz');
      }
    };
    fetchQuestions();

    // Cleanup timer on unmount
    return () => clearInterval(timerRef.current);
  }, [language, navigate]);

  // 2. Timer logic
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          submitQuiz(); // Auto-submit when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 3. Handle answer selection
  const handleSelectAnswer = (index) => {
    setSelectedAnswer(index);
  };

  // 4. Handle "Next" button click
  const handleNext = () => {
    // Save the answer
    setAnswers([...answers, {
      questionId: questions[currentQuestion]._id,
      answer: selectedAnswer
    }]);

    // Clear selection
    setSelectedAnswer(null);

    // Check if it's the last question
    if (currentQuestion === questions.length - 1) {
      submitQuiz();
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // 5. Submit the quiz
  const submitQuiz = async () => {
    clearInterval(timerRef.current); // Stop the timer

    const finalAnswers = [...answers, {
      questionId: questions[currentQuestion]?._id, // Handle last question
      answer: selectedAnswer
    }].filter(a => a.questionId); // Filter out any undefined

    const timeTaken = 300 - timeLeft;

    try {
      const res = await api.post('/api/quiz/submit', {
        language,
        answers: finalAnswers,
        timeTaken
      });

      // --- THIS LINE IS UPDATED ---
      // Navigate to results page, passing BOTH result and questions
      navigate('/quiz/result', { state: { result: res.data, questions: questions } });
      // --- END OF UPDATE ---

    } catch (err) {
      console.error('Failed to submit quiz', err);
      alert('Error submitting quiz.');
    }
  };

  if (loading) {
    return <div className="quiz-container"><h2>Loading Quiz...</h2></div>;
  }

  if (questions.length === 0) {
    return <div className="quiz-container"><h2>No questions found for {language}.</h2></div>;
  }

  const q = questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{language} Quiz</h2>
        <div className="quiz-timer">{formatTime(timeLeft)}</div>
      </div>
      <div className="question-card">
        <h3>Question {currentQuestion + 1} of {questions.length}</h3>
        <p className="question-text">{q.question}</p>
        <div className="options-grid">
          {q.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${selectedAnswer === index ? 'selected' : ''}`}
              onClick={() => handleSelectAnswer(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={handleNext}
        className="btn btn-primary next-btn"
        disabled={selectedAnswer === null} // Disable if no answer is selected
      >
        {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
      </button>
    </div>
  );
};

export default QuizPage;
