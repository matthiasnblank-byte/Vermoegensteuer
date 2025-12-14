import { useState } from 'react';

/**
 * Hook für imperatives Ankündigen von Nachrichten an Screenreader
 * Verwendet zusammen mit der LiveRegion-Komponente
 */
export function useAnnounce() {
  const [message, setMessage] = useState('');

  const announce = (text: string) => {
    setMessage('');
    // Kurze Verzögerung für wiederholte Nachrichten
    setTimeout(() => setMessage(text), 50);
  };

  const clear = () => setMessage('');

  return { message, announce, clear };
}

export default useAnnounce;
