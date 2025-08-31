import React from "react";
import CartRight from "./Cart";
import ConnectorRight from "./ConnectorRight";
import ScoreBox from "./ScoreBox";

interface RightBracketProps {
  users: Array<{ username: string; avatarUrl: string }>;
}

const RightBracket: React.FC<RightBracketProps> = ({ users }) => (
  <div className="flex items-center justify-between p-2">
    {/* <div>
      <CartRight
        key={"wain"}
        username={"wain"}
        avatarUrl={"rejal"}
      />
    </div>
    <div>
      <ConnectorRight width={100} height={90} color="white" strokeWidth={2} />
    </div> */}
    <div>
      {users.map((user) => (
        <div className="flex justify-between items-center p-2">
            <ScoreBox score={"-"} />
            <CartRight username={user.username} avatarUrl={user.avatarUrl} />
        </div>
      ))}
    </div>
  </div>
);

export default RightBracket;
