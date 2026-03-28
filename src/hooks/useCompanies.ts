import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { API_BASE } from '../config/api';

export interface Company {
    id: string;
    unvan: string;
    tehlikeSinifi: 'Çok Tehlikeli' | 'Tehlikeli' | 'Az Tehlikeli';
    sgkSicilNo: string;
    calisanSayisi: number;
    isveren: string;
    isgUzmani: string;
    durum: 'Aktif' | 'Pasif';
    [key: string]: any;
}


export const useCompanies = () => {
    return useQuery<Company[]>({
        queryKey: ['companies'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/api/companies`);
            if (!res.ok) throw new Error('Firmalar yüklenemedi');
            return res.json();
        },
    });
};

export const useCompany = (id: string | undefined) => {
    return useQuery<Company>({
        queryKey: ['companies', id],
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/api/companies/${id}`);
            if (!res.ok) throw new Error('Firma detayları yüklenemedi');
            return res.json();
        },
        enabled: !!id,
    });
};

export const useDeleteCompany = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${API_BASE}/api/companies/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Firma silinemedi');
            return id;
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['companies'] });
            const previousCompanies = queryClient.getQueryData<Company[]>(['companies']);
            queryClient.setQueryData(['companies'], (old: Company[] | undefined) =>
                old?.filter((c) => c.id !== id)
            );
            return { previousCompanies };
        },
        onError: (err, _id, context) => {
            queryClient.setQueryData(['companies'], context?.previousCompanies);
            toast.error('Geri alma başarısız: ' + err.message);
        },
        onSuccess: () => {
            toast.success('Firma başarıyla silindi');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
        },
    });
};

export const useSuspendCompany = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${API_BASE}/api/companies/${id}/suspend`, { method: 'PUT' });
            if (!res.ok) throw new Error('Firma durumu güncellenemedi');
            return id;
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['companies'] });
            const previousCompanies = queryClient.getQueryData<Company[]>(['companies']);
            queryClient.setQueryData(['companies'], (old: Company[] | undefined) =>
                old?.map((c) =>
                    c.id === id ? { ...c, durum: c.durum === 'Aktif' ? 'Pasif' : 'Aktif' } : c
                )
            );
            return { previousCompanies };
        },
        onError: (err, _id, context) => {
            queryClient.setQueryData(['companies'], context?.previousCompanies);
            toast.error('Güncelleme başarısız: ' + err.message);
        },
        onSuccess: () => {
            toast.success('Firma durumu güncellendi');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
        },
    });
};
