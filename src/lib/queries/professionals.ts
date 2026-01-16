import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Professional } from '@/types/business';

/**
 * Fetch professionals for a business
 */
export function useProfessionals(businessId: string, filters?: { active?: boolean; canBookOnline?: boolean }) {
  return useQuery({
    queryKey: ['professionals', businessId, filters],
    queryFn: async () => {
      const professionalsRef = collection(db, 'businesses', businessId, 'professionals');
      let q: any = query(professionalsRef);

      if (filters?.active !== undefined) {
        q = query(q, where('active', '==', filters.active));
      }

      if (filters?.canBookOnline !== undefined) {
        q = query(q, where('canBookOnline', '==', filters.canBookOnline));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
      })) as Professional[];
    },
    enabled: !!businessId,
  });
}

/**
 * Fetch a single professional
 */
export function useProfessional(businessId: string, professionalId: string) {
  return useQuery({
    queryKey: ['professional', businessId, professionalId],
    queryFn: async () => {
      const professionalRef = doc(db, 'businesses', businessId, 'professionals', professionalId);
      const snapshot = await getDoc(professionalRef);
      
      if (!snapshot.exists()) {
        throw new Error('Professional not found');
      }

      const data = snapshot.data();
      return {
        id: snapshot.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      } as Professional;
    },
    enabled: !!businessId && !!professionalId,
  });
}

/**
 * Create a new professional
 */
export function useCreateProfessional(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (professionalData: Omit<Professional, 'id' | 'createdAt' | 'updatedAt' | 'businessId'>) => {
      const professionalsRef = collection(db, 'businesses', businessId, 'professionals');
      
      const data = {
        ...professionalData,
        businessId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(professionalsRef, data);
      return { id: docRef.id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professionals', businessId] });
    },
  });
}

/**
 * Update a professional
 */
export function useUpdateProfessional(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ professionalId, updates }: { professionalId: string; updates: Partial<Professional> }) => {
      const professionalRef = doc(db, 'businesses', businessId, 'professionals', professionalId);
      
      await updateDoc(professionalRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });

      return { id: professionalId, ...updates };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['professionals', businessId] });
      queryClient.invalidateQueries({ queryKey: ['professional', businessId, variables.professionalId] });
    },
  });
}
