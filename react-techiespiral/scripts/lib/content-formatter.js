export class ContentFormatter {
  static createSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  static formatFrontmatter(article) {
    const {
      title,
      description,
      keywords,
      publishedDate,
      category,
      toolNames,
      author = 'TechieSpiral',
      featured = false
    } = article;

    return `---
title: "${title}"
description: "${description}"
keywords: "${keywords}"
publishedDate: "${publishedDate}"
category: "${category}"
tools: ${JSON.stringify(toolNames)}
author: "${author}"
featured: ${featured}
---`;
  }

  static createMarkdownArticle(frontmatter, content) {
    return `${frontmatter}\n\n${content}`;
  }

  static extractDescription(content, maxLength = 160) {
    // Extract first paragraph or first maxLength characters
    const firstPara = content.split('\n\n')[0];
    const cleaned = firstPara
      .replace(/^#+\s+/, '') // Remove markdown headers
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links but keep text
      .trim();

    return cleaned.length > maxLength
      ? cleaned.substring(0, maxLength - 3) + '...'
      : cleaned;
  }

  static sanitizeMarkdown(content) {
    // Remove any potentially problematic content
    return content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags
      .replace(/```[a-z]*\n[\s\S]*?\n```/g, (match) => {
        // Ensure code blocks are properly formatted
        return match.trim();
      })
      .trim();
  }

  static validateArticle(article) {
    const required = ['title', 'content'];
    const errors = [];

    required.forEach(field => {
      if (!article[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Word count check
    const wordCount = article.content.split(/\s+/).length;
    if (wordCount < 2000) {
      errors.push(`Article too short: ${wordCount} words (minimum 2000)`);
    }
    if (wordCount > 4000) {
      errors.push(`Article too long: ${wordCount} words (maximum 4000)`);
    }

    // Section checks
    const requiredSections = [
      'Comparison Table',
      'Pros',
      'Cons',
      'FAQ',
      'Recommendation'
    ];

    requiredSections.forEach(section => {
      if (!article.content.includes(section)) {
        errors.push(`Missing required section: ${section}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      wordCount
    };
  }
}
