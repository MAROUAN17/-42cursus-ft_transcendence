interface GradientBarProps {
  direction: "left" | "right";
}

export default function GradientBar({ direction }: GradientBarProps) {
  const gradient =
    direction === "left"
      ? "bg-gradient-to-r from-purple-500 to-purple-400"
      : "bg-gradient-to-l from-purple-500 to-purple-400";
  const rounded =
    direction === "left" ? "rounded-l-full" : "rounded-r-full";

  return (
    <div className={`h-8 w-16 ${gradient} ${rounded}`} />
  );
}