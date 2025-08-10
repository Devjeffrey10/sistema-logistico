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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MapPin,
  User,
  FileText,
  Package,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function SupplierManagement() {
  const {
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    toggleSupplierStatus,
    productTypes,
    addProductType,
    removeProductType,
  } = useProducts();

  const [activeTab, setActiveTab] = useState("suppliers");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddSupplierDialogOpen, setIsAddSupplierDialogOpen] = useState(false);
  const [isEditSupplierDialogOpen, setIsEditSupplierDialogOpen] =
    useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [newProductType, setNewProductType] = useState("");

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    cnpj: "",
    phone: "",
    email: "",
    address: "",
    contactPerson: "",
  });

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.cnpj.includes(searchTerm) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddSupplier = () => {
    if (
      !newSupplier.name ||
      !newSupplier.cnpj ||
      !newSupplier.phone ||
      !newSupplier.contactPerson
    ) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Check if CNPJ already exists
    if (suppliers.some((s) => s.cnpj === newSupplier.cnpj)) {
      toast({
        title: "Erro",
        description: "Este CNPJ já está cadastrado",
        variant: "destructive",
      });
      return;
    }

    addSupplier({
      ...newSupplier,
      status: "active",
    });

    setNewSupplier({
      name: "",
      cnpj: "",
      phone: "",
      email: "",
      address: "",
      contactPerson: "",
    });
    setIsAddSupplierDialogOpen(false);

    toast({
      title: "Sucesso",
      description: "Fornecedor cadastrado com sucesso",
    });
  };

  const handleEditSupplier = (supplier: any) => {
    setSelectedSupplier(supplier);
    setIsEditSupplierDialogOpen(true);
  };

  const handleUpdateSupplier = () => {
    if (selectedSupplier) {
      updateSupplier(selectedSupplier.id, selectedSupplier);
      setIsEditSupplierDialogOpen(false);
      setSelectedSupplier(null);

      toast({
        title: "Sucesso",
        description: "Fornecedor atualizado com sucesso",
      });
    }
  };

  const handleDeleteSupplier = (supplierId: string) => {
    deleteSupplier(supplierId);
    toast({
      title: "Sucesso",
      description: "Fornecedor removido com sucesso",
    });
  };

  const handleToggleSupplierStatus = (supplierId: string) => {
    toggleSupplierStatus(supplierId);
    const supplier = suppliers.find((s) => s.id === supplierId);
    const newStatus = supplier?.status === "active" ? "inativo" : "ativo";

    toast({
      title: "Status atualizado",
      description: `Fornecedor está agora ${newStatus}`,
    });
  };

  const handleAddProductType = () => {
    if (!newProductType.trim()) {
      toast({
        title: "Erro",
        description: "Digite um tipo de produto válido",
        variant: "destructive",
      });
      return;
    }

    if (productTypes.includes(newProductType.trim())) {
      toast({
        title: "Erro",
        description: "Este tipo de produto já existe",
        variant: "destructive",
      });
      return;
    }

    addProductType(newProductType.trim());
    setNewProductType("");

    toast({
      title: "Sucesso",
      description: "Tipo de produto adicionado com sucesso",
    });
  };

  const handleRemoveProductType = (productType: string) => {
    removeProductType(productType);
    toast({
      title: "Sucesso",
      description: "Tipo de produto removido com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Building className="h-8 w-8" />
            Gestão de Fornecedores
          </h1>
          <p className="text-muted-foreground">
            Cadastro e controle de fornecedores e tipos de produtos
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="suppliers" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Fornecedores
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Tipos de Produtos
          </TabsTrigger>
        </TabsList>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Fornecedores Cadastrados
                </CardTitle>

                <Dialog
                  open={isAddSupplierDialogOpen}
                  onOpenChange={setIsAddSupplierDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Cadastrar Fornecedor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Cadastrar Novo Fornecedor</DialogTitle>
                      <DialogDescription>
                        Preencha as informações do fornecedor
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome da Empresa *</Label>
                          <Input
                            id="name"
                            value={newSupplier.name}
                            onChange={(e) =>
                              setNewSupplier({
                                ...newSupplier,
                                name: e.target.value,
                              })
                            }
                            placeholder="Ex: Mineração ABC Ltda"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cnpj">CNPJ *</Label>
                          <Input
                            id="cnpj"
                            value={newSupplier.cnpj}
                            onChange={(e) =>
                              setNewSupplier({
                                ...newSupplier,
                                cnpj: e.target.value,
                              })
                            }
                            placeholder="12.345.678/0001-90"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone *</Label>
                          <Input
                            id="phone"
                            value={newSupplier.phone}
                            onChange={(e) =>
                              setNewSupplier({
                                ...newSupplier,
                                phone: e.target.value,
                              })
                            }
                            placeholder="(11) 3333-4444"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newSupplier.email}
                            onChange={(e) =>
                              setNewSupplier({
                                ...newSupplier,
                                email: e.target.value,
                              })
                            }
                            placeholder="contato@empresa.com.br"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">
                          Pessoa de Contato *
                        </Label>
                        <Input
                          id="contactPerson"
                          value={newSupplier.contactPerson}
                          onChange={(e) =>
                            setNewSupplier({
                              ...newSupplier,
                              contactPerson: e.target.value,
                            })
                          }
                          placeholder="Nome do responsável"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Endereço</Label>
                        <Textarea
                          id="address"
                          value={newSupplier.address}
                          onChange={(e) =>
                            setNewSupplier({
                              ...newSupplier,
                              address: e.target.value,
                            })
                          }
                          placeholder="Endereço completo da empresa"
                          rows={2}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddSupplierDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleAddSupplier}>Cadastrar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar fornecedor por nome, CNPJ ou contato..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>

            <CardContent>
              {filteredSuppliers.length === 0 ? (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {suppliers.length === 0
                      ? "Nenhum fornecedor cadastrado ainda"
                      : "Nenhum fornecedor encontrado"}
                  </p>
                  {suppliers.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Clique em "Cadastrar Fornecedor" para começar
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSuppliers.map((supplier) => (
                        <TableRow key={supplier.id}>
                          <TableCell>
                            <div className="font-medium">{supplier.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {supplier.cnpj}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {supplier.phone}
                              </div>
                              {supplier.email && (
                                <div className="text-sm flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {supplier.email}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {supplier.contactPerson}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                supplier.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {supplier.status === "active" ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {supplier.status === "active"
                                ? "Ativo"
                                : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditSupplier(supplier)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleToggleSupplierStatus(supplier.id)
                                }
                              >
                                {supplier.status === "active" ? (
                                  <XCircle className="h-3 w-3" />
                                ) : (
                                  <CheckCircle className="h-3 w-3" />
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDeleteSupplier(supplier.id)
                                }
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Product Types Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Tipos de Produtos
              </CardTitle>

              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar novo tipo de produto..."
                  value={newProductType}
                  onChange={(e) => setNewProductType(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleAddProductType()
                  }
                />
                <Button onClick={handleAddProductType}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {productTypes.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum tipo de produto cadastrado
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Digite um tipo de produto acima para começar
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {productTypes.map((productType, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <span className="font-medium">{productType}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveProductType(productType)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Supplier Dialog */}
      <Dialog
        open={isEditSupplierDialogOpen}
        onOpenChange={setIsEditSupplierDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Fornecedor</DialogTitle>
            <DialogDescription>
              Atualize as informações do fornecedor
            </DialogDescription>
          </DialogHeader>
          {selectedSupplier && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome da Empresa</Label>
                  <Input
                    id="edit-name"
                    value={selectedSupplier.name}
                    onChange={(e) =>
                      setSelectedSupplier({
                        ...selectedSupplier,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cnpj">CNPJ</Label>
                  <Input
                    id="edit-cnpj"
                    value={selectedSupplier.cnpj}
                    onChange={(e) =>
                      setSelectedSupplier({
                        ...selectedSupplier,
                        cnpj: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Telefone</Label>
                  <Input
                    id="edit-phone"
                    value={selectedSupplier.phone}
                    onChange={(e) =>
                      setSelectedSupplier({
                        ...selectedSupplier,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    value={selectedSupplier.email}
                    onChange={(e) =>
                      setSelectedSupplier({
                        ...selectedSupplier,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contactPerson">Pessoa de Contato</Label>
                <Input
                  id="edit-contactPerson"
                  value={selectedSupplier.contactPerson}
                  onChange={(e) =>
                    setSelectedSupplier({
                      ...selectedSupplier,
                      contactPerson: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Endereço</Label>
                <Textarea
                  id="edit-address"
                  value={selectedSupplier.address}
                  onChange={(e) =>
                    setSelectedSupplier({
                      ...selectedSupplier,
                      address: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditSupplierDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateSupplier}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
