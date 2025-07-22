import React from 'react';
import { Handle, Position } from '@xyflow/react';

const PromptInputNode = ({ data }) => {
  
  return (
    <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5, backgroundColor: '#f0f0f0' }}>
      <label htmlFor="prompt" style={{ display: 'block', marginBottom: 5 }}>Prompt do Vídeo:</label>
      <textarea
        id="prompt"
        name="prompt"
        rows="4"
        cols="30"
        onChange={(e) => data.onChange(e.target.value)}
        value={data.value}
        className="nodrag"
        style={{ width: '100%', resize: 'vertical' }}
      ></textarea>
      <Handle type="source" position={Position.Right} id="a" style={{ top: '50%' }} />
    </div>
  );
};

export default PromptInputNode;