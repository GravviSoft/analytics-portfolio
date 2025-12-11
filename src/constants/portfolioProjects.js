const portfolioProjects = [
  {
    slug: 'youtube-market-intelligence',
    title: 'YouTube Market Intelligence',
    summary: 'Real-time analytics to spot low-saturation, high-revenue YouTube niches before they explode. Track performance and discover opportunities.',
    status: 'Live case study',
    badges: ['React', 'Node.js', 'PostgreSQL'],
    accent: 'blue',
    githubUrl: 'https://github.com/GravviSoft/youtube-market-intelligence',
    liveUrl: '', // To be updated with real URL
    overviewContent: {
      title: 'Understanding the YouTube Market',
      subtitle: 'Real-world context and problem-solving capabilities',
      sections: [
        {
          heading: 'What This Data Represents',
          content: 'This dashboard provides comprehensive market intelligence for YouTube creators, investors, and strategists. By analyzing thousands of channels across multiple niches, we identify opportunities, measure saturation, and predict revenue potential in real-time.'
        },
        {
          heading: 'The YouTube Market Dynamics',
          content: 'Like every market, YouTube has both supply and demand. If we talk about YouTube as a market for videos/content:',
          highlights: [
            { label: 'Supply', description: 'comes from creators - They supply videos (content) to the platform.' },
            { label: 'Demand', description: 'comes from viewers - They demand (want to watch) videos.' }
          ],
          callout: '🎯 This app is created to help creators and investors identify where there are gaps in supply and demand.'
        },
        {
          heading: 'The Window of Opportunity',
          content: 'New channels with high views (>100k) but low subscribers (<100k) signal emerging trends worth investing in—before competitors flood the market.',
          callout: '💰 The Early Mover Advantage: It is a very profitable game for those who can act early using real data to back up their investment. This dashboard identifies these high-potential opportunities before the market becomes saturated.',
          calloutType: 'success'
        },
        {
          heading: 'Real-World Problems This Solves',
          list: [
            { label: 'For Creators', description: 'Identify untapped niches with high revenue potential and low competition before entering the market' },
            { label: 'For Investors', description: 'Evaluate market saturation and growth trends to make informed decisions about channel acquisitions' },
            { label: 'For Strategists', description: 'Track emerging content formats and detect copycat trends to stay ahead of market shifts' },
            { label: 'For Researchers', description: 'Analyze supply-demand dynamics across niches to understand viewer preferences and content gaps' }
          ]
        }
      ]
    }
  },
  {
    slug: 'lead-factory-automation',
    title: 'Lead Factory Automation',
    summary: 'Automated lead sourcing, verification, and outreach workflows for B2B teams. Build high-quality prospect lists at scale with intelligent automation.',
    status: 'Automation',
    badges: ['React', 'Flask', 'PostgreSQL'],
    accent: 'teal',
    githubUrl: 'https://github.com/yourname/lead-factory-automation',
    liveUrl: '',
    overviewContent: {
      title: 'Automating Lead Generation at Scale',
      subtitle: 'Building an end-to-end lead sourcing and verification pipeline',
      sections: [
        {
          heading: 'The Challenge',
          content: 'B2B sales teams spend countless hours manually researching prospects, verifying contact information, and building outreach lists. This manual process is slow, error-prone, and doesn\'t scale.'
        },
        {
          heading: 'The Solution',
          content: 'This automated lead factory combines web scraping, data enrichment APIs, and intelligent verification to generate high-quality prospect lists on autopilot.',
          highlights: [
            { label: 'Sourcing', description: 'Automated scraping from multiple data sources including LinkedIn, company directories, and industry databases' },
            { label: 'Verification', description: 'Email validation, phone number verification, and company status checks to ensure data quality' }
          ]
        },
        {
          heading: 'Key Features',
          list: [
            { label: 'Multi-Source Scraping', description: 'Aggregate leads from 10+ different sources including job boards, professional networks, and business directories' },
            { label: 'Smart Deduplication', description: 'Fuzzy matching algorithms to identify and merge duplicate records across sources' },
            { label: 'Real-Time Enrichment', description: 'Automatic data enrichment using Clearbit, Hunter.io, and other APIs' },
            { label: 'Quality Scoring', description: 'ML-based lead scoring to prioritize high-intent prospects' }
          ]
        }
      ]
    }
  },
  {
    slug: 'outreach-orchestrator',
    title: 'Outreach Orchestrator',
    summary: 'Sequenced email and LinkedIn playbooks with deliverability monitoring and throttling. Optimize multi-channel engagement with adaptive campaigns.',
    status: 'In progress',
    badges: ['React', 'Node.js', 'MongoDB'],
    accent: 'purple',
    githubUrl: 'https://github.com/yourname/outreach-orchestrator',
    liveUrl: '',
    overviewContent: {
      title: 'Multi-Channel Outreach at Scale',
      subtitle: 'Orchestrating personalized campaigns across email and LinkedIn',
      sections: [
        {
          heading: 'Overview',
          content: 'This project demonstrates a sophisticated outreach automation system that manages multi-step sequences across email and LinkedIn while maintaining high deliverability and engagement rates.'
        }
      ]
    }
  },
  {
    slug: 'analytics-design-system',
    title: 'Analytics Design System',
    summary: 'Reusable chart primitives, cards, and page shells purpose-built for data products. Accelerate dashboard development with consistent theming.',
    status: 'UI system',
    badges: ['React', 'Flask', 'Chart.js'],
    accent: 'pink',
    githubUrl: 'https://github.com/yourname/analytics-design-system',
    liveUrl: '',
    overviewContent: {
      title: 'Building Consistent Data Experiences',
      subtitle: 'A component library designed for analytics dashboards',
      sections: [
        {
          heading: 'Overview',
          content: 'A comprehensive design system that provides reusable components, charts, and patterns for building professional analytics dashboards quickly and consistently.'
        }
      ]
    }
  },
  {
    slug: 'pipeline-forecasting',
    title: 'Pipeline Forecasting',
    summary: 'Monte Carlo revenue simulations with scenario planning for sales teams. Model pipeline outcomes and generate confidence intervals for forecasts.',
    status: 'Data science',
    badges: ['React', 'Node.js', 'PostgreSQL'],
    accent: 'amber',
    githubUrl: 'https://github.com/yourname/pipeline-forecasting',
    liveUrl: '',
    overviewContent: {
      title: 'Predictive Sales Analytics',
      subtitle: 'Using Monte Carlo simulations for revenue forecasting',
      sections: [
        {
          heading: 'Overview',
          content: 'Advanced forecasting tool that uses Monte Carlo simulations to predict revenue outcomes based on pipeline health, conversion rates, and deal velocity.'
        }
      ]
    }
  },
  {
    slug: 'growth-experiments',
    title: 'Growth Experiments Tracker',
    summary: 'Experiment backlog with impact scoring, success metrics, and reporting. Plan A/B tests, measure significance, and document learnings systematically.',
    status: 'Case study',
    badges: ['React', 'Flask', 'PostgreSQL'],
    accent: 'green',
    githubUrl: 'https://github.com/yourname/growth-experiments',
    liveUrl: '',
    overviewContent: {
      title: 'Data-Driven Growth Testing',
      subtitle: 'Managing and measuring growth experiments systematically',
      sections: [
        {
          heading: 'Overview',
          content: 'A framework for planning, executing, and analyzing growth experiments with built-in impact scoring and statistical significance testing.'
        }
      ]
    }
  },
  {
    slug: 'customer-insights',
    title: 'Customer Insights Hub',
    summary: 'Centralized customer interviews, notes, and sentiment tagging with quick filters. Surface patterns and actionable insights for product decisions.',
    status: 'Research',
    badges: ['React', 'Node.js', 'MongoDB'],
    accent: 'slate',
    githubUrl: 'https://github.com/yourname/customer-insights',
    liveUrl: '',
    overviewContent: {
      title: 'Centralizing Customer Research',
      subtitle: 'Making customer insights accessible and actionable',
      sections: [
        {
          heading: 'Overview',
          content: 'A centralized repository for customer research with AI-powered sentiment analysis and intelligent tagging to surface insights quickly.'
        }
      ]
    }
  },
  {
    slug: 'content-ideation',
    title: 'Content Ideation Copilot',
    summary: 'LLM-assisted topic ideation tuned for SEO and YouTube velocity. Generate content ideas and discover high-potential topics with AI assistance.',
    status: 'Prototype',
    badges: ['React', 'Flask', 'MongoDB'],
    accent: 'violet',
    githubUrl: 'https://github.com/yourname/content-ideation',
    liveUrl: '',
    overviewContent: {
      title: 'AI-Powered Content Planning',
      subtitle: 'Generating high-potential content ideas with LLMs',
      sections: [
        {
          heading: 'Overview',
          content: 'An AI copilot that generates content ideas optimized for search visibility and audience engagement using advanced language models.'
        }
      ]
    }
  },
  {
    slug: 'ops-command-center',
    title: 'Ops Command Center',
    summary: 'Operational metrics, alerting, and runbooks to keep teams on the same page. Monitor system health and respond to incidents with documentation.',
    status: 'Ops',
    badges: ['React', 'Node.js', 'PostgreSQL'],
    accent: 'orange',
    githubUrl: 'https://github.com/yourname/ops-command-center',
    liveUrl: '',
    overviewContent: {
      title: 'Operational Excellence Dashboard',
      subtitle: 'Real-time monitoring and incident management',
      sections: [
        {
          heading: 'Overview',
          content: 'A command center for operations teams featuring real-time metrics, intelligent alerting, and embedded runbooks for rapid incident response.'
        }
      ]
    }
  },
  {
    slug: 'data-quality-monitor',
    title: 'Data Quality Monitor',
    summary: 'Anomaly detection, freshness tracking, and quality gates across pipelines. Ensure data accuracy and timeliness with continuous monitoring.',
    status: 'Data reliability',
    badges: ['React', 'Flask', 'PostgreSQL'],
    accent: 'cyan',
    githubUrl: 'https://github.com/yourname/data-quality-monitor',
    liveUrl: '',
    overviewContent: {
      title: 'Ensuring Data Reliability',
      subtitle: 'Automated quality checks and anomaly detection',
      sections: [
        {
          heading: 'Overview',
          content: 'Comprehensive data quality monitoring system that tracks freshness, completeness, and accuracy across data pipelines with automated alerting.'
        }
      ]
    }
  },
  {
    slug: 'churn-prediction',
    title: 'Churn Prediction Sandbox',
    summary: 'Retention risk scoring with cohort analysis and recommended saves. Identify at-risk customers and implement targeted intervention campaigns.',
    status: 'ML',
    badges: ['React', 'Node.js', 'MongoDB'],
    accent: 'indigo',
    githubUrl: 'https://github.com/yourname/churn-prediction',
    liveUrl: '',
    overviewContent: {
      title: 'Predicting Customer Churn',
      subtitle: 'Machine learning for retention optimization',
      sections: [
        {
          heading: 'Overview',
          content: 'ML-powered churn prediction with cohort analysis and actionable intervention recommendations to improve customer retention.'
        }
      ]
    }
  },
  {
    slug: 'partner-ecosystem',
    title: 'Partner Ecosystem Portal',
    summary: 'Partner onboarding, attribution, and performance tracking in one view. Manage relationships and measure impact with comprehensive analytics.',
    status: 'Go-to-market',
    badges: ['React', 'Flask', 'MongoDB'],
    accent: 'yellow',
    githubUrl: 'https://github.com/yourname/partner-ecosystem',
    liveUrl: '',
    overviewContent: {
      title: 'Managing Partner Relationships',
      subtitle: 'End-to-end partner lifecycle management',
      sections: [
        {
          heading: 'Overview',
          content: 'A comprehensive portal for managing partner relationships from onboarding through performance tracking with attribution modeling.'
        }
      ]
    }
  }
];

export default portfolioProjects;


