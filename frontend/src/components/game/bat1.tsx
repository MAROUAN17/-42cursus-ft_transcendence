import { useEffect, useRef, useState, MouseEvent } from "react";

function Bat1() {
  const batRef = useRef<HTMLDivElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [posY, setPosY] = useState(330);
  const [dragOffset, setDragOffset] = useState(0);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (batRef.current) {
      const batTop = batRef.current.getBoundingClientRect().top;
      const offset = e.clientY - batTop;
      setDragOffset(offset);
      setIsDragging(true);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent | MouseEvent<HTMLDivElement> | MouseEvent<Document>) => {
    if (isDragging) {
      const containerHeight = window.innerHeight * 0.7;
      const minY = 0;
      const maxY = containerHeight - 160;

      const newY = e.clientY - dragOffset - 200;
      const clampedY = Math.max(minY, Math.min(maxY, newY));
      setPosY(clampedY);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove as any);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove as any);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={batRef}
      onMouseDown={handleMouseDown}
      className="ml-8 w-[18px] h-[160px] border-4 border-neon rounded-xl shadow-neon shadow-[0_10px_40px_rgba(0,0,0,0.1)] bg-white absolute"
      style={{ top: `${posY}px` }}
    ></div>
  );
}

export default Bat1;
