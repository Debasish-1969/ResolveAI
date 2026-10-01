const prisma = require("../lib/prisma");

const createArticle = async (req, res) => {
    try {
        const { title, content, category } = req.body;

        if (!title || !content || !category) {
            return res.status(400).json({
                message: "Title, content and category are required"
            });
        }

        const article = await prisma.knowledgeArticle.create({
            data: {
                title,
                content,
                category
            }
        });

        return res.status(201).json({
            message: "Knowledge article created successfully",
            article
        });

    } catch (error) {
        console.error("Create article error:", error);

        return res.status(500).json({
            message: "Something went wrong while creating the article"
        });
    }
};

const getArticles = async (req, res) => {
    try {
        const articles = await prisma.knowledgeArticle.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.status(200).json({
            articles
        });

    } catch (error) {
        console.error("Get articles error:", error);

        return res.status(500).json({
            message: "Something went wrong while fetching articles"
        });
    }
};

module.exports = {
    createArticle,
    getArticles
};