import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Controls,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

import ColorSelectorNode from "./ColorSelectorNode";
import { InputNode } from "./InputNode";
import PromptInputNode from "./PromptInputNode";
import VideoDisplayNode from "./VideoDisplayNode";

const initBgColor = "#c9f1dd";
const snapGrid = [20, 20];
const nodeTypes = {
  selectorNode: ColorSelectorNode,
  inputNode: InputNode,
  promptInput: PromptInputNode,
  videoDisplay: VideoDisplayNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 1.0 };

// Frases engraçadas
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

let outputCount = 0;

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [bgColor, setBgColor] = useState(initBgColor);
  const [promptValue, setPromptValue] = useState("");

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

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    []
  );

  const hasInitialized = useRef(false); // controla se já inicializamos os nós base

  const handlePromptChange = useCallback((value) => {
    setPromptValue(value);
  }, []);

  const onChangeBgColor = useCallback((event) => {
    const newColor = event.target.value;
    setBgColor(newColor);
  }, []);

  const generateFunnyText = useCallback(() => {
    if (!promptValue) {
      alert("Por favor, insira um prompt para gerar o texto.");
      return;
    }

    const template =
      funnyTemplates[Math.floor(Math.random() * funnyTemplates.length)];
    const generated = template(promptValue);

    const newNodeId = `output-${outputCount}`;
    const newY = 250 + outputCount * 90;

    const newNode = {
      id: newNodeId,
      type: "output",
      data: { label: generated },
      position: { x: 650, y: newY },
      targetPosition: "left",
      style: { backgroundColor: bgColor },
    };

    const newEdge = {
      id: `e2-${newNodeId}`,
      source: "2",
      target: newNodeId,
      animated: true,
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
    outputCount += 1;
  }, [promptValue, bgColor]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "prompt-node-1") {
          return {
            ...node,
            data: {
              ...node.data,
              value: promptValue,
              generateFunnyText,
              onChange: handlePromptChange,
            },
          };
        }
        return node;
      })
    );
  }, [promptValue]);

  // 🟢 Só executa 1x
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const baseNodes = [
      {
        id: "prompt-node-1",
        type: "inputNode",
        data: {
          label: "Node Inicial",
          generateFunnyText,
          onChange: handlePromptChange,
          value: "", // inicia vazio
        },
        position: { x: 0, y: 50 },
        sourcePosition: "right",
      },
      {
        id: "2",
        type: "selectorNode",
        data: { onChange: onChangeBgColor, color: initBgColor },
        position: { x: 300, y: 50 },
      },
    ];

    setNodes(baseNodes);
    setEdges([]);
  }, []);

  return (
    <div
      style={{
        width: "80vw",
        height: "80vh",
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
      </ReactFlow>
    </div>
  );
}

export default App;
