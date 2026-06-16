'use client';

export function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://kswtechzone.com/#website',
        url: 'https://kswtechzone.com',
        name: 'KSW TechZone',
        alternateName: 'KSW TechZone Nepal',
        description:
          'KSW TechZone is a Nepal-based technology company specializing in custom software development, web applications, mobile apps, SaaS, AI solutions, and digital marketing. Best software services in Kathmandu, Nepal.',
        inLanguage: 'en-US',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://kswtechzone.com/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://kswtechzone.com/#organization',
        name: 'KSW TechZone',
        url: 'https://kswtechzone.com',
        logo: 'https://kswtechzone.com/logo.png',
        description:
          'A Nepal-based technology company delivering enterprise-grade software solutions including web development, mobile apps, SaaS, and AI for businesses worldwide.',
        foundingDate: '2020',
        foundingLocation: {
          '@type': 'Place',
          name: 'Kathmandu, Nepal',
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Kathmandu',
          addressLocality: 'Kathmandu',
          addressCountry: 'NP',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+977-9863198323',
          contactType: 'customer service',
          email: 'kswtechzone@gmail.com',
        },
        sameAs: [
          'https://www.facebook.com/kswtechzone',
          'https://www.linkedin.com/company/kswtechzone',
          'https://twitter.com/kswtechzone',
          'https://www.instagram.com/kswtechzone',
        ],
        keywords: [
          'KSW TechZone',
          'best software company in Nepal',
          'web development Nepal',
          'mobile app development Kathmandu',
          'SaaS development Nepal',
          'digital marketing agency Nepal',
          'AI solutions Nepal',
          'cloud computing Kathmandu',
          'custom software development Nepal',
          'IT services Nepal',
          'software company Kathmandu',
          'tech services Nepal',
          'KSW TechZone services',
          'affordable web development Nepal',
          'enterprise software Nepal',
        ],
        offers: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Software Development',
              description:
                'Custom software development services in Nepal — build scalable enterprise applications, ERP, CRM, and POS systems for your business.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Web Development',
              description:
                'Professional web development company in Nepal offering responsive websites, e-commerce platforms, and web applications using modern frameworks.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Mobile App Development',
              description:
                'iOS and Android mobile app development services by KSW TechZone — from MVPs to full-scale enterprise mobile solutions.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'SaaS Development',
              description:
                'End-to-end SaaS platform development in Nepal — multi-tenant architecture, subscription billing, and cloud-native applications.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Digital Marketing',
              description:
                'Digital marketing agency services in Nepal — SEO, SEM, social media marketing, content strategy, and paid advertising campaigns.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'AI Solutions',
              description:
                'AI and machine learning development services including chatbots, predictive analytics, computer vision, and intelligent automation.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Cloud Solutions',
              description:
                'Cloud infrastructure and DevOps consulting in Nepal — AWS, Azure, GCP migration, CI/CD pipelines, and cloud-native architecture.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'UI UX Design',
              description:
                'Professional UI UX design services — wireframing, prototyping, user research, and interface design for web and mobile applications.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'E-commerce Development',
              description:
                'E-commerce website development in Nepal — custom online stores, payment gateway integration, and marketplace platforms.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'IT Consulting',
              description:
                'IT consulting services in Nepal — technology strategy, digital transformation, architecture design, and technical due diligence.',
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
