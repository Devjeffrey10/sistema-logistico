import { useState } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Package,
  Plus,
  Search,
  Camera,
  Calendar,
  Building,
  Weight,
  FileText,
  UserPlus,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ProductEntry() {
  const { suppliers, entries, addEntry, productTypes } = useProducts();
  const [activeTab, setActiveTab] = useState("register");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProduct, setFilterProduct] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");

  // Entry form state
  const [entryForm, setEntryForm] = useState({
    date: "",
    productType: "",
    supplier: "",
    tonnage: "",
    observations: "",
  });

  // Get active suppliers
  const activeSuppliers = suppliers.filter((s) => s.status === "active");

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProduct =
      !filterProduct ||
      filterProduct === "all" ||
      entry.productType === filterProduct;
    const matchesSupplier =
      !filterSupplier ||
      filterSupplier === "all" ||
      entry.supplier === filterSupplier;
    return matchesSearch && matchesProduct && matchesSupplier;
  });

  const totalTonnage = filteredEntries.reduce(
    (sum, entry) => sum + entry.tonnage,
    0,
  );
  const entriesWithImages = filteredEntries.filter(
    (entry) => entry.hasImage,
  ).length;

  const handleSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !entryForm.date ||
      !entryForm.productType ||
      !entryForm.supplier ||
      !entryForm.tonnage
    ) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    addEntry({
      date: entryForm.date,
      productType: entryForm.productType,
      supplier: entryForm.supplier,
      tonnage: parseFloat(entryForm.tonnage),
      observations: entryForm.observations,
      hasImage: false, // Placeholder for image functionality
      status: "received",
    });

    setEntryForm({
      date: "",
      productType: "",
      supplier: "",
      tonnage: "",
      observations: "",
    });

    toast({
      title: "Sucesso",
      description: "Entrada de produto registrada com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Package className="h-8 w-8" />
            Entrada de Produtos
          </h1>
          <p className="text-muted-foreground">
            Controle de cargas recebidas na transportadora
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Registrar Entrada
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Ver Registros
          </TabsTrigger>
        </TabsList>

        {/* Register Entry Tab */}
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Nova Entrada de Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitEntry} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entryDate">Data da Entrada *</Label>
                    <Input
                      id="entryDate"
                      type="date"
                      value={entryForm.date}
                      onChange={(e) =>
                        setEntryForm({ ...entryForm, date: e.target.value })
                      }
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productType">Tipo de Produto *</Label>
                    <Select
                      value={entryForm.productType}
                      onValueChange={(value) =>
                        setEntryForm({ ...entryForm, productType: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {productTypes.map((product) => (
                          <SelectItem key={product} value={product}>
                            {product}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supplier">Fornecedor *</Label>
                    <Select
                      value={entryForm.supplier}
                      onValueChange={(value) =>
                        setEntryForm({ ...entryForm, supplier: value })
                      }
                      required
                      disabled={activeSuppliers.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            activeSuppliers.length === 0
                              ? "Nenhum fornecedor cadastrado"
                              : "Selecione o fornecedor"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {activeSuppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {activeSuppliers.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Vá para "Gestão de Fornecedores" para cadastrar
                        fornecedores primeiro
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tonnage">Toneladas Recebidas *</Label>
                    <Input
                      id="tonnage"
                      type="number"
                      step="0.1"
                      placeholder="0,0"
                      value={entryForm.tonnage}
                      onChange={(e) =>
                        setEntryForm({ ...entryForm, tonnage: e.target.value })
                      }
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="entryImage">
                      Foto da Chegada (Opcional)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="entryImage"
                        type="file"
                        accept="image/*"
                        className="w-full"
                      />
                      <Button type="button" variant="outline" size="icon">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Foto opcional do caminhão no pátio da empresa
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entryObservations">Observações</Label>
                  <Textarea
                    id="entryObservations"
                    placeholder="Adicione observações sobre a carga recebida..."
                    value={entryForm.observations}
                    onChange={(e) =>
                      setEntryForm({
                        ...entryForm,
                        observations: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Registrar Entrada
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setEntryForm({
                        date: "",
                        productType: "",
                        supplier: "",
                        tonnage: "",
                        observations: "",
                      })
                    }
                  >
                    Limpar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* List Entries Tab */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Registros de Entrada</CardTitle>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="bg-primary/10 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {filteredEntries.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total de Entradas
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {totalTonnage}t
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total de Toneladas
                  </p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {entriesWithImages}
                  </p>
                  <p className="text-sm text-muted-foreground">Com Fotos</p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por produto ou fornecedor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterProduct} onValueChange={setFilterProduct}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filtrar por produto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os produtos</SelectItem>
                    {productTypes.map((product) => (
                      <SelectItem key={product} value={product}>
                        {product}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filterSupplier}
                  onValueChange={setFilterSupplier}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filtrar por fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os fornecedores</SelectItem>
                    {activeSuppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{entry.productType}</Badge>
                        {entry.hasImage && (
                          <Badge variant="outline" className="text-green-600">
                            <Camera className="h-3 w-3 mr-1" />
                            Com Foto
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ID: #{entry.id}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Data</p>
                          <p className="font-medium">
                            {new Date(entry.date).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Fornecedor
                          </p>
                          <p className="font-medium text-sm">
                            {entry.supplierName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Weight className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Toneladas
                          </p>
                          <p className="font-medium">{entry.tonnage}t</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Status
                          </p>
                          <p className="font-medium text-green-600">Recebido</p>
                        </div>
                      </div>
                    </div>

                    {entry.observations && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Observações:</span>{" "}
                          {entry.observations}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredEntries.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhuma entrada encontrada
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
