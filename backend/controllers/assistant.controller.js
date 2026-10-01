const { InferenceClient } = require("@huggingface/inference");

const prisma = require("../lib/prisma");

const hf = new InferenceClient(process.env.HF_TOKEN);

const assistant = async (req, res) => {

    try {

        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                message: "Message is required"
            });
        }

        // Get knowledge-base articles
        const articles = await prisma.knowledgeArticle.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        // Build context from knowledge articles
        const knowledgeContext = articles
            .map((article) => {
                return `
Title: ${article.title}

Category: ${article.category}

Content: ${article.content}
`;
            })
            .join("\n");

        const systemPrompt = `
You are ResolveAI, an intelligent customer support assistant.

You can answer two types of questions:

1. ResolveAI / college support questions
2. General technical or general-knowledge questions

For ResolveAI-specific questions:

- Use the provided knowledge base as the primary source.
- Do not invent college-specific policies, procedures, rules, or facts.
- If the knowledge base does not contain enough information for a college-specific question, clearly say that the information is not available and recommend contacting the support team.

For general questions:

- You may answer using your general knowledge.
- You do not need to find the answer in the knowledge base.
- Give a clear and accurate explanation.
- If you are genuinely uncertain about a fact, say so rather than inventing information.

Important:

- Do not pretend that general knowledge is an official ResolveAI or college policy.
- Keep responses concise, helpful, and easy to understand.

Knowledge Base:

${knowledgeContext}
`;

        const response = await hf.chatCompletion({

            model: "openai/gpt-oss-120b:fastest",

            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: message.trim()
                }
            ],

            max_tokens: 300,
            temperature: 0.3
        });

        const answer = response.choices?.[0]?.message?.content;

        if (!answer) {
            return res.status(500).json({
                message: "AI did not return a response"
            });
        }

        return res.status(200).json({
            message: "Assistant request processed",
            answer,
            sources: articles.map((article) => ({
                id: article.id,
                title: article.title,
                category: article.category
            }))
        });

    } catch (error) {

        console.error("Assistant error:", error);

        return res.status(500).json({
            message: "Something went wrong while processing the assistant request"
        });
    }
};

module.exports = {
    assistant
};