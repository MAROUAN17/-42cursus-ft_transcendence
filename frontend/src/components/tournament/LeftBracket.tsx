import React from "react";
import CartLeft from "./Cart";
import ConnectorLeft from "./ConnectorLeft";
import ScoreBox from "./ScoreBox";

interface LeftBracketProps {
  users: Array<{ username: string; avatarUrl: string }>;
}

const LeftBracket: React.FC<LeftBracketProps> = ({ users }) => (
  <div className="flex items-center justify-between p-10">
    <div>
      {users.map((user) => (
        <div className="flex justify-between items-center p-2">
          <CartLeft
            key={user.username}
            username={user.username}
            avatarUrl={user.avatarUrl}
          />
          <ScoreBox score={"-"} />
        </div>
      ))}
    </div>
    <div>
      <ConnectorLeft width={100} height={90} color="white" strokeWidth={2} />
    </div>
    {/* <div>
      <CartLeft
        key={"wain"}
        username={"wain"}
        avatarUrl={"rejal"}
      />
    </div> */}
  </div>
);

export default LeftBracket;
