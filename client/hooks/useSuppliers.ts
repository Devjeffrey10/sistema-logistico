import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
  contact_person: string;
  status: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
}

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSuppliers(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar fornecedores",
      );
    } finally {
      setLoading(false);
    }
  };

  const addSupplier = async (
    supplier: Omit<Supplier, "id" | "created_at" | "updated_at">,
  ) => {
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .insert([supplier])
        .select()
        .single();

      if (error) throw error;
      setSuppliers((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao adicionar fornecedor",
      );
      throw err;
    }
  };

  const updateSupplier = async (id: string, updates: Partial<Supplier>) => {
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      setSuppliers((prev) => prev.map((s) => (s.id === id ? data : s)));
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar fornecedor",
      );
      throw err;
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      const { error } = await supabase.from("suppliers").delete().eq("id", id);

      if (error) throw error;
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao excluir fornecedor",
      );
      throw err;
    }
  };

  useEffect(() => {
    fetchSuppliers();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel("suppliers")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "suppliers",
        },
        () => {
          fetchSuppliers();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    suppliers,
    loading,
    error,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    refetch: fetchSuppliers,
  };
}
