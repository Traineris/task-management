# 04. Design System Tokens & UI Specifications

Dokumen ini mendefinisikan sistem token visual yang **wajib digunakan oleh AI saat membuat/mengedit komponen UI Frontend**.

## 🎨 Color Tokens (Jira Palette)

```css
/* Background & Layout */
--bg-app: #F4F5F7;
--bg-surface: #FFFFFF;
--bg-sidebar: #0747A6;

/* Text */
--text-heading: #172B4D;
--text-body: #253858;
--text-subtle: #5E6C84;

/* Brand & Interactive */
--color-primary: #0052CC;
--color-primary-hover: #0747A6;
--color-success: #36B37E;
--color-danger: #FF5630;
--color-warning: #FFAB00;

/* Jira Issue Priorities */
--priority-highest: #DE350B;
--priority-high: #FF5630;
--priority-medium: #FFAB00;
--priority-low: #36B37E;
```

## 📐 Spacing & Layout Rules

- Gunakan skala kelipatan 4px (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`).
- Radius sudut (*Border Radius*):
  - Card / Input / Button: `4px` atau `6px`.
  - Avatar: `50%`.

## ⚡ UI Animation Guidelines

- Semua hover & active state harus memiliki transisi halus: `transition: background-color 0.2s ease, transform 0.1s ease`.
- Card drag-and-drop harus memberikan *feedback visual* (shadow elevation saat di-drag).
