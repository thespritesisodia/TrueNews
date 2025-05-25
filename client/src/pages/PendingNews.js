import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PendingNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchPendingArticles();
  }, []);

  const fetchPendingArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/news/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(response.data);
    } catch (err) {
      setError('Failed to fetch pending articles');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (status) => {
    if (!selectedArticle) return;

    setVerifying(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/news/${selectedArticle._id}/verify`,
        {
          verificationStatus: status,
          verificationNotes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedArticle(null);
      setVerificationNotes('');
      fetchPendingArticles();
    } catch (err) {
      setError('Failed to verify article');
    } finally {
      setVerifying(false);
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Pending Articles
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mt: 3 }}>
        {articles.map((article) => (
          <Card key={article._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {article.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  mb: 2,
                }}
              >
                {article.content}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={article.category}
                  color="primary"
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={`By ${article.author.name}`}
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={new Date(article.createdAt).toLocaleDateString()}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => navigate(`/news/${article._id}`)}
              >
                View Details
              </Button>
              <Button
                size="small"
                color="primary"
                onClick={() => setSelectedArticle(article)}
              >
                Verify
              </Button>
            </CardActions>
          </Card>
        ))}

        {articles.length === 0 && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No pending articles to verify
            </Typography>
          </Paper>
        )}
      </Box>

      <Dialog
        open={Boolean(selectedArticle)}
        onClose={() => setSelectedArticle(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Verify Article</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            {selectedArticle?.title}
          </Typography>
          <TextField
            label="Verification Notes"
            fullWidth
            multiline
            rows={4}
            value={verificationNotes}
            onChange={(e) => setVerificationNotes(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setSelectedArticle(null)}
            disabled={verifying}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleVerify('rejected')}
            color="error"
            disabled={verifying}
          >
            {verifying ? <CircularProgress size={24} /> : 'Reject'}
          </Button>
          <Button
            onClick={() => handleVerify('verified')}
            color="success"
            disabled={verifying}
          >
            {verifying ? <CircularProgress size={24} /> : 'Verify'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PendingNews; 