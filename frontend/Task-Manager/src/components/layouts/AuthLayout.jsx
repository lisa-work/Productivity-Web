const AuthLayout = ({ children }) => {
  return (
    <div className="relative flex">
      {/* Bubble background */}
      <div className="bubble-background">
        <div className="bubble" />
        <div className="bubble" />
        <div className="bubble" />
        <div className="bubble" />
        <div className="bubble" />
        <div className="bubble" />
        <div className="bubble" />
        <div className="bubble" />
      </div>

      <div className="w-screen h-screen px-12 py-5 flex flex-col justify-center items-center relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

