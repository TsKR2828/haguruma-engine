export const CONNECTIONS = [
  {
    id: "raincoat_double",
    requires: ["raincoat_station", "raincoat_train"],
    title: "兩件雨衣",
    subtitle: "迴路初現",
    icon: "◇",
    insightGain: 1,
  },
  {
    id: "raincoat_triple",
    requires: ["raincoat_station", "raincoat_train", "raincoat_hotel"],
    title: "三件雨衣",
    subtitle: "形未明，迴路已成",
    icon: "◈",
    insightGain: 1,
  },
  {
    id: "raincoat_omen",
    requires: ["raincoat_station", "raincoat_death"],
    title: "季節外れの雨衣",
    subtitle: "死の予兆",
    icon: "✦",
    insightGain: 2,
  },
  {
    id: "allright_meaning",
    check: (s) =>
      s.choicesMade.pondered_allright &&
      s.notebook.some((n) => n.key === "raincoat_death"),
    title: "All right",
    subtitle: "すべて整ふ",
    icon: "✶",
    insightGain: 1,
  },
  {
    id: "worm_chain",
    requires: ["book_worm", "wing_corridor"],
    title: "麒麟・鳳凰・蛆",
    subtitle: "言葉の滑り",
    icon: "◉",
    insightGain: 1,
  },
];
