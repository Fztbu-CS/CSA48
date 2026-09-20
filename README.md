# 🤡 耻辱排行榜 (Hall of Shame / Goof Wall)

> 记录团队与大伙每一次啼笑皆非的犯蠢与社死瞬间，全自动加权排行，欢声笑语中见证大伙的成长与蜕变！

基于 **Astro 5 + TailwindCSS** 构建的现代化静态网站，开箱即用原生适配 **GitHub Pages** 自动化部署。

---

## ✨ 核心特性

- 🏆 **至尊颁奖台 (Top 3 Podium)**：前三名金银铜阶梯排位，专属皇冠与搞笑头衔（“榜首·蠢王”、“全员群手滑艺术家”）。
- 📊 **全员耻辱天梯榜 (Leaderboard)**：支持按**综合加权耻辱值**、**犯蠢总次数**、**最近作案时间**实时排序与模糊搜索。
- 📜 **翻车编年史 (Timeline / Feed)**：时间线长廊，分类过滤（代码爆破、社死现场、逆天发言、乌龙事故、生活迷糊）。
- 🗣️ **猪猪辩解与目击证人**：收录每一位嫌疑人的狡辩陈词与现场目击者。
- 🚨 **我要立案 / 自首登记**：
  - **本地即时试玩**：浏览器即时录入、撒花庆祝、榜单实时更新。
  - **一键导出 PR 数据**：自动格式化为标准 JSON 片段，直接提 PR 协同共建。
- 📈 **数据罗盘统计**：大盘分析、平均离谱星级、分类分布占比与高频翻车词云。
- 🚀 **GitHub Pages 0配置自适应**：自动识别仓库二级子路径（如 `/CSA48/`），静态资源永不丢失。

---

## 🛠️ 本地运行与开发

### 1. 安装依赖
```bash
pnpm install
```

### 2. 启动本地开发服务
```bash
pnpm dev
```
打开浏览器访问 [http://localhost:4321](http://localhost:4321) 即可预览。

### 3. 构建静态站点
```bash
pnpm build
```
编译产物位于 `dist/` 目录。

---

## 🚀 部署到 GitHub Pages

项目已内置 `.github/workflows/deploy.yml` 自动化部署工作流。

### 部署步骤：

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

---

## 📝 如何添加/修改案底数据

案底数据集中维护在 [`src/data/shameData.json`](./src/data/shameData.json) 中：

### 1. 登记人物档案 (`persons`):
```json
{
  "id": "zhangsan",
  "name": "张三",
  "nickname": "生产删库特种兵",
  "avatar": "💥",
  "bio": "“我以为那是测试环境……”",
  "joinedAt": "2024-01-10"
}
```

### 2. 添加犯蠢案底 (`incidents`):
```json
{
  "id": "inc-001",
  "personId": "zhangsan",
  "title": "生产数据库 Update 忘记带 WHERE 条件",
  "description": "周五下午执行 SQL 少选了 WHERE，把全库用户状态改为了已注销。",
  "date": "2024-11-08",
  "severity": 5,
  "category": "code",
  "witnesses": ["李四", "DBA老刘"],
  "defense": "这证明我的 UPDATE 语句性能非常好，0.3秒就执行完了！",
  "tags": ["生产事故", "SQL手滑", "周五诅咒"]
}
```

- **严重等级 (`severity`)**：`1` ~ `5`（1: 🍼 轻微尴尬, 3: 🤡 纯粹小丑, 5: 🚀 载入史册）
- **分类 (`category`)**：`code` (代码爆破) | `social` (社死现场) | `words` (逆天发言) | `work` (乌龙事故) | `life` (生活迷糊)

---

## 🤡 友情提示

> 本项目纯属娱乐，旨在活跃团队气氛。若有冒犯，请猪猪反思为何能做出如此离谱操作！
