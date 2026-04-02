# skill_design_temp.md — Clone Template từ Ảnh

## Mục đích

Nhận 2 ảnh đầu vào → phân tích → clone thành code React/HTML chính xác về layout, vị trí, font chữ.

---

## Input: 2 ảnh bắt buộc

| Ảnh | Tên gợi ý | Nội dung |
|-----|-----------|----------|
| Ảnh 1 | `template_text.png` | Bản có text placeholder (`name`, `time`, `location`, `message`...) — dùng để đọc font, cỡ chữ, vị trí |
| Ảnh 2 | `template.png` | Bản không có text (hoặc ít text) — dùng làm **background thật** trong code |

> ⚠️ Ảnh 2 (clean) sẽ được dùng trực tiếp làm `backgroundImage` hoặc `<Image src>` trong component.  
> Ảnh 1 (text) chỉ dùng để đọc thông tin thiết kế — KHÔNG dùng làm background.

---

## Quy trình 6 bước

### B1: Đọc Ảnh 1 — Phân tích layout

Chia template thành các **vùng** (zones) từ trên xuống dưới:

```
[ZONE TOP]      ← màu nền, họa tiết, decor phía trên
[ZONE TITLE]    ← tiêu đề chính (font, size, màu, vị trí)
[ZONE MEDIA]    ← ảnh / collage / khung ảnh
[ZONE DIVIDER]  ← đường kẻ, torn paper, dải màu
[ZONE INFO]     ← time, date, location (font, layout, alignment)
[ZONE FOOTER]   ← name, message, class (font, size, color)
```

Ghi chú cho từng zone:
- Font family (serif / sans / display / handwritten / stamp)
- Font size tương đối (lớn / trung bình / nhỏ)
- Font weight (bold / regular / italic)
- Màu chữ & màu nền
- Alignment (left / center / right)
- Vị trí (absolute % hoặc flex layout)

---

### B2: Đọc Ảnh 2 — Extract background

- Dùng ảnh 2 (clean) làm `src` cho background
- Xác định kích thước tỉ lệ (portrait A5: ~390×554px / A4: ~595×842px)
- Xác định vùng "safe area" — nơi text có thể đặt lên mà không che decor quan trọng

---

### B3: Map placeholder → data fields

Đọc Ảnh 1, map từng placeholder text vào đúng field trong schema:

```
"name"      → { name }
"class"     / "Class of [class]" → { class }
"time hour" / "time date"        → { time }
"location"  → { location }
"mesage" / "message"             → { message }
```

Ghi vị trí tương đối của từng field (top: X%, left: Y%, fontSize, color).

---

### B4: Viết component

Cấu trúc chuẩn:

```tsx
export default function TemplateXxx({ name, class: cls, time, location, message }: Invitation) {
  return (
    <div style={{ position: 'relative', width: W, height: H }}>

      {/* Layer 0: Background image (Ảnh 2) */}
      <Image src={bgImage} alt="" fill style={{ objectFit: 'cover' }} />

      {/* Layer 1: Overlay content — absolute positioned */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>

        {/* Zone: Title */}
        <p style={{ position: 'absolute', top: '18%', left: '10%', fontSize: '...', fontFamily: '...' }}>
          Happy Graduation
        </p>

        {/* Zone: Info */}
        <p style={{ position: 'absolute', bottom: '22%', left: '8%', ... }}>{time}</p>
        <p style={{ position: 'absolute', bottom: '22%', right: '8%', ... }}>{/* date part */}</p>

        {/* Zone: Footer */}
        <p style={{ position: 'absolute', bottom: '10%', left: '14%', ... }}>{message}</p>
        <p style={{ position: 'absolute', bottom: '10%', right: '14%', ... }}>{name}</p>

      </div>
    </div>
  )
}
```

> 💡 Dùng `position: absolute` + `top/left` theo `%` để responsive theo container size.

---

### B5: Chọn font đúng

Đọc font từ Ảnh 1, map sang Google Fonts gần nhất:

| Kiểu chữ nhìn thấy | Google Font gợi ý |
|--------------------|-------------------|
| Stamp / grunge / distressed | `Archivo Black`, `Bebas Neue`, `Rubik Dirt` |
| Script / handwritten | `Dancing Script`, `Pacifico`, `Caveat` |
| Serif trang trọng | `Playfair Display`, `Cormorant Garamond`, `Libre Baskerville` |
| Sans bold hiện đại | `Oswald`, `Barlow Condensed`, `Anton` |
| Notebook / casual | `Patrick Hand`, `Kalam`, `Indie Flower` |

Import vào `layout.tsx` hoặc `_document.tsx`:
```html
<link href="https://fonts.googleapis.com/css2?family=Rubik+Dirt&family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
```

---

### B6: Kiểm tra & tinh chỉnh

Checklist trước khi done:

- [ ] Background = Ảnh 2 (clean), không phải Ảnh 1
- [ ] Đủ 5 field: `name`, `class`, `time`, `location`, `message`
- [ ] `message` có check optional: `{message && <p>...</p>}`
- [ ] Font khớp visual với Ảnh 1
- [ ] Vị trí text không che mất decor chính (mũ, hoa, khung ảnh...)
- [ ] Test responsive: thu nhỏ container xem text có vỡ không

---

## Ví dụ: Template Blue-Yellow Scrapbook

**Phân tích Ảnh 1:**

```
ZONE TOP    → nền vàng #F5B800, font stamp/grunge
ZONE TITLE  → "HAPPY GRADUATION", Rubik Dirt hoặc Archivo Black, ~48px, màu đen
ZONE MEDIA  → notebook/scrapbook collage, vùng giữa ~45% chiều cao
ZONE TORN   → torn paper effect (SVG hoặc background-image)
ZONE INFO   → bottom 30%, 2 cột: "time hour" (left) + "time date" (right), font bold navy
ZONE FOOTER → "mesage" (left) + "name" (right), font medium navy
```

**Output component:**

```tsx
// TemplateScrapbook.tsx
import type { Invitation } from "@/types"
import Image from "next/image"
import bgClean from "./Blue_Yellow_Creative_Graduation_Poster_clean.png"

export default function TemplateScrapbook({ name, class: cls, time, location, message }: Invitation) {
  return (
    <div style={{ position: 'relative', width: '390px', height: '554px', borderRadius: '8px', overflow: 'hidden' }}>
      <Image src={bgClean} alt="" fill style={{ objectFit: 'cover' }} priority />

      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        {/* Time + Date row */}
        <div style={{
          position: 'absolute', bottom: '22%', left: 0, right: 0,
          display: 'flex', justifyContent: 'space-around',
          fontFamily: "'Oswald', sans-serif", fontWeight: 700,
          fontSize: '22px', color: '#1B2D6B'
        }}>
          <span>{time}</span>
          <span>{location}</span>
        </div>

        {/* Message + Name row */}
        <div style={{
          position: 'absolute', bottom: '12%', left: 0, right: 0,
          display: 'flex', justifyContent: 'space-around',
          fontFamily: "'Oswald', sans-serif", fontWeight: 500,
          fontSize: '14px', color: '#1B2D6B'
        }}>
          <span>{message}</span>
          <span>{name}</span>
        </div>
      </div>
    </div>
  )
}
```

---

## Naming convention

```
Template{Style}.tsx           ← component
{style}-bg.png                ← ảnh 2 (clean background)
```

Ví dụ:
```
TemplateScrapbook.tsx  +  scrapbook-bg.png
TemplateClassic.tsx    +  classic-bg.png
TemplateCute.tsx       +  cute-bg.png
```

---

## Lưu ý quan trọng

- **Không tự vẽ lại decor** (hoa, mũ, torn paper, notebook) bằng CSS/SVG phức tạp → dùng ảnh 2 làm nền là đủ
- **Chỉ code phần text overlay** lên trên nền
- Nếu decor quan trọng bị text che → dịch chuyển text hoặc thêm `text-shadow` để readable
- Với template có **2 cột thông tin** (như Blue-Yellow): dùng `display: flex; justify-content: space-around` thay vì absolute từng cái
