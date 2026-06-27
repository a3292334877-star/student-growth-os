/**
 * AI Provider 适配层
 * 支持 OpenAI 和 DeepSeek，自动故障转移
 */

interface AIProviderConfig {
  name: string;
  apiKey: string;
  baseUrl: string;
  model: string;
  priority: number;
}

export interface AIResponse {
  content: string;
  model: string;
  provider: string;
}

const providers: AIProviderConfig[] = [
  {
    name: "openai",
    apiKey: process.env.OPENAI_API_KEY || "",
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4o",
    priority: 1,
  },
  {
    name: "deepseek",
    apiKey: process.env.DEEPSEEK_API_KEY || "",
    baseUrl: "https://api.deepseek.com/v1",
    model: "deepseek-chat",
    priority: 2,
  },
];

export class AIProvider {
  private activeProvider: AIProviderConfig | null = null;

  constructor() {
    // Sort by priority and find the first available
    const sorted = [...providers].sort((a, b) => a.priority - b.priority);
    for (const p of sorted) {
      if (p.apiKey) {
        this.activeProvider = p;
        break;
      }
    }
  }

  isAvailable(): boolean {
    return this.activeProvider !== null;
  }

  async generate(
    systemPrompt: string,
    userPrompt: string,
    options?: { temperature?: number; maxTokens?: number },
  ): Promise<AIResponse> {
    if (!this.activeProvider) {
      throw new Error("No AI provider available. Please configure API keys.");
    }

    const provider = this.activeProvider;
    const temperature = options?.temperature ?? 0.7;
    const maxTokens = options?.maxTokens ?? 4096;

    try {
      const response = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify({
          model: provider.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`AI API error (${provider.name}): ${error}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

      return {
        content,
        model: provider.model,
        provider: provider.name,
      };
    } catch (error) {
      console.error(`AI provider ${provider.name} failed:`, error);
      throw error;
    }
  }

  async generateJSON<T>(
    systemPrompt: string,
    userPrompt: string,
    options?: { temperature?: number },
  ): Promise<T> {
    const jsonPrompt = `${userPrompt}\n\n你必须以严格的 JSON 格式返回结果，不要包含任何其他内容。`;
    const result = await this.generate(systemPrompt, jsonPrompt, {
      ...options,
      temperature: options?.temperature ?? 0.3,
    });

    try {
      // Try to extract JSON if wrapped in markdown code blocks
      const jsonStr = result.content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      return JSON.parse(jsonStr) as T;
    } catch {
      throw new Error(
        `AI returned invalid JSON. Provider: ${result.provider}, Model: ${result.model}`,
      );
    }
  }
}

// Singleton
let aiInstance: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!aiInstance) {
    aiInstance = new AIProvider();
  }
  return aiInstance;
}
