import { useState, useEffect, useRef } from 'react';

const useWebSocket = (url) => {
  const [data, setData] = useState({
    risk_score: 0,
    predicted_risk: 0,
    people_count: 0,
    avg_velocity: 0,
    reasons: []
  });
  const [status, setStatus] = useState('DISCONNECTED');
  const ws = useRef(null);

  useEffect(() => {
    const connect = () => {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log('✅ Connected to ARGUS-AI Brain');
        setStatus('CONNECTED');
      };

      ws.current.onmessage = (event) => {
        const json = JSON.parse(event.data);
        setData(json);
      };

      ws.current.onclose = () => {
        console.log('❌ Disconnected');
        setStatus('DISCONNECTED');
        // Auto-reconnect after 3 seconds
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [url]);

  return { data, status };
};

export default useWebSocket;