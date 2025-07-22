import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

export const InputNode = ({ data, isConnectable }) => {
  const handleInputChange = (e) => {
    data?.onChange?.(e.currentTarget.value);
  };

  const handleGenerate = () => {
    data?.generateFunnyText?.();
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <div className="flex w-full max-w-sm items-center gap-2 p-2 bg-white rounded shadow">
        <Input
          onChange={handleInputChange}
          placeholder="Tipo"
          className="flex-1"
        />
        <Button
          onClick={handleGenerate}
          type="button"
          variant="outline"
        >
          Confirmar
        </Button>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
};

export default memo(InputNode);
