import { addEdge, applyEdgeChanges, applyNodeChanges, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";
import "./App.css";

// --- Importe todos os seus nós personalizados de arquivos separados ---
import ColorSelectorNode from './ColorSelectorNode';
import InputNode from './InputNode';
import PromptInputNode from './PromptInputNode'; // Importe o novo nó
import VideoDisplayNode from './VideoDisplayNode'; // Importe o novo nó
// --- Fim das Importações de Nós Personalizados ---

const initialNodes = []; // Definiremos os nós no useEffect
const initialEdges = [];

const initBgColor = '#c9f1dd';

const snapGrid = [20, 20];
const nodeTypes = {
  selectorNode: ColorSelectorNode,
  inputNode: InputNode,
  promptInput: PromptInputNode, // Adicione o novo tipo de nó
  videoDisplay: VideoDisplayNode, // Adicione o novo tipo de nó
};

const defaultViewport = { x: 0, y: 0, zoom: 1.0 };

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [bgColor, setBgColor] = useState(initBgColor);
  const [promptValue, setPromptValue] = useState(''); // Estado para o valor do prompt
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState(''); // Estado para a URL do vídeo gerado

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  const onChangeBgColor = useCallback((event) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id !== '2') {
          return node;
        }
        const color = event.target.value;
        setBgColor(color);
        return {
          ...node,
          data: {
            ...node.data,
            color,
          },
        };
      }),
    );
  }, []); // Dependência vazia, pois não depende de estado externo

  const handlePromptChange = useCallback((value) => {
    setPromptValue(value);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === 'prompt-node-1') { // O ID do seu nó de prompt
          return {
            ...node,
            data: {
              ...node.data,
              value: value,
            },
          };
        }
        return node;
      }),
    );
  }, []); // Dependência vazia, pois não depende de estado externo


  const generateVideo = useCallback(async () => {
    if (!promptValue) {
      alert('Por favor, insira um prompt para gerar o vídeo.');
      return;
    }

    try {
      setGeneratedVideoUrl(''); // Limpa a URL anterior enquanto gera
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === 'video-node-1') { // O ID do seu nó de exibição de vídeo
            return {
              ...node,
              data: { ...node.data, videoUrl: null }, // Limpa a URL para mostrar "Aguardando..."
            };
          }
          return node;
        })
      );

      console.log('Enviando prompt para o backend:', promptValue);
      // Ajuste a URL para o endereço do seu backend (e.g., 'http://localhost:3001/api/generate-video')
      const response = await fetch('http://localhost:3001/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Falha na requisição ao backend.');
      }

      const data = await response.json();
      console.log('URL do vídeo recebida:', data.videoUrl);
      setGeneratedVideoUrl(data.videoUrl);

      // Atualiza o nó de exibição de vídeo com a URL
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === 'video-node-1') {
            return {
              ...node,
              data: { ...node.data, videoUrl: data.videoUrl },
            };
          }
          return node;
        })
      );

    } catch (error) {
      console.error('Erro ao gerar vídeo:', error);
      alert('Erro ao gerar vídeo: ' + error.message);
    }
  }, [promptValue]); // Dependência: `promptValue` é usado dentro de `generateVideo`


  useEffect(() => {
    setNodes([
      {
        id: '1',
        type: 'inputNode',
        data: { label: 'Node Inicial' },
        position: { x: 0, y: 50 },
        sourcePosition: 'right',
      },
      {
        id: '2',
        type: 'selectorNode',
        data: { onChange: onChangeBgColor, color: bgColor },
        position: { x: 300, y: 50 },
      },
      {
        id: 'prompt-node-1', // Novo nó para o prompt
        type: 'promptInput',
        data: { onChange: handlePromptChange, value: promptValue },
        position: { x: 0, y: 200 },
        sourcePosition: 'right',
      },
      {
        id: 'video-node-1', // Novo nó para exibir o vídeo
        type: 'videoDisplay',
        data: { videoUrl: generatedVideoUrl }, // Passa a URL do vídeo para o nó
        position: { x: 500, y: 200 },
        targetPosition: 'left',
      },
      {
        id: '3',
        type: 'output',
        data: { label: 'Output A' },
        position: { x: 650, y: 25 },
        targetPosition: 'left',
      },
      {
        id: '4',
        type: 'output',
        data: { label: 'Output B' },
        position: { x: 650, y: 100 },
        targetPosition: 'left',
      },
    ]);

    setEdges([
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e2a-3', source: '2', target: '3', animated: true },
      { id: 'e2b-4', source: '2', target: '4', animated: true },
      // Conexão do nó de prompt para o nó de exibição de vídeo
      { id: 'e-prompt-video', source: 'prompt-node-1', target: 'video-node-1', animated: true, type: 'step' },
    ]);
  }, [bgColor, promptValue, generatedVideoUrl, onChangeBgColor, handlePromptChange]); 
  // Dependências do useEffect: todas as variáveis de estado e funções de callback usadas dentro dele.

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        snapToGrid={true}
        snapGrid={snapGrid}
        defaultViewport={defaultViewport}
        fitView
        attributionPosition="bottom-left"
        style={{ background: bgColor }}
      >
        <MiniMap
          nodeColor={(n) => {
            return '#fff';
          }}
        />
        <Controls />
        {/* Botão para gerar vídeo */}
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, background: 'white', padding: 10, borderRadius: 5, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <button onClick={generateVideo} style={{ padding: '8px 15px', cursor: 'pointer', fontSize: '16px' }}>
            Gerar Vídeo com Veo 3
          </button>
        </div>
      </ReactFlow>
    </div>
  );
}

export default App;