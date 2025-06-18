import { CampaignLLMOutput } from '../types/subscription';

export class LLMService {
  /**
   * Simulate an LLM call to tag and summarize a campaign description
   */
  public async analyzeCampaign(description: string): Promise<CampaignLLMOutput> {
    // Mocked logic: extract keywords and create a summary
    const tags = this.extractTags(description);
    const summary = this.summarize(description);
    return { tags, summary };
  }

  private extractTags(description: string): string[] {
    // Very basic keyword extraction for demo
    const keywords = ['disaster', 'relief', 'Nepal', 'education', 'health', 'children', 'emergency', 'food', 'water', 'shelter'];
    return keywords.filter(word => description.toLowerCase().includes(word.toLowerCase()));
  }

  private summarize(description: string): string {
    // Simple summary: first sentence or up to 80 chars
    const firstSentence = description.split('. ')[0];
    return firstSentence.length > 80 ? firstSentence.slice(0, 77) + '...' : firstSentence;
  }
} 