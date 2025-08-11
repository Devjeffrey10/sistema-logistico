import { useState } from "react";
import { useVehicles } from "@/contexts/VehicleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Truck,
  User,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  Phone,
  CreditCard,
  Wrench,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function VehicleManagement() {
  const {
    drivers,
    vehicles,
    addDriver,
    updateDriver,
    deleteDriver,
    toggleDriverStatus,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    toggleVehicleStatus,
  } = useVehicles();

  const [activeTab, setActiveTab] = useState("drivers");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDriverDialogOpen, setIsAddDriverDialogOpen] = useState(false);
  const [isEditDriverDialogOpen, setIsEditDriverDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [isAddVehicleDialogOpen, setIsAddVehicleDialogOpen] = useState(false);
  const [isEditVehicleDialogOpen, setIsEditVehicleDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  const [newDriver, setNewDriver] = useState({
    name: "",
    cpf: "",
    phone: "",
    cnh: "",
    cnhCategory: "D",
    cnhExpiry: "",
  });

  const [newVehicle, setNewVehicle] = useState({
    plate: "",
    model: "",
    brand: "",
    year: "",
    capacity: "",
    fuelType: "diesel" as const,
  });

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.cpf.includes(searchTerm) ||
      driver.cnh.includes(searchTerm),
  );

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddDriver = () => {
    if (
      !newDriver.name ||
      !newDriver.cpf ||
      !newDriver.phone ||
      !newDriver.cnh ||
      !newDriver.cnhExpiry
    ) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    addDriver({
      ...newDriver,
      status: "active",
    });

    setNewDriver({
      name: "",
      cpf: "",
      phone: "",
      cnh: "",
      cnhCategory: "D",
      cnhExpiry: "",
    });
    setIsAddDriverDialogOpen(false);

    toast({
      title: "Sucesso",
      description: "Motorista cadastrado com sucesso",
    });
  };

  const handleAddVehicle = () => {
    if (
      !newVehicle.plate ||
      !newVehicle.model ||
      !newVehicle.brand ||
      !newVehicle.year
    ) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    addVehicle({
      ...newVehicle,
      status: "active",
    });

    setNewVehicle({
      plate: "",
      model: "",
      brand: "",
      year: "",
      capacity: "",
      fuelType: "diesel",
    });
    setIsAddVehicleDialogOpen(false);

    toast({
      title: "Sucesso",
      description: "Veículo cadastrado com sucesso",
    });
  };

  const handleEditDriver = (driver: any) => {
    setSelectedDriver(driver);
    setIsEditDriverDialogOpen(true);
  };

  const handleUpdateDriver = () => {
    if (selectedDriver) {
      updateDriver(selectedDriver.id, selectedDriver);
      setIsEditDriverDialogOpen(false);
      setSelectedDriver(null);

      toast({
        title: "Sucesso",
        description: "Motorista atualizado com sucesso",
      });
    }
  };

  const handleEditVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setIsEditVehicleDialogOpen(true);
  };

  const handleUpdateVehicle = () => {
    if (selectedVehicle) {
      updateVehicle(selectedVehicle.id, selectedVehicle);
      setIsEditVehicleDialogOpen(false);
      setSelectedVehicle(null);

      toast({
        title: "Sucesso",
        description: "Veículo atualizado com sucesso",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Truck className="h-8 w-8" />
            Gestão de Frota
          </h1>
          <p className="text-muted-foreground">
            Cadastro e controle de motoristas e veículos
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="drivers" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Motoristas
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Veículos
          </TabsTrigger>
        </TabsList>

        {/* Drivers Tab */}
        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Motoristas Cadastrados
                </CardTitle>

                <Dialog
                  open={isAddDriverDialogOpen}
                  onOpenChange={setIsAddDriverDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Cadastrar Motorista
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Cadastrar Novo Motorista</DialogTitle>
                      <DialogDescription>
                        Preencha as informações do motorista
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome Completo *</Label>
                          <Input
                            id="name"
                            value={newDriver.name}
                            onChange={(e) =>
                              setNewDriver({
                                ...newDriver,
                                name: e.target.value,
                              })
                            }
                            placeholder="Digite o nome completo"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cpf">CPF *</Label>
                          <Input
                            id="cpf"
                            value={newDriver.cpf}
                            onChange={(e) =>
                              setNewDriver({
                                ...newDriver,
                                cpf: e.target.value,
                              })
                            }
                            placeholder="000.000.000-00"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone *</Label>
                          <Input
                            id="phone"
                            value={newDriver.phone}
                            onChange={(e) =>
                              setNewDriver({
                                ...newDriver,
                                phone: e.target.value,
                              })
                            }
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cnh">CNH *</Label>
                          <Input
                            id="cnh"
                            value={newDriver.cnh}
                            onChange={(e) =>
                              setNewDriver({
                                ...newDriver,
                                cnh: e.target.value,
                              })
                            }
                            placeholder="00000000000"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cnhCategory">Categoria CNH *</Label>
                          <Select
                            value={newDriver.cnhCategory}
                            onValueChange={(value) =>
                              setNewDriver({ ...newDriver, cnhCategory: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="D">D - Caminhão</SelectItem>
                              <SelectItem value="E">E - Carreta</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cnhExpiry">Vencimento CNH *</Label>
                          <Input
                            id="cnhExpiry"
                            type="date"
                            value={newDriver.cnhExpiry}
                            onChange={(e) =>
                              setNewDriver({
                                ...newDriver,
                                cnhExpiry: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDriverDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleAddDriver}>Cadastrar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar motorista por nome, CPF ou CNH..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>

            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Motorista</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>CNH</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>
                          <div className="font-medium">{driver.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <CreditCard className="h-3 w-3" />
                            {driver.cpf}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {driver.phone}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline">
                              {driver.cnhCategory}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              Vence:{" "}
                              {new Date(driver.cnhExpiry).toLocaleDateString(
                                "pt-BR",
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              driver.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {driver.status === "active" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {driver.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditDriver(driver)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleDriverStatus(driver.id)}
                            >
                              {driver.status === "active" ? (
                                <XCircle className="h-3 w-3" />
                              ) : (
                                <CheckCircle className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteDriver(driver.id)}
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vehicles Tab */}
        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Veículos Cadastrados
                </CardTitle>

                <Dialog
                  open={isAddVehicleDialogOpen}
                  onOpenChange={setIsAddVehicleDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Cadastrar Veículo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Cadastrar Novo Veículo</DialogTitle>
                      <DialogDescription>
                        Preencha as informações do veículo
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="plate">Placa *</Label>
                          <Input
                            id="plate"
                            value={newVehicle.plate}
                            onChange={(e) =>
                              setNewVehicle({
                                ...newVehicle,
                                plate: e.target.value.toUpperCase(),
                              })
                            }
                            placeholder="ABC-1234"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="model">Modelo *</Label>
                          <Input
                            id="model"
                            value={newVehicle.model}
                            onChange={(e) =>
                              setNewVehicle({
                                ...newVehicle,
                                model: e.target.value,
                              })
                            }
                            placeholder="Ex: Scania R440"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="brand">Marca *</Label>
                          <Input
                            id="brand"
                            value={newVehicle.brand}
                            onChange={(e) =>
                              setNewVehicle({
                                ...newVehicle,
                                brand: e.target.value,
                              })
                            }
                            placeholder="Ex: Scania"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="year">Ano *</Label>
                          <Input
                            id="year"
                            value={newVehicle.year}
                            onChange={(e) =>
                              setNewVehicle({
                                ...newVehicle,
                                year: e.target.value,
                              })
                            }
                            placeholder="2020"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="capacity">Capacidade</Label>
                          <Input
                            id="capacity"
                            value={newVehicle.capacity}
                            onChange={(e) =>
                              setNewVehicle({
                                ...newVehicle,
                                capacity: e.target.value,
                              })
                            }
                            placeholder="15 toneladas"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fuelType">Combustível</Label>
                          <Select
                            value={newVehicle.fuelType}
                            onValueChange={(value: any) =>
                              setNewVehicle({ ...newVehicle, fuelType: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="diesel">Diesel</SelectItem>
                              <SelectItem value="gasoline">Gasolina</SelectItem>
                              <SelectItem value="ethanol">Etanol</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddVehicleDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleAddVehicle}>Cadastrar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar veículo por placa, modelo ou marca..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>

            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Veículo</TableHead>
                      <TableHead>Especificações</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell>
                          <div className="font-medium">{vehicle.plate}</div>
                          <div className="text-sm text-muted-foreground">
                            {vehicle.brand} {vehicle.model}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">Ano: {vehicle.year}</div>
                            <div className="text-sm text-muted-foreground">
                              {vehicle.capacity && `${vehicle.capacity} • `}
                              {vehicle.fuelType === "diesel"
                                ? "Diesel"
                                : vehicle.fuelType === "gasoline"
                                  ? "Gasolina"
                                  : "Etanol"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              vehicle.status === "active"
                                ? "default"
                                : vehicle.status === "maintenance"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {vehicle.status === "active" && (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            )}
                            {vehicle.status === "maintenance" && (
                              <Wrench className="h-3 w-3 mr-1" />
                            )}
                            {vehicle.status === "inactive" && (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {vehicle.status === "active"
                              ? "Ativo"
                              : vehicle.status === "maintenance"
                                ? "Manutenção"
                                : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditVehicle(vehicle)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleVehicleStatus(vehicle.id)}
                            >
                              {vehicle.status === "active" ? (
                                <XCircle className="h-3 w-3" />
                              ) : (
                                <CheckCircle className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteVehicle(vehicle.id)}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Driver Dialog */}
      <Dialog
        open={isEditDriverDialogOpen}
        onOpenChange={setIsEditDriverDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Motorista</DialogTitle>
            <DialogDescription>
              Atualize as informações do motorista
            </DialogDescription>
          </DialogHeader>
          {selectedDriver && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome Completo</Label>
                  <Input
                    id="edit-name"
                    value={selectedDriver.name}
                    onChange={(e) =>
                      setSelectedDriver({
                        ...selectedDriver,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cpf">CPF</Label>
                  <Input
                    id="edit-cpf"
                    value={selectedDriver.cpf}
                    onChange={(e) =>
                      setSelectedDriver({
                        ...selectedDriver,
                        cpf: e.target.value,
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
                    value={selectedDriver.phone}
                    onChange={(e) =>
                      setSelectedDriver({
                        ...selectedDriver,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cnh">CNH</Label>
                  <Input
                    id="edit-cnh"
                    value={selectedDriver.cnh}
                    onChange={(e) =>
                      setSelectedDriver({
                        ...selectedDriver,
                        cnh: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-cnhCategory">Categoria CNH</Label>
                  <Select
                    value={selectedDriver.cnhCategory}
                    onValueChange={(value) =>
                      setSelectedDriver({
                        ...selectedDriver,
                        cnhCategory: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="D">D - Caminhão</SelectItem>
                      <SelectItem value="E">E - Carreta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cnhExpiry">Vencimento CNH</Label>
                  <Input
                    id="edit-cnhExpiry"
                    type="date"
                    value={selectedDriver.cnhExpiry}
                    onChange={(e) =>
                      setSelectedDriver({
                        ...selectedDriver,
                        cnhExpiry: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDriverDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateDriver}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Dialog */}
      <Dialog
        open={isEditVehicleDialogOpen}
        onOpenChange={setIsEditVehicleDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Veículo</DialogTitle>
            <DialogDescription>
              Atualize as informações do veículo
            </DialogDescription>
          </DialogHeader>
          {selectedVehicle && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-plate">Placa</Label>
                  <Input
                    id="edit-plate"
                    value={selectedVehicle.plate}
                    onChange={(e) =>
                      setSelectedVehicle({
                        ...selectedVehicle,
                        plate: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-model">Modelo</Label>
                  <Input
                    id="edit-model"
                    value={selectedVehicle.model}
                    onChange={(e) =>
                      setSelectedVehicle({
                        ...selectedVehicle,
                        model: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-brand">Marca</Label>
                  <Input
                    id="edit-brand"
                    value={selectedVehicle.brand}
                    onChange={(e) =>
                      setSelectedVehicle({
                        ...selectedVehicle,
                        brand: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-year">Ano</Label>
                  <Input
                    id="edit-year"
                    value={selectedVehicle.year}
                    onChange={(e) =>
                      setSelectedVehicle({
                        ...selectedVehicle,
                        year: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-capacity">Capacidade</Label>
                  <Input
                    id="edit-capacity"
                    value={selectedVehicle.capacity}
                    onChange={(e) =>
                      setSelectedVehicle({
                        ...selectedVehicle,
                        capacity: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-fuelType">Combustível</Label>
                  <Select
                    value={selectedVehicle.fuelType}
                    onValueChange={(value: any) =>
                      setSelectedVehicle({
                        ...selectedVehicle,
                        fuelType: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="gasoline">Gasolina</SelectItem>
                      <SelectItem value="ethanol">Etanol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditVehicleDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateVehicle}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
