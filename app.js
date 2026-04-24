const phone = document.getElementById("phone");
const barTitle = document.getElementById("barTitle");
const barValue = document.getElementById("barValue");
const appLogo = document.getElementById("appLogo");
const middleLogo = document.getElementById("middleLogo");
const statusPill = document.getElementById("statusPill");
const statusText = document.getElementById("statusText");
const middlePage = document.getElementById("middlePage");
const middleTitle = document.getElementById("middleTitle");

const variantButtons = [...document.querySelectorAll("[data-variant-tab]")];
const stateButtons = [...document.querySelectorAll("[data-state-button]")];
const specButtons = [...document.querySelectorAll("[data-spec-tab]")];
const specPages = [...document.querySelectorAll(".spec-page")];

const variants = {
  v1: {
    label: "V1 / 线上对照",
    app: "抖音商城",
    value: "天天有优惠 新人更便宜",
    logo: "https://www.figma.com/api/mcp/asset/601c6e07-b893-40b9-8365-741641432f8e",
    normal: "线上常规态：40px 单行底 bar，保留下载按钮与关闭入口。",
    boosted: "线上强化态：组件升级为双行信息，按钮强化为白底，营销感与占用感较强。",
    returned: "V1 对照组不新增退场，返回后仍按线上逻辑展示。",
    suppressed: "关闭后底 bar 隐藏，用于观察关闭率基线。"
  },
  v2: {
    label: "V2 / 弱化强化态",
    app: "抖音商城",
    value: "天天有优惠 新人更便宜",
    logo: "https://www.figma.com/api/mcp/asset/601c6e07-b893-40b9-8365-741641432f8e",
    normal: "常规态：保持 40px 单行组件，按钮为半透明次级样式。",
    boosted: "强化态：仅按钮切换为白底主行动样式，文案与组件高度不扩张。",
    returned: "进入中间页后返回抖音，强化态退场并回落为常规态。",
    suppressed: "点击关闭后记录 7 天冷却，冷却期内不再进入强化态。"
  },
  v3: {
    label: "V3 / 取消强化整合",
    app: "抖音精选",
    value: "AI 边看边问",
    logo: "https://www.figma.com/api/mcp/asset/515632b3-2b02-46e2-a304-ababdf44738f",
    normal: "固定形态：移除独立下载按钮，主标题合并为下载/打开 + App 名 + 应用。",
    boosted: "V3 不进入强化态，仅在原强化触发时机播放一次 icon 与文案微动效。",
    returned: "点击跳转并返回后保持固定形态，不产生二次强化打扰。",
    suppressed: "关闭后隐藏组件，并保留样式组埋点用于关闭率分析。"
  }
};

let currentVariant = "v2";
let currentState = "normal";
let suppressUntil = null;

function setActive(buttons, attr, value) {
  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset[attr] === value);
  });
}

function applyState(variant = currentVariant, state = currentState) {
  currentVariant = variant;
  currentState = state;
  const config = variants[variant];

  phone.dataset.variant = variant;
  phone.dataset.state = state;
  phone.classList.remove("pulse");

  appLogo.src = config.logo;
  middleLogo.src = config.logo;
  middleTitle.textContent = config.app;

  if (variant === "v3") {
    barTitle.textContent = `下载${config.app}应用`;
    barValue.textContent = config.value;
  } else {
    barTitle.textContent = config.app;
    barValue.textContent = config.value;
  }

  if (variant === "v3" && state === "boosted") {
    window.requestAnimationFrame(() => phone.classList.add("pulse"));
  }

  const stateLabel = {
    normal: "常规态",
    boosted: variant === "v3" ? "触发微动效" : "强化态",
    returned: "返回回落",
    suppressed: "7 天不强化"
  }[state];

  statusPill.textContent = `${config.label} / ${stateLabel}`;
  statusText.textContent = config[state];
  setActive(variantButtons, "variantTab", variant);
  setActive(stateButtons, "stateButton", state);
}

function openMiddlePage() {
  middlePage.hidden = false;
}

function returnFromMiddlePage() {
  middlePage.hidden = true;
  if (currentVariant === "v2") {
    applyState("v2", "returned");
  } else if (currentVariant === "v3") {
    applyState("v3", "returned");
  }
}

variantButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextVariant = button.dataset.variantTab;
    const nextState = nextVariant === "v3" && currentState === "boosted" ? "normal" : currentState;
    middlePage.hidden = true;
    applyState(nextVariant, nextState);
  });
});

stateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    middlePage.hidden = true;
    applyState(currentVariant, button.dataset.stateButton);
  });
});

specButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.specTab;
    specButtons.forEach((item) => item.classList.toggle("active", item === button));
    specPages.forEach((page) => page.classList.toggle("active", page.id === `spec-${tab}`));
  });
});

document.getElementById("triggerBoost").addEventListener("click", () => {
  if (suppressUntil && Date.now() < suppressUntil) {
    applyState(currentVariant, "suppressed");
    return;
  }
  applyState(currentVariant, "boosted");
});

document.getElementById("openMiddle").addEventListener("click", openMiddlePage);
document.getElementById("barHitArea").addEventListener("click", openMiddlePage);
document.getElementById("downloadBtn").addEventListener("click", openMiddlePage);
document.getElementById("returnBtn").addEventListener("click", returnFromMiddlePage);

document.getElementById("closeBtn").addEventListener("click", () => {
  suppressUntil = Date.now() + 7 * 24 * 60 * 60 * 1000;
  applyState(currentVariant, "suppressed");
});

document.getElementById("closeBarAction").addEventListener("click", () => {
  suppressUntil = Date.now() + 7 * 24 * 60 * 60 * 1000;
  applyState(currentVariant, "suppressed");
});

document.getElementById("resetDemo").addEventListener("click", () => {
  suppressUntil = null;
  middlePage.hidden = true;
  applyState(currentVariant, "normal");
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !middlePage.hidden) {
    returnFromMiddlePage();
  }
});

applyState(currentVariant, currentState);
