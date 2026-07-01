export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  tech: string[];
  image: string; // Base64 description or SVG representation
  githubUrl: string;
  liveUrl: string;
}

export interface Skill {
  name: string;
  level: number; // 0 to 100
  category: "frontend" | "backend" | "programming" | "tools";
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  type: "education" | "experience" | "milestone";
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  verificationUrl: string;
}

export interface Achievement {
  id: string;
  title: string;
  category: "Hackathon" | "Competition" | "Open Source" | "Leadership" | "College Events";
  description: string;
  iconName: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  avatar: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
