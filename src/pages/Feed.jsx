// src/pages/Feed.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CreateSnippet from '../components/snippets/CreateSnippet';
import SnippetItem from '../components/snippets/SnippetItem';

const Feed = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all snippets on component mount
  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/snippets');
        setSnippets(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch snippets', err);
        setLoading(false);
      }
    };
    fetchSnippets();
  }, []);

  // Function to add a new snippet to the top of the list
  const handleSnippetPosted = (newSnippet) => {
    setSnippets([newSnippet, ...snippets]);
  };

  return (
    <div>
      <h1>Code Snippet Feed</h1>
      <CreateSnippet onSnippetPosted={handleSnippetPosted} />
      
      {loading ? (
        <p>Loading snippets...</p>
      ) : (
        <div className="snippet-list">
          {snippets.map((snippet) => (
            <SnippetItem key={snippet._id} snippet={snippet} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;