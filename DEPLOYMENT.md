# 🎄 Hướng Dẫn Deploy GitHub Pages

## Step 1: Chuẩn Bị Repository GitHub

### 1.1 Tạo Repository Mới

1. Vào [GitHub.com](https://github.com)
2. Click vào **"+"** góc trên phải → **"New repository"**
3. Điền thông tin:
   - **Repository name**: `merry-christmas` (hoặc tên khác)
   - **Description**: "Interactive Christmas Hand Gesture Control"
   - **Public** (chọn public để deploy lên GitHub Pages)
   - Bỏ chọn "Initialize this repository with a README"
4. Click **"Create repository"**

### 1.2 Lấy URL Repository

Sau khi tạo, bạn sẽ thấy màn hình với URL như:

```
https://github.com/YOUR_USERNAME/merry-christmas.git
```

Lưu lại URL này để dùng ở bước sau.

---

## Step 2: Cấu Hình Vite Cho GitHub Pages

Mở file `vite.config.ts` và đảm bảo có cấu hình đúng:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/merry-christmas/", // ⚠️ Thay 'merry-christmas' bằng repository name của bạn
});
```

**Lưu ý**: Nếu repository tên là `merry-christmas`, thì `base` phải là `/merry-christmas/`

---

## Step 3: Build Project

Chạy lệnh để tạo production build:

```bash
npm run build
```

Sau khi chạy xong, sẽ tạo folder `dist/` chứa tất cả file cần deploy.

---

## Step 4: Khởi Tạo Git & Push Lên GitHub

### 4.1 Kiểm Tra Git Status

```bash
git status
```

### 4.2 Add Files & Commit

```bash
git add .
git commit -m "Initial commit: Christmas Hand Gesture Control"
```

### 4.3 Thêm Remote Repository

Thay `YOUR_USERNAME` và `REPO_NAME` với thông tin của bạn:

```bash
git remote add origin https://github.com/YOUR_USERNAME/merry-christmas.git
```

Nếu đã có remote, cập nhật:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/merry-christmas.git
```

### 4.4 Push Lên GitHub

```bash
git branch -M main
git push -u origin main
```

---

## Step 5: Deploy Lên GitHub Pages (Tùy Chọn A - Manual)

### 5.1 Copy Build Files

1. Sao chép tất cả file từ folder `dist/`
2. Tạo branch `gh-pages`:

```bash
git checkout --orphan gh-pages
```

3. Copy toàn bộ file từ `dist/`:

```bash
# Windows PowerShell
Copy-Item -Path "dist\*" -Destination "." -Recurse -Force

# hoặc Linux/Mac
cp -r dist/* .
```

4. Xóa folder `dist` và file không cần thiết:

```bash
git rm -r src node_modules public vite.config.ts tsconfig.json ...
git clean -fd
```

5. Commit và push:

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push -u origin gh-pages --force
```

---

## Step 5: Deploy Lên GitHub Pages (Tùy Chọn B - GitHub Actions - Nên Dùng)

### 5.1 Tạo GitHub Actions Workflow

Tạo folder `.github/workflows/` nếu chưa có:

```bash
mkdir -p .github/workflows
```

Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 5.2 Commit Workflow File

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

### 5.3 Enable GitHub Pages

1. Vào repository → **Settings**
2. Tìm **"Pages"** ở menu bên trái
3. Dưới **"Build and deployment"**:
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** (hoặc **main** nếu dùng Actions)
   - Folder: **/ (root)**
4. Click **Save**

---

## Step 6: Kiểm Tra Deployment

Sau 1-2 phút:

1. Vào **Settings** → **Pages**
2. Sẽ thấy dòng: "Your site is live at `https://YOUR_USERNAME.github.io/merry-christmas/`"
3. Click vào link để kiểm tra

---

## Step 7: Cập Nhật Code & Redeploy

Khi có thay đổi:

```bash
# Sửa code, sau đó:
git add .
git commit -m "Update: description của thay đổi"
git push origin main
```

**Nếu dùng GitHub Actions**: Tự động build & deploy
**Nếu dùng Manual**: Phải lặp lại Step 5

---

## 🐛 Troubleshooting

### Lỗi: "404 Not Found" khi vào website

- ✅ Kiểm tra `base` trong `vite.config.ts` đúng tên repository
- ✅ Kiểm tra branch `gh-pages` có files không
- ✅ Vào **Settings** → **Pages** kiểm tra source branch

### Lỗi: "Push rejected"

```bash
# Kéo changes từ remote trước
git pull origin main
# Sau đó push lại
git push origin main
```

### Camera/Assets không hoạt động

- ✅ Kiểm tra đường dẫn file trong code có đúng không
- ✅ Kiểm tra tất cả assets đã copy vào `public/` folder
- ✅ Kiểm tra import paths đúng

---

## 📝 Tóm Tắt Quick Commands

```bash
# Lần đầu tiên
git remote add origin https://github.com/YOUR_USERNAME/merry-christmas.git
git branch -M main
git push -u origin main

# Cập nhật code
git add .
git commit -m "Your message"
git push origin main

# Nếu manual deploy
git checkout gh-pages
# Copy file từ dist/
git add .
git commit -m "Deploy"
git push origin gh-pages --force
```

---

## ✅ Checklist

- [ ] Tạo GitHub repository
- [ ] Cấu hình `vite.config.ts` với đúng `base`
- [ ] Chạy `npm run build` thành công
- [ ] Push code lên `main` branch
- [ ] Enable GitHub Pages trong Settings
- [ ] Chờ 1-2 phút để deploy
- [ ] Kiểm tra website hoạt động
- [ ] Test camera & gesture control

---

**🎉 Xong! Website của bạn đã live trên GitHub Pages!**
