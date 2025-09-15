'use client';

import dynamic from 'next/dynamic';

// Dynamically import ChatWidget with no SSR to avoid hydration issues
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), {
  ssr: false,
});

export default function ChatWidgetWrapper() {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <ChatWidget />
    </div>
  );
}
