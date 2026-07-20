# Illustrator

[English](./README.md) | [简体中文](./README.zh-CN.md)

![将 Illustrator 字标拆解为彩色渲染标本的封面](./skills/illustrator/examples/render-specimen/preview.png)

**让具备代码执行能力的普通 LLM 也能生成设计图片——无需生图模型。**

Illustrator 是一个轻量、无需浏览器的 Agent Skill，通过本地渲染，将自然语言描述、内容、代码和用户提供的图片转化为可复现的视觉作品。你可以从预制示例开始，也可以完全自由地定义自己的视觉风格。

## 为什么选择 Illustrator

- **无需生图模型** — 普通的代码型 LLM 可以通过生成本地渲染代码来创建视觉作品。
- **轻量且无需浏览器** — 不依赖 Chromium、Puppeteer 或浏览器运行时。
- **预制示例，风格不限** — 可以参考内置示例，也可以使用自己的视觉方向。
- **天生可复现** — 输入、渲染代码和输出可以一起保存。

## 可以创建什么

- 编辑插画与海报
- 文章和社交媒体配图
- 使用自有图片的照片编排
- 数据报告与信息图
- 代码片段、代码窗口与 Diff 图片
- 完全自定义的视觉系统

## 安装

需要 Node.js 20 或更高版本，以及兼容 Agent Skills 的代码 Agent。

```sh
npx skills add Visualizeit/illustrator --skill illustrator
```

## 使用

安装后，直接向 Agent 描述你想要的视觉作品：

```text
/illustration 创建一张 1600×900、主题为专注与深度工作的编辑插画。
```

```text
/illustration 参考内置的 Flash Diary 示例，重新设计这份内容。
```

```text
/illustration 把这段代码制作成一张干净、适合演示的图片。
```

## 示例

### 插画与编辑视觉

#### [Flash Diary](./skills/illustrator/examples/flash-diary)

以用户图片、醒目字体和精简编辑信息构成的明快城市日记。

<p align="center">
  <a href="./skills/illustrator/examples/flash-diary">
    <img src="./skills/illustrator/examples/flash-diary/preview.png" alt="Flash Diary 示例预览" width="560">
  </a>
</p>

#### [Flower Market](./skills/illustrator/examples/flower-market)

将超大字体与利落的几何花卉结合起来的彩色市集海报。

<p align="center">
  <a href="./skills/illustrator/examples/flower-market">
    <img src="./skills/illustrator/examples/flower-market/preview.png" alt="Flower Market 示例预览" width="560">
  </a>
</p>

#### [Field Archive](./skills/illustrator/examples/field-archive)

以自然形态、测量标注和档案信息构成的当代标本研究视觉。

<p align="center">
  <a href="./skills/illustrator/examples/field-archive">
    <img src="./skills/illustrator/examples/field-archive/preview.png" alt="Field Archive 示例预览" width="560">
  </a>
</p>

#### [Render Specimen](./skills/illustrator/examples/render-specimen)

将 ILLUSTRATOR 字标转化为带有测量标注和彩色构造层的字体标本。

<p align="center">
  <a href="./skills/illustrator/examples/render-specimen">
    <img src="./skills/illustrator/examples/render-specimen/preview.png" alt="Render Specimen 示例预览" width="900">
  </a>
</p>

#### [Paddock Blue](./skills/illustrator/examples/paddock-blue)

将动态摄影与精简性能数据结合起来的克制赛车编辑视觉。

<p align="center">
  <a href="./skills/illustrator/examples/paddock-blue">
    <img src="./skills/illustrator/examples/paddock-blue/preview.png" alt="Paddock Blue 示例预览" width="560">
  </a>
</p>

#### [Grid Operator](./skills/illustrator/examples/grid-operator)

围绕语义化表格和一次精确交互构建的横版自动化视觉。

<p align="center">
  <a href="./skills/illustrator/examples/grid-operator">
    <img src="./skills/illustrator/examples/grid-operator/preview.png" alt="Grid Operator 示例预览" width="900">
  </a>
</p>

#### [Refraction Atlas](./skills/illustrator/examples/refraction-atlas)

使用清晰对比线和半透明重叠色域构成的分析报告视觉。

<p align="center">
  <a href="./skills/illustrator/examples/refraction-atlas">
    <img src="./skills/illustrator/examples/refraction-atlas/preview.png" alt="Refraction Atlas 示例预览" width="900">
  </a>
</p>

#### [Chromatic Poster](./skills/illustrator/examples/chromatic-poster)

以单一主色域和精简编辑字体构成的极简色彩研究海报。

<p align="center">
  <a href="./skills/illustrator/examples/chromatic-poster">
    <img src="./skills/illustrator/examples/chromatic-poster/preview.png" alt="Chromatic Poster 示例预览" width="560">
  </a>
</p>

### 代码图片

#### [Shiki Code Diff](./skills/illustrator/examples/shiki-code-diff)

适合演示的左右分栏 Diff，包含语法高亮和清晰的增删区域。

<p align="center">
  <a href="./skills/illustrator/examples/shiki-code-diff">
    <img src="./skills/illustrator/examples/shiki-code-diff/preview.png" alt="Shiki Code Diff 示例预览" width="900">
  </a>
</p>

#### [Shiki Code Window](./skills/illustrator/examples/shiki-code-window)

带有精简文件栏和清晰语法高亮的浅色代码窗口。

<p align="center">
  <a href="./skills/illustrator/examples/shiki-code-window">
    <img src="./skills/illustrator/examples/shiki-code-window/preview.png" alt="Shiki Code Window 示例预览" width="900">
  </a>
</p>

#### [Shiki Code Image](./skills/illustrator/examples/shiki-code-image)

适用于文档、文章和社交媒体的极简深色代码图片。

<p align="center">
  <a href="./skills/illustrator/examples/shiki-code-image">
    <img src="./skills/illustrator/examples/shiki-code-image/preview.png" alt="Shiki Code Image 示例预览" width="900">
  </a>
</p>

## 许可证

Copyright 2026 Visualizeit。本项目采用 [Apache License 2.0](./LICENSE)；再次分发时，必须保留许可证以及 [`NOTICE`](./NOTICE) 中要求的归属声明。

仅使用 Illustrator 生成图片时，无需在生成图片上标注 Illustrator。内置字体和示例照片继续遵循各自的许可条款，详见 [`THIRD_PARTY_NOTICES.md`](./skills/illustrator/THIRD_PARTY_NOTICES.md)。

## 开发

需要 Node.js 和 pnpm。

```sh
pnpm install
pnpm run validate
```

Skill 源码位于 [`skills/illustrator`](./skills/illustrator)。项目内置 Noto Sans SC 和 JetBrains Mono，以确保文字和代码渲染效果一致；字体和图片来源见 [`THIRD_PARTY_NOTICES.md`](./skills/illustrator/THIRD_PARTY_NOTICES.md)。

> 项目仍在开发中，公开接口和运行时打包方式可能发生变化。
