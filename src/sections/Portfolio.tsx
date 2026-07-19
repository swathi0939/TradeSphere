import { PORTFOLIO_ALLOCATION_PCT, PORTFOLIO_VALUE } from '@/data/dashboard';

/** Portfolio value + equity-allocation ring — one cell of the dashboard mockup grid. */
export function Portfolio() {
  return (
    <div className="flex flex-col items-start justify-center gap-3 bg-surface p-[18px]">
      <p className="text-[0.78rem] text-muted">Portfolio Value</p>
      <p className="tabular-figures text-[1.35rem] font-extrabold text-text">{PORTFOLIO_VALUE}</p>
      <div
        style={{ ['--pct' as string]: PORTFOLIO_ALLOCATION_PCT }}
        className="allocation-ring mt-1 grid h-16 w-16 shrink-0 place-items-center self-center rounded-full transition-[filter] duration-300"
      >
        <span className="grid h-11 w-11 place-items-center rounded-full bg-surface text-center text-[0.6rem] leading-[1.2] font-bold text-text">
          {PORTFOLIO_ALLOCATION_PCT}%
          <br />
          Equity
        </span>
      </div>
    </div>
  );
}
