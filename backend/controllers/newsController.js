const News = require('../models/News');

exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find({ isPublished: true })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createNews = async (req, res) => {
  try {
    const news = await News.create({
      ...req.body,
      author: req.user._id,
    });
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};