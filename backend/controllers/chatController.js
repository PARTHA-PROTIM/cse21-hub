const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('user', 'name regNo role')
      .sort({ createdAt: 1 })
      .limit(100); // Last 100 messages
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    const newMessage = await Message.create({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      message: message,
    });
    
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('user', 'name regNo role');
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Only allow user to delete their own message or CR can delete any
    if (message.user.toString() !== req.user._id.toString() && req.user.role !== 'cr') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};