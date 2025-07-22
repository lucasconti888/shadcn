import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Controls,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";
import "./App.css";

import ColorSelectorNode from "./ColorSelectorNode";
import InputNode from "./InputNode";
import PromptInputNode from "./PromptInputNode";
import VideoDisplayNode from "./VideoDisplayNode";
import { Button } from "./components/ui/button";

const initialNodes = [];
const initialEdges = [];

const initBgColor = "#c9f1dd";

const snapGrid = [20, 20];
const nodeTypes = {
  selectorNode: ColorSelectorNode,
  inputNode: InputNode,
  promptInput: PromptInputNode,
  videoDisplay: VideoDisplayNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 1.0 };

// Base de frases engraçadas
const funnyTemplates = [
  (input) =>
    `Você disse "${input}"? Isso é mais engraçado que meu saldo bancário! 😂`,
  (input) =>
    `Novo estudo revela: quem fala "${input}" tem 80% mais chance de tropeçar no próprio ego.`,
  (input) =>
    `Se "${input}" fosse uma comida, com certeza seria miojo gourmetizado.`,
  (input) =>
    `"${input}" é o nome do meu novo álbum de sofrência eletrônica. 🎧💔`,
  (input) =>
    `Breaking news: "${input}" vai substituir o Wi-Fi na casa da sua avó.`,
];

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [bgColor, setBgColor] = useState(initBgColor);
  const [promptValue, setPromptValue] = useState("");
  const [generatedFunnyText, setGeneratedFunnyText] = useState("");

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

  const FLOW_STORAGE_KEY = "funny-flow-state";

  const saveFlowState = (nodes, edges) => {
    localStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify({ nodes, edges }));
  };

  useEffect(() => {
  saveFlowState(nodes, edges);
}, [nodes, edges]);


  const loadFlowState = () => {
    const stored = localStorage.getItem(FLOW_STORAGE_KEY);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Erro ao carregar estado salvo:", e);
      return null;
    }
  };

  useEffect(() => {
  const savedState = loadFlowState();

  if (savedState) {
    setNodes(savedState.nodes);
    setEdges(savedState.edges);
  } else {
    setNodes([
      {
        id: "1",
        type: "inputNode",
        data: { label: "Node Inicial" },
        position: { x: 0, y: 50 },
        sourcePosition: "right",
      },
      {
        id: "2",
        type: "selectorNode",
        data: { onChange: onChangeBgColor, color: bgColor },
        position: { x: 300, y: 50 },
      },
      {
        id: "prompt-node-1",
        type: "promptInput",
        data: { onChange: handlePromptChange, value: promptValue },
        position: { x: 0, y: 200 },
        sourcePosition: "right",
      },
      {
        id: "video-node-1",
        type: "videoDisplay",
        data: { videoUrl: generatedFunnyText },
        position: { x: 500, y: 200 },
        targetPosition: "left",
      },
      {
        id: "3",
        type: "output",
        data: { label: "Output A" },
        position: { x: 650, y: 25 },
        targetPosition: "left",
      },
      {
        id: "4",
        type: "output",
        data: { label: "Output B" },
        position: { x: 650, y: 100 },
        targetPosition: "left",
      },
    ]);

    setEdges([
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e2a-3", source: "2", target: "3", animated: true },
      { id: "e2b-4", source: "2", target: "4", animated: true },
      {
        id: "e-prompt-video",
        source: "prompt-node-1",
        target: "video-node-1",
        animated: true,
        type: "step",
      },
    ]);
  }
}, []);


  const onChangeBgColor = useCallback((event) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id !== "2") return node;
        const color = event.target.value;
        setBgColor(color);
        return {
          ...node,
          data: { ...node.data, color },
        };
      })
    );
  }, []);

  const handlePromptChange = useCallback((value) => {
    setPromptValue(value);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "prompt-node-1") {
          return { ...node, data: { ...node.data, value } };
        }
        return node;
      })
    );
  }, []);

  const generateFunnyText = useCallback(() => {
    if (!promptValue) {
      alert("Por favor, insira um prompt para gerar o texto.");
      return;
    }

    const template =
      funnyTemplates[Math.floor(Math.random() * funnyTemplates.length)];
    const generatedText = template(promptValue);

    setGeneratedFunnyText(generatedText);

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "video-node-1") {
          return {
            ...node,
            data: { ...node.data, videoUrl: generatedText },
          };
        }
        return node;
      })
    );
  }, [promptValue]);

  useEffect(() => {
    setNodes([
      {
        id: "1",
        type: "inputNode",
        data: { label: "Node Inicial" },
        position: { x: 0, y: 50 },
        sourcePosition: "right",
      },
      {
        id: "2",
        type: "selectorNode",
        data: { onChange: onChangeBgColor, color: bgColor },
        position: { x: 300, y: 50 },
      },
      {
        id: "prompt-node-1",
        type: "promptInput",
        data: { onChange: handlePromptChange, value: promptValue },
        position: { x: 0, y: 200 },
        sourcePosition: "right",
      },
      {
        id: "video-node-1",
        type: "videoDisplay",
        data: { videoUrl: generatedFunnyText },
        position: { x: 500, y: 200 },
        targetPosition: "left",
      },
      {
        id: "3",
        type: "output",
        data: { label: "Output A" },
        position: { x: 650, y: 25 },
        targetPosition: "left",
      },
      {
        id: "4",
        type: "output",
        data: { label: "Output B" },
        position: { x: 650, y: 100 },
        targetPosition: "left",
      },
    ]);

    setEdges([
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e2a-3", source: "2", target: "3", animated: true },
      { id: "e2b-4", source: "2", target: "4", animated: true },
      {
        id: "e-prompt-video",
        source: "prompt-node-1",
        target: "video-node-1",
        animated: true,
        type: "step",
      },
    ]);
  }, [promptValue, generatedFunnyText, onChangeBgColor, handlePromptChange]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    []
  );

  return (
    <div
      style={{
        width: "50vw",
        height: "50vh",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        snapToGrid
        snapGrid={snapGrid}
        defaultViewport={defaultViewport}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 10,
            padding: 10,
          }}
        >
          <Button
            onClick={generateFunnyText}
            style={{ padding: "8px 15px", cursor: "pointer", fontSize: "16px" }}
          >
            Gerar Piada
          </Button>
        </div>
      </ReactFlow>
    </div>
  );
}

export default App;
