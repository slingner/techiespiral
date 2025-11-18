import { useEffect } from 'react';
import { Tool, FeaturedComparison } from '../types/Tool';

interface ComparisonSEOProps {
  comparison?: FeaturedComparison;
  tool1: Tool;
  tool2: Tool;
}

// Generate structured data (JSON-LD) for search engines
export const ComparisonSEO = ({ comparison, tool1, tool2 }: ComparisonSEOProps) => {
  useEffect(() => {
    // Set page title
    const title = comparison?.title || `${tool1.tool_name} vs ${tool2.tool_name} - Comparison for Indie Hackers`;
    document.title = title;

    // Set meta description
    const metaDescription = comparison?.meta_description ||
      `Compare ${tool1.tool_name} vs ${tool2.tool_name}. Features, pricing, pros & cons to help indie developers choose the right tool.`;

    let metaTag = document.querySelector('meta[name="description"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'description');
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', metaDescription);

    // Generate structured data for FAQPage
    if (comparison?.faqs && comparison.faqs.length > 0) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': comparison.faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        }))
      };

      let faqScript = document.getElementById('faq-schema');
      if (!faqScript) {
        faqScript = document.createElement('script');
        faqScript.id = 'faq-schema';
        faqScript.type = 'application/ld+json';
        document.head.appendChild(faqScript);
      }
      faqScript.textContent = JSON.stringify(faqSchema);
    }

    // Generate structured data for comparison
    const comparisonSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': title,
      'description': metaDescription,
      'author': {
        '@type': 'Organization',
        'name': 'TechieSpiral'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'TechieSpiral',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://techiespiral.com/images/logo.png'
        }
      },
      'datePublished': comparison?.created_at || new Date().toISOString(),
      'dateModified': comparison?.updated_at || new Date().toISOString(),
      'mainEntity': {
        '@type': 'SoftwareApplication',
        'name': tool1.tool_name,
        'offers': {
          '@type': 'Offer',
          'price': tool1.price_range
        }
      }
    };

    let comparisonScript = document.getElementById('comparison-schema');
    if (!comparisonScript) {
      comparisonScript = document.createElement('script');
      comparisonScript.id = 'comparison-schema';
      comparisonScript.type = 'application/ld+json';
      document.head.appendChild(comparisonScript);
    }
    comparisonScript.textContent = JSON.stringify(comparisonSchema);

    // Cleanup on unmount
    return () => {
      const faqScript = document.getElementById('faq-schema');
      const compScript = document.getElementById('comparison-schema');
      if (faqScript) faqScript.remove();
      if (compScript) compScript.remove();
    };
  }, [comparison, tool1, tool2]);

  return null; // This component only manages SEO meta tags
};
