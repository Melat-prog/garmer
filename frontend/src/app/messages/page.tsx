'use client';
import React, { useState } from 'react';
import styles from './page.module.css';
import { Button } from '../../components/ui/Button/Button';

export default function Messages() {
  const [message, setMessage] = useState('');

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>Messages</div>
        <div className={styles.conversationList}>
          {[1, 2, 3].map(i => (
            <div key={i} className={`${styles.conversationItem} ${i === 1 ? styles.conversationItemActive : ''}`}>
              <div className={styles.conversationHeader}>
                <span className={styles.conversationName}>Global Garments Ltd</span>
                <span className={styles.conversationTime}>10:42 AM</span>
              </div>
              <div className={styles.conversationPreview}>Yes, we can do the custom branding for that...</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={styles.chatArea}>
        <div className={styles.chatHeader}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-gray-200)' }}></div>
          <div>
            <div style={{ fontWeight: 700 }}>Global Garments Ltd</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>Typically replies within 1 hour</div>
          </div>
        </div>

        <div className={styles.messages}>
          <div className={`${styles.message} ${styles.messageSent}`}>
            Hi, I'm interested in the Premium Cotton T-Shirt. Can you do custom embroidery on the left chest?
          </div>
          <div className={`${styles.message} ${styles.messageReceived}`}>
            Hello! Yes, we offer custom embroidery. We would need your logo file in vector format (AI or EPS) to provide an accurate quotation for the setup cost.
          </div>
          <div className={`${styles.message} ${styles.messageReceived}`}>
            For an order of 500 pcs, the embroidery would add approximately $1.20 per piece.
          </div>
        </div>

        <div className={styles.chatInput}>
          <input 
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ 
              flex: 1, 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-full)', 
              border: '1px solid var(--color-gray-300)',
              outline: 'none'
            }}
          />
          <Button variant="primary" style={{ borderRadius: 'var(--radius-full)' }}>Send</Button>
        </div>
      </div>
    </div>
  );
}
