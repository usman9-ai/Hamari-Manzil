import React, { useState, useEffect, useRef } from 'react';

const ChatBox = ({ hostelId, hostelName, ownerName, messages = [], onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && onSendMessage) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);

  if (isMinimized) {
    return (
      <div className="chat-minimized position-fixed bottom-0 end-0 m-3">
        <button
          className="btn btn-primary rounded-pill shadow"
          onClick={() => setIsMinimized(false)}
        >
          <i className="fas fa-comments me-2"></i>
          Chat with {ownerName}
        </button>
      </div>
    );
  }

  return (
    <div className="chat-box position-fixed bottom-0 end-0 m-3 shadow-lg" style={{ width: '350px', height: '500px' }}>
      {/* Chat Header */}
      <div className="chat-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-0 fw-bold">Chat with {ownerName}</h6>
          <small className="opacity-75">{hostelName}</small>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => setIsMinimized(true)}
          >
            <i className="fas fa-minus"></i>
          </button>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => {/* Close chat */}}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="chat-messages bg-white flex-grow-1 p-3"
        style={{ height: '350px', overflowY: 'auto' }}
      >
        {Object.keys(groupedMessages).length === 0 ? (
          <div className="text-center text-muted py-4">
            <i className="fas fa-comments fa-2x mb-3"></i>
            <p>Start a conversation with {ownerName}</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dayMessages]) => (
            <div key={date}>
              <div className="text-center my-3">
                <span className="badge bg-light text-muted">
                  {formatDate(dayMessages[0].timestamp)}
                </span>
              </div>
              {dayMessages.map((message) => (
                <div
                  key={message.id}
                  className={`message mb-3 ${
                    message.senderType === 'student' ? 'text-end' : 'text-start'
                  }`}
                >
                  <div
                    className={`d-inline-block p-2 rounded ${
                      message.senderType === 'student'
                        ? 'bg-primary text-white'
                        : 'bg-light text-dark'
                    }`}
                    style={{ maxWidth: '80%' }}
                  >
                    <p className="mb-1">{message.message}</p>
                    <small className={`opacity-75 ${
                      message.senderType === 'student' ? 'text-white-50' : 'text-muted'
                    }`}>
                      {formatTime(message.timestamp)}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="chat-input p-3 border-top">
        <form onSubmit={handleSendMessage} className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!newMessage.trim()}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
