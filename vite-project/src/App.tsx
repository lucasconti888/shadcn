import { Controls, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./App.css";
import { useApp } from "./App.hook";
import { defaultViewport, nodeTypes, snapGrid } from "./App.utils";

function App() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useApp();

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
