import { Tool } from '../types/Tool';

export const mockTools: Tool[] = [
  {
    Id: 1,
    tool_name: "GitHub",
    category: "Developer Tools",
    description: "World's leading software development platform with Git version control",
    long_description: "GitHub is a development platform inspired by the way you work. From open source to business, you can host and review code, manage projects, and build software alongside 50 million developers.",
    price_range: "Free - $21/month",
    website_url: "https://github.com",
    affiliate_link: "https://github.com",
    logo_url: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    features: "Git repositories, Issue tracking, Pull requests, Actions CI/CD, Code review",
    pros_cons: "PROS: Free for public repos, excellent collaboration tools, huge ecosystem CONS: Can be complex for beginners, private repos require paid plans",
    use_cases: "Perfect for software development teams, open source projects, and code collaboration",
    best_for: "Developers",
    startup_stages: ['mvp', 'launched', 'scaling']
  },
  {
    Id: 2,
    tool_name: "Figma",
    category: "Design Tools",
    description: "Collaborative interface design tool for teams",
    long_description: "Figma is a vector graphics editor and prototyping tool which is primarily web-based, with additional offline features enabled by desktop applications.",
    price_range: "Free - $15/month",
    website_url: "https://figma.com",
    affiliate_link: "https://figma.com",
    features: "Vector design, Prototyping, Real-time collaboration, Component libraries, Developer handoff",
    pros_cons: "PROS: Real-time collaboration, cross-platform, great prototyping CONS: Requires internet connection, can be slow with large files",
    use_cases: "UI/UX design, prototyping, design systems, team collaboration",
    best_for: "Designers",
    startup_stages: ['validating', 'mvp', 'launched', 'scaling']
  },
  {
    Id: 3,
    tool_name: "Notion",
    category: "Project Management",
    description: "All-in-one workspace for notes, tasks, wikis, and databases",
    long_description: "Notion is a collaboration platform with modified Markdown support that integrates kanban boards, tasks, wikis and databases.",
    price_range: "Free - $10/month",
    website_url: "https://notion.so",
    affiliate_link: "https://notion.so",
    features: "Note-taking, Task management, Databases, Templates, Team collaboration",
    pros_cons: "PROS: Highly customizable, great for documentation, powerful database features CONS: Can be overwhelming, steep learning curve",
    use_cases: "Project management, documentation, note-taking, team wikis",
    best_for: "Teams",
    startup_stages: ['validating', 'mvp', 'launched', 'scaling']
  },
  {
    Id: 4,
    tool_name: "Slack",
    category: "Communication",
    description: "Business communication platform for teams",
    price_range: "Free - $12.50/month",
    website_url: "https://slack.com",
    affiliate_link: "https://slack.com",
    features: "Channels, Direct messaging, File sharing, App integrations, Video calls",
    pros_cons: "PROS: Great integrations, organized conversations, searchable history CONS: Can be noisy, expensive for large teams",
    use_cases: "Team communication, project coordination, remote work collaboration",
    best_for: "Teams",
    startup_stages: ['launched', 'scaling']
  }
];