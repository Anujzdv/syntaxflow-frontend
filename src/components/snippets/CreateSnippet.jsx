// src/components/snippets/CreateSnippet.jsx
import React, { useState } from 'react';
import api from '../../services/api';
import './CreateSnippet.css';

const CreateSnippet = ({ onSnippetPosted }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    language: 'JavaScript',
  });

  const { title, description, code, language } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/snippets', formData);
      onSnippetPosted(res.data); // Pass the new snippet back to the parent (Feed)
      // Clear the form
      setFormData({
        title: '',
        description: '',
        code: '',
        language: 'JavaScript',
      });
    } catch (err) {
      console.error('Failed to create snippet', err);
      alert('Error: Could not post snippet.');
    }
  };

  return (
    <form className="snippet-form" onSubmit={onSubmit}>
      <h3>Share a Code Snippet!</h3>
      <div className="form-group">
        <input
          type="text"
          name="title"
          value={title}
          onChange={onChange}
          placeholder="Snippet Title"
          required
        />
      </div>
      <div className="form-group">
        <select name="language" value={language} onChange={onChange}>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
          <option value="C++">C++</option>
          <option value="C">C</option>
        </select>
      </div>
      <div className="form-group">
        <textarea
          name="description"
          value={description}
          onChange={onChange}
          placeholder="What does this code do?"
        ></textarea>
      </div>
      <div className="form-group">
        <textarea
          name="code"
          value={code}
          onChange={onChange}
          placeholder="Your code here..."
          rows="5"
          required
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary">Post</button>
    </form>
  );
};

export default CreateSnippet;