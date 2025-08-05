import { useState, useEffect, useRef } from "react";

function Bat2() {
    const batRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [posY, setPosY] = useState(330);
    const [dragOffset, setDragOffset] = useState(0); 

    const handleMouseDown = (e) => {
        const batTop = batRef.current.getBoundingClientRect().top;
        const offset = e.clientY - batTop;
        setDragOffset(offset);
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    }
    const handleMouseMove = (e) => {
        if (isDragging) {
            const containerHeight = window.innerHeight * 0.7; 
            const minY = 0;
            const maxY = containerHeight - 160; 

            let newY = e.clientY - dragOffset - 200;
            const clampedY = Math.max(minY, Math.min(maxY, newY));
            setPosY(clampedY);
        }
    };
    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }
    }, [isDragging]);
    return (
        <div
            ref={batRef}
            onMouseDown={handleMouseDown}
            style={{ top: `${posY}px` }}
            className="absolute right-0  mr-8 w-[18px] h-[160px] border-4 border-bat2Color rounded-xl shadow-bat2Color shadow-[0_10px_40px_rgba(0,0,0,1)]">
        </div>
    )
}

export default Bat2;