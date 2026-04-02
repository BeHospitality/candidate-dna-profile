import { storage } from "@/lib/storage";

interface DynamicFooterProps {
  forcePublic?: boolean;
}

const DynamicFooter = ({ forcePublic }: DynamicFooterProps) => {
  const entryInfo = forcePublic ? { mode: "public" as const } : storage.getEntryMode();

  return (
    <footer className="w-full border-t border-[#1a2332] bg-[#0a1120] py-8 px-6 text-center">
      <div className="max-w-2xl mx-auto space-y-3">
        {entryInfo.mode === "public" && (
          <>
            <p className="text-sm">
              <span className="text-white font-medium">Be Connect</span>
              <span className="text-[#9ca3af]"> · Building Hospitality Careers</span>
            </p>
            <div className="flex items-center justify-center gap-6">
              <a
                href="https://ecosystem.be.ie"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#f59e0b] hover:underline"
              >
                Join the Network →
              </a>
              <a
                href="https://ecosystem.be.ie"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#9ca3af] hover:underline"
              >
                Explore the Ecosystem →
              </a>
            </div>
          </>
        )}

        {entryInfo.mode === "candidate" && (
          <>
            <p className="text-sm">
              <span className="text-white font-medium">Be Connect</span>
              <span className="text-[#9ca3af]"> · Hospitality Intelligence</span>
            </p>
            <p className="text-sm text-white/90">
              Your results will be shared with your property upon completion.
            </p>
          </>
        )}

        {entryInfo.mode === "team" && (
          <>
            <p className="text-sm">
              <span className="text-white font-medium">Be Connect</span>
              <span className="text-[#9ca3af]"> · Hospitality Intelligence</span>
            </p>
            <p className="text-sm text-white/90">
              Your results will be shared with your team upon completion.
            </p>
          </>
        )}

        <a
          href="https://be.ie/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] underline"
          style={{ color: "#008C72" }}
        >
          Privacy Notice
        </a>
        <p className="text-xs text-[#6b7280]">© 2026 Be Connect</p>
      </div>
    </footer>
  );
};

export default DynamicFooter;
