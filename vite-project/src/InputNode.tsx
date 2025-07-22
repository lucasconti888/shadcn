import { Handle, Position } from "@xyflow/react";
import { memo } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

export default memo(({ data, isConnectable }) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      {/* <div>
        Tipo <strong>{data.color}</strong>
      </div> */}
      <div className="flex w-full max-w-sm items-center gap-2">
        <Input defaultValue={data.color} type="email" placeholder="Tipo" />
        <Button onChange={data.onChange} type="submit" variant="outline">
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
});
