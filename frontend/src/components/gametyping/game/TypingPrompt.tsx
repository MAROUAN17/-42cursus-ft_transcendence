interface TypingPromptProps {
  prompt: string;
  userInput: string;
}

export default function TypingPrompt({ prompt, userInput }: TypingPromptProps) {
  return (
    <div className="bg-blue-900 bg-opacity-60 rounded-2xl px-8 py-4 mx-auto my-8 w-fit text-2xl font-mono flex flex-wrap">
      {prompt.split("").map((char, i) => {
        let color = "";
        if (userInput[i] == null) color = "text-white";
        else if (userInput[i] === char) color = "text-green-400";
        else color = "text-red-400";
        return (
          <span key={i} className={color}>
            {char}
          </span>
        );
      })}
    </div>
  );
}