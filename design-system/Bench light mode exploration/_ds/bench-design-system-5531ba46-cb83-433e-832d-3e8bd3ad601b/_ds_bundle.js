/* @ds-bundle: {"format":4,"namespace":"AVLHubDesignSystem_5531ba","components":[{"name":"EventCard","sourcePath":"components/calendar/EventCard.jsx"},{"name":"DayColumn","sourcePath":"components/calendar/EventCard.jsx"},{"name":"WeekGrid","sourcePath":"components/calendar/EventCard.jsx"},{"name":"SyncBar","sourcePath":"components/calendar/EventCard.jsx"},{"name":"AppBar","sourcePath":"components/chrome/AppBar.jsx"},{"name":"BackStrip","sourcePath":"components/chrome/BackStrip.jsx"},{"name":"PageHeader","sourcePath":"components/chrome/PageHeader.jsx"},{"name":"Kpi","sourcePath":"components/chrome/PageHeader.jsx"},{"name":"StatStrip","sourcePath":"components/chrome/PageHeader.jsx"},{"name":"FactRow","sourcePath":"components/data/FactRow.jsx"},{"name":"LinkChip","sourcePath":"components/data/FactRow.jsx"},{"name":"ChecklistRow","sourcePath":"components/data/FactRow.jsx"},{"name":"LaneBarRow","sourcePath":"components/data/FactRow.jsx"},{"name":"LineRow","sourcePath":"components/data/FactRow.jsx"},{"name":"ActivityRow","sourcePath":"components/data/FactRow.jsx"},{"name":"ActionButton","sourcePath":"components/decisions/DecisionRow.jsx"},{"name":"DecisionRow","sourcePath":"components/decisions/DecisionRow.jsx"},{"name":"SourceChip","sourcePath":"components/decisions/DecisionRow.jsx"},{"name":"TypeGlyph","sourcePath":"components/docs/FileRow.jsx"},{"name":"FileRow","sourcePath":"components/docs/FileRow.jsx"},{"name":"VersionRow","sourcePath":"components/docs/FileRow.jsx"},{"name":"DocsHeaderRow","sourcePath":"components/docs/FileRow.jsx"},{"name":"DropZone","sourcePath":"components/docs/FileRow.jsx"},{"name":"FolderFilter","sourcePath":"components/docs/FileRow.jsx"},{"name":"FolderItem","sourcePath":"components/docs/FileRow.jsx"},{"name":"PreviewPanel","sourcePath":"components/docs/FileRow.jsx"},{"name":"VENTURE_COLORS","sourcePath":"components/forms/SwatchPicker.jsx"},{"name":"SwatchPicker","sourcePath":"components/forms/SwatchPicker.jsx"},{"name":"Swatch","sourcePath":"components/forms/SwatchPicker.jsx"},{"name":"TextField","sourcePath":"components/forms/TextField.jsx"},{"name":"TaskCard","sourcePath":"components/kanban/TaskCard.jsx"},{"name":"KanbanColumn","sourcePath":"components/kanban/TaskCard.jsx"},{"name":"Lane","sourcePath":"components/kanban/TaskCard.jsx"},{"name":"SectionLabel","sourcePath":"components/layout/Panel.jsx"},{"name":"Panel","sourcePath":"components/layout/Panel.jsx"},{"name":"EmptyState","sourcePath":"components/layout/Panel.jsx"},{"name":"Skeleton","sourcePath":"components/layout/Panel.jsx"},{"name":"SkeletonRow","sourcePath":"components/layout/Panel.jsx"},{"name":"NoteSidebar","sourcePath":"components/notes/NoteEditor.jsx"},{"name":"SidebarLink","sourcePath":"components/notes/NoteEditor.jsx"},{"name":"NoteBlock","sourcePath":"components/notes/NoteEditor.jsx"},{"name":"NoteQuote","sourcePath":"components/notes/NoteEditor.jsx"},{"name":"TaskBlock","sourcePath":"components/notes/NoteEditor.jsx"},{"name":"SlashMenu","sourcePath":"components/notes/NoteEditor.jsx"},{"name":"MetaRail","sourcePath":"components/notes/NoteEditor.jsx"},{"name":"MetaLink","sourcePath":"components/notes/NoteEditor.jsx"},{"name":"NoteEditor","sourcePath":"components/notes/NoteEditor.jsx"},{"name":"Modal","sourcePath":"components/overlay/Modal.jsx"},{"name":"CommandPalette","sourcePath":"components/overlay/Modal.jsx"},{"name":"CommandRow","sourcePath":"components/overlay/Modal.jsx"},{"name":"GateBar","sourcePath":"components/pipeline/VentureCard.jsx"},{"name":"WhoChip","sourcePath":"components/pipeline/VentureCard.jsx"},{"name":"VentureCard","sourcePath":"components/pipeline/VentureCard.jsx"},{"name":"AddButton","sourcePath":"components/pipeline/VentureCard.jsx"},{"name":"StageColumn","sourcePath":"components/pipeline/VentureCard.jsx"},{"name":"PipelineBoard","sourcePath":"components/pipeline/VentureCard.jsx"},{"name":"Tag","sourcePath":"components/venture/VentureHeader.jsx"},{"name":"VentureHeader","sourcePath":"components/venture/VentureHeader.jsx"},{"name":"GateRail","sourcePath":"components/venture/VentureHeader.jsx"},{"name":"VentureTabs","sourcePath":"components/venture/VentureHeader.jsx"},{"name":"FilterBar","sourcePath":"components/work/TaskRow.jsx"},{"name":"GroupHeader","sourcePath":"components/work/TaskRow.jsx"},{"name":"TaskRow","sourcePath":"components/work/TaskRow.jsx"}],"sourceHashes":{"components/calendar/EventCard.jsx":"e92ebc8c7171","components/chrome/AppBar.jsx":"009040f73741","components/chrome/BackStrip.jsx":"9534040409b7","components/chrome/PageHeader.jsx":"5c4bbffbb837","components/data/FactRow.jsx":"1b13f0a86909","components/decisions/DecisionRow.jsx":"d6dc8b912567","components/docs/FileRow.jsx":"dda96285d962","components/forms/SwatchPicker.jsx":"3c1ef6884c3c","components/forms/TextField.jsx":"448b4b5a26d0","components/kanban/TaskCard.jsx":"2cebc1363e9c","components/layout/Panel.jsx":"9d19a361aba4","components/notes/NoteEditor.jsx":"909a530dacd8","components/overlay/Modal.jsx":"c326be411d58","components/pipeline/VentureCard.jsx":"0040111c467d","components/venture/VentureHeader.jsx":"5c117199e06f","components/work/TaskRow.jsx":"2a867189e13f","ui_kits/bench/App.jsx":"cbf875d29c59","ui_kits/bench/CalendarScreen.jsx":"3ac76e5ed111","ui_kits/bench/DecisionsScreen.jsx":"886efcdc76fa","ui_kits/bench/DecisionsTab.jsx":"eeb47d805788","ui_kits/bench/DocsTab.jsx":"a629dd887882","ui_kits/bench/MyWorkScreen.jsx":"a46d410bf1b2","ui_kits/bench/NewVentureModal.jsx":"909d5a610209","ui_kits/bench/NotesScreen.jsx":"39a39f4760f8","ui_kits/bench/OverviewTab.jsx":"baf174925114","ui_kits/bench/Palette.jsx":"d5ba84996b79","ui_kits/bench/PipelineScreen.jsx":"28a3dbad2eb9","ui_kits/bench/StateSwitch.jsx":"8a4bd761427a","ui_kits/bench/VentureScreen.jsx":"af9ccca0a74d","ui_kits/bench/data.jsx":"959a60012a13","ui_kits/bench/tweaks-panel.jsx":"d259e3a86f73"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AVLHubDesignSystem_5531ba = window.AVLHubDesignSystem_5531ba || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/calendar/EventCard.jsx
try { (() => {
function EventCard({
  time,
  title,
  flag,
  color = "var(--copper)",
  onClick
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      padding: "8px 9px",
      marginBottom: 6,
      borderLeft: "2px solid " + color,
      background: h ? "var(--panel2)" : "var(--panel)",
      cursor: "pointer",
      transition: "background var(--dur-fast),transform var(--dur-fast)",
      transform: h ? "translateX(2px)" : "none"
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--faint)",
      display: "block",
      letterSpacing: ".08em",
      fontVariantNumeric: "tabular-nums",
      fontWeight: 400
    }
  }, time), /*#__PURE__*/React.createElement("h5", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      marginTop: 4,
      lineHeight: 1.35,
      margin: "4px 0 0"
    }
  }, title), flag && /*#__PURE__*/React.createElement("s", {
    style: {
      display: "inline-block",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".12em",
      textTransform: "uppercase",
      color: "var(--violet)",
      textDecoration: "none",
      marginTop: 6
    }
  }, flag));
}
function DayColumn({
  label,
  today = false,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bg)",
      minHeight: 270,
      padding: 10
    }
  }, /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: "normal",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".14em",
      textTransform: "uppercase",
      color: today ? "var(--copper)" : "var(--faint)",
      display: "block",
      marginBottom: 9
    }
  }, label), children);
}
function WeekGrid({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(5,1fr)",
      gap: 1,
      background: "var(--line)"
    }
  }, children);
}
function SyncBar({
  children = "GOOGLE CALENDAR · SYNCED 14:22 +06 · TWO WAY",
  live = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "11px 22px",
      borderTop: "1px solid var(--line)",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".1em",
      color: "var(--faint)",
      background: "var(--bg2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "var(--teal)",
      animation: live ? "avl-glow var(--dur-glow) ease-in-out infinite" : undefined
    }
  }), children);
}
Object.assign(__ds_scope, { EventCard, DayColumn, WeekGrid, SyncBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/calendar/EventCard.jsx", error: String((e && e.message) || e) }); }

// components/chrome/AppBar.jsx
try { (() => {
function AppBar({
  items = ["Pipeline", "My work", "Notes", "Calendar", "Decisions"],
  active = "Pipeline",
  dimmed = false,
  mark = "B",
  onNavigate,
  onNewVenture,
  onJump,
  newLabel = "+ New venture",
  jumpLabel = "Jump to",
  jumpKey = "⌘K",
  menuItems = ["Profile", "Settings", "Log out"],
  onMenuSelect
}) {
  const [nh, setNh] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [hov, setHov] = React.useState(null);
  const wrap = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const away = e => {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
    };
    const esc = e => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "11px 16px",
      borderBottom: "1px solid var(--line)",
      background: "var(--bg2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: wrap,
    style: {
      position: "relative",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setOpen(o => !o),
    title: "Account",
    style: {
      width: 19,
      height: 19,
      background: "var(--copper)",
      borderRadius: 2,
      display: "grid",
      placeItems: "center",
      fontSize: 11,
      fontWeight: 700,
      color: "var(--on-copper)",
      fontFamily: "var(--font-mono)",
      cursor: "pointer",
      boxShadow: open ? "0 0 0 3px var(--copper-wash)" : "none",
      transition: "box-shadow var(--dur-fast)"
    }
  }, mark), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "calc(100% + 10px)",
      left: 0,
      minWidth: 158,
      background: "var(--bg2)",
      border: "1px solid var(--line)",
      borderRadius: 3,
      boxShadow: "0 12px 28px rgba(0,0,0,.55)",
      padding: "4px 0",
      zIndex: 60
    }
  }, menuItems.map((mi, i) => /*#__PURE__*/React.createElement("div", {
    key: mi,
    onMouseEnter: () => setHov(mi),
    onMouseLeave: () => setHov(null),
    onClick: () => {
      setOpen(false);
      onMenuSelect && onMenuSelect(mi);
    },
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".12em",
      textTransform: "uppercase",
      padding: "8px 13px",
      cursor: "pointer",
      whiteSpace: "nowrap",
      borderTop: i === menuItems.length - 1 && menuItems.length > 1 ? "1px solid var(--line)" : "none",
      marginTop: i === menuItems.length - 1 && menuItems.length > 1 ? 4 : 0,
      paddingTop: i === menuItems.length - 1 && menuItems.length > 1 ? 12 : 8,
      color: hov === mi ? "var(--ink)" : "var(--faint)",
      background: hov === mi ? "var(--copper-wash)" : "transparent",
      transition: "color var(--dur-fast),background var(--dur-fast)"
    }
  }, mi)))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".1em",
      textTransform: "uppercase",
      color: "var(--faint)",
      display: "flex",
      gap: 20
    }
  }, items.map(it => {
    const on = !dimmed && it === active;
    return /*#__PURE__*/React.createElement("span", {
      key: it,
      onClick: () => onNavigate && onNavigate(it),
      style: {
        cursor: "pointer",
        transition: "color var(--dur-base)",
        position: "relative",
        whiteSpace: "nowrap",
        color: on ? "var(--ink)" : undefined,
        fontWeight: on ? 500 : undefined
      }
    }, it, on && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -13,
        height: 1,
        background: "var(--copper)"
      }
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, onNewVenture && /*#__PURE__*/React.createElement("div", {
    onClick: onNewVenture,
    onMouseEnter: () => setNh(true),
    onMouseLeave: () => setNh(false),
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".14em",
      textTransform: "uppercase",
      padding: "5px 11px",
      borderRadius: 2,
      cursor: "pointer",
      border: "1px solid var(--copper)",
      color: "var(--copper)",
      background: nh ? "var(--copper-tint)" : "var(--copper-wash)",
      transition: "background var(--dur-fast)",
      whiteSpace: "nowrap",
      flex: "none"
    }
  }, newLabel), /*#__PURE__*/React.createElement("div", {
    onClick: onJump,
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--faint)",
      border: "1px solid var(--line)",
      padding: "5px 10px",
      borderRadius: 2,
      display: "flex",
      gap: 26,
      cursor: "pointer",
      whiteSpace: "nowrap",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", null, jumpLabel), /*#__PURE__*/React.createElement("kbd", null, jumpKey))));
}
Object.assign(__ds_scope, { AppBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chrome/AppBar.jsx", error: String((e && e.message) || e) }); }

// components/chrome/BackStrip.jsx
try { (() => {
function BackStrip({
  parent = "Pipeline",
  current,
  color = "var(--magenta)",
  onBack,
  switchLabel = "Switch venture ▾",
  onSwitch
}) {
  const t = {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    letterSpacing: ".13em",
    textTransform: "uppercase"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "9px 16px",
      background: "var(--back-strip)",
      borderBottom: "1px solid var(--line)",
      ...t
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onBack,
    style: {
      color: "var(--dim)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 7,
      whiteSpace: "nowrap",
      transition: "color var(--dur-base)"
    }
  }, "\u2190 ", parent), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--ink-ghost2)"
    }
  }, "/"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--ink)",
      display: "flex",
      alignItems: "center",
      gap: 7,
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 2,
      background: color,
      flex: "none"
    }
  }), current), /*#__PURE__*/React.createElement("div", {
    onClick: onSwitch,
    style: {
      marginLeft: "auto",
      color: "var(--faint)",
      border: "1px solid var(--line)",
      padding: "4px 9px",
      cursor: "pointer",
      whiteSpace: "nowrap",
      flex: "none"
    }
  }, switchLabel));
}
Object.assign(__ds_scope, { BackStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chrome/BackStrip.jsx", error: String((e && e.message) || e) }); }

// components/chrome/PageHeader.jsx
try { (() => {
function PageHeader({
  title,
  meta,
  right,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "24px 22px 20px",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      borderBottom: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 25,
      fontWeight: 600,
      letterSpacing: "-.025em",
      margin: 0
    }
  }, title), meta && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--faint)",
      letterSpacing: ".08em",
      marginTop: 7
    }
  }, meta)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 34,
      alignItems: "center",
      textAlign: "right",
      fontFamily: "var(--font-mono)"
    }
  }, right || children));
}
function Kpi({
  value,
  label,
  hot = false
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", {
    style: {
      display: "block",
      fontSize: 27,
      fontWeight: 400,
      letterSpacing: "-.02em",
      lineHeight: 1,
      fontVariantNumeric: "tabular-nums",
      color: hot ? "var(--copper)" : undefined
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      letterSpacing: ".18em",
      textTransform: "uppercase",
      color: "var(--faint)",
      display: "block",
      marginTop: 7
    }
  }, label));
}
function StatStrip({
  stats = []
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 1,
      background: "var(--grid)",
      borderTop: "1px solid var(--line)",
      fontFamily: "var(--font-mono)"
    }
  }, stats.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.label,
    style: {
      flex: 1,
      background: "var(--bg2)",
      padding: "13px 16px"
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 16,
      fontWeight: 400,
      display: "block",
      fontVariantNumeric: "tabular-nums"
    }
  }, s.value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      letterSpacing: ".16em",
      textTransform: "uppercase",
      color: "var(--faint)",
      display: "block",
      marginTop: 5
    }
  }, s.label))));
}
Object.assign(__ds_scope, { PageHeader, Kpi, StatStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chrome/PageHeader.jsx", error: String((e && e.message) || e) }); }

// components/data/FactRow.jsx
try { (() => {
function FactRow({
  k,
  v,
  color,
  mono = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "104px 1fr",
      gap: 12,
      alignItems: "baseline",
      padding: "7px 0",
      borderBottom: "1px solid var(--divider)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".16em",
      textTransform: "uppercase",
      color: "var(--faint)"
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: color || "var(--meta-ink)",
      fontFamily: mono ? "var(--font-mono)" : undefined,
      fontVariantNumeric: mono ? "tabular-nums" : undefined
    }
  }, v));
}
function LinkChip({
  children,
  onClick
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".13em",
      textTransform: "uppercase",
      padding: "4px 9px",
      borderRadius: 2,
      border: "1px solid " + (h ? "var(--line2)" : "var(--line)"),
      color: h ? "var(--copper)" : "var(--dim)",
      cursor: "pointer",
      transition: "color var(--dur-fast),border-color var(--dur-fast)"
    }
  }, children);
}
function ChecklistRow({
  label,
  by,
  done = false,
  onToggle
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "8px 0",
      borderBottom: "1px solid var(--divider)",
      background: h ? "var(--hover-row)" : undefined,
      transition: "background var(--dur-instant)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onToggle,
    style: {
      width: 14,
      height: 14,
      border: "1.5px solid " + (done || h ? "var(--teal)" : "var(--ink-ghost)"),
      borderRadius: 2,
      flex: "none",
      display: "grid",
      placeItems: "center",
      background: done ? "var(--teal)" : undefined,
      cursor: "pointer",
      transition: "border-color var(--dur-base),background var(--dur-base)"
    }
  }, done && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--on-teal)",
      fontWeight: 700
    }
  }, "\u2713")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: done ? "var(--dim)" : undefined
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".12em",
      textTransform: "uppercase",
      color: done ? "var(--teal)" : "var(--ink-ghost3)"
    }
  }, by || "—"));
}
function LaneBarRow({
  lane,
  color,
  open,
  max = 8
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "64px 1fr 24px",
      gap: 11,
      alignItems: "center",
      padding: "6px 0"
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      fontStyle: "normal",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".16em",
      textTransform: "uppercase",
      color: "var(--dim)"
    }
  }, lane), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 2
    }
  }, Array.from({
    length: max
  }).map((_, i) => /*#__PURE__*/React.createElement("s", {
    key: i,
    style: {
      flex: 1,
      height: 3,
      background: i < open ? color : "var(--gate-empty)",
      textDecoration: "none"
    }
  }))), /*#__PURE__*/React.createElement("b", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--dim)",
      fontWeight: 400,
      textAlign: "right",
      fontVariantNumeric: "tabular-nums"
    }
  }, open));
}
function LineRow({
  label,
  meta,
  color,
  onClick
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      padding: "7px 0",
      borderBottom: "1px solid var(--divider)",
      cursor: "pointer",
      background: h ? "var(--hover-row)" : undefined,
      transition: "background var(--dur-instant)"
    }
  }, color && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: 1,
      background: color,
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: h ? "var(--ink)" : "var(--meta-ink)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".1em",
      textTransform: "uppercase",
      color: "var(--faint)",
      flex: "none",
      fontVariantNumeric: "tabular-nums"
    }
  }, meta));
}
function ActivityRow({
  who,
  text,
  when,
  color = "var(--ash)",
  compact = false
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "grid",
      gridTemplateColumns: (compact ? "17px" : "19px") + " 1fr 44px",
      gap: compact ? 9 : 12,
      alignItems: "center",
      padding: compact ? "6px 11px" : "9px 13px",
      borderBottom: "1px solid var(--divider)",
      background: h ? "var(--hover-row)" : undefined,
      transition: "background var(--dur-instant)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: compact ? 17 : 19,
      height: compact ? 17 : 19,
      border: "1px solid var(--line2)",
      borderRadius: 2,
      display: "grid",
      placeItems: "center",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "#a89890"
    }
  }, who), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: compact ? 12 : 12.5,
      color: "var(--meta-ink)",
      display: "flex",
      alignItems: "center",
      gap: 8,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("s", {
    style: {
      width: 5,
      height: 5,
      borderRadius: 1,
      background: color,
      textDecoration: "none",
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: "normal",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, text)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".12em",
      textTransform: "uppercase",
      color: "var(--faint)",
      textAlign: "right",
      fontVariantNumeric: "tabular-nums"
    }
  }, when));
}
Object.assign(__ds_scope, { FactRow, LinkChip, ChecklistRow, LaneBarRow, LineRow, ActivityRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/FactRow.jsx", error: String((e && e.message) || e) }); }

// components/decisions/DecisionRow.jsx
try { (() => {
function ActionButton({
  children,
  onClick,
  accent = true
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".14em",
      textTransform: "uppercase",
      padding: "6px 11px",
      cursor: "pointer",
      borderRadius: 2,
      border: "1px solid " + (accent ? "var(--copper)" : h ? "var(--line2)" : "var(--line)"),
      color: accent ? "var(--copper)" : h ? "var(--dim)" : "var(--faint)",
      background: accent && h ? "var(--copper-tint)" : accent ? "var(--copper-wash)" : "transparent",
      transition: "var(--dur-fast)",
      whiteSpace: "nowrap",
      flex: "none"
    }
  }, children);
}
function DecisionRow({
  decision,
  date,
  who,
  venture,
  ventureColor,
  source,
  rationale,
  expanded = false,
  onToggle,
  onOpenSource
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    onClick: onToggle,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "grid",
      gridTemplateColumns: "14px 1fr 150px 130px 70px",
      gap: 14,
      alignItems: "center",
      padding: "11px 22px",
      borderBottom: "1px solid var(--divider)",
      cursor: "pointer",
      background: expanded ? "var(--active-row)" : h ? "var(--hover-row)" : undefined,
      transition: "background var(--dur-instant)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: expanded ? "var(--copper)" : "var(--ink-ghost)",
      transition: "color var(--dur-fast)"
    }
  }, expanded ? "▾" : "▸"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5
    }
  }, decision), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".1em",
      textTransform: "uppercase",
      color: "var(--dim)",
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, venture && /*#__PURE__*/React.createElement("s", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 1,
      background: ventureColor || "var(--ash)",
      textDecoration: "none"
    }
  }), venture || who), /*#__PURE__*/React.createElement("span", {
    style: {
      justifySelf: "start"
    }
  }, source ? /*#__PURE__*/React.createElement(SourceChip, {
    onClick: e => {
      e && e.stopPropagation && e.stopPropagation();
      onOpenSource && onOpenSource();
    }
  }, source) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".12em",
      textTransform: "uppercase",
      color: "var(--ink-ghost)"
    }
  }, "Logged direct")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--faint)",
      textAlign: "right",
      fontVariantNumeric: "tabular-nums"
    }
  }, date)), expanded && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 22px 18px 50px",
      borderBottom: "1px solid var(--divider)",
      background: "var(--bg2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".16em",
      textTransform: "uppercase",
      color: "var(--faint)",
      marginBottom: 8
    }
  }, "Rationale \xB7 decided by ", who), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      lineHeight: 1.7,
      color: "var(--body-ink)",
      maxWidth: 720,
      margin: 0
    }
  }, rationale)));
}
function SourceChip({
  children,
  onClick
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".12em",
      textTransform: "uppercase",
      padding: "3px 8px",
      borderRadius: 2,
      cursor: "pointer",
      background: "var(--magenta-tint)",
      color: h ? "var(--ink)" : "var(--magenta-label)",
      transition: "color var(--dur-fast)"
    }
  }, children);
}
Object.assign(__ds_scope, { ActionButton, DecisionRow, SourceChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/decisions/DecisionRow.jsx", error: String((e && e.message) || e) }); }

// components/docs/FileRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TypeGlyph({
  type = "PDF",
  color
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".1em",
      textTransform: "uppercase",
      color: color || "var(--dim)",
      border: "1px solid var(--line2)",
      borderRadius: 2,
      padding: "3px 5px",
      display: "inline-block",
      minWidth: 36,
      textAlign: "center"
    }
  }, type);
}
function FileRow({
  name,
  type = "PDF",
  typeColor,
  size,
  who,
  date,
  versions = 1,
  on = false,
  expanded = false,
  onClick,
  onExpand
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "grid",
      gridTemplateColumns: "48px 1fr 74px 120px 74px 58px",
      gap: 14,
      alignItems: "center",
      padding: "10px 16px",
      borderBottom: "1px solid var(--divider)",
      cursor: "pointer",
      borderLeft: "2px solid " + (on ? "var(--copper)" : "transparent"),
      background: on ? "var(--active-row)" : h ? "var(--hover-row)" : undefined,
      transition: "background var(--dur-instant)"
    }
  }, /*#__PURE__*/React.createElement(TypeGlyph, {
    type: type,
    color: typeColor
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--faint)",
      fontVariantNumeric: "tabular-nums"
    }
  }, size), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".1em",
      textTransform: "uppercase",
      color: "var(--dim)"
    }
  }, who), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--faint)",
      textAlign: "right",
      fontVariantNumeric: "tabular-nums"
    }
  }, date), /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      e.stopPropagation();
      onExpand && onExpand();
    },
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".12em",
      textTransform: "uppercase",
      textAlign: "right",
      color: versions > 1 ? h || expanded ? "var(--copper)" : "var(--dim)" : "var(--ink-ghost)",
      transition: "color var(--dur-fast)"
    }
  }, versions > 1 ? `V${versions} ▾` : "V1"));
}
function VersionRow({
  version,
  who,
  date,
  note
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "grid",
      gridTemplateColumns: "48px 1fr 120px 74px",
      gap: 14,
      alignItems: "center",
      padding: "7px 16px 7px 62px",
      borderBottom: "1px solid var(--divider)",
      background: h ? "var(--hover-row)" : "var(--bg2)",
      transition: "background var(--dur-instant)",
      borderLeft: "2px solid var(--line2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".12em",
      color: "var(--dim)"
    }
  }, "V", version), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--faint)"
    }
  }, note), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".1em",
      textTransform: "uppercase",
      color: "var(--dim)"
    }
  }, who), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--faint)",
      textAlign: "right",
      fontVariantNumeric: "tabular-nums"
    }
  }, date));
}
function DocsHeaderRow() {
  const c = {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    letterSpacing: ".16em",
    textTransform: "uppercase",
    color: "var(--faint)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "48px 1fr 74px 120px 74px 58px",
      gap: 14,
      padding: "9px 16px",
      background: "var(--bg2)",
      borderTop: "1px solid var(--line)",
      borderBottom: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: c
  }, "Type"), /*#__PURE__*/React.createElement("span", {
    style: c
  }, "Name"), /*#__PURE__*/React.createElement("span", {
    style: c
  }, "Size"), /*#__PURE__*/React.createElement("span", {
    style: c
  }, "Uploaded by"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...c,
      textAlign: "right"
    }
  }, "Date"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...c,
      textAlign: "right"
    }
  }, "Ver"));
}
function DropZone({
  label = "Drop files here",
  hint = "or click to browse · PDF, PNG, XLSX, DOCX up to 50MB",
  active = false,
  onClick
}) {
  const [h, setH] = React.useState(false);
  const on = active || h;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      border: "1px dashed " + (on ? "var(--copper)" : "var(--line)"),
      borderRadius: 2,
      padding: "18px",
      textAlign: "center",
      cursor: "pointer",
      margin: "14px 16px",
      background: on ? "var(--copper-wash)" : "transparent",
      transition: "border-color var(--dur-base),background var(--dur-base)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".14em",
      textTransform: "uppercase",
      color: on ? "var(--copper)" : "var(--ink-ghost3)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--faint)",
      marginTop: 7
    }
  }, hint));
}
function FolderFilter({
  folders = [],
  active,
  onSelect
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bg2)",
      borderRight: "1px solid var(--line)",
      padding: "14px 0",
      minHeight: 420
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".18em",
      textTransform: "uppercase",
      color: "var(--faint)",
      padding: "0 15px 9px"
    }
  }, "Folders"), folders.map(f => /*#__PURE__*/React.createElement(FolderItem, _extends({
    key: f.label
  }, f, {
    on: f.label === active,
    onClick: () => onSelect && onSelect(f.label)
  }))));
}
function FolderItem({
  label,
  count,
  on = false,
  onClick
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 15px",
      fontSize: 12.5,
      cursor: "pointer",
      borderLeft: "2px solid " + (on ? "var(--copper)" : "transparent"),
      color: on || h ? "var(--ink)" : "var(--dim)",
      background: on ? "var(--active-row)" : h ? "var(--hover-row)" : undefined,
      transition: "color var(--dur-fast),background var(--dur-fast)"
    }
  }, label, /*#__PURE__*/React.createElement("b", {
    style: {
      marginLeft: "auto",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--faint)",
      fontWeight: 400,
      fontVariantNumeric: "tabular-nums"
    }
  }, count));
}
function PreviewPanel({
  name,
  type,
  meta,
  children,
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderLeft: "1px solid var(--line)",
      background: "var(--bg2)",
      padding: "14px 15px",
      minHeight: 420
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      paddingBottom: 11,
      borderBottom: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement(TypeGlyph, {
    type: type
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    onClick: onClose,
    style: {
      marginLeft: "auto",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--faint)",
      cursor: "pointer"
    }
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      border: "1px solid var(--line)",
      borderRadius: 2,
      background: "var(--panel)",
      minHeight: 210,
      display: "grid",
      placeItems: "center",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".16em",
      textTransform: "uppercase",
      color: "var(--ink-ghost)"
    }
  }, children || "Preview"), meta);
}
Object.assign(__ds_scope, { TypeGlyph, FileRow, VersionRow, DocsHeaderRow, DropZone, FolderFilter, FolderItem, PreviewPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/docs/FileRow.jsx", error: String((e && e.message) || e) }); }

// components/forms/SwatchPicker.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const VENTURE_COLORS = [{
  label: "Copper",
  value: "var(--copper)"
}, {
  label: "Ember",
  value: "var(--venture-ember)"
}, {
  label: "Clay",
  value: "var(--venture-clay)"
}, {
  label: "Amber",
  value: "var(--amber)"
}, {
  label: "Moss",
  value: "var(--venture-moss)"
}, {
  label: "Fern",
  value: "var(--venture-fern)"
}, {
  label: "Teal",
  value: "var(--teal)"
}, {
  label: "Steel",
  value: "var(--venture-steel)"
}, {
  label: "Indigo",
  value: "var(--venture-indigo)"
}, {
  label: "Violet",
  value: "var(--violet)"
}, {
  label: "Plum",
  value: "var(--venture-plum)"
}, {
  label: "Magenta",
  value: "var(--magenta)"
}];
function SwatchPicker({
  label = "Colour",
  value,
  onChange,
  options = VENTURE_COLORS,
  note
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8,
      marginBottom: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".16em",
      textTransform: "uppercase",
      color: "var(--faint)"
    }
  }, label), note && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-ghost3)"
    }
  }, note)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, options.map(o => /*#__PURE__*/React.createElement(Swatch, _extends({
    key: o.value
  }, o, {
    on: o.value === value,
    onClick: () => onChange && onChange(o.value)
  })))));
}
function Swatch({
  label,
  value,
  on = false,
  onClick
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    title: label,
    style: {
      width: 34,
      height: 26,
      borderRadius: 2,
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      border: "1px solid " + (on ? value : h ? "var(--line2)" : "var(--line)"),
      transition: "border-color var(--dur-fast)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `linear-gradient(97deg,${value} 0%,transparent 74%)`,
      opacity: on ? 1 : .55
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      height: 2,
      width: "100%",
      background: value,
      opacity: on ? 1 : .6
    }
  }));
}
Object.assign(__ds_scope, { VENTURE_COLORS, SwatchPicker, Swatch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SwatchPicker.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextField.jsx
try { (() => {
function TextField({
  label,
  value,
  onChange,
  placeholder,
  optional = false,
  multiline = false,
  autoFocus = false
}) {
  const [f, setF] = React.useState(false);
  const s = {
    width: "100%",
    background: "var(--bg2)",
    border: "1px solid " + (f ? "var(--copper)" : "var(--line)"),
    borderRadius: 2,
    color: "var(--ink)",
    fontFamily: "var(--font-sans)",
    fontSize: 13.5,
    padding: "9px 11px",
    outline: "none",
    transition: "border-color var(--dur-base)",
    resize: "none"
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".16em",
      textTransform: "uppercase",
      color: f ? "var(--copper)" : "var(--faint)",
      transition: "color var(--dur-base)"
    }
  }, label), optional && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".12em",
      textTransform: "uppercase",
      color: "var(--ink-ghost)"
    }
  }, "Optional")), multiline ? /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: value,
    placeholder: placeholder,
    autoFocus: autoFocus,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    onChange: e => onChange && onChange(e.target.value),
    style: s
  }) : /*#__PURE__*/React.createElement("input", {
    value: value,
    placeholder: placeholder,
    autoFocus: autoFocus,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    onChange: e => onChange && onChange(e.target.value),
    style: s
  }));
}
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextField.jsx", error: String((e && e.message) || e) }); }

// components/kanban/TaskCard.jsx
try { (() => {
function TaskCard({
  title,
  who,
  note,
  due,
  fromNote = false,
  done = false,
  color = "var(--copper)",
  onClick
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      background: h ? "var(--panel2)" : "var(--panel)",
      border: "1px solid " + (h ? "var(--line2)" : "var(--line)"),
      borderLeft: "2px solid " + color,
      padding: "9px 10px",
      marginBottom: 6,
      cursor: "grab",
      transition: "transform var(--dur-fast),background var(--dur-fast),border-color var(--dur-fast)",
      transform: h ? "translateX(2px)" : "none"
    }
  }, /*#__PURE__*/React.createElement("h5", {
    style: {
      fontSize: 12.5,
      fontWeight: 500,
      lineHeight: 1.35,
      margin: 0,
      color: done ? "var(--faint)" : undefined,
      textDecoration: done ? "line-through" : undefined
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 8,
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".06em",
      color: "var(--dim)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 19,
      height: 19,
      border: "1px solid var(--line2)",
      borderRadius: 2,
      display: "grid",
      placeItems: "center",
      fontSize: 11,
      color: "#a89890"
    }
  }, who), /*#__PURE__*/React.createElement("span", {
    style: {
      color: fromNote ? "var(--violet)" : due ? "var(--amber)" : undefined,
      fontVariantNumeric: "tabular-nums"
    }
  }, fromNote ? "FROM NOTE" : due || note || "—")));
}
function KanbanColumn({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bg2)",
      border: "1px solid var(--line)",
      minHeight: 92,
      padding: 7
    }
  }, /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: "normal",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".16em",
      textTransform: "uppercase",
      color: "var(--faint)",
      display: "block",
      margin: "2px 0 7px 2px"
    }
  }, label), children);
}
function Lane({
  name,
  color,
  count,
  children,
  rise
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      animation: rise != null ? `avl-rise var(--dur-rise) var(--ease-rise) ${rise * 0.05}s both` : undefined
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 1,
      background: color
    }
  }), /*#__PURE__*/React.createElement("i", {
    style: {
      fontStyle: "normal",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".18em",
      textTransform: "uppercase",
      color: "var(--dim)"
    }
  }, name), /*#__PURE__*/React.createElement("s", {
    style: {
      flex: 1,
      height: 1,
      background: "var(--line)",
      textDecoration: "none"
    }
  }), /*#__PURE__*/React.createElement("b", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--faint)",
      fontWeight: 400
    }
  }, count)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 8
    }
  }, children));
}
Object.assign(__ds_scope, { TaskCard, KanbanColumn, Lane });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/kanban/TaskCard.jsx", error: String((e && e.message) || e) }); }

// components/layout/Panel.jsx
try { (() => {
function SectionLabel({
  children,
  color,
  right
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      fontStyle: "normal",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".18em",
      textTransform: "uppercase",
      color: color || "var(--faint)"
    }
  }, children), /*#__PURE__*/React.createElement("s", {
    style: {
      flex: 1,
      height: 1,
      background: "var(--line)",
      textDecoration: "none"
    }
  }), right != null && /*#__PURE__*/React.createElement("b", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--faint)",
      fontWeight: 400
    }
  }, right));
}
function Panel({
  label,
  right,
  children,
  pad = 13,
  flush = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--panel)",
      border: "1px solid var(--line)",
      borderRadius: 2,
      padding: flush ? 0 : pad,
      marginBottom: 8
    }
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: flush ? "11px 13px 0" : 0,
      marginBottom: 11
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    right: right
  }, label)), children);
}
function EmptyState({
  children,
  hint,
  action,
  onAction
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px dashed var(--line)",
      borderRadius: 2,
      padding: "26px 18px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".14em",
      textTransform: "uppercase",
      color: "var(--ink-ghost3)"
    }
  }, children), hint && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--faint)",
      marginTop: 9,
      lineHeight: 1.5
    }
  }, hint), action && /*#__PURE__*/React.createElement("div", {
    onClick: onAction,
    style: {
      display: "inline-block",
      marginTop: 14,
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".14em",
      textTransform: "uppercase",
      color: "var(--copper)",
      border: "1px solid var(--line)",
      padding: "6px 11px",
      cursor: "pointer"
    }
  }, action));
}
function Skeleton({
  w = "100%",
  h = 13,
  mb = 0
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: w,
      height: h,
      background: "var(--gate-empty)",
      borderRadius: 2,
      marginBottom: mb,
      animation: "avl-glow var(--dur-glow) ease-in-out infinite"
    }
  });
}
function SkeletonRow({
  cols = ["1fr", "150px", "70px"],
  pad = "11px 22px"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: cols.join(" "),
      gap: 14,
      alignItems: "center",
      padding: pad,
      borderBottom: "1px solid var(--divider)"
    }
  }, cols.map((c, i) => /*#__PURE__*/React.createElement(Skeleton, {
    key: i,
    h: i === 0 ? 13 : 10
  })));
}
Object.assign(__ds_scope, { SectionLabel, Panel, EmptyState, Skeleton, SkeletonRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Panel.jsx", error: String((e && e.message) || e) }); }

// components/notes/NoteEditor.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function NoteSidebar({
  groups = [],
  active,
  onSelect
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bg2)",
      borderRight: "1px solid var(--line)",
      padding: "14px 0",
      minHeight: 520
    }
  }, groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.label
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".18em",
      textTransform: "uppercase",
      color: "var(--faint)",
      padding: "12px 15px 7px"
    }
  }, g.label), g.items.map(it => /*#__PURE__*/React.createElement(SidebarLink, _extends({
    key: it.label
  }, it, {
    on: it.label === active,
    onClick: () => onSelect && onSelect(it.label)
  }))))));
}
function SidebarLink({
  label,
  color = "var(--ash)",
  on = false,
  onClick
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 15px",
      fontSize: 12.5,
      textDecoration: "none",
      cursor: "pointer",
      borderLeft: "2px solid " + (on ? "var(--copper)" : "transparent"),
      color: on || h ? "var(--ink)" : "var(--dim)",
      background: on ? "var(--active-row)" : h ? "var(--hover-row)" : undefined,
      transition: "color var(--dur-fast),background var(--dur-fast)"
    }
  }, /*#__PURE__*/React.createElement("s", {
    style: {
      width: 5,
      height: 5,
      borderRadius: 1,
      background: color,
      textDecoration: "none"
    }
  }), label);
}
function NoteBlock({
  children,
  rise
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      position: "relative",
      padding: "5px 0 5px 26px",
      marginTop: 4,
      borderRadius: 2,
      background: h ? "#100c0a" : undefined,
      transition: "background var(--dur-instant)",
      animation: rise != null ? `avl-rise var(--dur-rise) var(--ease-rise) ${rise * 0.05}s both` : undefined
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      display: "flex",
      gap: 2,
      opacity: h ? 1 : 0,
      transition: "opacity var(--dur-instant)",
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "#463b36"
    }
  }, "\u28FF +"), children);
}
function NoteQuote({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderLeft: "2px solid var(--magenta)",
      paddingLeft: 14,
      color: "var(--quote-ink)",
      fontSize: 14.5,
      lineHeight: 1.7
    }
  }, children);
}
function TaskBlock({
  label,
  pill,
  pillColor = "var(--teal)",
  done = false,
  onToggle
}) {
  const [h, setH] = React.useState(false);
  const tint = pillColor === "var(--magenta)" ? "var(--magenta-tint)" : pillColor === "var(--copper)" ? "var(--copper-tint)" : pillColor === "var(--amber)" ? "var(--amber-tint)" : "var(--teal-tint-strong)";
  const ink = pillColor === "var(--magenta)" ? "var(--magenta-label)" : pillColor === "var(--copper)" ? "var(--copper-label)" : pillColor === "var(--amber)" ? "var(--amber-label)" : "var(--teal-label)";
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      background: "var(--panel)",
      border: "1px solid var(--line)",
      borderLeft: "2px solid var(--teal)",
      padding: "9px 12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onToggle,
    style: {
      width: 14,
      height: 14,
      border: "1.5px solid " + (done || h ? "var(--teal)" : "var(--faint)"),
      borderRadius: 2,
      flex: "none",
      display: "grid",
      placeItems: "center",
      background: done ? "var(--teal)" : undefined,
      transition: "border-color var(--dur-base),background var(--dur-base)",
      cursor: "pointer"
    }
  }, done && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--on-teal)",
      fontWeight: 700
    }
  }, "\u2713")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: done ? "var(--faint)" : undefined,
      textDecoration: done ? "line-through" : undefined
    }
  }, label), pill && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".12em",
      textTransform: "uppercase",
      padding: "3px 8px",
      borderRadius: 2,
      background: tint,
      color: ink
    }
  }, pill));
}
function SlashMenu({
  items = [],
  heading = "Blocks"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      marginLeft: 26,
      width: 290,
      background: "var(--panel)",
      border: "1px solid var(--line2)",
      borderRadius: 3,
      padding: 5,
      boxShadow: "var(--shadow-menu)"
    }
  }, /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: "normal",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".16em",
      textTransform: "uppercase",
      color: "var(--faint)",
      display: "block",
      padding: "6px 9px 5px"
    }
  }, heading), items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.label,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "7px 9px",
      fontSize: 13,
      borderRadius: 2,
      background: it.on ? "#221814" : undefined,
      color: it.on ? "var(--ink)" : "var(--dim)"
    }
  }, /*#__PURE__*/React.createElement("s", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--copper)",
      textDecoration: "none",
      width: 14
    }
  }, it.glyph), it.label, it.hint && /*#__PURE__*/React.createElement("b", {
    style: {
      marginLeft: "auto",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "#463b36",
      fontWeight: 400
    }
  }, it.hint))));
}
function MetaRail({
  sections = []
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderLeft: "1px solid var(--line)",
      padding: "16px 15px",
      background: "var(--bg2)"
    }
  }, sections.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.label
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".16em",
      textTransform: "uppercase",
      color: "var(--faint)",
      margin: i === 0 ? "0 0 6px" : "16px 0 6px"
    }
  }, s.label), s.links ? s.links.map(l => /*#__PURE__*/React.createElement(MetaLink, {
    key: l
  }, l)) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: s.color || "var(--meta-ink)"
    }
  }, s.value))));
}
function MetaLink({
  children
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "block",
      fontSize: 12,
      color: h ? "var(--copper)" : "var(--dim)",
      padding: "5px 0",
      borderBottom: "1px solid var(--line)",
      cursor: "pointer",
      transition: "color var(--dur-fast)"
    }
  }, children);
}
function NoteEditor({
  sidebarGroups = [],
  activeNote,
  crumbs,
  title,
  byline,
  children,
  meta = [],
  onSelectNote
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "216px 1fr 200px"
    }
  }, /*#__PURE__*/React.createElement(NoteSidebar, {
    groups: sidebarGroups,
    active: activeNote,
    onSelect: onSelectNote
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "34px 44px 60px",
      minHeight: 520
    }
  }, crumbs && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".15em",
      textTransform: "uppercase",
      color: "var(--faint)",
      marginBottom: 16
    }
  }, crumbs), title && /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 33,
      fontWeight: 600,
      letterSpacing: "-.035em",
      lineHeight: 1.15,
      margin: 0
    }
  }, title), byline && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".1em",
      color: "var(--faint)",
      marginTop: 11,
      paddingBottom: 20,
      borderBottom: "1px solid var(--line)"
    }
  }, byline), children), /*#__PURE__*/React.createElement(MetaRail, {
    sections: meta
  }));
}
Object.assign(__ds_scope, { NoteSidebar, SidebarLink, NoteBlock, NoteQuote, TaskBlock, SlashMenu, MetaRail, MetaLink, NoteEditor });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/notes/NoteEditor.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Modal.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Modal({
  title,
  eyebrow,
  children,
  footer,
  width = 520,
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 40,
      display: "grid",
      placeItems: "center",
      background: "rgba(0,0,0,.6)"
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width,
      maxWidth: "92vw",
      background: "var(--panel)",
      border: "1px solid var(--line2)",
      borderRadius: 3,
      boxShadow: "var(--shadow-menu)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 18px 14px",
      borderBottom: "1px solid var(--line)",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".18em",
      textTransform: "uppercase",
      color: "var(--copper)"
    }
  }, eyebrow), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: "-.02em",
      marginTop: eyebrow ? 7 : 0
    }
  }, title)), /*#__PURE__*/React.createElement("span", {
    onClick: onClose,
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--faint)",
      cursor: "pointer"
    }
  }, "ESC")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px"
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "13px 18px",
      borderTop: "1px solid var(--line)",
      background: "var(--bg2)",
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, footer)));
}
function CommandPalette({
  query = "",
  onQuery,
  groups = [],
  onRun,
  onClose,
  placeholder = "Jump to a venture, note or action"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 40,
      display: "grid",
      placeItems: "start center",
      paddingTop: "12vh",
      background: "rgba(0,0,0,.6)"
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 560,
      maxWidth: "92vw",
      background: "var(--panel)",
      border: "1px solid var(--line2)",
      borderRadius: 3,
      boxShadow: "var(--shadow-menu)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "12px 14px",
      borderBottom: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--copper)"
    }
  }, "\u2318K"), /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: query,
    placeholder: placeholder,
    onChange: e => onQuery && onQuery(e.target.value),
    style: {
      flex: 1,
      background: "transparent",
      border: "none",
      outline: "none",
      color: "var(--ink)",
      fontFamily: "var(--font-sans)",
      fontSize: 13.5
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 5,
      maxHeight: 340,
      overflow: "auto"
    }
  }, groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.label
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".16em",
      textTransform: "uppercase",
      color: "var(--faint)",
      padding: "9px 9px 5px"
    }
  }, g.label), g.items.map(it => /*#__PURE__*/React.createElement(CommandRow, _extends({
    key: it.label
  }, it, {
    onClick: () => onRun && onRun(it)
  }))))))));
}
function CommandRow({
  glyph,
  label,
  hint,
  color,
  primary = false,
  on = false,
  onClick
}) {
  const [h, setH] = React.useState(false);
  const lit = on || h;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "8px 9px",
      fontSize: 13,
      borderRadius: 2,
      cursor: "pointer",
      background: lit ? "#221814" : undefined,
      color: lit ? "var(--ink)" : "var(--dim)",
      transition: "background var(--dur-instant),color var(--dur-instant)"
    }
  }, /*#__PURE__*/React.createElement("s", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: primary ? "var(--copper)" : color || "var(--faint)",
      textDecoration: "none",
      width: 14,
      textAlign: "center"
    }
  }, glyph), label, hint && /*#__PURE__*/React.createElement("b", {
    style: {
      marginLeft: "auto",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".1em",
      textTransform: "uppercase",
      color: "var(--ink-ghost)",
      fontWeight: 400
    }
  }, hint));
}
Object.assign(__ds_scope, { Modal, CommandPalette, CommandRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Modal.jsx", error: String((e && e.message) || e) }); }

// components/pipeline/VentureCard.jsx
try { (() => {
function GateBar({
  total = 6,
  filled = 0,
  color = "var(--copper)",
  height = 3,
  gap = 2.5
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap,
      marginTop: 11
    }
  }, Array.from({
    length: total
  }).map((_, i) => /*#__PURE__*/React.createElement("s", {
    key: i,
    style: {
      flex: 1,
      height,
      background: i < filled ? color : "var(--gate-empty)",
      textDecoration: "none"
    }
  })));
}
function WhoChip({
  initials,
  size = 19
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      border: "1px solid var(--line2)",
      borderRadius: 2,
      display: "grid",
      placeItems: "center",
      fontSize: 11,
      color: "#a89890",
      fontFamily: "var(--font-mono)",
      flex: "none"
    }
  }, initials);
}
function VentureCard({
  name,
  caption,
  color = "var(--copper)",
  gates = 0,
  gateTotal = 6,
  who,
  founder,
  flag,
  onClick,
  rise,
  showGates = true,
  showMeta = true
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      background: h ? "var(--panel2)" : "var(--panel)",
      border: "1px solid " + (h ? "var(--line2)" : "var(--line)"),
      borderLeft: "3px solid " + color,
      padding: "12px 13px",
      marginBottom: 8,
      cursor: "pointer",
      transition: "background var(--dur-base),border-color var(--dur-base),transform var(--dur-base)",
      transform: h ? "translateX(2px)" : "none",
      animation: rise != null ? `avl-rise var(--dur-rise) var(--ease-rise) ${rise * 0.05}s both` : undefined
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14.5,
      fontWeight: 600,
      letterSpacing: "-.015em",
      margin: 0
    }
  }, name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11.5,
      color: "var(--dim)",
      marginTop: 3,
      lineHeight: 1.4
    }
  }, caption), showGates && /*#__PURE__*/React.createElement(GateBar, {
    total: gateTotal,
    filled: gates,
    color: color
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginTop: showGates ? 10 : 11
    }
  }, /*#__PURE__*/React.createElement(WhoChip, {
    initials: who
  }), showMeta && (flag ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".06em",
      color: "var(--amber)",
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap"
    }
  }, flag) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: "var(--dim)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, founder))));
}
function AddButton({
  children = "+ Venture",
  onClick
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      width: "100%",
      border: "1px dashed " + (h ? "var(--line2)" : "var(--line)"),
      background: "transparent",
      color: h ? "var(--dim)" : "var(--ink-ghost3)",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".14em",
      textTransform: "uppercase",
      padding: 9,
      cursor: "pointer",
      transition: "var(--dur-fast)"
    }
  }, children);
}
function StageColumn({
  stage,
  count,
  progress = 0,
  color = "var(--copper)",
  steps = 5,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bg2)",
      minHeight: 290
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 13px 10px",
      borderBottom: "1px solid var(--grid)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      fontFamily: "var(--font-mono)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      fontStyle: "normal",
      fontSize: 11,
      letterSpacing: ".18em",
      textTransform: "uppercase",
      color: "var(--dim)"
    }
  }, stage), /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 14,
      fontWeight: 400,
      color: "var(--faint)",
      fontVariantNumeric: "tabular-nums"
    }
  }, count)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 2,
      marginTop: 9
    }
  }, Array.from({
    length: steps
  }).map((_, i) => /*#__PURE__*/React.createElement("s", {
    key: i,
    style: {
      flex: 1,
      height: 2,
      background: i < progress ? color : "var(--line)",
      textDecoration: "none"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 10
    }
  }, children));
}
function PipelineBoard({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(5,1fr)",
      gap: 1,
      background: "var(--line)"
    }
  }, children);
}
Object.assign(__ds_scope, { GateBar, WhoChip, VentureCard, AddButton, StageColumn, PipelineBoard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/pipeline/VentureCard.jsx", error: String((e && e.message) || e) }); }

// components/venture/VentureHeader.jsx
try { (() => {
function Tag({
  children,
  hot = false
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".13em",
      textTransform: "uppercase",
      padding: "4px 9px",
      borderRadius: 2,
      whiteSpace: "nowrap",
      border: "1px solid " + (hot ? "var(--amber)" : "rgba(255,255,255,.2)"),
      color: hot ? "var(--amber-label-strong)" : "var(--venture-tag-ink)",
      background: hot ? "var(--amber-tint-strong)" : "rgba(0,0,0,.3)"
    }
  }, children);
}
function VentureHeader({
  name,
  sub,
  tags = [],
  stage,
  stageMeta,
  color
}) {
  const wash = color ? `linear-gradient(97deg,${color} 0%,transparent 74%)` : "var(--venture-wash)";
  const rule = color ? `linear-gradient(90deg,${color} 0%,${color} 52%,transparent 100%)` : "var(--venture-rule)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 22,
      position: "relative",
      overflow: "hidden",
      borderBottom: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: wash,
      opacity: "var(--venture-wash-opacity)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      height: 2,
      width: "100%",
      background: rule
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 31,
      fontWeight: 600,
      letterSpacing: "-.03em",
      margin: 0
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: "var(--venture-sub)",
      marginTop: 6
    }
  }, sub), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      marginTop: 13
    }
  }, tags.map((t, i) => /*#__PURE__*/React.createElement(Tag, {
    key: i,
    hot: t.hot
  }, t.label || t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      fontFamily: "var(--font-mono)"
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      display: "block",
      fontSize: 11,
      letterSpacing: ".2em",
      textTransform: "uppercase",
      color: "var(--venture-stage-ink)"
    }
  }, "Stage"), /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: "normal",
      display: "block",
      fontSize: 34,
      color: "#fff",
      letterSpacing: "-.02em",
      marginTop: 6,
      fontWeight: 500
    }
  }, stage), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      letterSpacing: ".16em",
      textTransform: "uppercase",
      color: "var(--venture-stage-meta)",
      display: "block",
      marginTop: 5
    }
  }, stageMeta))));
}
function GateRail({
  gates = []
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 1,
      background: "var(--line)",
      borderBottom: "1px solid var(--line)"
    }
  }, gates.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.stage,
    style: {
      flex: 1,
      background: g.state === "now" ? "var(--active-row)" : "var(--bg2)",
      padding: "11px 13px",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      fontStyle: "normal",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".16em",
      textTransform: "uppercase",
      display: "block",
      whiteSpace: "nowrap",
      color: g.state === "done" ? "var(--teal)" : g.state === "now" ? "var(--copper)" : "var(--faint)"
    }
  }, g.stage), /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 12.5,
      fontWeight: 500,
      display: "block",
      marginTop: 5,
      color: g.state ? "var(--ink)" : "var(--dim)"
    }
  }, g.label), g.state && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      bottom: 0,
      left: 0,
      height: 2,
      width: g.state === "now" ? "66%" : "100%",
      background: g.state === "now" ? "var(--copper)" : "var(--teal)"
    }
  }))));
}
function VentureTabs({
  tabs = [],
  active,
  onSelect,
  scope,
  accent = "var(--magenta)"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 2,
      padding: "10px 22px 0",
      background: "var(--bg2)",
      borderBottom: "1px solid var(--line)"
    }
  }, tabs.map(t => {
    const on = t.label === active;
    return /*#__PURE__*/React.createElement("div", {
      key: t.label,
      onClick: () => onSelect && onSelect(t.label),
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: ".13em",
        textTransform: "uppercase",
        color: on ? "var(--ink)" : "var(--faint)",
        padding: "9px 14px",
        cursor: "pointer",
        whiteSpace: "nowrap",
        border: "1px solid " + (on ? "var(--line)" : "transparent"),
        borderBottom: "none",
        background: on ? "var(--bg)" : undefined,
        position: "relative",
        top: on ? 1 : 0,
        transition: "color var(--dur-base),background var(--dur-base)"
      }
    }, on && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        top: -1,
        left: -1,
        right: -1,
        height: 2,
        background: accent
      }
    }), t.label, t.count != null && /*#__PURE__*/React.createElement("b", {
      style: {
        color: "var(--faint)",
        fontWeight: 400,
        marginLeft: 7
      }
    }, t.count));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".14em",
      textTransform: "uppercase",
      color: "#463b36",
      padding: "9px 0",
      whiteSpace: "nowrap",
      flex: "none"
    }
  }, scope));
}
Object.assign(__ds_scope, { Tag, VentureHeader, GateRail, VentureTabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/venture/VentureHeader.jsx", error: String((e && e.message) || e) }); }

// components/work/TaskRow.jsx
try { (() => {
function FilterBar({
  filters = [],
  active,
  onSelect
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, filters.map(f => {
    const on = f === active;
    return /*#__PURE__*/React.createElement("div", {
      key: f,
      onClick: () => onSelect && onSelect(f),
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: ".14em",
        textTransform: "uppercase",
        padding: "6px 11px",
        cursor: "pointer",
        transition: "var(--dur-fast)",
        border: "1px solid " + (on ? "var(--copper)" : "var(--line)"),
        color: on ? "var(--copper)" : "var(--faint)",
        background: on ? "var(--copper-wash)" : undefined
      }
    }, f);
  }));
}
function GroupHeader({
  label,
  count,
  hot = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "9px 22px",
      background: "var(--bg2)",
      borderTop: "1px solid var(--line)",
      borderBottom: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      fontStyle: "normal",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".18em",
      textTransform: "uppercase",
      color: hot ? "var(--amber)" : "var(--dim)"
    }
  }, label), /*#__PURE__*/React.createElement("b", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--faint)",
      marginLeft: "auto",
      fontWeight: 400
    }
  }, count));
}
function TaskRow({
  title,
  venture,
  ventureColor = "var(--ash)",
  lane,
  laneColor = "var(--copper)",
  date,
  late = false,
  done = false,
  onToggle,
  onClick
}) {
  const [h, setH] = React.useState(false);
  const tint = laneColor === "var(--amber)" ? "var(--amber-tint)" : laneColor === "var(--teal)" ? "var(--teal-tint)" : laneColor === "var(--magenta)" ? "var(--magenta-tint)" : "var(--copper-tint)";
  const ink = laneColor === "var(--amber)" ? "var(--amber-label)" : laneColor === "var(--teal)" ? "var(--teal-label)" : laneColor === "var(--magenta)" ? "var(--magenta-label)" : "var(--copper-label)";
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "grid",
      gridTemplateColumns: "20px 1fr 150px 96px 70px",
      gap: 14,
      alignItems: "center",
      padding: "11px 22px",
      borderBottom: "1px solid var(--divider)",
      cursor: "pointer",
      background: h ? "var(--hover-row)" : undefined,
      transition: "background var(--dur-instant)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      e.stopPropagation();
      onToggle && onToggle();
    },
    style: {
      width: 14,
      height: 14,
      border: "1.5px solid " + (done ? "var(--teal)" : h ? "var(--teal)" : "var(--ink-ghost)"),
      borderRadius: 2,
      background: done ? "var(--teal)" : undefined,
      transition: "border-color var(--dur-base)",
      display: "grid",
      placeItems: "center"
    }
  }, done && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--on-teal)",
      fontWeight: 700
    }
  }, "\u2713")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: done ? "var(--faint)" : undefined,
      textDecoration: done ? "line-through" : undefined
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".1em",
      textTransform: "uppercase",
      display: "flex",
      alignItems: "center",
      gap: 7,
      color: "var(--dim)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 1,
      background: ventureColor
    }
  }), venture), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: ".13em",
      textTransform: "uppercase",
      padding: "3px 7px",
      borderRadius: 2,
      justifySelf: "start",
      background: tint,
      color: ink
    }
  }, lane), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: late ? "var(--amber)" : "var(--faint)",
      textAlign: "right",
      fontVariantNumeric: "tabular-nums"
    }
  }, date));
}
Object.assign(__ds_scope, { FilterBar, GroupHeader, TaskRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/work/TaskRow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/bench/App.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "cardStyle": "full",
  "stagger": true
} /*EDITMODE-END*/;
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [accountMsg, setAccountMsg] = React.useState(null);
  React.useEffect(() => {
    if (!accountMsg) return;
    const id = setTimeout(() => setAccountMsg(null), 2200);
    return () => clearTimeout(id);
  }, [accountMsg]);
  const [view, setView] = React.useState('Pipeline');
  const [venture, setVenture] = React.useState(null);
  const [modal, setModal] = React.useState(false);
  const [palette, setPalette] = React.useState(false);
  const nav = v => {
    if (venture) return;
    setView(v);
  };
  const openNew = () => {
    setPalette(false);
    setModal(true);
  };
  React.useEffect(() => {
    const h = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPalette(p => !p);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        openNew();
      } else if (e.key === 'Escape') {
        setPalette(false);
        setModal(false);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  const runCommand = it => {
    setPalette(false);
    if (it.action === 'new-venture') return setModal(true);
    if (it.action === 'venture') return setVenture(it.name);
    if (it.action === 'notes') {
      setVenture(null);
      return setView('Notes');
    }
    if (it.action === 'view') {
      setVenture(null);
      return setView(it.view);
    }
  };
  const bar = {
    onNewVenture: openNew,
    onJump: () => setPalette(true),
    onMenuSelect: it => setAccountMsg(it)
  };
  const overlays = /*#__PURE__*/React.createElement(React.Fragment, null, accountMsg && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      left: 16,
      top: 52,
      zIndex: 80,
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: 'var(--faint)',
      background: 'var(--bg2)',
      border: '1px solid var(--line)',
      borderRadius: 3,
      padding: '7px 11px'
    }
  }, accountMsg, " \u2014 not wired yet"), palette && /*#__PURE__*/React.createElement(Palette, {
    onClose: () => setPalette(false),
    onRun: runCommand
  }), modal && /*#__PURE__*/React.createElement(NewVentureModal, {
    onClose: () => setModal(false),
    onCreate: v => {
      AVL_DATA.ventures[v.name] = {
        color: v.color,
        caption: v.line || 'No one-liner yet',
        sub: v.line || 'No one-liner yet',
        stage: 'Meet',
        stageMeta: '0 of 6 gates cleared',
        gates: 0,
        who: 'RM',
        founder: v.founder || 'Founder not set',
        days: 'Added today',
        fresh: true
      };
      if (!AVL_DATA.stages[0].items.includes(v.name)) AVL_DATA.stages[0].items.push(v.name);
      AVL_DATA.stages[0].count = String(AVL_DATA.stages[0].items.length).padStart(2, '0');
      setModal(false);
      setVenture(v.name);
    }
  }));
  const screen = venture ? /*#__PURE__*/React.createElement(VentureScreen, _extends({
    name: venture,
    onBack: () => setVenture(null),
    onNavigate: nav
  }, bar)) : view === 'Notes' ? /*#__PURE__*/React.createElement(NotesScreen, _extends({
    onNavigate: nav
  }, bar)) : view === 'My work' ? /*#__PURE__*/React.createElement(MyWorkScreen, _extends({
    onNavigate: nav
  }, bar)) : view === 'Calendar' ? /*#__PURE__*/React.createElement(CalendarScreen, _extends({
    onNavigate: nav
  }, bar)) : view === 'Decisions' ? /*#__PURE__*/React.createElement(DecisionsScreen, _extends({
    onNavigate: nav
  }, bar)) : /*#__PURE__*/React.createElement(PipelineScreen, _extends({
    onOpenVenture: setVenture,
    onNavigate: nav
  }, bar, {
    cardStyle: t.cardStyle,
    stagger: t.stagger
  }));
  return /*#__PURE__*/React.createElement(React.Fragment, null, screen, overlays, /*#__PURE__*/React.createElement(TweaksPanel, null, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Pipeline card"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Detail",
    value: t.cardStyle,
    options: ['full', 'clean'],
    onChange: v => setTweak('cardStyle', v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Board"
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Staggered entrance",
    value: t.stagger,
    onChange: v => setTweak('stagger', v)
  })));
}
Object.assign(window, {
  App
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/bench/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/bench/CalendarScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const AppBar = p => window.AVLHubDesignSystem_5531ba.AppBar(p);
const FilterBar = p => window.AVLHubDesignSystem_5531ba.FilterBar(p);
const WeekGrid = p => window.AVLHubDesignSystem_5531ba.WeekGrid(p);
const DayColumn = p => window.AVLHubDesignSystem_5531ba.DayColumn(p);
const EventCard = p => window.AVLHubDesignSystem_5531ba.EventCard(p);
const SyncBar = p => window.AVLHubDesignSystem_5531ba.SyncBar(p);
const WEEK = [{
  label: 'Mon 17',
  events: [{
    time: '10:00',
    title: 'Tunde intro call',
    flag: 'Note ready',
    color: 'var(--magenta)'
  }]
}, {
  label: 'Tue 18',
  events: [{
    time: '14:30',
    title: 'Dikkha release review',
    flag: 'Note ready',
    color: 'var(--violet)'
  }, {
    time: '18:00',
    title: 'Personal · gym',
    color: 'var(--ash)'
  }]
}, {
  label: 'Wed 19 · today',
  today: true,
  events: [{
    time: '09:30',
    title: 'Partner sync, all four',
    flag: 'Note ready'
  }, {
    time: '16:00',
    title: 'Buyer interview 3 of 6',
    flag: '+ Create note',
    color: 'var(--magenta)'
  }]
}, {
  label: 'Thu 20',
  events: [{
    time: '11:00',
    title: 'Eloy Lab, regulatory update',
    flag: '+ Create note',
    color: 'var(--amber)'
  }]
}, {
  label: 'Fri 21',
  events: [{
    time: '15:00',
    title: 'Term sheet walkthrough',
    flag: '+ Create note',
    color: 'var(--teal)'
  }]
}];
function CalendarScreen({
  onNavigate,
  onNewVenture,
  onJump,
  onMenuSelect
}) {
  const [scope, setScope] = React.useState('Everyone');
  const [made, setMade] = React.useState({});
  const show = e => scope === 'Everyone' || (scope === 'Venture calls' ? !!e.flag : e.color !== 'var(--ash)');
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AppBar, {
    active: "Calendar",
    onNavigate: onNavigate,
    onNewVenture: onNewVenture,
    onJump: onJump,
    onMenuSelect: onMenuSelect
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 25,
      fontWeight: 600,
      letterSpacing: '-.025em',
      margin: 0
    }
  }, "Week of 17 August"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--faint)',
      letterSpacing: '.08em',
      marginTop: 6
    }
  }, "9 MEETINGS \xB7 4 LINKED TO VENTURES")), /*#__PURE__*/React.createElement(FilterBar, {
    filters: ['Everyone', 'Just me', 'Venture calls'],
    active: scope,
    onSelect: setScope
  })), /*#__PURE__*/React.createElement(WeekGrid, null, WEEK.map(d => /*#__PURE__*/React.createElement(DayColumn, {
    key: d.label,
    label: d.label,
    today: d.today
  }, d.events.filter(show).map(e => /*#__PURE__*/React.createElement(EventCard, _extends({
    key: e.title
  }, e, {
    flag: made[e.title] ? 'Note ready' : e.flag,
    onClick: () => e.flag === '+ Create note' && setMade(m => ({
      ...m,
      [e.title]: true
    }))
  })))))), /*#__PURE__*/React.createElement(SyncBar, null));
}
Object.assign(window, {
  CalendarScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/bench/CalendarScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/bench/DecisionsScreen.jsx
try { (() => {
const AppBar = p => window.AVLHubDesignSystem_5531ba.AppBar(p);
const ActionButton = p => window.AVLHubDesignSystem_5531ba.ActionButton(p);
const FilterBar = p => window.AVLHubDesignSystem_5531ba.FilterBar(p);
function DecisionsScreen({
  onNavigate,
  onNewVenture,
  onJump,
  onMenuSelect
}) {
  const [state, setState] = React.useState('Data');
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AppBar, {
    active: "Decisions",
    onNavigate: onNavigate,
    onNewVenture: onNewVenture,
    onJump: onJump,
    onMenuSelect: onMenuSelect
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 25,
      fontWeight: 600,
      letterSpacing: '-.025em',
      margin: 0
    }
  }, "Decisions"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--faint)',
      letterSpacing: '.08em',
      marginTop: 6
    }
  }, "6 LOGGED \xB7 4 VENTURES \xB7 NEWEST FIRST")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(FilterBar, {
    filters: ['Data', 'Empty', 'Loading'],
    active: state,
    onSelect: setState
  }), /*#__PURE__*/React.createElement(ActionButton, null, "+ Log a decision"))), /*#__PURE__*/React.createElement(DecisionsList, {
    items: DECISIONS,
    grouped: true,
    state: state
  }));
}
Object.assign(window, {
  DecisionsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/bench/DecisionsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/bench/DecisionsTab.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const DecisionRow = p => window.AVLHubDesignSystem_5531ba.DecisionRow(p);
const ActionButton = p => window.AVLHubDesignSystem_5531ba.ActionButton(p);
const EmptyState = p => window.AVLHubDesignSystem_5531ba.EmptyState(p);
const SkeletonRow = p => window.AVLHubDesignSystem_5531ba.SkeletonRow(p);
const GroupHeader = p => window.AVLHubDesignSystem_5531ba.GroupHeader(p);
const DECISIONS = [{
  decision: 'No exclusivity in the ImmiClaw term sheet',
  date: '18 AUG',
  who: 'Saif Rashid',
  venture: 'ImmiClaw',
  ventureColor: 'var(--magenta)',
  source: 'Call with Tunde',
  rationale: 'Six months Lagos-only would cap us before we know if the model works. We keep the pilot, we lose the guarantee, and we revisit the question at ten paying agencies.'
}, {
  decision: '45% AVL stake, agreed in principle',
  date: '11 AUG',
  who: 'Saif Rashid',
  venture: 'ImmiClaw',
  ventureColor: 'var(--magenta)',
  source: 'Founder call',
  rationale: 'Founder keeps operational control, AVL carries build and GTM for the first two quarters. Standard for a Validate-stage venture we are staffing ourselves.'
}, {
  decision: 'Nigeria before Ghana',
  date: '09 AUG',
  who: 'Mufassal Siddique',
  venture: 'ImmiClaw',
  ventureColor: 'var(--magenta)',
  rationale: 'Three warm agencies in Lagos against none in Accra. Ghana stays on the map for Q1 once the parser handles two document standards.'
}, {
  decision: 'Ship Dikkha 2.4 without the offline pack',
  date: '15 AUG',
  who: 'Risad Mahmud',
  venture: 'Dikkha AI',
  ventureColor: 'var(--violet)',
  source: 'Release review',
  rationale: 'Offline caching adds two weeks and the SSC season starts in September. It goes into 2.5, behind a flag, once the release is out.'
}, {
  decision: 'Pass on the logistics venture',
  date: '09 AUG',
  who: 'Risad Mahmud',
  venture: 'Unfiled',
  rationale: 'No AI leverage in the workflow and the margin sits with the fleet owner, not the software. Good business, wrong studio.'
}, {
  decision: 'Chhar stays on Play only until 5K installs',
  date: '04 AUG',
  who: 'Mufassal Siddique',
  venture: 'Chhar',
  ventureColor: 'var(--teal)',
  rationale: 'iOS review overhead is not worth it below five thousand installs. Revisit when the deals feed is stable for a full month.'
}];
function DecisionsList({
  items,
  grouped = false,
  state = 'Data',
  title,
  onLog
}) {
  const [open, setOpen] = React.useState(items[0] && items[0].decision);
  if (state === 'Loading') return /*#__PURE__*/React.createElement("div", null, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement(SkeletonRow, {
    key: i,
    cols: ['14px', '1fr', '150px', '130px', '70px'],
    pad: "11px 22px"
  })));
  if (state === 'Empty') return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 22
    }
  }, /*#__PURE__*/React.createElement(EmptyState, {
    hint: "A decision is logged from the /decision block in a note, or straight from this page. Every one keeps its rationale.",
    action: "+ Log a decision"
  }, "No decisions logged yet"));
  const row = d => /*#__PURE__*/React.createElement(DecisionRow, _extends({
    key: d.decision
  }, d, {
    venture: grouped ? undefined : d.venture,
    expanded: open === d.decision,
    onToggle: () => setOpen(o => o === d.decision ? null : d.decision)
  }));
  if (!grouped) return /*#__PURE__*/React.createElement("div", null, items.map(row));
  const groups = [...new Set(items.map(d => d.venture))];
  return /*#__PURE__*/React.createElement("div", null, groups.map(g => /*#__PURE__*/React.createElement(React.Fragment, {
    key: g
  }, /*#__PURE__*/React.createElement(GroupHeader, {
    label: g,
    count: items.filter(d => d.venture === g).length
  }), items.filter(d => d.venture === g).map(row))));
}
function DecisionsTab({
  state = 'Data',
  venture = 'ImmiClaw'
}) {
  const items = DECISIONS.filter(d => d.venture === venture);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '.18em',
      textTransform: 'uppercase',
      color: 'var(--faint)'
    }
  }, state === 'Empty' ? '0' : items.length, " decisions logged \xB7 newest first"), /*#__PURE__*/React.createElement(ActionButton, null, "+ Log a decision")), /*#__PURE__*/React.createElement(DecisionsList, {
    items: items,
    state: items.length ? state : 'Empty'
  }));
}
Object.assign(window, {
  DecisionsTab,
  DecisionsList,
  DECISIONS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/bench/DecisionsTab.jsx", error: String((e && e.message) || e) }); }

// ui_kits/bench/DocsTab.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const FolderFilter = p => window.AVLHubDesignSystem_5531ba.FolderFilter(p);
const DropZone = p => window.AVLHubDesignSystem_5531ba.DropZone(p);
const DocsHeaderRow = p => window.AVLHubDesignSystem_5531ba.DocsHeaderRow(p);
const FileRow = p => window.AVLHubDesignSystem_5531ba.FileRow(p);
const VersionRow = p => window.AVLHubDesignSystem_5531ba.VersionRow(p);
const PreviewPanel = p => window.AVLHubDesignSystem_5531ba.PreviewPanel(p);
const EmptyState = p => window.AVLHubDesignSystem_5531ba.EmptyState(p);
const SkeletonRow = p => window.AVLHubDesignSystem_5531ba.SkeletonRow(p);
const FactRow = p => window.AVLHubDesignSystem_5531ba.FactRow(p);
const foldersFrom = files => [{
  label: 'All',
  count: files.length
}, ...AVL_DATA.docFolders.map(f => ({
  label: f,
  count: files.filter(x => x.folder === f).length
}))];
function DocsTab({
  state = 'Data',
  venture = 'ImmiClaw'
}) {
  const files = state === 'Data' ? AVL_DATA.docs.filter(f => f.venture === venture) : [];
  const folders = state === 'Loading' ? [{
    label: 'All'
  }, ...AVL_DATA.docFolders.map(f => ({
    label: f
  }))] : foldersFrom(files);
  const [folder, setFolder] = React.useState('All');
  const [sel, setSel] = React.useState(null);
  const [open, setOpen] = React.useState(null);
  React.useEffect(() => {
    setSel(files.length ? files[0].name : null);
    setOpen(files.length ? files[0].name : null);
  }, [venture, state]);
  const [drag, setDrag] = React.useState(false);
  const rows = files.filter(f => folder === 'All' || f.folder === folder);
  const file = files.find(f => f.name === sel);
  const body = state === 'Loading' ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DropZone, null), /*#__PURE__*/React.createElement(DocsHeaderRow, null), [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement(SkeletonRow, {
    key: i,
    cols: ['48px', '1fr', '74px', '120px', '74px', '58px'],
    pad: "10px 16px"
  }))) : state === 'Empty' ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DropZone, {
    active: drag,
    onClick: () => setDrag(d => !d)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 16px 16px'
    }
  }, /*#__PURE__*/React.createElement(EmptyState, {
    hint: "Drop a file above, or connect the venture's Drive folder. Docs uploaded from a note land here automatically.",
    action: "+ Connect Drive"
  }, "No docs in this venture yet"))) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DropZone, {
    active: drag,
    onClick: () => setDrag(d => !d)
  }), /*#__PURE__*/React.createElement(DocsHeaderRow, null), rows.map(f => /*#__PURE__*/React.createElement(React.Fragment, {
    key: f.name
  }, /*#__PURE__*/React.createElement(FileRow, _extends({}, f, {
    versions: (f.versions || []).length + 1,
    on: f.name === sel,
    expanded: open === f.name,
    onClick: () => setSel(f.name),
    onExpand: () => setOpen(o => o === f.name ? null : f.name)
  })), open === f.name && (f.versions || []).map(v => /*#__PURE__*/React.createElement(VersionRow, _extends({
    key: v.version
  }, v))))));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '172px 1fr 260px'
    }
  }, /*#__PURE__*/React.createElement(FolderFilter, {
    folders: folders,
    active: folder,
    onSelect: setFolder
  }), body, state === 'Data' && file ? /*#__PURE__*/React.createElement(PreviewPanel, {
    name: file.name,
    type: file.type,
    onClose: () => setSel(null),
    meta: /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement(FactRow, {
      k: "Size",
      v: file.size,
      mono: true
    }), /*#__PURE__*/React.createElement(FactRow, {
      k: "Uploaded",
      v: file.who + ' · ' + file.date
    }), /*#__PURE__*/React.createElement(FactRow, {
      k: "Versions",
      v: (file.versions || []).length + 1,
      mono: true
    }), /*#__PURE__*/React.createElement(FactRow, {
      k: "Folder",
      v: file.folder
    }))
  }, file.preview || 'No inline preview for this type') : /*#__PURE__*/React.createElement("div", {
    style: {
      borderLeft: '1px solid var(--line)',
      background: 'var(--bg2)',
      minHeight: 420,
      display: 'grid',
      placeItems: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--ink-ghost)'
    }
  }, "Select a file"));
}
Object.assign(window, {
  DocsTab
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/bench/DocsTab.jsx", error: String((e && e.message) || e) }); }

// ui_kits/bench/MyWorkScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const AppBar = p => window.AVLHubDesignSystem_5531ba.AppBar(p);
const FilterBar = p => window.AVLHubDesignSystem_5531ba.FilterBar(p);
const GroupHeader = p => window.AVLHubDesignSystem_5531ba.GroupHeader(p);
const TaskRow = p => window.AVLHubDesignSystem_5531ba.TaskRow(p);
const EmptyState = p => window.AVLHubDesignSystem_5531ba.EmptyState(p);
const LANE_COLOR = n => (AVL_DATA.lanes.find(l => l.name === n) || {}).color || 'var(--copper)';
const rowsFor = who => {
  const mine = AVL_DATA.tasks.filter(t => t.who === who && !t.done).map(t => ({
    title: t.title,
    venture: t.venture,
    ventureColor: (AVL_DATA.ventures[t.venture] || {}).color,
    lane: t.lane,
    laneColor: LANE_COLOR(t.lane),
    date: t.due || '—',
    late: !!t.late
  }));
  return [{
    group: 'Overdue',
    hot: true,
    items: mine.filter(r => r.late)
  }, {
    group: 'This week',
    items: mine.filter(r => !r.late && r.date !== '—')
  }, {
    group: 'No date',
    items: mine.filter(r => !r.late && r.date === '—')
  }];
};
function MyWorkScreen({
  onNavigate,
  onNewVenture,
  onJump,
  onMenuSelect,
  who = 'RM'
}) {
  const ROWS = rowsFor(who);
  const open = ROWS.reduce((n, g) => n + g.items.length, 0);
  const [filter, setFilter] = React.useState('All');
  const [done, setDone] = React.useState({});
  const match = r => filter === 'All' || filter === 'No date' && r.date === '—' || filter === 'Blocked' && r.late || r.lane === filter;
  const shown = ROWS.reduce((n, g) => n + g.items.filter(match).length, 0);
  const firstName = (AVL_DATA.owners[who] || who).split(' ')[0];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AppBar, {
    active: "My work",
    onNavigate: onNavigate,
    onNewVenture: onNewVenture,
    onJump: onJump,
    onMenuSelect: onMenuSelect
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 25,
      fontWeight: 600,
      letterSpacing: '-.025em',
      margin: 0
    }
  }, (AVL_DATA.owners[who] || who).split(' ')[0], "'s work"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--faint)',
      letterSpacing: '.08em',
      marginTop: 6
    }
  }, open, " OPEN \xB7 ", ROWS[1].items.length, " DUE THIS WEEK \xB7 ", ROWS[0].items.length, " OVERDUE")), /*#__PURE__*/React.createElement(FilterBar, {
    filters: ['All', 'Tech', 'Capital', 'Blocked', 'No date'],
    active: filter,
    onSelect: setFilter
  })), !shown && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 22
    }
  }, /*#__PURE__*/React.createElement(EmptyState, {
    hint: open ? 'Clear the filter to see the other ' + open + ' open across every venture.' : 'Nothing is assigned to you right now.',
    action: filter === 'All' ? undefined : 'Show all',
    onAction: () => setFilter('All')
  }, filter === 'All' ? 'No open tasks' : filter === 'Blocked' ? 'Nothing overdue or blocked' : filter === 'No date' ? 'Everything you own has a date' : 'No ' + filter + ' tasks assigned to ' + firstName)), ROWS.map(g => {
    const items = g.items.filter(match);
    if (!items.length) return null;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: g.group
    }, /*#__PURE__*/React.createElement(GroupHeader, {
      label: g.group,
      count: items.length,
      hot: g.hot
    }), items.map(r => /*#__PURE__*/React.createElement(TaskRow, _extends({
      key: r.title
    }, r, {
      done: !!done[r.title],
      onToggle: () => setDone(d => ({
        ...d,
        [r.title]: !d[r.title]
      }))
    }))));
  }));
}
Object.assign(window, {
  MyWorkScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/bench/MyWorkScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/bench/NewVentureModal.jsx
try { (() => {
const Modal = p => window.AVLHubDesignSystem_5531ba.Modal(p);
const TextField = p => window.AVLHubDesignSystem_5531ba.TextField(p);
const DropZone = p => window.AVLHubDesignSystem_5531ba.DropZone(p);
const ActionButton = p => window.AVLHubDesignSystem_5531ba.ActionButton(p);
const SwatchPicker = p => window.AVLHubDesignSystem_5531ba.SwatchPicker(p);
function NewVentureModal({
  onClose,
  onCreate
}) {
  const [name, setName] = React.useState('');
  const [line, setLine] = React.useState('');
  const [founder, setFounder] = React.useState('');
  const [color, setColor] = React.useState('var(--copper)');
  const [deck, setDeck] = React.useState(false);
  return /*#__PURE__*/React.createElement(Modal, {
    eyebrow: "New venture",
    title: "Add a venture to the pipeline",
    onClose: onClose,
    width: 520,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ActionButton, {
      onClick: () => onCreate && onCreate({
        name: name || 'Untitled venture',
        line,
        founder,
        color
      })
    }, "Create and open"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11.5,
        color: 'var(--faint)'
      }
    }, "Lands in Meet. Everything else is editable later."))
  }, /*#__PURE__*/React.createElement(TextField, {
    label: "Name",
    value: name,
    onChange: setName,
    placeholder: "ImmiClaw",
    autoFocus: true
  }), /*#__PURE__*/React.createElement(TextField, {
    label: "One-liner",
    value: line,
    onChange: setLine,
    multiline: true,
    optional: true,
    placeholder: "Study abroad automation for agents across West Africa"
  }), /*#__PURE__*/React.createElement(TextField, {
    label: "Founder",
    value: founder,
    onChange: setFounder,
    placeholder: "Tunde Adeyemi",
    optional: true
  }), /*#__PURE__*/React.createElement(SwatchPicker, {
    value: color,
    onChange: setColor,
    note: "Themes this venture everywhere"
  }), /*#__PURE__*/React.createElement(DropZone, {
    active: deck,
    onClick: () => setDeck(d => !d),
    label: deck ? 'deck.pdf · 2.4 MB' : 'Drop the deck',
    hint: deck ? 'Click to remove · lands in Docs / Diligence' : 'or click to browse · PDF or PPTX · optional'
  }));
}
Object.assign(window, {
  NewVentureModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/bench/NewVentureModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/bench/NotesScreen.jsx
try { (() => {
const AppBar = p => window.AVLHubDesignSystem_5531ba.AppBar(p);
const NoteEditor = p => window.AVLHubDesignSystem_5531ba.NoteEditor(p);
const NoteBlock = p => window.AVLHubDesignSystem_5531ba.NoteBlock(p);
const NoteQuote = p => window.AVLHubDesignSystem_5531ba.NoteQuote(p);
const TaskBlock = p => window.AVLHubDesignSystem_5531ba.TaskBlock(p);
const SlashMenu = p => window.AVLHubDesignSystem_5531ba.SlashMenu(p);
const VENTURE_ORDER = ['ImmiClaw', 'Dikkha AI', 'Chhar', 'Eloy Lab'];
const sidebar = () => {
  const unfiled = AVL_DATA.notes.filter(n => !n.venture && !n.pinned);
  return [{
    label: 'Pinned',
    items: AVL_DATA.notes.filter(n => n.pinned || n.title === 'Call with Tunde, 18 Aug').map(n => ({
      label: n.title,
      color: n.venture ? AVL_DATA.ventures[n.venture].color : 'var(--copper)'
    }))
  }, {
    label: 'By venture',
    items: VENTURE_ORDER.map(v => ({
      label: v + ' · ' + AVL_DATA.notes.filter(n => n.venture === v).length,
      color: AVL_DATA.ventures[v].color
    }))
  }, {
    label: 'Unfiled · ' + unfiled.length,
    items: unfiled.map(n => ({
      label: n.title
    }))
  }];
};
function NotesScreen({
  onNavigate,
  onNewVenture,
  onJump,
  onMenuSelect
}) {
  const [note, setNote] = React.useState('Call with Tunde');
  const [termsheet, setTermsheet] = React.useState(false);
  const [onePager, setOnePager] = React.useState(true);
  const [slash, setSlash] = React.useState(true);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AppBar, {
    active: "Notes",
    onNavigate: onNavigate,
    onNewVenture: onNewVenture,
    onJump: onJump,
    onMenuSelect: onMenuSelect
  }), /*#__PURE__*/React.createElement(NoteEditor, {
    sidebarGroups: sidebar(),
    activeNote: note,
    onSelectNote: setNote,
    crumbs: /*#__PURE__*/React.createElement(React.Fragment, null, "Notes ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--ink-ghost)'
      }
    }, "/"), " ", /*#__PURE__*/React.createElement("em", {
      style: {
        fontStyle: 'normal',
        color: 'var(--magenta)'
      }
    }, "ImmiClaw"), " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--ink-ghost)'
      }
    }, "/"), " ", note),
    title: note === 'Call with Tunde' ? 'Call with Tunde, 18 Aug' : note,
    byline: "SAIF RASHID \xB7 EDITED 2H AGO \xB7 3 LINKED TASKS",
    meta: [{
      label: 'Venture',
      value: 'ImmiClaw',
      color: 'var(--magenta-label)'
    }, {
      label: 'Mentions',
      value: 'Dikkha AI, Chhar'
    }, {
      label: 'Tasks created',
      links: ['Draft term sheet', 'Send one pager', 'Agent shortlist']
    }, {
      label: 'From meeting',
      links: ['Tunde intro call · 18 Aug']
    }, {
      label: 'History',
      value: '12 versions',
      color: 'var(--faint)'
    }]
  }, /*#__PURE__*/React.createElement(NoteBlock, {
    rise: 0
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14.5,
      lineHeight: 1.75,
      color: 'var(--body-ink)',
      margin: 0
    }
  }, "He has three agencies ready to pilot in Lagos, all currently doing document review by hand. Two of them already pay for a CRM, so budget exists.")), /*#__PURE__*/React.createElement(NoteBlock, {
    rise: 1
  }, /*#__PURE__*/React.createElement(NoteQuote, null, "The exclusivity ask is the real negotiation. Six months Lagos-only would cap us before we know if the model works.")), /*#__PURE__*/React.createElement(NoteBlock, {
    rise: 2
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: '-.02em',
      marginTop: 14
    }
  }, "What we agreed")), /*#__PURE__*/React.createElement(NoteBlock, null, /*#__PURE__*/React.createElement(TaskBlock, {
    label: "Draft term sheet without the exclusivity clause",
    pill: "Capital \xB7 SR",
    done: termsheet,
    onToggle: () => setTermsheet(v => !v)
  })), /*#__PURE__*/React.createElement(NoteBlock, null, /*#__PURE__*/React.createElement(TaskBlock, {
    label: "Send him the AVL one pager",
    pill: "GTM \xB7 MS",
    pillColor: "var(--magenta)",
    done: onePager,
    onToggle: () => setOnePager(v => !v)
  })), /*#__PURE__*/React.createElement(NoteBlock, null, /*#__PURE__*/React.createElement("p", {
    onClick: () => setSlash(s => !s),
    style: {
      color: 'var(--ink-ghost)',
      fontSize: 14.5,
      margin: 0,
      cursor: 'text'
    }
  }, "/task")), slash && /*#__PURE__*/React.createElement(SlashMenu, {
    items: [{
      glyph: '☑',
      label: 'Task',
      hint: 'creates a card',
      on: true
    }, {
      glyph: '#',
      label: 'Heading'
    }, {
      glyph: '❝',
      label: 'Quote'
    }, {
      glyph: '@',
      label: 'Mention a venture'
    }, {
      glyph: '⧉',
      label: 'Embed doc'
    }, {
      glyph: '⚑',
      label: 'Decision',
      hint: 'logs it'
    }]
  })));
}
Object.assign(window, {
  NotesScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/bench/NotesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/bench/OverviewTab.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const Panel = p => window.AVLHubDesignSystem_5531ba.Panel(p);
const SectionLabel = p => window.AVLHubDesignSystem_5531ba.SectionLabel(p);
const EmptyState = p => window.AVLHubDesignSystem_5531ba.EmptyState(p);
const Skeleton = p => window.AVLHubDesignSystem_5531ba.Skeleton(p);
const FactRow = p => window.AVLHubDesignSystem_5531ba.FactRow(p);
const LinkChip = p => window.AVLHubDesignSystem_5531ba.LinkChip(p);
const ChecklistRow = p => window.AVLHubDesignSystem_5531ba.ChecklistRow(p);
const LaneBarRow = p => window.AVLHubDesignSystem_5531ba.LaneBarRow(p);
const LineRow = p => window.AVLHubDesignSystem_5531ba.LineRow(p);
const ActivityRow = p => window.AVLHubDesignSystem_5531ba.ActivityRow(p);
const ovNotes = v => AVL_DATA.notes.filter(n => n.venture === v).slice(0, 3).map(n => ({
  label: n.title,
  meta: n.meta
}));
function OverviewTab({
  state = 'Data',
  color = 'var(--magenta)',
  venture = 'ImmiClaw'
}) {
  const v = AVL_DATA.ventures[venture] || {};
  const ov = AVL_DATA.overview[venture] || {
    links: [],
    meetings: [],
    feed: []
  };
  const checklist = AVL_DATA.gatesFor(venture);
  const notes = ovNotes(venture);
  const tasks = AVL_DATA.tasksFor(venture);
  const facts = [{
    k: 'Stage',
    v: v.stage + ' · ' + (ov.days || '—')
  }, {
    k: 'Owner',
    v: AVL_DATA.owners[v.who] || v.who
  }, {
    k: 'AVL stake',
    v: v.stake || 'Not set',
    mono: !!v.stake
  }, {
    k: 'Market',
    v: ov.market || 'Not set'
  }, {
    k: 'Founder',
    v: v.founder || 'Not set'
  }, {
    k: 'Contact',
    v: ov.contact || 'Not set'
  }];
  const [gates, setGates] = React.useState(() => checklist.map(g => g.done));
  React.useEffect(() => {
    setGates(AVL_DATA.gatesFor(venture).map(g => g.done));
  }, [venture]);
  if (state === 'Loading') return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14,
      padding: '14px 22px 22px'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    label: "Facts"
  }, [0, 1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: '8px 0',
      borderBottom: '1px solid var(--divider)'
    }
  }, /*#__PURE__*/React.createElement(Skeleton, {
    w: i % 2 ? '62%' : '44%'
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Panel, {
    label: "Gate checklist"
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: '8px 0',
      borderBottom: '1px solid var(--divider)'
    }
  }, /*#__PURE__*/React.createElement(Skeleton, {
    w: "70%"
  })))), /*#__PURE__*/React.createElement(Panel, {
    label: "Open tasks"
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: '7px 0'
    }
  }, /*#__PURE__*/React.createElement(Skeleton, {
    h: 3
  }))))));
  if (state === 'Empty') return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px'
    }
  }, /*#__PURE__*/React.createElement(EmptyState, {
    hint: "Add the founder, the market and the stake, and this page starts filling itself from the work you do.",
    action: "+ Add venture facts"
  }, "Nothing recorded yet"));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 22px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Panel, {
    label: "Facts"
  }, facts.map(f => /*#__PURE__*/React.createElement(FactRow, {
    key: f.k,
    k: f.k,
    v: f.v,
    mono: f.mono
  }))), /*#__PURE__*/React.createElement(Panel, {
    label: "Links"
  }, ov.links.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, ov.links.map(l => /*#__PURE__*/React.createElement(LinkChip, {
    key: l
  }, l))) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-ghost3)'
    }
  }, "No links yet")), /*#__PURE__*/React.createElement(Panel, {
    label: "Activity",
    right: ov.feed.length,
    flush: true
  }, ov.feed.map(a => /*#__PURE__*/React.createElement(ActivityRow, _extends({
    key: a.text
  }, a, {
    compact: true
  }))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Panel, {
    label: v.stage + ' gates',
    right: gates.filter(Boolean).length + '/' + checklist.length
  }, checklist.map((g, i) => /*#__PURE__*/React.createElement(ChecklistRow, {
    key: g.label,
    label: g.label,
    by: gates[i] ? g.by || v.who : '',
    done: gates[i],
    onToggle: () => setGates(s => s.map((x, j) => j === i ? !x : x))
  }))), /*#__PURE__*/React.createElement(Panel, {
    label: "Open tasks",
    right: tasks.filter(t => !t.done).length
  }, AVL_DATA.lanes.map(l => /*#__PURE__*/React.createElement(LaneBarRow, {
    key: l.name,
    lane: l.name,
    color: l.color,
    open: tasks.filter(t => t.lane === l.name && !t.done).length
  }))), /*#__PURE__*/React.createElement(Panel, {
    label: "Next meetings"
  }, ov.meetings.length ? ov.meetings.map(m => /*#__PURE__*/React.createElement(LineRow, _extends({
    key: m.label
  }, m, {
    color: color
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-ghost3)'
    }
  }, "Nothing scheduled")), /*#__PURE__*/React.createElement(Panel, {
    label: "Recent notes",
    right: AVL_DATA.notes.filter(n => n.venture === venture).length
  }, notes.length ? notes.map(n => /*#__PURE__*/React.createElement(LineRow, _extends({
    key: n.label
  }, n, {
    color: color
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-ghost3)'
    }
  }, "No notes yet")))));
}
Object.assign(window, {
  OverviewTab
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/bench/OverviewTab.jsx", error: String((e && e.message) || e) }); }

// ui_kits/bench/Palette.jsx
try { (() => {
const CommandPalette = p => window.AVLHubDesignSystem_5531ba.CommandPalette(p);
function Palette({
  onClose,
  onRun
}) {
  const [q, setQ] = React.useState('');
  const groups = [{
    label: 'Actions',
    items: [{
      glyph: '+',
      label: 'New venture',
      hint: '⌘N',
      primary: true,
      action: 'new-venture'
    }, {
      glyph: '☑',
      label: 'New task',
      hint: '⌘T',
      action: 'noop'
    }, {
      glyph: '⚑',
      label: 'Log a decision',
      action: 'noop'
    }, {
      glyph: '✎',
      label: 'New note',
      action: 'notes'
    }]
  }, {
    label: 'Ventures',
    items: Object.keys(AVL_DATA.ventures).map(n => ({
      glyph: '●',
      label: n,
      color: AVL_DATA.ventures[n].color,
      hint: AVL_DATA.ventures[n].stage,
      action: 'venture',
      name: n
    }))
  }, {
    label: 'Go to',
    items: [{
      glyph: '▤',
      label: 'Pipeline',
      action: 'view',
      view: 'Pipeline'
    }, {
      glyph: '▤',
      label: 'My work',
      action: 'view',
      view: 'My work'
    }, {
      glyph: '▤',
      label: 'Notes',
      action: 'view',
      view: 'Notes'
    }, {
      glyph: '▤',
      label: 'Calendar',
      action: 'view',
      view: 'Calendar'
    }, {
      glyph: '▤',
      label: 'Decisions',
      action: 'view',
      view: 'Decisions'
    }]
  }].map(g => ({
    ...g,
    items: g.items.filter(i => !q || i.label.toLowerCase().includes(q.toLowerCase()))
  })).filter(g => g.items.length);
  return /*#__PURE__*/React.createElement(CommandPalette, {
    query: q,
    onQuery: setQ,
    groups: groups,
    onRun: onRun,
    onClose: onClose
  });
}
Object.assign(window, {
  Palette
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/bench/Palette.jsx", error: String((e && e.message) || e) }); }

// ui_kits/bench/PipelineScreen.jsx
try { (() => {
const AppBar = p => window.AVLHubDesignSystem_5531ba.AppBar(p);
const PageHeader = p => window.AVLHubDesignSystem_5531ba.PageHeader(p);
const PipelineBoard = p => window.AVLHubDesignSystem_5531ba.PipelineBoard(p);
const StageColumn = p => window.AVLHubDesignSystem_5531ba.StageColumn(p);
const VentureCard = p => window.AVLHubDesignSystem_5531ba.VentureCard(p);
const ActionButton = p => window.AVLHubDesignSystem_5531ba.ActionButton(p);
function PipelineScreen({
  onOpenVenture,
  onNavigate,
  onNewVenture,
  onJump,
  onMenuSelect,
  cardStyle = "full",
  stagger = true
}) {
  const clean = cardStyle === "clean";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AppBar, {
    active: "Pipeline",
    onNavigate: onNavigate,
    onNewVenture: onNewVenture,
    onJump: onJump,
    onMenuSelect: onMenuSelect
  }), /*#__PURE__*/React.createElement(PageHeader, {
    title: "Pipeline",
    right: /*#__PURE__*/React.createElement(ActionButton, {
      onClick: onNewVenture
    }, "+ New venture")
  }), /*#__PURE__*/React.createElement(PipelineBoard, null, AVL_DATA.stages.map(col => /*#__PURE__*/React.createElement(StageColumn, {
    key: col.stage,
    stage: col.stage,
    count: col.count,
    progress: col.progress,
    color: col.color
  }, col.items.map((name, i) => {
    const v = AVL_DATA.ventures[name];
    return /*#__PURE__*/React.createElement(VentureCard, {
      key: name,
      name: name,
      caption: v.caption,
      color: v.color,
      gates: v.gates,
      who: v.who,
      founder: v.founder,
      flag: v.flag,
      rise: stagger ? i : undefined,
      showGates: !clean,
      showMeta: !clean,
      onClick: () => onOpenVenture(name)
    });
  }), col.add && /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px dashed var(--line)',
      padding: 9,
      textAlign: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--ink-ghost3)'
    }
  }, col.add)))));
}
Object.assign(window, {
  PipelineScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/bench/PipelineScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/bench/StateSwitch.jsx
try { (() => {
const FilterBar = p => window.AVLHubDesignSystem_5531ba.FilterBar(p);
function StateSwitch({
  state,
  onChange,
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 22px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '.18em',
      textTransform: 'uppercase',
      color: 'var(--faint)'
    }
  }, label), /*#__PURE__*/React.createElement(FilterBar, {
    filters: ['Data', 'Empty', 'Loading'],
    active: state,
    onSelect: onChange
  }));
}
Object.assign(window, {
  StateSwitch
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/bench/StateSwitch.jsx", error: String((e && e.message) || e) }); }

// ui_kits/bench/VentureScreen.jsx
try { (() => {
const AppBar = p => window.AVLHubDesignSystem_5531ba.AppBar(p);
const BackStrip = p => window.AVLHubDesignSystem_5531ba.BackStrip(p);
const VentureHeader = p => window.AVLHubDesignSystem_5531ba.VentureHeader(p);
const GateRail = p => window.AVLHubDesignSystem_5531ba.GateRail(p);
const VentureTabs = p => window.AVLHubDesignSystem_5531ba.VentureTabs(p);
const Lane = p => window.AVLHubDesignSystem_5531ba.Lane(p);
const KanbanColumn = p => window.AVLHubDesignSystem_5531ba.KanbanColumn(p);
const TaskCard = p => window.AVLHubDesignSystem_5531ba.TaskCard(p);
const STAGE_ORDER = ['Meet', 'Validate', 'Build', 'Form', 'Grow'];
function VentureScreen({
  name,
  onBack,
  onNavigate,
  onNewVenture,
  onJump,
  onMenuSelect
}) {
  const v = AVL_DATA.ventures[name];
  const [tab, setTab] = React.useState('Overview');
  const [dstate, setDstate] = React.useState('Data');
  const nowIdx = STAGE_ORDER.indexOf(v.stage);
  const checklist = AVL_DATA.gatesFor(name);
  const nextGate = checklist.find(g => !g.done);
  const gates = STAGE_ORDER.map((st, i) => ({
    stage: st,
    label: i < nowIdx ? 'Cleared' : i === nowIdx ? v.fresh ? 'No gates cleared yet' : nextGate ? nextGate.label : 'All gates cleared' : 'Locked',
    state: i < nowIdx ? 'done' : i === nowIdx ? 'now' : undefined
  }));
  const tasks = AVL_DATA.tasksFor(name);
  const counts = {
    Docs: AVL_DATA.countFor(name, 'Docs'),
    Notes: AVL_DATA.countFor(name, 'Notes'),
    Tasks: AVL_DATA.countFor(name, 'Tasks'),
    Calendar: AVL_DATA.countFor(name, 'Calendar'),
    Decisions: AVL_DATA.countFor(name, 'Decisions')
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AppBar, {
    dimmed: true,
    onNavigate: onNavigate,
    onNewVenture: onNewVenture,
    onJump: onJump,
    onMenuSelect: onMenuSelect
  }), /*#__PURE__*/React.createElement(BackStrip, {
    current: name,
    color: v.color,
    onBack: onBack
  }), /*#__PURE__*/React.createElement(VentureHeader, {
    name: name,
    color: v.color,
    sub: v.sub,
    stage: v.stage,
    stageMeta: v.stageMeta,
    tags: [{
      label: v.stake ? v.stake + ' AVL stake' : 'AVL venture'
    }, {
      label: v.founder
    }, {
      label: v.days || '19 days in stage',
      hot: !v.fresh
    }]
  }), /*#__PURE__*/React.createElement(GateRail, {
    gates: gates
  }), /*#__PURE__*/React.createElement(VentureTabs, {
    accent: v.color,
    active: tab,
    onSelect: setTab,
    scope: name + ' only',
    tabs: [{
      label: 'Overview'
    }, {
      label: 'Docs',
      count: counts.Docs
    }, {
      label: 'Notes',
      count: counts.Notes
    }, {
      label: 'Tasks',
      count: counts.Tasks
    }, {
      label: 'Calendar',
      count: counts.Calendar
    }, {
      label: 'Decisions',
      count: counts.Decisions
    }]
  }), (tab === 'Overview' || tab === 'Docs' || tab === 'Decisions') && !v.fresh && /*#__PURE__*/React.createElement(StateSwitch, {
    label: tab + ' · ' + name,
    state: dstate,
    onChange: setDstate
  }), tab === 'Tasks' && !tasks.length && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px dashed var(--line)',
      borderRadius: 2,
      padding: '26px 18px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--ink-ghost3)'
    }
  }, "No tasks yet"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--faint)',
      marginTop: 9
    }
  }, "Tasks appear here as you create them, from a lane or from a /task block in a note."))), tab === 'Tasks' && !!tasks.length && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14
    }
  }, AVL_DATA.lanes.filter(l => tasks.some(t => t.lane === l.name)).map((l, li) => /*#__PURE__*/React.createElement(Lane, {
    key: l.name,
    name: l.name,
    color: l.color,
    count: tasks.filter(t => t.lane === l.name).length,
    rise: li
  }, AVL_DATA.columns.map(cn => /*#__PURE__*/React.createElement(KanbanColumn, {
    key: cn,
    label: cn
  }, tasks.filter(t => t.lane === l.name && t.col === cn).map(t => /*#__PURE__*/React.createElement(TaskCard, {
    key: t.title,
    title: t.title,
    who: t.who,
    note: t.note,
    due: t.due,
    fromNote: t.fromNote,
    done: t.done,
    color: t.color || l.color
  }))))))), tab === 'Overview' && /*#__PURE__*/React.createElement(OverviewTab, {
    state: v.fresh ? 'Empty' : dstate,
    color: v.color,
    venture: name
  }), tab === 'Docs' && /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement(DocsTab, {
    state: v.fresh ? 'Empty' : dstate,
    venture: name
  })), tab === 'Decisions' && /*#__PURE__*/React.createElement(DecisionsTab, {
    state: v.fresh ? 'Empty' : dstate,
    venture: name
  }), (tab === 'Notes' || tab === 'Calendar') && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '60px 22px',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--ink-ghost)'
    }
  }, tab, " \u2014 filtered view of the level-1 pile, see the ", tab, " screen"));
}
Object.assign(window, {
  VentureScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/bench/VentureScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/bench/data.jsx
try { (() => {
const AVL_DATA = {
  ventures: {
    ImmiClaw: {
      color: 'var(--magenta)',
      caption: 'Study abroad, Africa',
      sub: 'Study abroad automation for agents across West Africa',
      stage: 'Validate',
      stageMeta: '4 of 6 gates cleared',
      gates: 4,
      who: 'RN',
      founder: 'Tunde Adeyemi',
      stake: '45%'
    },
    'Dikkha AI': {
      color: 'var(--violet)',
      caption: 'SSC study companion',
      sub: 'SSC study companion for Bangladeshi students',
      stage: 'Build',
      stageMeta: '3 of 6 gates cleared',
      gates: 3,
      who: 'MS',
      founder: 'Nusrat Jahan',
      stake: '30%'
    },
    Chhar: {
      color: 'var(--teal)',
      caption: 'Deals app, live on Play',
      sub: 'Deals and coupons app, live on Play',
      stage: 'Grow',
      stageMeta: '5 of 6 gates cleared',
      gates: 5,
      who: 'MS',
      founder: 'Arif Hossain',
      stake: '25%'
    },
    'Eloy Lab': {
      color: 'var(--amber)',
      caption: 'Bank reporting agent, BD',
      sub: 'Bank reporting agent for Bangladeshi banks',
      stage: 'Meet',
      stageMeta: '2 of 6 gates cleared',
      gates: 2,
      who: 'RM',
      founder: 'Shahriar Kabir',
      flag: 'STALE 14D'
    },
    'Medical BOT': {
      color: 'var(--venture-clay)',
      caption: 'FCPS admission prep',
      sub: 'FCPS admission prep companion',
      stage: 'Meet',
      stageMeta: '1 of 6 gates cleared',
      gates: 1,
      who: 'SR',
      founder: 'Dr. Farhana Islam'
    },
    Berai: {
      color: 'var(--venture-steel)',
      caption: 'Private beta',
      sub: 'Private beta, invite only',
      stage: 'Build',
      stageMeta: '2 of 6 gates cleared',
      gates: 2,
      who: 'RM',
      founder: 'Imran Chowdhury',
      stake: '15%'
    }
  },
  docs: [{
    name: 'Lagos market memo.pdf',
    venture: 'ImmiClaw',
    type: 'PDF',
    size: '1.2 MB',
    who: 'RN',
    date: '18 AUG',
    folder: 'Diligence',
    preview: 'PDF preview · page 1 of 9',
    versions: [{
      version: 2,
      who: 'RN',
      date: '16 AUG',
      note: 'Added agent interview quotes'
    }, {
      version: 1,
      who: 'RN',
      date: '14 AUG',
      note: 'First draft'
    }]
  }, {
    name: 'Agent workflow screens.png',
    venture: 'ImmiClaw',
    type: 'PNG',
    size: '840 KB',
    who: 'MS',
    date: '17 AUG',
    folder: 'Product',
    preview: 'Image preview · 2400 × 1600',
    versions: []
  }, {
    name: 'Term sheet draft.docx',
    venture: 'ImmiClaw',
    type: 'DOCX',
    size: '96 KB',
    who: 'SR',
    date: '15 AUG',
    folder: 'Legal',
    versions: [{
      version: 1,
      who: 'SR',
      date: '13 AUG',
      note: 'From the Capital lane task'
    }]
  }, {
    name: 'Buyer interview notes.pdf',
    venture: 'ImmiClaw',
    type: 'PDF',
    size: '340 KB',
    who: 'MS',
    date: '14 AUG',
    folder: 'Diligence',
    preview: 'PDF preview · page 1 of 3',
    versions: []
  }, {
    name: 'Pricing model.xlsx',
    venture: 'ImmiClaw',
    type: 'XLSX',
    size: '58 KB',
    who: 'RN',
    date: '12 AUG',
    folder: 'Diligence',
    versions: [{
      version: 3,
      who: 'RN',
      date: '12 AUG',
      note: 'Per-agent tier'
    }, {
      version: 2,
      who: 'RN',
      date: '11 AUG',
      note: 'Flat fee scenario'
    }, {
      version: 1,
      who: 'RN',
      date: '09 AUG',
      note: 'First cut'
    }]
  }, {
    name: 'Cap table, pre-seed.xlsx',
    venture: 'ImmiClaw',
    type: 'XLSX',
    size: '44 KB',
    who: 'SR',
    date: '11 AUG',
    folder: 'Legal',
    versions: []
  }, {
    name: 'Applicant file schema.png',
    venture: 'ImmiClaw',
    type: 'PNG',
    size: '210 KB',
    who: 'RM',
    date: '10 AUG',
    folder: 'Product',
    preview: 'Image preview · 1600 × 900',
    versions: []
  }],
  overview: {
    ImmiClaw: {
      market: 'West Africa, Nigeria first',
      contact: 'tunde@immiclaw.co',
      days: '19 days',
      links: ['Repo', 'Figma', 'Granola', 'Drive'],
      meetings: [{
        label: 'Buyer interview 3 of 6',
        meta: 'TODAY 16:00'
      }, {
        label: 'Term sheet walkthrough',
        meta: 'FRI 15:00'
      }],
      feed: [{
        who: 'RN',
        text: 'Moved ImmiClaw from Meet to Validate',
        when: '2H',
        color: 'var(--magenta)'
      }, {
        who: 'MS',
        text: 'Completed Send the AVL one pager',
        when: '6H',
        color: 'var(--teal)'
      }, {
        who: 'SR',
        text: 'Added note Call with Tunde, 18 Aug',
        when: '1D',
        color: 'var(--violet)'
      }, {
        who: 'RN',
        text: 'Uploaded Lagos market memo.pdf, v3',
        when: '2D',
        color: 'var(--copper)'
      }, {
        who: 'MS',
        text: 'Cleared gate Competitor scan',
        when: '3D',
        color: 'var(--teal)'
      }, {
        who: 'SR',
        text: 'Logged decision No exclusivity in the term sheet',
        when: '4D',
        color: 'var(--amber)'
      }]
    },
    'Dikkha AI': {
      market: 'Bangladesh, SSC cohort',
      contact: 'nusrat@dikkha.ai',
      days: '34 days',
      links: ['Repo', 'Play Store', 'Drive'],
      meetings: [{
        label: 'Release review, 2.4',
        meta: 'TUE 14:30'
      }],
      feed: [{
        who: 'RM',
        text: 'Logged decision Ship 2.4 without the offline pack',
        when: '5D',
        color: 'var(--amber)'
      }, {
        who: 'MS',
        text: 'Added note SSC syllabus coverage',
        when: '7D',
        color: 'var(--violet)'
      }, {
        who: 'RM',
        text: 'Cleared gate MVP shipped internally',
        when: '9D',
        color: 'var(--teal)'
      }]
    },
    Chhar: {
      market: 'Bangladesh, urban deals',
      contact: 'arif@chhar.app',
      days: '62 days',
      links: ['Repo', 'Play Store', 'Drive'],
      meetings: [{
        label: 'Merchant pricing review',
        meta: 'THU 12:00'
      }],
      feed: [{
        who: 'MS',
        text: 'Added note Deals feed reliability',
        when: '1D',
        color: 'var(--violet)'
      }, {
        who: 'MS',
        text: 'Cleared gate Retention cohort positive',
        when: '11D',
        color: 'var(--teal)'
      }, {
        who: 'MS',
        text: 'Logged decision Play only until 5K installs',
        when: '17D',
        color: 'var(--amber)'
      }]
    },
    'Eloy Lab': {
      market: 'Bangladesh, tier-1 banks',
      contact: 'shahriar@eloylab.co',
      days: '14 days',
      links: ['Granola'],
      meetings: [{
        label: 'Regulatory update',
        meta: 'THU 11:00'
      }],
      feed: [{
        who: 'RM',
        text: 'Added note Regulatory timeline, BB',
        when: '3D',
        color: 'var(--violet)'
      }, {
        who: 'RM',
        text: 'Cleared gate Thesis fit written up',
        when: '14D',
        color: 'var(--teal)'
      }]
    },
    'Medical BOT': {
      market: 'Bangladesh, FCPS candidates',
      contact: 'farhana@medicalbot.co',
      days: '6 days',
      links: ['Granola'],
      meetings: [],
      feed: [{
        who: 'SR',
        text: 'Cleared gate Founder call logged',
        when: '6D',
        color: 'var(--teal)'
      }]
    },
    Berai: {
      market: 'Bangladesh, invite only',
      contact: 'imran@berai.co',
      days: '21 days',
      links: ['Repo', 'Figma'],
      meetings: [{
        label: 'Beta cohort check-in',
        meta: 'WED 17:00'
      }],
      feed: [{
        who: 'RM',
        text: 'Cleared gate Scope locked',
        when: '8D',
        color: 'var(--teal)'
      }, {
        who: 'RM',
        text: 'Added note Supabase or Neon',
        when: '12D',
        color: 'var(--violet)'
      }]
    }
  },
  lanes: [{
    name: 'Thesis',
    color: 'var(--amber)'
  }, {
    name: 'Tech',
    color: 'var(--copper)'
  }, {
    name: 'GTM',
    color: 'var(--magenta)'
  }, {
    name: 'Capital',
    color: 'var(--teal)'
  }],
  columns: ['To do', 'Doing', 'Blocked', 'Done'],
  tasks: [{
    venture: 'ImmiClaw',
    lane: 'Thesis',
    col: 'To do',
    title: 'Write the Lagos market memo',
    who: 'RN',
    due: '26 AUG'
  }, {
    venture: 'ImmiClaw',
    lane: 'Thesis',
    col: 'Done',
    title: 'Check against our AI thesis',
    who: 'RN',
    note: '15 AUG',
    done: true
  }, {
    venture: 'ImmiClaw',
    lane: 'Tech',
    col: 'To do',
    title: 'Scope MVP auth and agent roles',
    who: 'RM',
    due: '24 AUG'
  }, {
    venture: 'ImmiClaw',
    lane: 'Tech',
    col: 'To do',
    title: 'Doc parser benchmark, 3 options',
    who: 'RM'
  }, {
    venture: 'ImmiClaw',
    lane: 'Tech',
    col: 'Doing',
    title: 'Data model for applicant files',
    who: 'RM',
    fromNote: true
  }, {
    venture: 'ImmiClaw',
    lane: 'Tech',
    col: 'Blocked',
    title: 'Sandbox access from agency',
    who: 'RM',
    due: '2D LATE',
    late: true,
    color: 'var(--amber)'
  }, {
    venture: 'ImmiClaw',
    lane: 'GTM',
    col: 'To do',
    title: 'Shortlist 10 Nigerian agents',
    who: 'MS'
  }, {
    venture: 'ImmiClaw',
    lane: 'GTM',
    col: 'Doing',
    title: 'Buyer interview 3 of 6',
    who: 'MS',
    due: 'TODAY'
  }, {
    venture: 'ImmiClaw',
    lane: 'GTM',
    col: 'Done',
    title: 'Send the AVL one pager',
    who: 'MS',
    fromNote: true,
    done: true
  }, {
    venture: 'ImmiClaw',
    lane: 'Capital',
    col: 'To do',
    title: 'Draft term sheet, no exclusivity',
    who: 'SR',
    fromNote: true
  }, {
    venture: 'ImmiClaw',
    lane: 'Capital',
    col: 'Done',
    title: 'Agree 45% split in principle',
    who: 'SR',
    note: '11 AUG',
    done: true
  }, {
    venture: 'Dikkha AI',
    lane: 'Tech',
    col: 'To do',
    title: 'Cut the Play Store release for 2.4',
    who: 'RM',
    due: '25 AUG'
  }, {
    venture: 'Dikkha AI',
    lane: 'Tech',
    col: 'Doing',
    title: 'Offline pack behind a flag',
    who: 'RM'
  }, {
    venture: 'Dikkha AI',
    lane: 'GTM',
    col: 'To do',
    title: 'Tutor outreach, Khulna',
    who: 'MS'
  }, {
    venture: 'Dikkha AI',
    lane: 'Thesis',
    col: 'Done',
    title: 'SSC syllabus coverage check',
    who: 'MS',
    note: '12 AUG',
    done: true
  }, {
    venture: 'Chhar',
    lane: 'Tech',
    col: 'Doing',
    title: 'Deals feed reliability fix',
    who: 'RM',
    due: '28 AUG'
  }, {
    venture: 'Chhar',
    lane: 'GTM',
    col: 'To do',
    title: 'Merchant pricing tiers',
    who: 'MS'
  }, {
    venture: 'Chhar',
    lane: 'Capital',
    col: 'To do',
    title: 'Model unit economics at 5K',
    who: 'SR'
  }, {
    venture: 'Eloy Lab',
    lane: 'Thesis',
    col: 'To do',
    title: "Review Eloy Lab's regulatory timeline",
    who: 'RM'
  }, {
    venture: 'Eloy Lab',
    lane: 'GTM',
    col: 'Blocked',
    title: 'Waiting on bank intro',
    who: 'MS',
    due: '9D WAIT',
    color: 'var(--amber)'
  }, {
    venture: 'Berai',
    lane: 'Tech',
    col: 'To do',
    title: 'Decide Supabase or Neon for scale up',
    who: 'RM',
    due: '27 AUG'
  }, {
    venture: 'Berai',
    lane: 'Tech',
    col: 'Doing',
    title: 'Invite flow for the private beta',
    who: 'RM'
  }, {
    venture: 'Medical BOT',
    lane: 'Thesis',
    col: 'To do',
    title: 'FCPS question bank licensing',
    who: 'SR'
  }],
  owners: {
    RN: 'Rashedun Nabi',
    MS: 'Mufassal Siddique',
    SR: 'Saif Rashid',
    RM: 'Risad Mahmud'
  },
  gateChecklists: {
    Meet: ['Founder call logged', 'Thesis fit written up', 'Reference check', 'Founding team mapped', 'Cap table reviewed', 'Studio fit agreed'],
    Validate: ['Market memo drafted', 'Competitor scan', 'Buyer interviews', 'Pricing validated', 'Willingness to pay tested', 'Design partner signed'],
    Build: ['Scope locked', 'MVP shipped internally', 'First pilot live', 'Instrumentation in place', 'Support loop defined', 'Pilot feedback reviewed'],
    Form: ['Entity registered', 'Cap table executed', 'IP assigned', 'Bank account open', 'Founder agreements signed', 'Board cadence set'],
    Grow: ['Paid acquisition tested', 'Retention cohort positive', 'Unit economics modelled', 'Hiring plan agreed', 'Next round narrative', 'Ops handover done']
  },
  docFolders: ['Diligence', 'Legal', 'Product', 'Unfiled'],
  notes: [{
    title: 'Call with Tunde, 18 Aug',
    venture: 'ImmiClaw',
    meta: '2H'
  }, {
    title: 'Lagos pricing scratch',
    venture: 'ImmiClaw',
    meta: '3D'
  }, {
    title: 'Competitor scan, 6 agents',
    venture: 'ImmiClaw',
    meta: '6D'
  }, {
    title: 'Agency onboarding checklist',
    venture: 'ImmiClaw',
    meta: '8D'
  }, {
    title: 'Parser options, three vendors',
    venture: 'ImmiClaw',
    meta: '11D'
  }, {
    title: 'Founder background notes',
    venture: 'ImmiClaw',
    meta: '14D'
  }, {
    title: 'Release review, 2.4',
    venture: 'Dikkha AI',
    meta: '4D'
  }, {
    title: 'SSC syllabus coverage',
    venture: 'Dikkha AI',
    meta: '7D'
  }, {
    title: 'Offline pack scoping',
    venture: 'Dikkha AI',
    meta: '9D'
  }, {
    title: 'Tutor interview, Khulna',
    venture: 'Dikkha AI',
    meta: '12D'
  }, {
    title: 'Deals feed reliability',
    venture: 'Chhar',
    meta: '1D'
  }, {
    title: 'Play Store listing copy',
    venture: 'Chhar',
    meta: '5D'
  }, {
    title: 'Merchant pricing tiers',
    venture: 'Chhar',
    meta: '6D'
  }, {
    title: 'iOS decision, revisit at 5K',
    venture: 'Chhar',
    meta: '17D'
  }, {
    title: 'Regulatory timeline, BB',
    venture: 'Eloy Lab',
    meta: '3D'
  }, {
    title: 'Bank reporting formats',
    venture: 'Eloy Lab',
    meta: '10D'
  }, {
    title: 'AVL thesis, 2026',
    venture: null,
    meta: '2D',
    pinned: true
  }, {
    title: 'Agent pricing ideas',
    venture: null,
    meta: '6D'
  }, {
    title: 'Who we should not back',
    venture: null,
    meta: '9D'
  }, {
    title: 'Random: BD fintech gap',
    venture: null,
    meta: '13D'
  }]
};
AVL_DATA.tasksFor = v => AVL_DATA.tasks.filter(t => t.venture === v);
AVL_DATA.countFor = (venture, key) => {
  if (key === 'Docs') return AVL_DATA.docs.filter(f => f.venture === venture).length;
  if (key === 'Notes') return AVL_DATA.notes.filter(n => n.venture === venture).length;
  if (key === 'Tasks') return AVL_DATA.tasksFor(venture).length;
  if (key === 'Calendar') return (AVL_DATA.overview[venture] || {
    meetings: []
  }).meetings.length;
  if (key === 'Decisions') return (window.DECISIONS || []).filter(x => x.venture === venture).length;
  return 0;
};
AVL_DATA.gatesFor = venture => {
  const v = AVL_DATA.ventures[venture];
  return (AVL_DATA.gateChecklists[v.stage] || []).map((label, i) => ({
    label,
    done: i < v.gates,
    by: i < v.gates ? v.who : ''
  }));
};
AVL_DATA.stages = [{
  stage: 'Meet',
  count: '02',
  progress: 1,
  color: 'var(--copper)',
  items: ['Eloy Lab', 'Medical BOT']
}, {
  stage: 'Validate',
  count: '01',
  progress: 2,
  color: 'var(--magenta)',
  items: ['ImmiClaw']
}, {
  stage: 'Build',
  count: '02',
  progress: 3,
  color: 'var(--violet)',
  items: ['Dikkha AI', 'Berai']
}, {
  stage: 'Form',
  count: '00',
  progress: 0,
  color: 'var(--copper)',
  items: [],
  add: 'Nothing here yet'
}, {
  stage: 'Grow',
  count: '01',
  progress: 5,
  color: 'var(--teal)',
  items: ['Chhar']
}];
Object.assign(window, {
  AVL_DATA
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/bench/data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/bench/tweaks-panel.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  // data-om-starter: inert presence marker — Claude Design's starter-usage
  // probe reads it. The closed panel renders nothing, so the marker rides
  // the <html> element as an attribute instead of a rendered node — zero
  // elements added, so page CSS (even structural selectors like
  // :nth-child) can never observe it. It records that the page WIRES a
  // tweaks panel, whether or not the panel is open. Keep this effect.
  React.useEffect(() => {
    document.documentElement.setAttribute('data-om-starter', 'tweaks-panel');
    return () => document.documentElement.removeAttribute('data-om-starter');
  }, []);
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/bench/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

__ds_ns.EventCard = __ds_scope.EventCard;

__ds_ns.DayColumn = __ds_scope.DayColumn;

__ds_ns.WeekGrid = __ds_scope.WeekGrid;

__ds_ns.SyncBar = __ds_scope.SyncBar;

__ds_ns.AppBar = __ds_scope.AppBar;

__ds_ns.BackStrip = __ds_scope.BackStrip;

__ds_ns.PageHeader = __ds_scope.PageHeader;

__ds_ns.Kpi = __ds_scope.Kpi;

__ds_ns.StatStrip = __ds_scope.StatStrip;

__ds_ns.FactRow = __ds_scope.FactRow;

__ds_ns.LinkChip = __ds_scope.LinkChip;

__ds_ns.ChecklistRow = __ds_scope.ChecklistRow;

__ds_ns.LaneBarRow = __ds_scope.LaneBarRow;

__ds_ns.LineRow = __ds_scope.LineRow;

__ds_ns.ActivityRow = __ds_scope.ActivityRow;

__ds_ns.ActionButton = __ds_scope.ActionButton;

__ds_ns.DecisionRow = __ds_scope.DecisionRow;

__ds_ns.SourceChip = __ds_scope.SourceChip;

__ds_ns.TypeGlyph = __ds_scope.TypeGlyph;

__ds_ns.FileRow = __ds_scope.FileRow;

__ds_ns.VersionRow = __ds_scope.VersionRow;

__ds_ns.DocsHeaderRow = __ds_scope.DocsHeaderRow;

__ds_ns.DropZone = __ds_scope.DropZone;

__ds_ns.FolderFilter = __ds_scope.FolderFilter;

__ds_ns.FolderItem = __ds_scope.FolderItem;

__ds_ns.PreviewPanel = __ds_scope.PreviewPanel;

__ds_ns.VENTURE_COLORS = __ds_scope.VENTURE_COLORS;

__ds_ns.SwatchPicker = __ds_scope.SwatchPicker;

__ds_ns.Swatch = __ds_scope.Swatch;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.TaskCard = __ds_scope.TaskCard;

__ds_ns.KanbanColumn = __ds_scope.KanbanColumn;

__ds_ns.Lane = __ds_scope.Lane;

__ds_ns.SectionLabel = __ds_scope.SectionLabel;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Skeleton = __ds_scope.Skeleton;

__ds_ns.SkeletonRow = __ds_scope.SkeletonRow;

__ds_ns.NoteSidebar = __ds_scope.NoteSidebar;

__ds_ns.SidebarLink = __ds_scope.SidebarLink;

__ds_ns.NoteBlock = __ds_scope.NoteBlock;

__ds_ns.NoteQuote = __ds_scope.NoteQuote;

__ds_ns.TaskBlock = __ds_scope.TaskBlock;

__ds_ns.SlashMenu = __ds_scope.SlashMenu;

__ds_ns.MetaRail = __ds_scope.MetaRail;

__ds_ns.MetaLink = __ds_scope.MetaLink;

__ds_ns.NoteEditor = __ds_scope.NoteEditor;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.CommandPalette = __ds_scope.CommandPalette;

__ds_ns.CommandRow = __ds_scope.CommandRow;

__ds_ns.GateBar = __ds_scope.GateBar;

__ds_ns.WhoChip = __ds_scope.WhoChip;

__ds_ns.VentureCard = __ds_scope.VentureCard;

__ds_ns.AddButton = __ds_scope.AddButton;

__ds_ns.StageColumn = __ds_scope.StageColumn;

__ds_ns.PipelineBoard = __ds_scope.PipelineBoard;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.VentureHeader = __ds_scope.VentureHeader;

__ds_ns.GateRail = __ds_scope.GateRail;

__ds_ns.VentureTabs = __ds_scope.VentureTabs;

__ds_ns.FilterBar = __ds_scope.FilterBar;

__ds_ns.GroupHeader = __ds_scope.GroupHeader;

__ds_ns.TaskRow = __ds_scope.TaskRow;

})();
