import React, { useState } from 'react';

interface Notification {
  id: number;
  address_id: number | null;
  event_id: number;
  is_read: boolean;
  created_at: string;
  event: {
    id: number;
    event_type_id: number;
    address_id: number | null;
    event_direction_id: number;
    from: string;
    to: string;
    body: string;
    url: string;
    url_type: string;
    conversation_id: string;
    created_by: string;
    contact_established: string;
    dead: string;
    created_at: string;
    received_at: string;
    keep_an_eye: string;
    is_stop: boolean;
    phone_number_id: string;
    user_id: string;
  };
  handleMarkAsRead: (event_id: number) => void;
}

const NotificationItem: React.FC<Notification> = ({ event, is_read, event_id, handleMarkAsRead }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const maxContentLength = 18; // Adjust this length as needed

  return (
    <li key={event_id} className={!is_read ? 'new-notification' : ''}>
      <div>
        <span>
          <i className="bi bi-chat-right-text icon-message icon-missed"></i>
        </span>
        <span className='missed-message'>You have missed message from</span>
        <div className='event-from'>{event.from}


     
        </div>
     <div className='message-body' >

        
        Message:
        {isExpanded || event.body.length <= maxContentLength
          ? event.body
          : `${event.body.slice(0, maxContentLength)}.. `}
        {event.body.length > maxContentLength && (
          <button onClick={toggleReadMore} className='read-more-btn text-success'>
            {isExpanded ? '..Read Less' : 'Read More'}
          </button>
        )} 
        <div>   
        {!is_read && (
          <button
            onClick={() => handleMarkAsRead(event_id)}
            className='notification-info'
          > 
            Mark as Read
          </button>
        )}

        </div>
        </div>
      </div>
    
    </li>
  );
};

export default NotificationItem;
