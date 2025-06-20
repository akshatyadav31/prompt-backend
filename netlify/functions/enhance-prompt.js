// // Netlify Function: enhance-prompt.js

// exports.handler = async (event, context) => {
//     // Enable CORS for production and local dev (if needed)
//     const headers = {
//         'Access-Control-Allow-Origin': '*', // Change to your deployed frontend domain!
//         'Access-Control-Allow-Headers': 'Content-Type',
//         'Access-Control-Allow-Methods': 'POST, OPTIONS'
//     };

//     // Handle CORS preflight
//     if (event.httpMethod === 'OPTIONS') {
//         return { statusCode: 200, headers, body: '' };
//     }

//     // Only allow POST
//     if (event.httpMethod !== 'POST') {
//         return {
//             statusCode: 405,
//             headers,
//             body: JSON.stringify({ error: 'Method not allowed' })
//         };
//     }

//     try {
//         const { input, method, parameters } = JSON.parse(event.body);

//         if (!input?.trim()) {
//             return {
//                 statusCode: 400,
//                 headers,
//                 body: JSON.stringify({ error: 'Input prompt is required' })
//             };
//         }

//         // API key should be set in Netlify environment variables (never in code)
//         const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
//         const OPENROUTER_MODEL = "deepseek/deepseek-r1-0528-qwen3-8b:free";
//         const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

//         // Map method to framework name
//         const frameworkMap = {
//             rsti: "RSTI",
//             tcrei: "TCREI",
//             tfcdc: "TFCDC"
//         };
//         const frameworks = [frameworkMap[method]];
//         const useCase = parameters.context || "General use case";

//         // Compose system prompt (keep this in sync with your client if you edit there)
//         const systemPrompt = `
// You are an expert prompt engineering assistant specializing in applying advanced frameworks to transform basic prompts into highly effective, structured prompts.

// Your expertise includes:
// - TCREI Framework (Task, Context, Resources, Evaluate, Iterate)
// - RSTI Framework (Revisit, Separate, Try different phrasing, Introduce constraints)
// - TFCDC Framework (Thinking, Frameworks, Checkpoints, Debugging, Context)

// TASK: Transform the user's basic prompt into a comprehensive, highly effective prompt that incorporates the detected frameworks: ${frameworks.join(", ")}.

// GUIDELINES:
// - Use Case: ${useCase}
// - Audience Level: ${parameters.audienceLevel || "General"}
// - Tone: ${parameters.tone || "Professional"}
// - Output Format: ${parameters.outputFormat || "Structured prompt"}
// - Target Length: ${parameters.wordLimit || 200} words

// FRAMEWORK APPLICATION:
// ${frameworks.includes('TCREI') ? `
// - TCREI: Structure the prompt with clear Task definition, Context setting, Resource requirements, Evaluation criteria, and Iteration guidelines.
// ` : ''}
// ${frameworks.includes('RSTI') ? `
// - RSTI: Apply micro-tuning with proven patterns, break complex instructions into clear segments, use precise phrasing, and introduce specific constraints.
// ` : ''}
// ${frameworks.includes('TFCDC') ? `
// - TFCDC: Include systematic thinking approach, framework selection rationale, checkpoint validation, debugging instructions, and comprehensive documentation.
// ` : ''}

// OUTPUT REQUIREMENTS:
// 1. Create a dramatically enhanced version that's 3-5x more detailed and specific
// 2. Include clear structure with sections and subsections
// 3. Add specific examples, constraints, and success criteria
// 4. Maintain the requested tone and format
// 5. Ensure the output guides toward ${parameters.outputFormat || "structured prompt"} structure
// 6. Include quality markers and evaluation criteria

// Transform the basic prompt into a professional-grade, comprehensive prompt that would produce significantly better AI responses.
// `;

//         const userPrompt = `Transform this basic prompt into a comprehensive, professional-grade prompt:

// "${input}"

// Target specifications:
// - Audience: ${parameters.audienceLevel || "General"} level
// - Tone: ${parameters.tone || "Professional"}
// - Format: ${parameters.outputFormat || "Structured prompt"}
// - Length: Approximately ${parameters.wordLimit || 200} words

// Provide only the enhanced prompt without any meta-commentary or explanations.`;

//         // Call OpenRouter API
//         const response = await fetch(OPENROUTER_URL, {
//             method: "POST",
//             headers: {
//                 "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
//                 "Content-Type": "application/json",
//                 "HTTP-Referer": "https://akshatyadav31.github.io/prompt-frontend/",
//                 "X-Title": "Prompt Enhancement Studio"
//             },
//             body: JSON.stringify({
//                 model: OPENROUTER_MODEL,
//                 messages: [
//                     { role: "system", content: systemPrompt.trim() },
//                     { role: "user", content: userPrompt.trim() }
//                 ],
//                 temperature: 0.7,
//                 max_tokens: 2000,
//                 top_p: 0.9
//             })
//         });

//         if (!response.ok) {
//             const errorData = await response.json().catch(() => ({}));
//             throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
//         }

//         const data = await response.json();
//         const enhancedContent = data.choices?.[0]?.message?.content;

//         if (!enhancedContent) {
//             throw new Error("No content received from OpenRouter API");
//         }

//         // Return the enhanced result
//         const result = {
//             original: input,
//             enhanced: enhancedContent.trim(),
//             suggestions: parseMethodologySteps(enhancedContent, method),
//             confidence: 0.9,
//             model: OPENROUTER_MODEL,
//             method: frameworkMap[method],
//             timestamp: new Date().toISOString()
//         };

//         return {
//             statusCode: 200,
//             headers,
//             body: JSON.stringify(result)
//         };

//     } catch (error) {
//         console.error('Function error:', error);
//         return {
//             statusCode: 500,
//             headers,
//             body: JSON.stringify({
//                 error: 'Internal server error',
//                 message: error.message
//             })
//         };
//     }
// };

// // Helper function to parse methodology steps out of the enhanced content
// function parseMethodologySteps(content, method) {
//     const steps = {
//         rsti: ['revisit', 'separate', 'try', 'introduce'],
//         tcrei: ['task', 'context', 'resources', 'evaluate', 'iterate'],
//         tfcdc: ['thinking', 'frameworks', 'checkpoints', 'debugging', 'context']
//     };
//     const methodSteps = steps[method] || [];
//     const suggestions = {};
//     methodSteps.forEach(step => {
//         const regex = new RegExp(`${step}[\\s\\-:]*([\\s\\S]+?)(\\n|$)`, "i");
//         const match = content.match(regex);



// Netlify Function: enhance-prompt.js

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*', // For production, set this to your frontend domain
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse incoming request
        let parsed;
        try {
            parsed = JSON.parse(event.body);
        } catch (err) {
            console.error('Invalid JSON in request body');
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid JSON in request body' })
            };
        }
        const { input, method, parameters } = parsed;

        if (!input?.trim()) {
            console.error('Missing input prompt');
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Input prompt is required' })
            };
        }

        // Environment variables
        const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
        const OPENROUTER_MODEL = "deepseek/deepseek-r1-0528:free";
        const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

        if (!OPENROUTER_API_KEY) {
            console.error('Missing OpenRouter API key');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Missing OpenRouter API key in environment variables' })
            };
        }

        // Framework mapping
        const frameworkMap = {
            rsti: "RSTI",
            tcrei: "TCREI",
            tfcdc: "TFCDC"
        };
        const frameworks = method && frameworkMap[method] ? [frameworkMap[method]] : [];
        const useCase = parameters?.context || "General use case";

        // Compose system prompt
        const systemPrompt = `
You are an expert prompt engineering assistant specializing in applying advanced frameworks to transform basic prompts into highly effective, structured prompts.

Your expertise includes:
- TCREI Framework (Task, Context, Resources, Evaluate, Iterate)
- RSTI Framework (Revisit, Separate, Try different phrasing, Introduce constraints)
- TFCDC Framework (Thinking, Frameworks, Checkpoints, Debugging, Context)

TASK: Transform the user's basic prompt into a comprehensive, highly effective prompt that incorporates the detected frameworks: ${frameworks.join(", ") || "None"}.

GUIDELINES:
- Use Case: ${useCase}
- Audience Level: ${parameters?.audienceLevel || "General"}
- Tone: ${parameters?.tone || "Professional"}
- Output Format: ${parameters?.outputFormat || "Structured prompt"}
- Target Length: ${parameters?.wordLimit || 200} words

FRAMEWORK APPLICATION:
${frameworks.includes('TCREI') ? `
- TCREI: Structure the prompt with clear Task definition, Context setting, Resource requirements, Evaluation criteria, and Iteration guidelines.
` : ''}
${frameworks.includes('RSTI') ? `
- RSTI: Apply micro-tuning with proven patterns, break complex instructions into clear segments, use precise phrasing, and introduce specific constraints.
` : ''}
${frameworks.includes('TFCDC') ? `
- TFCDC: Include systematic thinking approach, framework selection rationale, checkpoint validation, debugging instructions, and comprehensive documentation.
` : ''}

OUTPUT REQUIREMENTS:
1. Create a dramatically enhanced version that's 3-5x more detailed and specific
2. Include clear structure with sections and subsections
3. Add specific examples, constraints, and success criteria
4. Maintain the requested tone and format
5. Ensure the output guides toward ${parameters?.outputFormat || "structured prompt"} structure
6. Include quality markers and evaluation criteria

Transform the basic prompt into a professional-grade, comprehensive prompt that would produce significantly better AI responses.
`.trim();

        // Compose user prompt
        const userPrompt = `Transform this basic prompt into a comprehensive, professional-grade prompt:

"${input}"

Target specifications:
- Audience: ${parameters?.audienceLevel || "General"} level
- Tone: ${parameters?.tone || "Professional"}
- Format: ${parameters?.outputFormat || "Structured prompt"}
- Length: Approximately ${parameters?.wordLimit || 200} words

Provide only the enhanced prompt without any meta-commentary or explanations.`;

        // Call OpenRouter API
        const fetch = globalThis.fetch || (await import('node-fetch')).default;
        const response = await fetch(OPENROUTER_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://akshatyadav31.github.io/prompt-frontend/",
                "X-Title": "Prompt Enhancement Studio"
            },
            body: JSON.stringify({
                model: OPENROUTER_MODEL,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 2000,
                top_p: 0.9
            })
        });

        if (!response.ok) {
            let errorMsg = response.statusText;
            try {
                const errorData = await response.json();
                if (errorData?.error?.message) errorMsg = errorData.error.message;
            } catch (e) { /* ignore */ }
            throw new Error(`OpenRouter API error: ${response.status} - ${errorMsg}`);
        }

        const data = await response.json();
        const enhancedContent = data.choices?.[0]?.message?.content;

        if (!enhancedContent) {
            throw new Error("No content received from OpenRouter API");
        }

        // Helper to extract framework steps, if present
        function parseMethodologySteps(content, method) {
            const steps = {
                rsti: ['revisit', 'separate', 'try', 'introduce'],
                tcrei: ['task', 'context', 'resources', 'evaluate', 'iterate'],
                tfcdc: ['thinking', 'frameworks', 'checkpoints', 'debugging', 'context']
            };
            const methodSteps = steps[method] || [];
            const suggestions = {};
            methodSteps.forEach(step => {
                const regex = new RegExp(`${step}[\\s\\-:]*([\\s\\S]+?)(\\n|$)`, "i");
                const match = content.match(regex);
                if (match && match[1]) {
                    suggestions[step] = match[1].trim();
                }
            });
            return suggestions;
        }

        const result = {
            original: input,
            enhanced: enhancedContent.trim(),
            suggestions: parseMethodologySteps(enhancedContent, method),
            confidence: 0.9,
            model: OPENROUTER_MODEL,
            method: frameworkMap[method],
            timestamp: new Date().toISOString()
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result)
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};
