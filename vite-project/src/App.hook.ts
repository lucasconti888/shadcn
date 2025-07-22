import { useCallback, useEffect, useRef, useState } from "react";
import { funnyTemplates, initBgColor } from "./App.utils";
import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";

let outputCount = 0;

export const useApp = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [bgColor, setBgColor] = useState(initBgColor);
  const [promptValue, setPromptValue] = useState("");
  const [isConnectedToSelector, setIsConnectedToSelector] = useState(false);

  const hasInitialized = useRef(false);

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  const onEdgesChange = useCallback((changes) => {
    setEdges((edgesSnapshot) => {
      const updatedEdges = applyEdgeChanges(changes, edgesSnapshot);

      const isStillConnected = updatedEdges.some(
        (edge) =>
          (edge.source === "1" && edge.target === "2") ||
          (edge.source === "2" && edge.target === "1")
      );

      setIsConnectedToSelector(isStillConnected);

      return updatedEdges;
    });
  }, []);

  const onConnect = useCallback((params) => {
    setEdges((eds) => {
      const newEdges = addEdge({ ...params }, eds);

      if (
        (params.source === "1" && params.target === "2") ||
        (params.source === "2" && params.target === "1")
      ) {
        setIsConnectedToSelector(true);
      }

      return newEdges;
    });
  }, []);

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
      style: {
        backgroundColor: isConnectedToSelector ? bgColor : "white",
      },
    };

    const newEdge = {
      id: `e2-${newNodeId}`,
      source: isConnectedToSelector ? "2" : "1",
      target: newNodeId,
      animated: true,
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
    outputCount += 1;
  }, [promptValue, bgColor, isConnectedToSelector]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "1") {
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
  }, [promptValue, bgColor, isConnectedToSelector, generateFunnyText]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const baseNodes = [
      {
        id: "1",
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

  return { nodes, edges, onNodesChange, onEdgesChange, onConnect };
};
