import { useMemo, useState } from "react";
import type { ThemeColors } from "../types/theme";

type ToolKey = "noteshell" | "notebooklm" | "chatgpt" | "notion";

type CellValue = boolean | "partial";

type Row = {
  id: string;
  label: string;
  values: Record<ToolKey, CellValue>;
  emphasis?: boolean;
};

const TOOLS: Array<{
  key: ToolKey;
  name: string;
  sub?: string;
  highlight?: boolean;
}> = [
  { key: "noteshell", name: "Noteshell", sub: "Recommended", highlight: true },
  { key: "notebooklm", name: "NotebookLM", sub: "Source notebook" },
  { key: "chatgpt", name: "ChatGPT", sub: "General AI" },
  { key: "notion", name: "Notion", sub: "Workspace" },
];

const DEFAULT_ROWS: Row[] = [
  {
    id: "path",
    label: "Turns sources into a learning path",
    emphasis: true,
    values: {
      noteshell: true,
      notebooklm: "partial",
      chatgpt: "partial",
      notion: false,
    },
  },
  {
    id: "video",
    label: "Video recommendations and key moments",
    emphasis: true,
    values: {
      noteshell: true,
      notebooklm: "partial",
      chatgpt: "partial",
      notion: false,
    },
  },
  {
    id: "study",
    label: "One-click study tools",
    emphasis: true,
    values: {
      noteshell: true,
      notebooklm: "partial",
      chatgpt: false,
      notion: false,
    },
  },
  {
    id: "notes",
    label: "Auto-structured notes you can edit",
    values: {
      noteshell: true,
      notebooklm: "partial",
      chatgpt: false,
      notion: "partial",
    },
  },
  {
    id: "grounded",
    label: "Grounded in your sources",
    values: {
      noteshell: true,
      notebooklm: true,
      chatgpt: "partial",
      notion: "partial",
    },
  },
];

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M9.00016 16.17L4.83016 12L3.41016 13.41L9.00016 19L21.0002 7L19.5902 5.59L9.00016 16.17Z"
      />
    </svg>
  );
}

function IconDot() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="5" fill="currentColor" />
    </svg>
  );
}

function Cell({ value, highlight, isDark }: { value: CellValue; highlight?: boolean; isDark: boolean }) {
  const label = value === true ? "Yes" : value === "partial" ? "Partial" : "No";

  // Amber accent colors for Noteshell highlight
  const amberBg = isDark ? "rgba(245, 158, 11, 0.18)" : "rgba(217, 119, 6, 0.14)";
  const amberBorder = isDark ? "rgba(245, 158, 11, 0.35)" : "rgba(217, 119, 6, 0.30)";
  const amberColor = isDark ? "rgba(245, 158, 11, 0.95)" : "rgba(217, 119, 6, 0.95)";
  const amberPartialColor = isDark ? "rgba(245, 158, 11, 0.6)" : "rgba(217, 119, 6, 0.55)";
  const amberPartialBg = isDark ? "rgba(245, 158, 11, 0.10)" : "rgba(217, 119, 6, 0.08)";
  const amberPartialBorder = isDark ? "rgba(245, 158, 11, 0.22)" : "rgba(217, 119, 6, 0.18)";

  // Neutral colors
  const neutralBg = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)";
  const neutralBorder = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
  const neutralColor = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.55)";
  const neutralPartialColor = isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.3)";
  const emptyBg = isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)";
  const emptyBorder = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)";
  const emptyHlBg = isDark ? "rgba(245, 158, 11, 0.04)" : "rgba(217, 119, 6, 0.03)";
  const emptyHlBorder = isDark ? "rgba(245, 158, 11, 0.12)" : "rgba(217, 119, 6, 0.10)";

  if (typeof value === "boolean") {
    return (
      <div className="ns-cell" aria-label={label}>
        {value ? (
          <span
            className="ns-cellIcon"
            style={{
              background: highlight ? amberBg : neutralBg,
              borderColor: highlight ? amberBorder : neutralBorder,
              color: highlight ? amberColor : neutralColor,
              width: 40,
              height: 40,
              borderRadius: 10,
            }}
          >
            <IconCheck />
          </span>
        ) : (
          <span
            className="ns-cellEmpty"
            style={{
              background: highlight ? emptyHlBg : emptyBg,
              borderColor: highlight ? emptyHlBorder : emptyBorder,
              width: 40,
              height: 40,
              borderRadius: 10,
            }}
            aria-hidden="true"
          />
        )}
      </div>
    );
  }

  return (
    <div className="ns-cell" aria-label={label}>
      <span
        className="ns-cellIcon ns-partial"
        style={{
          background: highlight ? amberPartialBg : neutralBg,
          borderColor: highlight ? amberPartialBorder : neutralBorder,
          color: highlight ? amberPartialColor : neutralPartialColor,
          width: 40,
          height: 40,
          borderRadius: 10,
        }}
      >
        <IconDot />
      </span>
    </div>
  );
}

function SegmentedTabs({
  value,
  onChange,
  isDark,
}: {
  value: ToolKey;
  onChange: (v: ToolKey) => void;
  isDark: boolean;
}) {
  const segBg = isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)";
  const segBorder = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)";
  const activeBg = isDark ? "rgba(245, 158, 11, 0.14)" : "rgba(217, 119, 6, 0.12)";
  const activeBorder = isDark ? "rgba(245, 158, 11, 0.30)" : "rgba(217, 119, 6, 0.25)";

  return (
    <div
      className="ns-seg"
      role="tablist"
      aria-label="Compare tools"
      style={{ background: segBg, borderColor: segBorder }}
    >
      {TOOLS.filter((t) => t.key !== "noteshell").map((t) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          aria-selected={value === t.key}
          className={`ns-segBtn ${value === t.key ? "is-active" : ""}`}
          onClick={() => onChange(t.key)}
          style={value === t.key ? { background: activeBg, border: `1px solid ${activeBorder}` } : undefined}
        >
          <span className="ns-segBtnTitle">{t.name}</span>
        </button>
      ))}
    </div>
  );
}

interface ComparisonTableProps {
  c: ThemeColors;
  isDark: boolean;
}

export function ComparisonTable({ c, isDark }: ComparisonTableProps) {
  const rows = useMemo(() => DEFAULT_ROWS, []);
  const [mobileFocus, setMobileFocus] = useState<ToolKey>("notebooklm");

  // Theme-aware colors
  const textPrimary = c.starlight;
  const textSecondary = c.moonlight;
  const textTertiary = c.distant;
  const borderColor = c.border;
  const rowBorder = isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)";
  const headBg = isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)";
  const hlColBg = isDark ? "rgba(245, 158, 11, 0.06)" : "rgba(217, 119, 6, 0.04)";
  const hlHeaderBg = isDark ? "rgba(245, 158, 11, 0.08)" : "rgba(217, 119, 6, 0.06)";
  const hlHeaderBorder = isDark ? "rgba(245, 158, 11, 0.5)" : "rgba(217, 119, 6, 0.4)";
  const emphasisBg = isDark ? "rgba(245, 158, 11, 0.03)" : "rgba(217, 119, 6, 0.02)";
  const pillBg = isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)";
  const pillBorder = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
  const hlPillBg = isDark ? "rgba(245, 158, 11, 0.12)" : "rgba(217, 119, 6, 0.10)";
  const hlPillBorder = isDark ? "rgba(245, 158, 11, 0.30)" : "rgba(217, 119, 6, 0.25)";

  // Footer
  const footBg = c.nebula;
  const footBorder = borderColor;
  const ctaBg = isDark ? "rgba(245, 158, 11, 0.12)" : "rgba(217, 119, 6, 0.10)";
  const ctaBorder = isDark ? "rgba(245, 158, 11, 0.35)" : "rgba(217, 119, 6, 0.30)";
  const ctaHoverBg = isDark ? "rgba(245, 158, 11, 0.20)" : "rgba(217, 119, 6, 0.18)";

  // Mobile
  const mCardBg = c.nebula;
  const mRowBorder = rowBorder;
  const mPairBg = isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)";
  const mPairBorder = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)";

  return (
    <section id="comparison" className="ns-compareWrap" aria-labelledby="comparison-title">
      <div className="ns-compareInner">
        <div className="ns-compareHeader">
          <div className="ns-compareKicker" style={{ color: c.solarFlare }}>COMPARISON</div>
          <h2 id="comparison-title" className="ns-compareTitle" style={{ color: textPrimary }}>
            Noteshell vs the tools you already use
          </h2>
          <p className="ns-compareSub" style={{ color: textTertiary }}>Built for learning outputs, not just storage.</p>
        </div>

        {/* Mobile: compare Noteshell to one selected tool */}
        <div className="ns-compareMobileOnly">
          <div className="ns-compareMobileCard" style={{ background: mCardBg, borderColor }}>
            <div className="ns-compareMobileTop" style={{ borderBottomColor: rowBorder }}>
              <div className="ns-compareMobileLabel" style={{ color: textTertiary }}>Compare Noteshell to</div>
              <SegmentedTabs value={mobileFocus} onChange={setMobileFocus} isDark={isDark} />
            </div>

            <div className="ns-compareMobileGrid" role="table" aria-label="Comparison table mobile">
              {rows.map((row, rowIdx) => (
                <div
                  key={row.id}
                  className={`ns-mRow ${row.emphasis ? "is-emphasis" : ""}`}
                  role="row"
                  style={{
                    background: row.emphasis ? emphasisBg : "transparent",
                    borderTop: rowIdx > 0 ? `1px solid ${mRowBorder}` : undefined,
                  }}
                >
                  <div className="ns-mRowLabel" role="cell" style={{ color: textPrimary }}>{row.label}</div>
                  <div className="ns-mRowRight" role="cell">
                    <div className="ns-mPair" style={{ background: mPairBg, borderColor: mPairBorder }}>
                      <div className="ns-mPairLabel" style={{ color: textTertiary }}>Noteshell</div>
                      <Cell value={row.values.noteshell} highlight isDark={isDark} />
                    </div>
                    <div className="ns-mPair" style={{ background: mPairBg, borderColor: mPairBorder }}>
                      <div className="ns-mPairLabel" style={{ color: textTertiary }}>
                        {TOOLS.find((t) => t.key === mobileFocus)?.name ?? "Other"}
                      </div>
                      <Cell value={row.values[mobileFocus]} isDark={isDark} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: full matrix */}
        <div className="ns-compareDesktopOnly" role="table" aria-label="Comparison table">
          <div className="ns-table" style={{ background: c.nebula, borderColor }}>
            <div className="ns-tHead" role="rowgroup">
              <div className="ns-tRow ns-tRowHead" role="row" style={{ background: headBg }}>
                <div className="ns-tCell ns-tFeature" role="columnheader" style={{ color: textSecondary }}>
                  Features
                </div>
                {TOOLS.map((t) => (
                  <div
                    key={t.key}
                    className="ns-tCell ns-tTool"
                    role="columnheader"
                    style={t.highlight ? {
                      background: hlHeaderBg,
                      borderBottom: `2px solid ${hlHeaderBorder}`,
                    } : undefined}
                  >
                    <div
                      className="ns-tToolPill"
                      style={{
                        background: t.highlight ? hlPillBg : pillBg,
                        border: `1px solid ${t.highlight ? hlPillBorder : pillBorder}`,
                        borderRadius: 20,
                        padding: "5px 14px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span className="ns-tToolName" style={{ color: t.highlight ? c.solarFlare : textPrimary }}>
                        {t.name}
                      </span>
                    </div>
                    {t.sub ? (
                      <div className="ns-tToolSub" style={{ color: textTertiary }}>{t.sub}</div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="ns-tBody" role="rowgroup">
              {rows.map((row, rowIdx) => (
                <div
                  key={row.id}
                  className="ns-tRow"
                  role="row"
                  style={{
                    borderTop: rowIdx > 0 ? `1px solid ${rowBorder}` : undefined,
                    marginTop: rowIdx > 0 ? 2 : undefined,
                  }}
                >
                  <div className="ns-tCell ns-tFeature" role="rowheader">
                    <div className="ns-tFeatureTitle" style={{ color: textPrimary }}>{row.label}</div>
                  </div>
                  {TOOLS.map((t) => (
                    <div
                      key={`${row.id}-${t.key}`}
                      className="ns-tCell ns-tVal"
                      role="cell"
                      style={t.highlight ? {
                        background: row.emphasis ? emphasisBg : hlColBg,
                      } : undefined}
                    >
                      <Cell value={row.values[t.key]} highlight={t.highlight} isDark={isDark} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="ns-compareFooter"
          style={{ background: footBg, borderColor: footBorder }}
        >
          <div className="ns-compareFootLeft">
            <div className="ns-footTitle" style={{ color: textPrimary }}>What makes Noteshell different</div>
            <div className="ns-footCopy" style={{ color: textTertiary }}>
              Noteshell turns your sources into a roadmap, then outputs the materials you actually use to learn.
            </div>
          </div>
          <div className="ns-compareFootRight">
            <a
              className="ns-footCta"
              href="https://docs.google.com/forms/d/e/1FAIpQLSfyEoHmFAXD0plWwSXWNrm6PYz4QYSThChYDGvr4k67cPlzKQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                borderColor: ctaBorder,
                background: ctaBg,
                color: textPrimary,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = ctaHoverBg; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ctaBg; }}
            >
              Join the waitlist
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .ns-compareWrap {
          position: relative;
          width: 100%;
          padding: 64px 20px 24px;
        }

        .ns-compareInner {
          max-width: 900px;
          margin: 0 auto;
        }

        .ns-compareHeader {
          display: grid;
          gap: 10px;
          margin-bottom: 24px;
          text-align: center;
        }

        .ns-compareKicker {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-size: 12px;
        }

        .ns-compareKicker::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: currentColor;
          box-shadow: 0 0 0 4px currentColor;
          opacity: 0.15;
        }

        .ns-compareTitle {
          margin: 0;
          font-size: clamp(28px, 3.5vw, 44px);
          line-height: 1.1;
          font-weight: 600;
          font-family: var(--font-serif, ui-serif, Georgia, "Times New Roman", Times, serif);
        }

        .ns-compareSub {
          margin: 0;
          font-size: 14px;
        }

        /* ── Table ── */

        .ns-table {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid;
        }

        .ns-tRow {
          display: grid;
          grid-template-columns: 1.6fr repeat(4, 1fr);
        }

        .ns-tRowHead {
          /* background set inline */
        }

        .ns-tCell {
          padding: 16px 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60px;
        }

        .ns-tFeature {
          justify-content: flex-start;
        }

        .ns-tFeatureTitle {
          font-size: 14px;
          font-weight: 600;
          line-height: 1.3;
        }

        .ns-tTool {
          flex-direction: column;
          gap: 4px;
        }

        .ns-tToolName {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.01em;
        }

        .ns-tToolSub {
          font-size: 11px;
          white-space: nowrap;
          margin-top: 2px;
        }

        /* ── Cells ── */

        .ns-cell {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ns-cellIcon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid;
        }

        .ns-cellEmpty {
          display: inline-flex;
          border: 1px solid;
          opacity: 0.5;
        }

        /* ── Footer ── */

        .ns-compareFooter {
          margin-top: 12px;
          border: 1px solid;
          border-radius: 16px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .ns-footTitle {
          font-weight: 650;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .ns-footCopy {
          font-size: 12px;
          max-width: 520px;
          line-height: 1.4;
        }

        .ns-footCta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 16px;
          border-radius: 10px;
          text-decoration: none;
          border: 1px solid;
          font-size: 13px;
          font-weight: 650;
          white-space: nowrap;
          transition: background 140ms ease;
        }

        /* ── Mobile ── */

        .ns-compareMobileOnly { display: none; }
        .ns-compareDesktopOnly { display: block; }

        .ns-compareMobileCard {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid;
        }

        .ns-compareMobileTop {
          padding: 14px;
          border-bottom: 1px solid;
          display: grid;
          gap: 10px;
        }

        .ns-compareMobileLabel {
          font-size: 12px;
        }

        .ns-seg {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: 1fr;
          gap: 4px;
          border: 1px solid;
          border-radius: 10px;
          padding: 4px;
        }

        .ns-segBtn {
          cursor: pointer;
          border: none;
          background: transparent;
          color: inherit;
          border-radius: 8px;
          padding: 8px 10px;
          font-size: 12px;
          opacity: 0.6;
          white-space: nowrap;
          transition: opacity 140ms ease, background 140ms ease;
        }

        .ns-segBtn.is-active {
          opacity: 1;
        }

        .ns-segBtnTitle { font-weight: 650; }

        .ns-compareMobileGrid { display: grid; }

        .ns-mRow {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          padding: 14px;
        }

        .ns-mRowLabel {
          font-weight: 600;
          font-size: 13px;
          line-height: 1.3;
        }

        .ns-mRowRight {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .ns-mPair {
          border-radius: 10px;
          border: 1px solid;
          padding: 10px;
          display: grid;
          gap: 8px;
          justify-items: center;
        }

        .ns-mPairLabel {
          font-size: 12px;
          text-align: center;
        }

        @media (max-width: 720px) {
          .ns-compareDesktopOnly { display: none; }
          .ns-compareMobileOnly { display: block; }
          .ns-compareFooter {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </section>
  );
}

export default ComparisonTable;
