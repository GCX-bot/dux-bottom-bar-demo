# 导流队列底 bar 样式迭代原型

这是一个 Code first 的可交互高保真原型，用于验证 V1 线上对照、V2 弱化强化态、V3 取消强化整合三组底 bar 方案。

## 交付内容

- `index.html`：可运行原型入口，含手机播放器、实验组切换、状态切换与中间页返回演示。
- `styles.css`：根据 Figma 播放器资源库 Token 转写的高保真样式。
- `app.js`：V1/V2/V3 状态机、退场逻辑、7 天不强化与动效触发逻辑。
- FigJam 流程图：<https://www.figma.com/online-whiteboard/create-diagram/f080ed2b-a975-44e4-9605-1614279640aa?utm_source=chatgpt&utm_content=edit_in_figjam&oai_id=&request_id=53ff366f-130e-4927-b4da-01bdfebcf30c>

## 样式与逻辑覆盖

- V1：线上常规态、线上双行强化态。
- V2：常规态、仅按钮样式变化的强化态、进入中间页返回后回落、点击关闭 7 天内不再强化。
- V3：全程固定一种组件形态、移除下载按钮、主标题改为“下载/打开 + 原主标题 + 应用”、原强化触发时机播放 icon/文案微动效。

## 埋点字段建议

- `bottom_bar_style_group`: `v1_control` / `v2_button_only_boost` / `v3_integrated_static`
- `bar_visual_state`: `normal` / `boosted` / `returned` / `suppressed`
- `bar_action`: `expose` / `click_jump` / `close` / `return_from_middle_page`
- `suppress_until_days`: 关闭冷却天数，V2/V3 为 `7`
