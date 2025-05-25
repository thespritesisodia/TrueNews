import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const NewsDetail = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/news/${id}`);
      setArticle(response.data);
    } catch (err) {
      setError('Failed to fetch article');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !article) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Article not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {article.title}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Chip
            label={article.category}
            color="primary"
            sx={{ mr: 1 }}
          />
          <Chip
            label={`By ${article.author.name}`}
            variant="outlined"
            sx={{ mr: 1 }}
          />
          <Chip
            label={`Verified by ${article.verifiedBy?.name || 'Unknown'}`}
            color="success"
            variant="outlined"
          />
        </Box>

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {new Date(article.createdAt).toLocaleDateString()}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body1" paragraph>
          {article.content}
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Source: <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">{article.source}</a>
          </Typography>
        </Box>

        {user && (user.role === 'editor' || user.role === 'admin') && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Verification Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Status: {article.verificationStatus}
            </Typography>
            {article.verificationNotes && (
              <Typography variant="body2" color="text.secondary">
                Notes: {article.verificationNotes}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              Verified on: {new Date(article.verificationDate).toLocaleDateString()}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default NewsDetail; 