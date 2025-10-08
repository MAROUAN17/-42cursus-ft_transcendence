interface UserBoxProps {
  username: string;
  avatar: string;
}

const PlayerBox: React.FC<UserBoxProps> = ({ username, avatar }) => {
  return (
    <div className="flex items-center">
      <div className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-l-lg w-44">
        <img
          src={avatar}
          alt={username}
          width={28}
          height={28}
          className="rounded-full object-cover"
        />
        <span className="truncate text-sm font-bold uppercase">{username}</span>
      </div>

      <div className="w-8 h-8 bg-white text-purple-700 font-bold flex items-center justify-center rounded-sm ml-[2px]">
        -
      </div>
    </div>
  );
};

export default PlayerBox;
