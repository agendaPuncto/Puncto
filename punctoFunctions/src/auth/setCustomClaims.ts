import { https } from 'firebase-functions/v2';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import * as logger from 'firebase-functions/logger';

// Initialize Firebase Admin (only if not already initialized)
if (!getApps().length) {
  initializeApp();
}

const auth = getAuth();
const db = getFirestore();

interface SetCustomClaimsRequest {
  userId: string;
  platformAdmin?: boolean;
  businessRoles?: {
    [businessId: string]: 'owner' | 'manager' | 'professional';
  };
}

export const setCustomClaims = https.onCall<SetCustomClaimsRequest>(async (request) => {
  const { userId, platformAdmin, businessRoles } = request.data;

  // Verify caller is authenticated
  if (!request.auth) {
    throw new https.HttpsError('unauthenticated', 'Você deve estar autenticado para executar esta ação');
  }

  const callerId = request.auth.uid;
  const callerClaims = request.auth.token;

  logger.info(`setCustomClaims called by ${callerId} for user ${userId}`);

  try {
    // Get target user's current custom claims
    const targetUser = await auth.getUser(userId);
    const currentClaims = targetUser.customClaims || {};

    // Authorization checks
    if (platformAdmin !== undefined) {
      // Only super admins can set platformAdmin flag
      if (!callerClaims.platformAdmin) {
        throw new https.HttpsError(
          'permission-denied',
          'Apenas administradores da plataforma podem definir permissões de administrador'
        );
      }
    }

    if (businessRoles) {
      // Verify caller has permission to assign roles for each business
      for (const businessId of Object.keys(businessRoles)) {
        // Platform admins can assign any role
        if (callerClaims.platformAdmin) {
          continue;
        }

        // Business owners can assign roles for their business
        const callerBusinessRoles = (callerClaims.businessRoles as Record<string, string>) || {};
        if (callerBusinessRoles[businessId] !== 'owner') {
          throw new https.HttpsError(
            'permission-denied',
            `Você não tem permissão para atribuir funções para o negócio ${businessId}`
          );
        }
      }
    }

    // Prepare new custom claims
    const newClaims = {
      ...currentClaims,
      ...(platformAdmin !== undefined && { platformAdmin }),
      ...(businessRoles && { businessRoles: { ...(currentClaims.businessRoles || {}), ...businessRoles } }),
    };

    // Set custom claims
    await auth.setCustomUserClaims(userId, newClaims);

    // Update user document with new custom claims
    await db.collection('users').doc(userId).update({
      customClaims: newClaims,
      updatedAt: Timestamp.now(),
    });

    // Log the action to audit log
    await db.collection('auditLogs').add({
      timestamp: Timestamp.now(),
      userId: callerId,
      userEmail: request.auth.token.email || '',
      action: 'setCustomClaims',
      resource: 'user',
      resourceId: userId,
      details: {
        platformAdmin,
        businessRoles,
      },
    });

    logger.info(`Custom claims set successfully for user ${userId}`);

    return {
      success: true,
      message: 'Permissões atualizadas com sucesso',
    };
  } catch (error) {
    logger.error(`Error setting custom claims for user ${userId}:`, error);

    if (error instanceof https.HttpsError) {
      throw error;
    }

    throw new https.HttpsError('internal', 'Erro ao atualizar permissões');
  }
});
