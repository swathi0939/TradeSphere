import { motion } from 'framer-motion';
import { Container } from '@/components/Container';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { IndicatorChart } from '@/components/charts/IndicatorChart';
import { REVEAL_VIEWPORT, revealVariants, staggerDelay } from '@/components/motion';

const CHART_TABS = ['RSI', 'MACD', 'Bollinger Bands'];

const CHECKLIST = ['Multiple timeframes, zero lag', 'Overlay indicators on any chart type', 'Save custom chart layouts per watchlist'];

/** "Charting & indicators that don't hold back" showcase. */
export function LiveCharts() {
  return (
    <section id="charts" aria-labelledby="charts-heading" className="py-[var(--section-pad)] max-md:py-14">
      <Container className="grid grid-cols-1 items-center gap-14 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.div variants={revealVariants} initial="hidden" whileInView="visible" viewport={REVEAL_VIEWPORT}>
          <Card glass aria-hidden="true" className="p-[22px]">
            <div className="mb-4 flex gap-2">
              {CHART_TABS.map((tab, i) => (
                <Badge key={tab} variant="outline-primary" active={i === 0}>
                  {tab}
                </Badge>
              ))}
            </div>
            <IndicatorChart />
          </Card>
        </motion.div>

        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={REVEAL_VIEWPORT}
          transition={{ delay: staggerDelay(1) }}
        >
          <p className="mb-3 inline-flex items-center gap-2 text-[0.78rem] font-bold tracking-[0.12em] text-primary uppercase before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary before:shadow-[0_0_0_3px_rgba(var(--primary-rgb),.18)] before:content-['']">
            FOR SERIOUS TRADERS
          </p>
          <h2 id="charts-heading" className="max-w-[720px] text-h2 font-extrabold tracking-[-0.025em] text-text">
            Charting &amp; indicators that don&apos;t hold back.
          </h2>
          <p className="mt-4 max-w-[620px] text-[1.08rem] leading-[1.6] text-muted">
            Candlestick, Line, and OHLC views paired with the indicators pros actually use — RSI, MACD, and Bollinger Bands, built directly
            into the chart.
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {CHECKLIST.map((item) => (
              <li
                key={item}
                className="relative pl-7 text-muted before:absolute before:top-0 before:left-0 before:flex before:h-[18px] before:w-[18px] before:items-center before:justify-center before:rounded-full before:bg-[rgba(var(--primary-rgb),0.12)] before:text-[0.65rem] before:font-extrabold before:text-primary before:content-['✓']"
              >
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </Container>
    </section>
  );
}
