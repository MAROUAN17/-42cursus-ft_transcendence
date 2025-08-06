import {useEffect, useState} from "react";
import { GameBounds } from "./game";

interface BallProps {
  gameBounds: GameBounds;
  cords: { x: number; y: number };
  updateCords: (cords: { x: number; y: number }) => void;
}


function Ball({ gameBounds, cords, updateCords }: BallProps) {
  //coordinates
  //const [cords, setCords] = useState({x:50, y:50});
  const [toUp, setToUp] = useState(false);
  const [toLeft, setToLeft] = useState(false);
  const speed = 10;

  useEffect(() => {
    const interval = setInterval(() => {
      let newX = cords.x;
      let newY = cords.y;
      if (newY >= gameBounds.height - 40)
          setToUp(true);
      if (newY <= 0)
        setToUp(false);
      if (newX <= 0)
          setToLeft(false);
      if (newX >= gameBounds.width - 40)
        setToLeft(true);
      if (toUp)
          newY -= speed
      else
        newY += speed
      if (toLeft)
        newX -= speed
      else
        newX += speed
      updateCords({ x: newX, y: newY });
    }, 100);

    return () => clearInterval(interval);
  }, [cords]);
  
  return (
  <div
    className="bg-neon rounded-full w-[30px] h-[30px] absolute transition-all duration-100"
    style={{
      top: cords.y,
      left: cords.x,
    }}
  />

  );
}

export default Ball;
