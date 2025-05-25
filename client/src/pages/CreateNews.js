import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const categories = [
  'politics',
  'technology',
  'science',
  'health',
  'business',
  'sports',
  'entertainment',
  'other',
];

const CreateNews = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [source, setSource] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !content || !source || !sourceUrl || !category) {
      setError('All fields are required');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/news',
        {
          title,
          content,
          source,
          sourceUrl,
          category,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create news article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Submit News Article
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <TextField
            label="Content"
            fullWidth
            margin="normal"
            multiline
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <TextField
            label="Source"
            fullWidth
            margin="normal"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
          />

          <TextField
            label="Source URL"
            fullWidth
            margin="normal"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            required
          />

          <TextField
            select
            label="Category"
            fullWidth
            margin="normal"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Submitting...
                </>
              ) : (
                'Submit Article'
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateNews; 