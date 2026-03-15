import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { API_BASE } from '../config/api';

export interface Personnel {
    id: number;
    tc_no: string;
    first_name: string;
    last_name: string;
    job_title: string;
    company_id: number;
    is_active: boolean;
    [key: string]: any;
}


export const usePersonnelList = (companyId: string | undefined) => {
    return useQuery<Personnel[]>({
        queryKey: ['personnel', companyId],
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/companies/${companyId}/personnel`);
            if (!res.ok) throw new Error('Personel listesi yüklenemedi');
            return res.json();
        },
        enabled: !!companyId,
    });
};

export const useDeletePersonnel = (companyId: string | undefined) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`${API_BASE}/personnel/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Personel silinemedi');
            return id;
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['personnel', companyId] });
            const previousPersonnel = queryClient.getQueryData<Personnel[]>(['personnel', companyId]);
            queryClient.setQueryData(['personnel', companyId], (old: Personnel[] | undefined) =>
                old?.filter((p) => p.id !== id)
            );
            return { previousPersonnel };
        },
        onError: (err, _id, context) => {
            queryClient.setQueryData(['personnel', companyId], context?.previousPersonnel);
            toast.error('Silme başarısız: ' + err.message);
        },
        onSuccess: () => {
            toast.success('Personel başarıyla silindi');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['personnel', companyId] });
            queryClient.invalidateQueries({ queryKey: ['companies'] }); // employee count change
        },
    });
};

export const useBulkDeletePersonnel = (companyId: string | undefined) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ids: number[]) => {
            const res = await fetch(`${API_BASE}/personnel/bulk`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids }),
            });
            if (!res.ok) throw new Error('Toplu silme başarısız');
            return res.json();
        },
        onMutate: async (ids) => {
            await queryClient.cancelQueries({ queryKey: ['personnel', companyId] });
            const previousPersonnel = queryClient.getQueryData<Personnel[]>(['personnel', companyId]);
            queryClient.setQueryData(['personnel', companyId], (old: Personnel[] | undefined) =>
                old?.filter((p) => !ids.includes(p.id))
            );
            return { previousPersonnel };
        },
        onError: (err, _ids, context) => {
            queryClient.setQueryData(['personnel', companyId], context?.previousPersonnel);
            toast.error('Toplu silme başarısız: ' + err.message);
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Personeller başarıyla silindi');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['personnel', companyId] });
            queryClient.invalidateQueries({ queryKey: ['companies'] });
        },
    });
};

export const useBulkUploadPersonnel = (companyId: string | undefined) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await fetch(`${API_BASE}/companies/${companyId}/personnel/bulk-upload`, {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Yükleme başarısız');
            }
            return res.json();
        },
        onSuccess: (data) => {
            toast.success('Yükleme Tamamlandı', {
                description: `Başarıyla yüklenen: ${data.success_count} | Atlanan: ${data.error_count}`,
            });
            queryClient.invalidateQueries({ queryKey: ['personnel', companyId] });
            queryClient.invalidateQueries({ queryKey: ['companies'] });
        },
        onError: (err) => {
            toast.error('Hata: ' + err.message);
        },
    });
};
