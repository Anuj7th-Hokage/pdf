# PDFKIT — PDF Converter

A client-side React app for converting text, images, and HTML to PDF. Nothing leaves your browser.

## Features

- **Text → PDF** — Paste or write text, choose font/size/orientation, download as PDF
- **Image → PDF** — Drag & drop images (PNG/JPG/WEBP), multi-image → multi-page PDF
- **HTML → PDF** — Write or paste HTML, live preview, snapshot to PDF via html2canvas

## Stack

- React 18 + Vite
- [jsPDF](https://github.com/parallax/jsPDF) — PDF generation
- [html2canvas](https://html2canvas.hertzen.com/) — HTML rendering
- [react-dropzone](https://react-dropzone.js.org/) — drag & drop uploads

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
```

Output in `dist/`.
