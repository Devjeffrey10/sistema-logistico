import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface ProductEntry {
  id: string;
  entry_date: string;
  product_type: string;
  supplier_id: string;
  tonnage: number;
  observations?: string;
  has_image: boolean;
  status: "received" | "pending" | "processing";
  created_at?: string;
  updated_at?: string;
  // Joined data
  supplier?: {
    id: string;
    name: string;
  };
}

export function useProductEntries() {
  const [entries, setEntries] = useState<ProductEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("product_entries")
        .select(
          `
          *,
          supplier:suppliers(id, name)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar entradas de produtos",
      );
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (
    entry: Omit<ProductEntry, "id" | "created_at" | "updated_at" | "supplier">,
  ) => {
    try {
      const { data, error } = await supabase
        .from("product_entries")
        .insert([entry])
        .select(
          `
          *,
          supplier:suppliers(id, name)
        `,
        )
        .single();

      if (error) throw error;
      setEntries((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao adicionar entrada de produto",
      );
      throw err;
    }
  };

  const updateEntry = async (id: string, updates: Partial<ProductEntry>) => {
    try {
      const { data, error } = await supabase
        .from("product_entries")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select(
          `
          *,
          supplier:suppliers(id, name)
        `,
        )
        .single();

      if (error) throw error;
      setEntries((prev) => prev.map((e) => (e.id === id ? data : e)));
      return data;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao atualizar entrada de produto",
      );
      throw err;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from("product_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao excluir entrada de produto",
      );
      throw err;
    }
  };

  useEffect(() => {
    fetchEntries();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel("product_entries")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "product_entries",
        },
        () => {
          fetchEntries();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    entries,
    loading,
    error,
    addEntry,
    updateEntry,
    deleteEntry,
    refetch: fetchEntries,
  };
}
