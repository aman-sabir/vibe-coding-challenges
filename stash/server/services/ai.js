const { VertexAI } = require('@google-cloud/vertexai');

// Initialize Vertex AI
// NOTE: Make sure GOOGLE_APPLICATION_CREDENTIALS is set or you are in an environment with default creds
const vertexAi = new VertexAI({
    project: process.env.GOOGLE_CLOUD_PROJECT || 'your-project-id',
    location: 'us-central1'
});

const model = vertexAi.preview.getGenerativeModel({
    model: 'gemini-2.5-pro',
    generation_config: {
        max_output_tokens: 2048,
        temperature: 0.2,
        top_p: 0.8,
        top_k: 40
    }
});

async function summarizeContent(title, content) {
    try {
        const prompt = `
            Task: Summarize the following article and generate relevant tags.
            
            Article Title: ${title}
            Article Content:
            ${content}
            
            Output Format (JSON):
            {
                "summary": "Concise summary of the article...",
                "tags": ["tag1", "tag2", "tag3"]
            }
        `;

        const request = {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        };

        const result = await model.generateContent(request);
        const response = result.response;
        const text = response.candidates[0].content.parts[0].text;

        // Attempt to parse JSON
        try {
            // Clean markdown code blocks if present
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);
        } catch (e) {
            console.error('Failed to parse AI response as JSON:', text);
            return {
                summary: text,
                tags: []
            };
        }

    } catch (error) {
        console.error('Vertex AI error:', error);
        // Fallback for demo/dev if AI fails
        return {
            summary: "AI Summarization unavailable.",
            tags: ["article"]
        };
    }
}

module.exports = { summarizeContent };
