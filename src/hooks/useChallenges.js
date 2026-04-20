import { useState, useCallback } from 'react';
import api from '../services/api';

export function useChallenges() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/challenges');
      setIncoming(res.data.incoming || []);
      setOutgoing(res.data.outgoing || []);
      setHistory(res.data.history || []);
    } catch (err) {
      console.error('Failed to fetch challenges:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const issueChallenge = async (targetUserId, topic, difficulty) => {
    try {
      const res = await api.post('/api/challenges', { targetUserId, topic, difficulty });
      const challenge = res.data.challenge;
      setOutgoing((prev) => [challenge, ...prev]);
      return challenge;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const respondToChallenge = async (challengeId, status) => {
    try {
      const res = await api.put(`/api/challenges/${challengeId}/respond`, { status });
      const challenge = res.data.challenge;
      
      // Update local state by removing from incoming
      setIncoming((prev) => prev.filter(c => c._id !== challengeId));
      
      return challenge;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  return {
    incoming,
    outgoing,
    history,
    loading,
    fetchChallenges,
    issueChallenge,
    respondToChallenge
  };
}
