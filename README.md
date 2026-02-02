# 🎄 Merry Christmas Magic - Hand Gesture Control

![Christmas Magic](https://img.shields.io/badge/Christmas-2025-red?style=for-the-badge&logo=christmas)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)

Ứng dụng Giáng Sinh tương tác với điều khiển cử chỉ tay sử dụng MediaPipe và Three.js. Kết hợp giao diện hiện đại với hiệu ứng 3D đẹp mắt.

## ✨ Tính năng

- 🖐️ **Điều khiển cử chỉ tay**: Sử dụng MediaPipe Hands để nhận diện cử chỉ
- 🎄 **Hiệu ứng 3D**: Three.js với particle system động
- 🎨 **Giao diện đẹp mắt**: Tailwind CSS với thiết kế Christmas theme
- 📸 **Xem ảnh tương tác**: Xoay và phóng to ảnh bằng cử chỉ tay
- ❤️ **Hiệu ứng đặc biệt**: Heart animation và tree visualization
- 🎵 **Nhạc nền**: Background music tự động phát

## 🎮 Cách sử dụng các cử chỉ

| Cử chỉ           | Mô tả                     | Hiệu ứng                         |
| ---------------- | ------------------------- | -------------------------------- |
| ✊ **Nắm tay**   | Nắm bàn tay lại           | Hiển thị cây thông Noel          |
| 🖐️ **Xòe tay**   | Mở rộng bàn tay           | Xoay các ảnh trong không gian 3D |
| 👌 **Nhúm ngón** | Nhúm ngón tay lại         | Phóng to ảnh đang chọn           |
| 🫶 **Trái tim**   | Tạo hình trái tim (2 tay) | Hiển thị "I LOVE YOU"            |

## 🚀 Cài đặt

### Yêu cầu

- Node.js 18+
- npm hoặc yarn

### Các bước cài đặt

1. **Clone hoặc vào thư mục dự án**

```bash
cd christmas-magic-final
```

2. **Cài đặt dependencies**

```bash
npm install
```

3. **Chạy development server**

```bash
npm run dev
```

4. **Mở trình duyệt** tại `http://localhost:5173`

## 📦 Build cho Production

### Build local

```bash
npm run build
```

File build sẽ được tạo trong thư mục `dist/`

### Preview build

```bash
npm run preview
```

## 🌐 Deploy lên GitHub Pages

### Bước 1: Chuẩn bị Repository

1. Tạo repository mới trên GitHub (nếu chưa có)
2. Push code lên GitHub:

```bash
git init
git add .
git commit -m "Initial commit: Christmas Magic"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```

### Bước 2: Cấu hình GitHub Pages

1. Vào repository trên GitHub
2. Settings → Pages
3. Source: chọn **GitHub Actions**

### Bước 3: Tạo GitHub Actions Workflow

Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Bước 4: Cập nhật Vite Config

Đảm bảo `vite.config.ts` có `base` path đúng:

```typescript
export default defineConfig({
  base: "/REPO_NAME/", // Thay REPO_NAME bằng tên repo của bạn
  // ... các config khác
});
```

### Bước 5: Deploy

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push
```

GitHub Actions sẽ tự động build và deploy. Truy cập tại:

```
https://USERNAME.github.io/REPO_NAME/
```

## 🛠️ Công nghệ sử dụng

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Three.js** - 3D Graphics
- **MediaPipe Hands** - Hand Tracking
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📁 Cấu trúc thư mục

```
christmas-magic-final/
├── public/
│   └── assets/
│       ├── audio/          # Nhạc nền
│       └── images/         # Ảnh hiển thị
├── src/
│   ├── components/
│   │   ├── CameraFeed.tsx  # Camera với gesture detection
│   │   ├── GestureCard.tsx # Card hiển thị cử chỉ
│   │   ├── Snowfall.tsx    # Hiệu ứng tuyết rơi
│   │   └── ThreeScene.tsx  # 3D Scene render
│   ├── logic/
│   │   ├── config.ts       # Cấu hình
│   │   ├── gestures.ts     # Gesture detection
│   │   ├── particles.ts    # Particle system
│   │   ├── scene.ts        # Three.js scene
│   │   └── textures.ts     # Texture generation
│   ├── App.tsx             # Main component
│   ├── index.tsx           # Entry point
│   ├── types.ts            # TypeScript types
│   └── index.css           # Global styles
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🎨 Tùy chỉnh

### Thay đổi số lượng ảnh

1. Cập nhật `src/logic/config.ts`:

```typescript
export const CONFIG = {
  PHOTO_COUNT: 10, // Thay đổi số lượng ảnh
  // ...
};
```

2. Thêm ảnh vào `public/assets/images/` và cập nhật:

```typescript
export const photoFiles = [
  "/assets/images/image1.jpeg",
  "/assets/images/image2.jpeg",
  // ... thêm ảnh mới
];
```

### Thay đổi màu sắc

Chỉnh sửa `tailwind.config.js`:

```javascript
colors: {
  'xmas-red': '#D42426',
  'xmas-green': '#0B6623',
  'xmas-gold': '#F8B229',
}
```

## 🐛 Troubleshooting

### Camera không hoạt động

- Đảm bảo trình duyệt có quyền truy cập camera
- Sử dụng HTTPS hoặc localhost
- Kiểm tra camera không bị ứng dụng khác sử dụng

### Build lỗi TypeScript

```bash
npm run build -- --mode development
```

### Lỗi MediaPipe

- Kiểm tra kết nối internet (CDN)
- Clear browser cache

## 📝 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại

## 🎅 Credits

Created with ❤️ for Christmas 2025

- Design: Modern Christmas UI/UX
- 3D Graphics: Three.js particle system
- Hand Tracking: MediaPipe Hands
- Icons: Lucide React

---

⭐ **Nếu bạn thích project này, hãy cho một star!** ⭐

🎄 **Chúc Mừng Giáng Sinh!** 🎄
