import React from 'react';
import { Handle, Position } from '@xyflow/react';

const VideoDisplayNode = ({ data }) => {
  return (
    <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5, backgroundColor: '#e0ffe0', minWidth: '320px' }}>
      <h4>Vídeo Gerado:</h4>
      {data.videoUrl ? (
        <video controls src={data.videoUrl} style={{ maxWidth: '100%', height: 'auto', display: 'block', marginTop: 10 }} />
      ) : (
        <p>Aguardando geração do vídeo...</p>
      )}
      <Handle type="target" position={Position.Left} id="a" style={{ top: '50%' }} />
    </div>
  );
};

export default VideoDisplayNode;