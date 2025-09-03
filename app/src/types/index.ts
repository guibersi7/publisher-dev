// Tipos para navegação
export interface NavItem {
  path: string;
  label: string;
  icon?: string;
}

// Tipos para páginas
export interface PageProps {
  title?: string;
  children?: React.ReactNode;
}

// Tipos para o dashboard
export interface DashboardStats {
  contentPublished: number;
  activeUsers: number;
  totalViews: number;
}

// Tipos para usuários
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
}

// Tipos para conteúdo
export interface Content {
  id: string;
  title: string;
  body: string;
  author: string;
  publishedAt: Date;
  status: "draft" | "published" | "archived";
}
