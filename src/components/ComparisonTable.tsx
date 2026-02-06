import { useCallback, useMemo, useState } from "react";

type ToolKey =
  | "noteshell"
  | "notebooklm"
  | "notion"
  | "obsidian"
  | "quizlet"
  | "chatgpt";

type CellValue = boolean | "partial" | string;

type Row = {
  id: string;
  label: string;
  helper?: string;
  detail?: string;
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
  { key: "notion", name: "Notion", sub: "Workspace" },
  { key: "obsidian", name: "Obsidian", sub: "Local PKM" },
  { key: "quizlet", name: "Quizlet", sub: "Study tools" },
  { key: "chatgpt", name: "ChatGPT", sub: "General AI" },
];

const DEFAULT_ROWS: Row[] = [
  {
    id: "path",
    label: "Turns sources into a learning path",
    helper: "Roadmap with modules and next steps",
    detail:
      "Instead of a blank page, you get a structured roadmap with what to learn first, what comes next, and why.",
    emphasis: true,
    values: {
      noteshell: true,
      notebooklm: "partial",
      notion: false,
      obsidian: false,
      quizlet: false,
      chatgpt: "partial",
    },
  },
  {
    id: "video",
    label: "Video recommendations and key moments",
    helper: "Find what matters without scrubbing",
    detail:
      "Pulls the best next video for your goal and highlights the key moments so you skip the time-wasting parts.",
    emphasis: true,
    values: {
      noteshell: true,
      notebooklm: "partial",
      notion: false,
      obsidian: "partial",
      quizlet: false,
      chatgpt: "partial",
    },
  },
  {
    id: "notes",
    label: "Auto-structured notes you can edit",
    helper: "Clean, organized, and still yours",
    detail:
      "Noteshell turns messy inputs into clean, editable notes that stay organized inside a project workspace.",
    values: {
      noteshell: true,
      notebooklm: "partial",
      notion: true,
      obsidian: true,
      quizlet: false,
      chatgpt: false,
    },
  },
  {
    id: "study",
    label: "One-click study tools",
    helper: "Flashcards, quizzes, mind maps",
    detail:
      "Generate study outputs from your own materials so you can retain what you learned, not just store it.",
    emphasis: true,
    values: {
      noteshell: true,
      notebooklm: "partial",
      notion: "partial",
      obsidian: "partial",
      quizlet: true,
      chatgpt: false,
    },
  },
  {
    id: "grounded",
    label: "Grounded in your sources",
    helper: "Evidence-first outputs",
    detail:
      "Keeps answers anchored to the sources you provide so you can verify, revisit, and trust the output.",
    values: {
      noteshell: true,
      notebooklm: true,
      notion: "partial",
      obsidian: "partial",
      quizlet: false,
      chatgpt: "partial",
    },
  },
  {
    id: "workflow",
    label: "Built for workflows, not just pages",
    helper: "Plan, track, and keep momentum",
    detail:
      "Designed around goals and progress, not just documents. Keeps the next step obvious.",
    values: {
      noteshell: true,
      notebooklm: false,
      notion: "partial",
      obsidian: "partial",
      quizlet: false,
      chatgpt: false,
    },
  },
  {
    id: "export",
    label: "Export anytime",
    helper: "Markdown and PDF",
    detail:
      "Your outputs remain portable so you can keep them anywhere, not locked in.",
    values: {
      noteshell: true,
      notebooklm: "partial",
      notion: "partial",
      obsidian: true,
      quizlet: "partial",
      chatgpt: "partial",
    },
  },
  {
    id: "privacy",
    label: "Private by default",
    helper: "Your learning stays yours",
    detail:
      "Treats your learning materials as personal by default with a privacy-first stance.",
    values: {
      noteshell: true,
      notebooklm: "partial",
      notion: "partial",
      obsidian: true,
      quizlet: false,
      chatgpt: "partial",
    },
  },
];

function IconCheck(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
      className={props.className}
    >
      <path
        fill="currentColor"
        d="M9.00016 16.17L4.83016 12L3.41016 13.41L9.00016 19L21.0002 7L19.5902 5.59L9.00016 16.17Z"
      />
    </svg>
  );
}


function IconDot(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
      className={props.className}
    >
      <circle cx="12" cy="12" r="5" fill="currentColor" />
    </svg>
  );
}


function getCellLabel(value: CellValue): string {
  if (typeof value === "string") {
    if (value === "partial") return "Partial";
    return value;
  }
  return value ? "Yes" : "No";
}

function Cell({ value, highlight }: { value: CellValue; highlight?: boolean }) {
  if (typeof value === "boolean") {
    return (
      <div
        className={`ns-cell ${highlight ? "is-highlight" : ""}`}
        aria-label={getCellLabel(value)}
      >
        {value ? (
          <span className={`ns-cellIcon ${highlight ? "is-highlight" : ""}`}>
            <IconCheck />
          </span>
        ) : (
          <span className={`ns-cellEmpty ${highlight ? "is-highlight" : ""}`} aria-hidden="true" />
        )}
      </div>
    );
  }

  if (value === "partial") {
    return (
      <div className={`ns-cell ${highlight ? "is-highlight" : ""}`} aria-label={getCellLabel(value)}>
        <span className={`ns-cellIcon ${highlight ? "is-highlight" : ""}`}>
          <IconDot />
        </span>
      </div>
    );
  }

  return (
    <div className={`ns-cell ${highlight ? "is-highlight" : ""}`} aria-label={getCellLabel(value)}>
      <span className="ns-cellText">{value}</span>
    </div>
  );
}

function SegmentedTabs({
  value,
  onChange,
}: {
  value: ToolKey;
  onChange: (v: ToolKey) => void;
}) {
  return (
    <div className="ns-seg" role="tablist" aria-label="Compare tools">
      {TOOLS.filter((t) => t.key !== "noteshell").map((t) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          aria-selected={value === t.key}
          className={`ns-segBtn ${value === t.key ? "is-active" : ""}`}
          onClick={() => onChange(t.key)}
        >
          <span className="ns-segBtnTitle">{t.name}</span>
        </button>
      ))}
    </div>
  );
}

export function ComparisonTable() {
  const rows = useMemo(() => DEFAULT_ROWS, []);
  const rowIds = useMemo(() => rows.map((r) => r.id), [rows]);

  const [mobileFocus, setMobileFocus] = useState<ToolKey>("notebooklm");
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const id of rowIds) init[id] = false;
    return init;
  });

  const expandedCount = useMemo(
    () => Object.values(expanded).filter(Boolean).length,
    [expanded],
  );

  const toggleRow = useCallback((id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const setAll = useCallback(
    (value: boolean) => {
      setExpanded((prev) => {
        const next: Record<string, boolean> = { ...prev };
        for (const id of rowIds) next[id] = value;
        return next;
      });
    },
    [rowIds],
  );

  return (
    <section id="comparison" className="ns-compareWrap" aria-labelledby="comparison-title">
      <div className="ns-compareInner">
        <div className="ns-compareHeader">
          <div className="ns-compareKicker">COMPARISON</div>
          <h2 id="comparison-title" className="ns-compareTitle">
            Noteshell vs the tools you already use
          </h2>
          <p className="ns-compareSub">Noteshell is built for learning outputs, not just storage.</p>

          <div className="ns-compareActions" aria-label="Comparison controls">
            <button type="button" className="ns-actionBtn" onClick={() => setAll(true)}>
              Expand all
            </button>
            <button type="button" className="ns-actionBtn" onClick={() => setAll(false)}>
              Collapse all
            </button>
            <div className="ns-actionHint">{expandedCount}/{rowIds.length} expanded</div>
          </div>
        </div>

        {/* Mobile: compare Noteshell to one selected tool */}
        <div className="ns-compareMobileOnly">
          <div className="ns-compareMobileCard">
            <div className="ns-compareMobileTop">
              <div className="ns-compareMobileLabel">Compare Noteshell to</div>
              <SegmentedTabs value={mobileFocus} onChange={setMobileFocus} />
            </div>

            <div className="ns-compareMobileGrid" role="table" aria-label="Comparison table mobile">
              {rows.map((row) => {
                const isOpen = expanded[row.id] === true;
                return (
                  <div key={row.id} className={`ns-mRow ${row.emphasis ? "is-emphasis" : ""}`} role="row">
                    <button
                      type="button"
                      className="ns-mRowLeft"
                      role="cell"
                      onClick={() => toggleRow(row.id)}
                      aria-expanded={isOpen}
                      aria-controls={`cmp-detail-${row.id}`}
                    >
                      <div className="ns-mRowTitle">
                        <span className="ns-mChevron" aria-hidden="true">{isOpen ? "▾" : "▸"}</span>
                        {row.label}
                      </div>
                      {row.helper ? <div className="ns-mRowHelper">{row.helper}</div> : null}
                      <div
                        id={`cmp-detail-${row.id}`}
                        className={`ns-rowDetail ${isOpen ? "is-open" : ""}`}
                      >
                        {row.detail ?? ""}
                      </div>
                    </button>

                    <div className="ns-mRowRight" role="cell">
                      <div className="ns-mPair">
                        <div className="ns-mPairLabel">Noteshell</div>
                        <Cell value={row.values.noteshell} highlight />
                      </div>
                      <div className="ns-mPair">
                        <div className="ns-mPairLabel">
                          {TOOLS.find((t) => t.key === mobileFocus)?.name ?? "Other"}
                        </div>
                          <Cell value={row.values[mobileFocus]} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop: full matrix */}
        <div className="ns-compareDesktopOnly" role="table" aria-label="Comparison table">
          <div className="ns-table">
            <div className="ns-tHead" role="rowgroup">
              <div className="ns-tRow ns-tRowHead" role="row">
                <div className="ns-tCell ns-tFeature" role="columnheader">
                  Features
                </div>
                {TOOLS.map((t) => (
                  <div
                    key={t.key}
                    className={`ns-tCell ns-tTool ${t.highlight ? "is-highlight" : ""}`}
                    role="columnheader"
                  >
                    <div className="ns-tToolTop">
                      <div className="ns-tToolName">{t.name}</div>
                    </div>
                    {t.sub ? <div className="ns-tToolSub">{t.sub}</div> : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="ns-tBody" role="rowgroup">
              {rows.map((row) => {
                const isOpen = expanded[row.id] === true;

                return (
                  <div
                    key={row.id}
                    className={`ns-tRow ${row.emphasis ? "is-emphasis" : ""}`}
                    role="row"
                  >
                    <button
                      type="button"
                      className="ns-tCell ns-tFeature ns-featureBtn"
                      role="rowheader"
                      onClick={() => toggleRow(row.id)}
                      aria-expanded={isOpen}
                      aria-controls={`cmp-detail-${row.id}`}
                    >
                      <div className="ns-tFeatureTitle">
                        <span className="ns-chevron" aria-hidden="true">{isOpen ? "▾" : "▸"}</span>
                        {row.label}
                      </div>
                      {row.helper ? (
                        <div className="ns-tFeatureHelper">{row.helper}</div>
                      ) : null}
                      <div
                        id={`cmp-detail-${row.id}`}
                        className={`ns-rowDetail ${isOpen ? "is-open" : ""}`}
                      >
                        {row.detail ?? ""}
                      </div>
                    </button>

                    {TOOLS.map((t) => (
                      <div
                        key={`${row.id}-${t.key}`}
                        className={`ns-tCell ns-tVal ${t.highlight ? "is-highlight" : ""}`}
                        role="cell"
                      >
                        <div className={`ns-tValInner ${t.highlight ? "is-highlight" : ""}`}>
                          <Cell value={row.values[t.key]} highlight={t.highlight} />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="ns-legend" aria-label="Legend">
            <div className="ns-legendItem">
              <span className="ns-legendIcon">
                <IconCheck />
              </span>
              <span className="ns-legendText">Yes</span>
            </div>
            <div className="ns-legendItem">
              <span className="ns-legendIcon">
                <IconDot />
              </span>
              <span className="ns-legendText">Partial</span>
            </div>
          </div>
        </div>

        <div className="ns-compareFooter">
          <div className="ns-compareFootLeft">
            <div className="ns-footTitle">What makes Noteshell different</div>
            <div className="ns-footCopy">
              Noteshell turns your sources into a roadmap, then outputs the materials you actually use to learn.
            </div>
          </div>
          <div className="ns-compareFootRight">
            <a className="ns-footCta" href="#waitlist">
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
          max-width: 1120px;
          margin: 0 auto;
        }

        .ns-compareHeader {
          display: grid;
          gap: 10px;
          margin-bottom: 18px;
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
          color: rgba(231, 171, 66, 0.95);
          opacity: 1;
        }

        .ns-compareKicker::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: rgba(231, 171, 66, 0.95);
          box-shadow: 0 0 0 4px rgba(231, 171, 66, 0.10);
        }

        /* Match "Be the first to explore" scale */
        .ns-compareTitle {
          margin: 0;
          font-size: clamp(34px, 4vw, 56px);
          line-height: 1.05;
          font-weight: 600;
          font-family: var(--font-serif, ui-serif, Georgia, "Times New Roman", Times, serif);
        }

        .ns-compareSub {
          margin: 0;
          opacity: 0.75;
          font-size: 14px;
        }

        .ns-compareActions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 6px;
        }

        .ns-actionBtn {
          cursor: pointer;
          border-radius: 12px;
          padding: 10px 12px;
          font-size: 13px;
          font-weight: 600;
          color: inherit;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.14);
          transition: transform 140ms ease, background 140ms ease;
        }

        .ns-actionBtn:hover {
          background: rgba(255, 255, 255, 0.06);
          transform: translateY(-1px);
        }

        .ns-actionHint {
          font-size: 12px;
          opacity: 0.75;
          padding-left: 4px;
        }

        .ns-table {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(0, 0, 0, 0.32);
          backdrop-filter: blur(10px);
        }

        .ns-tRow {
          display: grid;
          grid-template-columns: 1.55fr repeat(6, minmax(120px, 1fr));
        }

        .ns-tRow + .ns-tRow {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ns-tRowHead {
          background: rgba(255, 255, 255, 0.04);
        }

        .ns-tRow.is-emphasis {
          background: transparent;
        }

        .ns-tCell {
          padding: 14px 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 64px;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.92);
        }

        .ns-tRow .ns-tCell:last-child {
          border-right: none;
        }

        .ns-tFeature {
          justify-content: flex-start;
          align-items: flex-start;
          flex-direction: column;
          gap: 6px;
          background: rgba(0, 0, 0, 0.18);
          color: rgba(255, 255, 255, 0.92);
          opacity: 1;
        }

        .ns-featureBtn {
          cursor: pointer;
          border: none;
          width: 100%;
          text-align: left;
        }

        .ns-featureBtn:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .ns-tFeatureTitle {
          font-size: 14px;
          font-weight: 650;
          line-height: 1.25;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ns-chevron {
          width: 14px;
          opacity: 0.85;
          flex: 0 0 auto;
        }

        .ns-tFeatureHelper {
          font-size: 12px;
          opacity: 0.70;
          line-height: 1.3;
          padding-left: 24px;
        }

        .ns-rowDetail {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transform: translateY(-4px);
          transition: max-height 220ms ease, opacity 220ms ease, transform 220ms ease;
          padding-left: 24px;
          font-size: 12px;
          line-height: 1.35;
          opacity: 0.0;
        }

        .ns-rowDetail.is-open {
          max-height: 120px;
          opacity: 0.78;
          transform: translateY(0);
        }

        .ns-tTool {
          flex-direction: column;
          gap: 4px;
          background: rgba(0, 0, 0, 0.18);
        }

        .ns-tToolName {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.01em;
        }

        .ns-tToolSub {
          font-size: 11px;
          opacity: 0.72;
          white-space: nowrap;
        }

        .ns-tToolTop {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }


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
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.10);
        }

        .ns-cellEmpty {
          display: inline-flex;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          opacity: 0.55;
        }

        .ns-cellEmpty.is-highlight {
          background: rgba(74, 144, 226, 0.06);
          border-color: rgba(74, 144, 226, 0.18);
          opacity: 0.60;
        }

        .ns-cellIcon.is-highlight {
          background: linear-gradient(180deg, rgba(74, 144, 226, 0.34), rgba(74, 144, 226, 0.16));
          border-color: rgba(74, 144, 226, 0.45);
          box-shadow: 0 10px 26px rgba(74, 144, 226, 0.16);
        }

        /* Noteshell column: premium highlight */
        .is-highlight.ns-tTool {
          position: relative;
          background: linear-gradient(180deg, rgba(74, 144, 226, 0.22), rgba(0, 0, 0, 0.10));
          box-shadow:
            inset 1px 0 0 rgba(74, 144, 226, 0.35),
            inset -1px 0 0 rgba(74, 144, 226, 0.22),
            0 18px 40px rgba(74, 144, 226, 0.10);
        }

        .is-highlight.ns-tTool::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 0px;
          background: radial-gradient(1200px 240px at 50% 0%, rgba(74, 144, 226, 0.35), transparent 60%);
          pointer-events: none;
        }

        .is-highlight.ns-tTool::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(74, 144, 226, 0.85), transparent);
          pointer-events: none;
        }

        .is-highlight.ns-tVal {
          background: transparent;
          box-shadow: inset 1px 0 0 rgba(74, 144, 226, 0.26), inset -1px 0 0 rgba(74, 144, 226, 0.16);
        }

        .ns-tValInner {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
        }

        .ns-tValInner.is-highlight {
          background: linear-gradient(180deg, rgba(74, 144, 226, 0.10), rgba(74, 144, 226, 0.04));
          border: 1px solid rgba(74, 144, 226, 0.20);
          box-shadow: 0 14px 34px rgba(74, 144, 226, 0.10);
        }

        /* Slightly stronger for emphasized rows, but ONLY inside the Noteshell column */
        .ns-tRow.is-emphasis .is-highlight.ns-tVal {
          box-shadow: inset 1px 0 0 rgba(74, 144, 226, 0.32), inset -1px 0 0 rgba(74, 144, 226, 0.20);
        }

        .ns-tRow.is-emphasis .ns-tValInner.is-highlight {
          background: linear-gradient(180deg, rgba(74, 144, 226, 0.14), rgba(74, 144, 226, 0.06));
          border-color: rgba(74, 144, 226, 0.26);
        }
        .ns-tValInner.is-highlight:hover {
          transform: translateY(-1px);
          transition: transform 140ms ease, background 140ms ease, box-shadow 140ms ease;
          box-shadow: 0 18px 44px rgba(74, 144, 226, 0.14);
        }

        .ns-legend {
          display: flex;
          gap: 14px;
          justify-content: center;
          align-items: center;
          margin-top: 10px;
          opacity: 0.9;
          flex-wrap: wrap;
        }

        .ns-legendItem {
          display: inline-flex;
          gap: 8px;
          align-items: center;
          font-size: 12px;
          opacity: 0.75;
        }

        .ns-legendIcon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ns-compareFooter {
          margin-top: 16px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(0, 0, 0, 0.28);
          border-radius: 16px;
          padding: 16px;
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
          opacity: 0.75;
          max-width: 680px;
          line-height: 1.35;
        }

        .ns-footCta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 14px;
          border-radius: 12px;
          text-decoration: none;
          border: 1px solid rgba(74, 144, 226, 0.45);
          background: rgba(74, 144, 226, 0.16);
          color: inherit;
          font-size: 13px;
          font-weight: 650;
          white-space: nowrap;
        }

        .ns-footCta:hover {
          background: rgba(74, 144, 226, 0.24);
        }

        /* Mobile */
        .ns-compareMobileOnly {
          display: none;
        }

        .ns-compareDesktopOnly {
          display: block;
        }

        .ns-compareMobileCard {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(0, 0, 0, 0.32);
          backdrop-filter: blur(10px);
        }

        .ns-compareMobileTop {
          padding: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: grid;
          gap: 10px;
        }

        .ns-compareMobileLabel {
          font-size: 12px;
          opacity: 0.75;
        }

        .ns-seg {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: 1fr;
          gap: 6px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 6px;
          overflow-x: auto;
        }

        .ns-segBtn {
          cursor: pointer;
          border: none;
          background: transparent;
          color: inherit;
          border-radius: 12px;
          padding: 8px 10px;
          font-size: 12px;
          opacity: 0.7;
          white-space: nowrap;
        }

        .ns-segBtn.is-active {
          opacity: 1;
          background: rgba(74, 144, 226, 0.16);
          border: 1px solid rgba(74, 144, 226, 0.35);
        }

        .ns-segBtnTitle {
          font-weight: 650;
        }

        .ns-compareMobileGrid {
          display: grid;
        }

        .ns-mRow {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          padding: 14px;
        }

        .ns-mRow.is-emphasis {
          background: rgba(74, 144, 226, 0.06);
        }

        .ns-mRow + .ns-mRow {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ns-mRowLeft {
          cursor: pointer;
          border: none;
          background: transparent;
          color: inherit;
          text-align: left;
          padding: 0;
        }

        .ns-mRowTitle {
          font-weight: 650;
          font-size: 13px;
          line-height: 1.25;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ns-mChevron {
          width: 14px;
          opacity: 0.85;
          flex: 0 0 auto;
        }

        .ns-mRowHelper {
          margin-top: 4px;
          font-size: 12px;
          opacity: 0.70;
          line-height: 1.3;
          padding-left: 24px;
        }

        .ns-mRowRight {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .ns-mPair {
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          padding: 10px;
          display: grid;
          gap: 8px;
          justify-items: center;
        }

        .ns-mPairLabel {
          font-size: 12px;
          opacity: 0.75;
          text-align: center;
        }

        @media (max-width: 980px) {
          .ns-tRow {
            grid-template-columns: 1.4fr repeat(6, minmax(92px, 1fr));
          }
        }

        @media (max-width: 860px) {
          .ns-compareDesktopOnly {
            display: none;
          }
          .ns-compareMobileOnly {
            display: block;
          }
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