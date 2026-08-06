# 03. Design System & Styling Conventions

Dokumen ini mendefinisikan pedoman visual dan styling untuk antarmuka **Jira Clone** di `task-client`.

## 🎨 Palette Warna (Jira Palette)

Sistem menggunakan warna yang terinspirasi dari Jira Atlassian Design System:

```css
:root {
  /* Brand Colors */
  --color-primary: #0052CC;
  --color-primary-hover: #0747A6;
  
  /* Status Colors */
  --color-todo: #42526E;
  --color-in-progress: #0052CC;
  --color-done: #00875A;
  
  /* Priority Colors */
  --color-priority-highest: #DE350B;
  --color-priority-high: #FF5630;
  --color-priority-medium: #FFAB00;
  --color-priority-low: #36B37E;

  /* Neutral Surface Colors */
  --bg-main: #F4F5F7;
  --bg-card: #FFFFFF;
  --text-main: #172B4D;
  --text-muted: #5E6C84;
}
```

## ✒️ Typography & Spacing

- **Font Family**: `Inter`, `system-ui`, `-apple-system`, `sans-serif`.
- **Spacing Scale**: Baseline 4px/8px grid scale (`4px`, `8px`, `16px`, `24px`, `32px`).

## 🧱 Guidelines Micro-Animations

- Tambahkan efek transisi halus (`transition: all 0.2s ease-in-out`) pada komponen interaktif seperti tombol, drag-and-drop card hover, dan modal overlays.
