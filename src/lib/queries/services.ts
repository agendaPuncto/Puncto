import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Service } from '@/types/business';

/**
 * Fetch services for a business
 */
export function useServices(businessId: string, filters?: { active?: boolean }) {
  return useQuery({
    queryKey: ['services', businessId, filters],
    queryFn: async () => {
      const servicesRef = collection(db, 'businesses', businessId, 'services');
      let q: any = query(servicesRef);

      if (filters?.active !== undefined) {
        q = query(q, where('active', '==', filters.active));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
      })) as Service[];
    },
    enabled: !!businessId,
  });
}

/**
 * Fetch a single service
 */
export function useService(businessId: string, serviceId: string) {
  return useQuery({
    queryKey: ['service', businessId, serviceId],
    queryFn: async () => {
      const serviceRef = doc(db, 'businesses', businessId, 'services', serviceId);
      const snapshot = await getDoc(serviceRef);
      
      if (!snapshot.exists()) {
        throw new Error('Service not found');
      }

      const data = snapshot.data();
      return {
        id: snapshot.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      } as Service;
    },
    enabled: !!businessId && !!serviceId,
  });
}

/**
 * Create a new service
 */
export function useCreateService(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt' | 'businessId'>) => {
      const servicesRef = collection(db, 'businesses', businessId, 'services');
      
      const data = {
        ...serviceData,
        businessId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(servicesRef, data);
      return { id: docRef.id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', businessId] });
    },
  });
}

/**
 * Update a service
 */
export function useUpdateService(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, updates }: { serviceId: string; updates: Partial<Service> }) => {
      const serviceRef = doc(db, 'businesses', businessId, 'services', serviceId);
      
      await updateDoc(serviceRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });

      return { id: serviceId, ...updates };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['services', businessId] });
      queryClient.invalidateQueries({ queryKey: ['service', businessId, variables.serviceId] });
    },
  });
}
