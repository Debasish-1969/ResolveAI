require("dotenv").config();

const express = require("express");
const prisma = require("./lib/prisma");
const authRoutes = require("./routes/auth.routes");
const authenticate = require("./middleware/auth.middleware");
const issueRoutes = require("./routes/issue.routes");
const commentRoutes = require("./routes/comment.routes");
// const requireAdmin = require("./middleware/admin.middleware");
const adminRoutes = require("./routes/admin.routes");
const articleRoutes = require("./routes/article.routes");
const assistantRoutes = require("./routes/assistant.routes");

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
    res.header(
      'Access-Control-Allow-Methods',
      'GET,POST,PATCH,PUT,DELETE,OPTIONS',
    )
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    )
  
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204)
    }
  
    next()
  })
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/issues", commentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/articles", articleRoutes);
app.use("/api/assistant", assistantRoutes);

app.get("/api/health", (req, res) => {
    res.json({ message: "ResolveAI backend is running" });
});
// app.get("/api/protected", authenticate, (req, res) => {
//     res.json({
//         message: "You accessed a protected route",
//         user: req.user
//     });
// });
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});