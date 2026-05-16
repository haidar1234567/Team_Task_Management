export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#09090b] pointer-events-none">
      {/* Subtle deep navy gradient in the top right to give a premium SaaS feel without noise */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#1e1b4b] opacity-20 blur-[120px]" />
      
      {/* Subtle soft violet gradient in bottom left */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#4c1d95] opacity-10 blur-[120px]" />
    </div>
  );
};
