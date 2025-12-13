/**
 * Client-side permission utilities for role-based access control
 */

import { User } from '@/types/user';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Check if user is a platform administrator
 */
export function isPlatformAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.customClaims?.platformAdmin === true;
}

/**
 * Get user's role for a specific business
 */
export function getBusinessRole(
  user: User | null,
  businessId: string
): 'owner' | 'manager' | 'professional' | null {
  if (!user) return null;
  return user.customClaims?.businessRoles?.[businessId] || null;
}

/**
 * Check if user is a business owner
 */
export function isBusinessOwner(user: User | null, businessId: string): boolean {
  return getBusinessRole(user, businessId) === 'owner';
}

/**
 * Check if user is business staff (any role)
 */
export function isBusinessStaff(user: User | null, businessId: string): boolean {
  const role = getBusinessRole(user, businessId);
  return role === 'owner' || role === 'manager' || role === 'professional';
}

/**
 * Check if user has a specific permission for a business
 *
 * @param user - Current user
 * @param businessId - Business ID to check permission for
 * @param permission - Permission name to check
 * @returns Promise<boolean> - True if user has permission
 */
export async function hasPermission(
  user: User | null,
  businessId: string,
  permission: string
): Promise<boolean> {
  if (!user) return false;

  // Platform admins have all permissions
  if (isPlatformAdmin(user)) return true;

  // Owners have all permissions
  if (isBusinessOwner(user, businessId)) return true;

  // For managers and professionals, check staff document permissions
  try {
    const staffDocRef = doc(db, 'businesses', businessId, 'staff', user.id);
    const staffDoc = await getDoc(staffDocRef);

    if (staffDoc.exists()) {
      const permissions = staffDoc.data().permissions || {};
      return permissions[permission] === true;
    }

    return false;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

/**
 * Check multiple permissions at once
 */
export async function hasAnyPermission(
  user: User | null,
  businessId: string,
  permissions: string[]
): Promise<boolean> {
  if (!user) return false;
  if (isPlatformAdmin(user) || isBusinessOwner(user, businessId)) return true;

  for (const permission of permissions) {
    if (await hasPermission(user, businessId, permission)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if user has all specified permissions
 */
export async function hasAllPermissions(
  user: User | null,
  businessId: string,
  permissions: string[]
): Promise<boolean> {
  if (!user) return false;
  if (isPlatformAdmin(user) || isBusinessOwner(user, businessId)) return true;

  for (const permission of permissions) {
    if (!(await hasPermission(user, businessId, permission))) {
      return false;
    }
  }

  return true;
}

// Permission presets for different roles

export const OWNER_PERMISSIONS = {
  manageServices: true,
  manageProfessionals: true,
  manageBookings: true,
  viewReports: true,
  manageSettings: true,
  manageLocations: true,
  exportData: true,
};

export const MANAGER_PERMISSIONS_DEFAULT = {
  manageServices: true,
  manageProfessionals: false,
  manageBookings: true,
  viewReports: true,
  manageSettings: false,
  manageLocations: false,
  exportData: false,
};

export const PROFESSIONAL_PERMISSIONS = {
  manageServices: false,
  manageProfessionals: false,
  manageBookings: false, // Read-only access
  viewReports: false,
  manageSettings: false,
  manageLocations: false,
  exportData: false,
};

/**
 * Get permission preset for a role
 */
export function getPermissionPreset(role: 'owner' | 'manager' | 'professional') {
  switch (role) {
    case 'owner':
      return OWNER_PERMISSIONS;
    case 'manager':
      return MANAGER_PERMISSIONS_DEFAULT;
    case 'professional':
      return PROFESSIONAL_PERMISSIONS;
    default:
      return PROFESSIONAL_PERMISSIONS;
  }
}

/**
 * Permission display names in Portuguese
 */
export const PERMISSION_LABELS: Record<string, string> = {
  manageServices: 'Gerenciar serviços',
  manageProfessionals: 'Gerenciar profissionais',
  manageBookings: 'Gerenciar agendamentos',
  viewReports: 'Ver relatórios',
  manageSettings: 'Gerenciar configurações',
  manageLocations: 'Gerenciar locais',
  exportData: 'Exportar dados',
};

/**
 * Role display names in Portuguese
 */
export const ROLE_LABELS: Record<string, string> = {
  owner: 'Proprietário',
  manager: 'Gerente',
  professional: 'Profissional',
  customer: 'Cliente',
  platform_admin: 'Administrador da Plataforma',
};
