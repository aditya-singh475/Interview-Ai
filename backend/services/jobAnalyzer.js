const analyzeJobDescriptionText = (jdText) => {
  const text = jdText || '';
  const textLower = text.toLowerCase();

  const techKeywords = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'Python', 'Django', 'FastAPI',
    'Java', 'Spring Boot', 'C++', 'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes',
    'AWS', 'GCP', 'Azure', 'Git', 'REST API', 'GraphQL', 'HTML', 'CSS', 'Tailwind', 'System Design', 'CI/CD'
  ];

  const matchedTech = techKeywords.filter(tech => {
    const regex = new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(text);
  });

  const requiredSkills = matchedTech.slice(0, Math.ceil(matchedTech.length * 0.6));
  const preferredSkills = matchedTech.slice(Math.ceil(matchedTech.length * 0.6));

  // Determine Role title
  let detectedRole = 'Full Stack Developer';
  if (textLower.includes('frontend') || textLower.includes('react developer')) detectedRole = 'Frontend Developer';
  else if (textLower.includes('backend') || textLower.includes('node')) detectedRole = 'Backend Developer';
  else if (textLower.includes('data analyst')) detectedRole = 'Data Analyst';
  else if (textLower.includes('devops')) detectedRole = 'DevOps Engineer';
  else if (textLower.includes('qa') || textLower.includes('tester')) detectedRole = 'QA Engineer';

  return {
    role: detectedRole,
    responsibilities: [
      'Design, develop, and maintain high performance applications',
      'Collaborate with cross-functional teams to define feature specs',
      'Optimize codebase for performance, security, and scalability'
    ],
    requiredSkills: requiredSkills.length > 0 ? requiredSkills : ['JavaScript', 'REST APIs', 'SQL'],
    preferredSkills: preferredSkills.length > 0 ? preferredSkills : ['Docker', 'Redis', 'AWS'],
    technologies: matchedTech.length > 0 ? matchedTech : ['JavaScript', 'Node.js', 'React', 'SQL'],
    experienceYears: textLower.includes('senior') || textLower.includes('5+') ? '5+ Years' : '2-4 Years',
    domain: textLower.includes('fintech') ? 'Fintech' : textLower.includes('e-commerce') ? 'E-Commerce' : 'SaaS / Software'
  };
};

module.exports = {
  analyzeJobDescriptionText
};
