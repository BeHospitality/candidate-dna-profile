const BrandHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full h-[52px] flex items-center justify-between px-6 bg-[#0a1120] border-b border-[#1a2332]">
      <div className="flex items-center gap-0">
        <span className="text-white font-bold text-sm tracking-wide">BE</span>
        <span className="text-[#3b82f6] font-bold text-sm tracking-wide ml-1.5">CONNECT</span>
        <span className="text-[#6b7280] mx-2">|</span>
        <span className="text-[#9ca3af] text-sm hidden sm:inline">Hospitality Intelligence</span>
      </div>
      <span className="text-[#f59e0b] text-sm font-semibold uppercase tracking-wider">
        DNA Assessment
      </span>
    </header>
  );
};

export default BrandHeader;
