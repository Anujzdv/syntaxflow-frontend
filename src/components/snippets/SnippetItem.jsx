// src/components/snippets/SnippetItem.jsx
import React, { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';
import './SnippetItem.css';

const SnippetItem = ({ snippet }) => {
  const { user } = useContext(AuthContext);
  const [likes, setLikes] = useState(snippet.likes || []);
  const [comments, setComments] = useState(snippet.comments || []);
  const [commentText, setCommentText] = useState('');

  // Check if the current user has liked this post
  const hasLiked = likes.some((like) => like.user === user._id);

  const handleLike = async () => {
    try {
      const res = await api.put(`/api/snippets/like/${snippet._id}`);
      setLikes(res.data); // Update likes from server response
    } catch (err) {
      console.error('Like failed', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText) return;
    try {
      const res = await api.post(`/api/snippets/comment/${snippet._id}`, { text: commentText });
      setComments(res.data); // Update comments from server
      setCommentText('');
    } catch (err) {
      console.error('Comment failed', err);
    }
  };
  
  // Helper to format the code block
  const formattedCode = "```" + snippet.language.toLowerCase() + "\n" + snippet.code + "\n```";

  return (
    <div className="snippet-card">
      <div className="snippet-header">
        <span className="snippet-author">{snippet.user.name || 'User'}</span>
        <span className="snippet-language">{snippet.language}</span>
      </div>
      <div className="snippet-body">
        <h4>{snippet.title}</h4>
        <p>{snippet.description}</p>
        <pre className="code-block">
          <code>{snippet.code}</code>
        </pre>
      </div>
      <div className="snippet-actions">
        <button onClick={handleLike} className={`btn-like ${hasLiked ? 'liked' : ''}`}>
          ❤️ {likes.length} Like{likes.length !== 1 ? 's' : ''}
        </button>
        <span className="comment-count">
          💬 {comments.length} Comment{comments.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="snippet-comments">
        <form onSubmit={handleComment} className="comment-form">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit">Post</button>
        </form>
        <div className="comment-list">
          {comments.slice(0, 3).map((comment) => ( // Show 3 recent comments
            <div key={comment._id} className="comment">
              <strong>{comment.name}:</strong> {comment.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SnippetItem;