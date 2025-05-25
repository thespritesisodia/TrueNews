const express = require('express');
const router = express.Router();
const News = require('../models/News');
const { auth, checkRole } = require('../middleware/auth');

// Get all verified news
router.get('/', async (req, res) => {
    try {
        const news = await News.find({ verificationStatus: 'verified' })
            .populate('author', 'name')
            .sort({ createdAt: -1 });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news', error: error.message });
    }
});

// Create new article (requires authentication)
router.post('/', auth, async (req, res) => {
    try {
        const news = new News({
            ...req.body,
            author: req.user._id
        });
        await news.save();
        res.status(201).json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error creating news article', error: error.message });
    }
});

// Verify news article (requires editor or admin role)
router.patch('/:id/verify', auth, checkRole(['editor', 'admin']), async (req, res) => {
    try {
        const { verificationStatus, verificationNotes } = req.body;
        const news = await News.findById(req.params.id);
        
        if (!news) {
            return res.status(404).json({ message: 'News article not found' });
        }

        news.verificationStatus = verificationStatus;
        news.verificationNotes = verificationNotes;
        news.verifiedBy = req.user._id;
        news.verificationDate = new Date();

        await news.save();
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error verifying news article', error: error.message });
    }
});

// Get pending articles (requires editor or admin role)
router.get('/pending', auth, checkRole(['editor', 'admin']), async (req, res) => {
    try {
        const news = await News.find({ verificationStatus: 'pending' })
            .populate('author', 'name')
            .sort({ createdAt: -1 });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending news', error: error.message });
    }
});

// Get article by ID
router.get('/:id', async (req, res) => {
    try {
        const news = await News.findById(req.params.id)
            .populate('author', 'name')
            .populate('verifiedBy', 'name');
        
        if (!news) {
            return res.status(404).json({ message: 'News article not found' });
        }
        
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news article', error: error.message });
    }
});

module.exports = router; 