import { TIP_URL } from "@/lib/constants";

type TipButtonProps = {
  /** Match the shape of the theme toggle it sits next to. */
  shape?: "xl" | "full";
};

export function TipButton({ shape = "xl" }: TipButtonProps) {
  return (
    <a
      href={TIP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Tip the developer on Buy Me a Coffee (opens in new tab)"
      title="Buy me a coffee"
      className={`h-10 w-10 sm:w-auto sm:px-3 flex items-center justify-center gap-1.5 font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-black transition-all duration-300 btn-press shadow-sm shadow-amber-500/30 ${
        shape === "full" ? "rounded-full" : "rounded-xl"
      }`}
    >
      <span className="text-lg" aria-hidden="true">
        ☕
      </span>
      <span className="hidden sm:inline whitespace-nowrap">Buy me a coffee</span>
    </a>
  );
}
