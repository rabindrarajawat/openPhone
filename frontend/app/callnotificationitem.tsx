import React from 'react';

interface CallNotificationProps {
  event: {
    from: string;
    to: string;
  };
  is_read: boolean;
  event_id: number;
  handleMarkAsRead: (event_id: number) => void;
}

const CallNotificationItem: React.FC<CallNotificationProps> = ({ event, is_read, event_id, handleMarkAsRead }) => {
  return (
    <li key={event_id} className={!is_read ? 'new-notification' : ''}>
      <div className='callset'>
        <span className='call-icon'>
          <i className=" bi bi-telephone-inbound-fill icon-call  bg-light text-danger"></i>
        </span>
        <span className='missed-call'>You have missed a call from</span>
       <div className='d-flex'>

        <div className='event-from1'>Number:{event.from}
            <span>

        {!is_read && (
            <button
              onClick={() => handleMarkAsRead(event_id)}
              className='notification-info1'
            >
              Mark as Read
            </button>
          )}
            </span>

        
          </div>
       </div>
        <div>
         
        </div>
      </div>
    </li>
  );
};

export default CallNotificationItem;
