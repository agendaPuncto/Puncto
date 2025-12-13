import { https } from 'firebase-functions/v2';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import * as logger from 'firebase-functions/logger';
import { randomUUID } from 'crypto';

// Initialize Firebase Admin (only if not already initialized)
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

interface StaffPermissions {
  manageServices: boolean;
  manageProfessionals: boolean;
  manageBookings: boolean;
  viewReports: boolean;
  manageSettings: boolean;
  manageLocations: boolean;
  exportData: boolean;
}

interface InviteStaffRequest {
  businessId: string;
  email: string;
  role: 'owner' | 'manager' | 'professional';
  permissions?: StaffPermissions;
  professionalId?: string;
}

export const inviteStaff = https.onCall<InviteStaffRequest>(async (request) => {
  const { businessId, email, role, permissions, professionalId } = request.data;

  // Verify caller is authenticated
  if (!request.auth) {
    throw new https.HttpsError('unauthenticated', 'Você deve estar autenticado para convidar funcionários');
  }

  const callerId = request.auth.uid;
  const callerClaims = request.auth.token;

  logger.info(`inviteStaff called by ${callerId} for business ${businessId}`);

  try {
    // Authorization check: Only business owners or platform admins can invite staff
    const callerBusinessRoles = (callerClaims.businessRoles as Record<string, string>) || {};
    const isOwner = callerBusinessRoles[businessId] === 'owner';
    const isPlatformAdmin = callerClaims.platformAdmin === true;

    if (!isOwner && !isPlatformAdmin) {
      throw new https.HttpsError(
        'permission-denied',
        'Apenas proprietários podem convidar funcionários'
      );
    }

    // Validate business exists
    const businessDoc = await db.collection('businesses').doc(businessId).get();
    if (!businessDoc.exists) {
      throw new https.HttpsError('not-found', 'Negócio não encontrado');
    }

    // Validate permissions are provided for managers
    if (role === 'manager' && !permissions) {
      throw new https.HttpsError(
        'invalid-argument',
        'Permissões devem ser especificadas para gerentes'
      );
    }

    // Generate unique invite token
    const inviteToken = randomUUID();

    // Calculate expiration date (7 days from now)
    const expiresAt = Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

    // Create staff invite document
    const inviteData = {
      businessId,
      email: email.toLowerCase(),
      role,
      permissions: permissions || null,
      professionalId: professionalId || null,
      inviteToken,
      invitedBy: callerId,
      invitedAt: Timestamp.now(),
      expiresAt,
      status: 'pending',
    };

    const inviteRef = await db
      .collection('businesses')
      .doc(businessId)
      .collection('staffInvites')
      .add(inviteData);

    logger.info(`Staff invite created: ${inviteRef.id}`);

    // TODO: Send invite email
    // For now, return the invite link that can be manually shared
    const inviteLink = `https://puncto.com.br/auth/accept-invite?token=${inviteToken}`;

    // Log the action
    await db.collection('auditLogs').add({
      timestamp: Timestamp.now(),
      userId: callerId,
      userEmail: request.auth.token.email || '',
      businessId,
      action: 'inviteStaff',
      resource: 'staffInvite',
      resourceId: inviteRef.id,
      details: {
        email,
        role,
      },
    });

    return {
      success: true,
      message: 'Convite enviado com sucesso',
      inviteId: inviteRef.id,
      inviteLink,
      inviteToken, // For development/testing
    };
  } catch (error) {
    logger.error(`Error inviting staff to business ${businessId}:`, error);

    if (error instanceof https.HttpsError) {
      throw error;
    }

    throw new https.HttpsError('internal', 'Erro ao enviar convite');
  }
});
