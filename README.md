<<<<<<< HEAD
# HNUE Invitation 🎓

> Tạo thiệp mời kỉ yếu đẹp, dễ chia sẻ — dành cho sinh viên Trường Đại học Sư phạm Hà Nội.

## Tech stack

- **Next.js 14** (App Router)
- **Firebase** — Firestore (database) + Storage (ảnh)
- **Tailwind CSS**
- **Vercel** (deploy)

---

## Cài đặt local

### 1. Clone repo

```bash
git clone https://github.com/<your-username>/hnue-invitation.git
cd hnue-invitation
npm install
```

### 2. Tạo Firebase project

1. Vào [Firebase Console](https://console.firebase.google.com) → Tạo project mới
2. Bật **Firestore Database** (production mode)
3. Bật **Storage**
4. Vào **Project Settings > Your apps** → Add web app → Copy config

### 3. Cấu hình biến môi trường

```bash
cp .env.example .env.local
# Mở .env.local và điền các giá trị Firebase config vào
```

### 4. Cài Firestore & Storage rules

```bash
# Cài Firebase CLI nếu chưa có
npm install -g firebase-tools
firebase login

firebase init   # chọn Firestore + Storage, dùng project vừa tạo

# Deploy rules
firebase deploy --only firestore:rules,storage
```

### 5. Seed templates

```bash
# Download service account key từ Firebase Console > Project Settings > Service accounts
# Lưu file tại: firebase-service-account.json (đã có trong .gitignore)

node scripts/seed-templates.js
```

### 6. Chạy dev

```bash
npm run dev
# Mở http://localhost:3000
```

---

## Deploy lên Vercel

```bash
# Cài Vercel CLI
npm i -g vercel

vercel
# Làm theo hướng dẫn, thêm environment variables khi được hỏi
```

Hoặc kết nối repo GitHub với [vercel.com](https://vercel.com) để auto-deploy khi push.

---

## Cấu trúc project

```
hnue-invitation/
├── app/
│   ├── page.tsx                  # Home — chọn template
│   ├── create/page.tsx           # Form tạo thiệp
│   ├── invite/[id]/
│   │   ├── page.tsx              # Mini website công khai
│   │   └── ShareBar.tsx          # Nút copy link / share
│   └── api/
│       ├── invite/route.ts       # POST — tạo thiệp
│       ├── invite/[id]/route.ts  # GET  — lấy thiệp
│       └── ai/suggest/route.ts   # POST — gợi ý template
├── components/
│   └── templates/
│       ├── TemplateRenderer.tsx  # Router component
│       ├── CutePink.tsx
│       ├── ElegantBlue.tsx
│       └── MinimalWhite.tsx
├── lib/
│   ├── firebase.ts               # Firebase client
│   └── templates.ts              # Dữ liệu & keyword matching
├── types/index.ts
├── scripts/seed-templates.js
├── firestore.rules
└── storage.rules
```

---

## Roadmap

- [x] **Phase 1** — 3 template, tạo + preview + share link
- [ ] **Phase 2** — AI caption, AI template suggest (OpenAI)
- [ ] **Phase 3** — Marketplace, multi-school

---

## Thêm template mới

1. Tạo file `components/templates/TenTemplate.tsx`
2. Thêm vào `lib/templates.ts` (TEMPLATES array + keywords)
3. Thêm vào map trong `components/templates/TemplateRenderer.tsx`
4. Chạy `scripts/seed-templates.js` để cập nhật Firestore
=======
# hnue-invitation
>>>>>>> 1a3d9ebdbf2b9ff283dce4ce60e32bcb850fa615
