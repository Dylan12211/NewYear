# 🎄 HƯỚNG DẪN NHANH - CHRISTMAS MAGIC FINAL

## 📋 CÁC BƯỚC THỰC HIỆN

### 1️⃣ CÀI ĐẶT DEPENDENCIES

```bash
cd christmas-magic-final
npm install
```

**Lưu ý**: Quá trình cài đặt có thể mất 2-3 phút.

### 2️⃣ CHẠY DEVELOPMENT SERVER

```bash
npm run dev
```

Mở trình duyệt tại: `http://localhost:5173`

### 3️⃣ BUILD CHO PRODUCTION

```bash
npm run build
```

File build trong thư mục `dist/`

### 4️⃣ PREVIEW BUILD

```bash
npm run preview
```

## 🚀 DEPLOY LÊN GITHUB PAGES

### Bước 1: Init Git Repository

```bash
git init
git add .
git commit -m "Initial commit: Christmas Magic Final"
```

### Bước 2: Tạo Repository trên GitHub

1. Vào https://github.com/new
2. Tạo repository mới (ví dụ: `christmas-magic`)
3. **KHÔNG** chọn "Initialize with README"

### Bước 3: Push Code

```bash
git remote add origin https://github.com/USERNAME/christmas-magic.git
git branch -M main
git push -u origin main
```

### Bước 4: Tạo GitHub Actions Workflow

Tạo file `.github/workflows/deploy.yml` với nội dung (xem README.md)

### Bước 5: Cập nhật vite.config.ts

Trong file `vite.config.ts`, đổi:

```typescript
base: './',  // Đổi thành
base: '/christmas-magic/',  // Tên repository của bạn
```

### Bước 6: Push lại

```bash
git add .
git commit -m "Configure for GitHub Pages"
git push
```

### Bước 7: Enable GitHub Pages

1. Vào Settings → Pages
2. Source: GitHub Actions
3. Đợi build hoàn thành (~2-3 phút)

### Bước 8: Truy cập website

```
https://USERNAME.github.io/christmas-magic/
```

## ⚠️ LƯU Ý QUAN TRỌNG

### Camera Permission

- Phải chạy trên HTTPS hoặc localhost
- Cho phép browser truy cập camera
- Đảm bảo không có app khác đang dùng camera

### Build Issues

Nếu gặp lỗi TypeScript khi build:

```bash
npm run build -- --mode development
```

### Assets

- Đảm bảo có đủ 5 ảnh trong `public/assets/images/`
- File audio trong `public/assets/audio/audio.mp3`

## 📦 DEPENDENCIES CHÍNH

- react & react-dom: ^18.3.1
- three: ^0.160.0
- @mediapipe/hands: ^0.4.1646424915
- @mediapipe/camera_utils: ^0.3.1620248817
- tailwindcss: ^3.4.1
- typescript: ^5.3.3
- vite: ^5.0.12

## 🎮 TEST LOCAL

1. Chạy `npm run dev`
2. Mở http://localhost:5173
3. Cho phép camera access
4. Click "BẮT ĐẦU PHÉP THUẬT"
5. Test các cử chỉ:
   - ✊ Nắm tay → Cây thông
   - 🖐️ Xòe tay → Xoay ảnh
   - 👌 Nhúm ngón → Phóng to
   - 🫶 Trái tim (2 tay) → I LOVE YOU

## 🐛 TROUBLESHOOTING

### Lỗi: Cannot find module 'three'

```bash
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: MediaPipe not loading

- Kiểm tra internet connection
- Thử dùng VPN nếu bị chặn CDN
- Clear browser cache

### Camera không hiển thị

- Reload page và cho phép permission
- Thử browser khác (Chrome recommended)
- Kiểm tra camera hardware

## 📞 HỖ TRỢ

Nếu gặp vấn đề:

1. Kiểm tra console log (F12)
2. Đọc error message
3. Google error message + "vite" hoặc "three.js"

---

✨ **Chúc bạn thành công!** ✨
🎄 **Merry Christmas!** 🎄
