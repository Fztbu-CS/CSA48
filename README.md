<p align="center">
  <img src="./public/pig.svg" alt="猪猪" width="128" />
</p>

# ！猪猪？！
> ？！者者！？

基于 **Astro 5 + TailwindCSS** 。

## 猪运行.......
```bash
pnpm install
pnpm dev
```
---

## 猪管理.......
```bash
pnpm admin
```

## 猪部署

1. **创建 GitHub 仓库并推送代码**：
   ```bash
   git init
   git add .
   git commit -m "feat: init shame leaderboard"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/<你的仓库名>.git
   git push -u origin main
   ```

2. **启用 GitHub Pages**：
   - 打开 GitHub 仓库页面，点击 **Settings** (设置) -> **Pages**。
   - 在 **Build and deployment** 下方的 **Source** 下拉菜单中，选择 **GitHub Actions**。
   - 保存即可！

3. **查看发布站点**：
   - 每次向 `main` 分支提交代码或合并 PR，GitHub Actions 将全自动编译并发布。
   - 部署完成后，在 Pages 页面即可看到你的访问链接（如 `https://<用户名>.github.io/<仓库名>/`）。
