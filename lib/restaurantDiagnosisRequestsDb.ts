import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin';

const DELETE_BATCH = 200;

export async function deleteRestaurantDiagnosisRequestsByIds(ids: string[]): Promise<{
  deleted: number;
  error?: string;
}> {
  const unique = [...new Set(ids.map((id) => id.trim()).filter(Boolean))];
  if (unique.length === 0) return { deleted: 0 };
  if (!isSupabaseConfigured()) {
    return { deleted: 0, error: 'Supabase が未設定です' };
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { deleted: 0, error: 'Supabase が未設定です' };
  }

  let deleted = 0;
  for (let i = 0; i < unique.length; i += DELETE_BATCH) {
    const slice = unique.slice(i, i + DELETE_BATCH);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('restaurant_diagnosis_requests')
      .delete()
      .in('id', slice)
      .select('id');
    if (error) {
      console.error('deleteRestaurantDiagnosisRequestsByIds:', error);
      return { deleted, error: 'データベースからの削除に失敗しました' };
    }
    deleted += (data as { id: string }[] | null)?.length ?? 0;
  }
  return { deleted };
}
