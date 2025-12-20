import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  schema?: object;
}

export const SEO = ({
  title = 'TechieSpiral - Tech Stack Advisor for Indie Hackers',
  description = 'Curated tools and complete tech stacks for indie developers and bootstrapped founders. Scout-rated tools, budget-friendly picks, and proven tool combinations to build, ship, and grow.',
  image = '/images/logo.png',
  url = 'https://techiespiral.com',
  type = 'website',
  keywords = 'tech tools, indie hackers, tech stacks, developer tools, SaaS tools, bootstrapped founders, startup tools',
  schema,
}: SEOProps) => {
  const fullTitle = title.includes('TechieSpiral') ? title : `${title} | TechieSpiral`;
  const fullImageUrl = image.startsWith('http') ? image : `${url}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="TechieSpiral" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="TechieSpiral" />
      <link rel="canonical" href={url} />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};
