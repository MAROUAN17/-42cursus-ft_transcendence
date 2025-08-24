import React from "react";

type ConnectorProps = {
  width?: number;   // total width of connector
  height?: number;  // total height (distance between top & bottom players)
  strokeWidth?: number;
  color?: string;
};


const ConnectorLeft: React.FC<ConnectorProps> = ({
  width = 120,
  height = 160,
  strokeWidth = 4,
  color = "white",
}) => {
  const midY = height / 2;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >

      <line
        x1={strokeWidth / 2}
        y1={0}
        x2={width / 2}
        y2={0}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      {/* Right vertical line */}
      <line
        x1={width / 2}
        y1={0}
        x2={width / 2}
        y2={height}
        stroke={color}
        strokeWidth={strokeWidth}
      />
       <line
        x1={strokeWidth / 2}
        y1={height}
        x2={width / 2}
        y2={height}
        stroke={color}
        strokeWidth={strokeWidth}
      />
        {/* Middle horizontal */}
        <line
          x1={width / 2}
          y1={midY}
          x2={width}
          y2={midY}
          stroke={color}
          strokeWidth={strokeWidth}
        />
      {/* Middle horizontal */}
    </svg>
  );
};

export default ConnectorLeft;
