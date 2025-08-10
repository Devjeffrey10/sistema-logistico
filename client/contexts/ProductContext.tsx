import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
  contactPerson: string;
  status: "active" | "inactive";
  createdAt: string;
}

interface ProductEntry {
  id: string;
  date: string;
  productType: string;
  supplier: string;
  supplierName: string;
  tonnage: number;
  observations: string;
  hasImage: boolean;
  status: "received" | "pending" | "processing";
  createdAt: string;
}

interface ProductContextType {
  suppliers: Supplier[];
  entries: ProductEntry[];
  addSupplier: (supplierData: Omit<Supplier, "id" | "createdAt">) => void;
  updateSupplier: (id: string, supplierData: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  toggleSupplierStatus: (id: string) => void;
  addEntry: (
    entryData: Omit<ProductEntry, "id" | "createdAt" | "supplierName">,
  ) => void;
  updateEntry: (id: string, entryData: Partial<ProductEntry>) => void;
  deleteEntry: (id: string) => void;
  productTypes: string[];
  addProductType: (productType: string) => void;
  removeProductType: (productType: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Start with empty data - no demo content
const defaultSuppliers: Supplier[] = [];
const defaultEntries: ProductEntry[] = [];

// Default product types - can be customized by users
const defaultProductTypes = [
  "Areia",
  "Brita",
  "Grãos",
  "Cimento",
  "Pedra",
  "Cascalho",
  "Terra",
  "Cal",
  "Argila",
  "Seixo",
];

export function ProductProvider({ children }: { children: ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [entries, setEntries] = useState<ProductEntry[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);

  // Initialize suppliers from localStorage or use defaults
  useEffect(() => {
    const storedSuppliers = localStorage.getItem("app_suppliers");
    if (storedSuppliers) {
      try {
        setSuppliers(JSON.parse(storedSuppliers));
      } catch (error) {
        setSuppliers(defaultSuppliers);
        localStorage.setItem("app_suppliers", JSON.stringify(defaultSuppliers));
      }
    } else {
      setSuppliers(defaultSuppliers);
      localStorage.setItem("app_suppliers", JSON.stringify(defaultSuppliers));
    }
  }, []);

  // Initialize entries from localStorage or use defaults
  useEffect(() => {
    const storedEntries = localStorage.getItem("app_product_entries");
    if (storedEntries) {
      try {
        setEntries(JSON.parse(storedEntries));
      } catch (error) {
        setEntries(defaultEntries);
        localStorage.setItem(
          "app_product_entries",
          JSON.stringify(defaultEntries),
        );
      }
    } else {
      setEntries(defaultEntries);
      localStorage.setItem(
        "app_product_entries",
        JSON.stringify(defaultEntries),
      );
    }
  }, []);

  // Initialize product types from localStorage or use defaults
  useEffect(() => {
    const storedProductTypes = localStorage.getItem("app_product_types");
    if (storedProductTypes) {
      try {
        setProductTypes(JSON.parse(storedProductTypes));
      } catch (error) {
        setProductTypes(defaultProductTypes);
        localStorage.setItem(
          "app_product_types",
          JSON.stringify(defaultProductTypes),
        );
      }
    } else {
      setProductTypes(defaultProductTypes);
      localStorage.setItem(
        "app_product_types",
        JSON.stringify(defaultProductTypes),
      );
    }
  }, []);

  // Supplier management functions
  const addSupplier = (supplierData: Omit<Supplier, "id" | "createdAt">) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: (Math.max(...suppliers.map((s) => parseInt(s.id)), 0) + 1).toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updatedSuppliers = [...suppliers, newSupplier];
    setSuppliers(updatedSuppliers);
    localStorage.setItem("app_suppliers", JSON.stringify(updatedSuppliers));
  };

  const updateSupplier = (id: string, supplierData: Partial<Supplier>) => {
    const updatedSuppliers = suppliers.map((s) =>
      s.id === id ? { ...s, ...supplierData } : s,
    );
    setSuppliers(updatedSuppliers);
    localStorage.setItem("app_suppliers", JSON.stringify(updatedSuppliers));
  };

  const deleteSupplier = (id: string) => {
    const updatedSuppliers = suppliers.filter((s) => s.id !== id);
    setSuppliers(updatedSuppliers);
    localStorage.setItem("app_suppliers", JSON.stringify(updatedSuppliers));
  };

  const toggleSupplierStatus = (id: string) => {
    const updatedSuppliers = suppliers.map((s) =>
      s.id === id
        ? {
            ...s,
            status: s.status === "active" ? "inactive" : ("active" as const),
          }
        : s,
    );
    setSuppliers(updatedSuppliers);
    localStorage.setItem("app_suppliers", JSON.stringify(updatedSuppliers));
  };

  // Entry management functions
  const addEntry = (
    entryData: Omit<ProductEntry, "id" | "createdAt" | "supplierName">,
  ) => {
    const supplier = suppliers.find((s) => s.id === entryData.supplier);
    const newEntry: ProductEntry = {
      ...entryData,
      id: (Math.max(...entries.map((e) => parseInt(e.id)), 0) + 1).toString(),
      supplierName: supplier?.name || "",
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    localStorage.setItem("app_product_entries", JSON.stringify(updatedEntries));
  };

  const updateEntry = (id: string, entryData: Partial<ProductEntry>) => {
    const updatedEntries = entries.map((e) =>
      e.id === id ? { ...e, ...entryData } : e,
    );
    setEntries(updatedEntries);
    localStorage.setItem("app_product_entries", JSON.stringify(updatedEntries));
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter((e) => e.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem("app_product_entries", JSON.stringify(updatedEntries));
  };

  // Product type management functions
  const addProductType = (productType: string) => {
    if (!productTypes.includes(productType)) {
      const updatedProductTypes = [...productTypes, productType];
      setProductTypes(updatedProductTypes);
      localStorage.setItem(
        "app_product_types",
        JSON.stringify(updatedProductTypes),
      );
    }
  };

  const removeProductType = (productType: string) => {
    const updatedProductTypes = productTypes.filter((p) => p !== productType);
    setProductTypes(updatedProductTypes);
    localStorage.setItem(
      "app_product_types",
      JSON.stringify(updatedProductTypes),
    );
  };

  return (
    <ProductContext.Provider
      value={{
        suppliers,
        entries,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        toggleSupplierStatus,
        addEntry,
        updateEntry,
        deleteEntry,
        productTypes,
        addProductType,
        removeProductType,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
