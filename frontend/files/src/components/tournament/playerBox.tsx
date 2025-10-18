interface UserBoxProps {
  username: string;
  avatar: string;
}

const PlayerBox: React.FC<UserBoxProps> = ({ username, avatar }) => {
  return (
    <div className="font-poppins flex items-center">
      <div className="flex items-center gap-2 bg-neon text-white px-4 py-2 rounded-l-lg xl:w-[300px] lg:w-[150px]">
        <img
          src={avatar ? avatar : '/9896174.jpg'}
          alt={username ? username : 'no-pic'}
          className="w-[42px] h-[42px] rounded-full object-cover"
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
