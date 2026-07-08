import type { AuthUser } from './auth';

export type UserRole = AuthUser['role'];

export const canCreate = (role?: UserRole): boolean =>
  role === 'admin' || role === 'operator';

export const canEdit = (role?: UserRole): boolean =>
  role === 'admin' || role === 'operator';

export const canDelete = (role?: UserRole): boolean =>
  role === 'admin';

export const getRoleBadgeStyle = (role?: UserRole): { label: string; color: string; bg: string; border: string } => {
  switch (role) {
    case 'admin':
      return { label: 'Admin', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)' };
    case 'operator':
      return { label: 'Operator', color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.12)', border: 'rgba(34, 211, 238, 0.3)' };
    case 'viewer':
      return { label: 'Viewer', color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.12)', border: 'rgba(167, 139, 250, 0.3)' };
    default:
      return { label: 'Unknown', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', border: 'rgba(148, 163, 184, 0.2)' };
  }
};
