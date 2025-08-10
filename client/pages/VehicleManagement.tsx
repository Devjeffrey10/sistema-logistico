import { useState } from "react";
import { useDrivers } from "@/hooks/useDrivers";
import { useVehicles } from "@/hooks/useVehicles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload, AvatarImage } from "@/components/ui/image-upload";
import { resizeImage, getInitials } from "@/lib/image-utils";
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
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Driver, Vehicle } from "@/lib/supabase";

export default function VehicleManagement() {
  const {
    drivers,
    loading: driversLoading,
    error: driversError,
    addDriver,
    updateDriver,
    deleteDriver,
  } = useDrivers();

  const {
    vehicles,
    loading: vehiclesLoading,
    error: vehiclesError,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  } = useVehicles();

  const [activeTab, setActiveTab] = useState("drivers");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDriverDialogOpen, setIsAddDriverDialogOpen] = useState(false);
  const [isEditDriverDialogOpen, setIsEditDriverDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isAddVehicleDialogOpen, setIsAddVehicleDialogOpen] = useState(false);
  const [isEditVehicleDialogOpen, setIsEditVehicleDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDriverImage, setNewDriverImage] = useState<File | null>(null);
  const [editDriverImage, setEditDriverImage] = useState<File | null>(null);
  const [newVehicleImage, setNewVehicleImage] = useState<File | null>(null);
  const [editVehicleImage, setEditVehicleImage] = useState<File | null>(null);

  const [newDriver, setNewDriver] = useState({
    name: "",
    cpf: "",
    phone: "",
    cnh: "",
    cnh_category: "D" as "D" | "E",
    cnh_expiry: "",
  });

  const [newVehicle, setNewVehicle] = useState({
    plate: "",
    model: "",
    brand: "",
    year: "",
    capacity: "",
    fuel_type: "diesel" as "diesel" | "gasoline" | "ethanol",
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

  const handleAddDriver = async () => {
    if (isSubmitting) return;

    if (
      !newDriver.name ||
      !newDriver.cpf ||
      !newDriver.phone ||
      !newDriver.cnh ||
      !newDriver.cnh_expiry
    ) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = "";

      // Process image if uploaded
      if (newDriverImage) {
        try {
          imageUrl = await resizeImage(newDriverImage, 400, 400, 0.8);
        } catch (error) {
          toast({
            title: "Erro",
            description: "Erro ao processar imagem",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      await addDriver({
        ...newDriver,
        status: "active",
        image_url: imageUrl || undefined,
      });

      setNewDriver({
        name: "",
        cpf: "",
        phone: "",
        cnh: "",
        cnh_category: "D",
        cnh_expiry: "",
      });
      setNewDriverImage(null);
      setIsAddDriverDialogOpen(false);

      toast({
        title: "Sucesso",
        description: "Motorista cadastrado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar motorista",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddVehicle = async () => {
    if (isSubmitting) return;

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

    setIsSubmitting(true);
    try {
      let imageUrl = "";

      // Process image if uploaded
      if (newVehicleImage) {
        try {
          imageUrl = await resizeImage(newVehicleImage, 600, 400, 0.8);
        } catch (error) {
          toast({
            title: "Erro",
            description: "Erro ao processar imagem",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      await addVehicle({
        ...newVehicle,
        status: "active",
        image_url: imageUrl || undefined,
      });

      setNewVehicle({
        plate: "",
        model: "",
        brand: "",
        year: "",
        capacity: "",
        fuel_type: "diesel",
      });
      setNewVehicleImage(null);
      setIsAddVehicleDialogOpen(false);

      toast({
        title: "Sucesso",
        description: "Veículo cadastrado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar veículo",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsEditDriverDialogOpen(true);
  };

  const handleUpdateDriver = async () => {
    if (!selectedDriver || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await updateDriver(selectedDriver.id, {
        name: selectedDriver.name,
        cpf: selectedDriver.cpf,
        phone: selectedDriver.phone,
        cnh: selectedDriver.cnh,
        cnh_category: selectedDriver.cnh_category,
        cnh_expiry: selectedDriver.cnh_expiry,
      });

      setIsEditDriverDialogOpen(false);
      setSelectedDriver(null);

      toast({
        title: "Sucesso",
        description: "Motorista atualizado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar motorista",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditVehicleDialogOpen(true);
  };

  const handleUpdateVehicle = async () => {
    if (!selectedVehicle || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await updateVehicle(selectedVehicle.id, {
        plate: selectedVehicle.plate,
        model: selectedVehicle.model,
        brand: selectedVehicle.brand,
        year: selectedVehicle.year,
        capacity: selectedVehicle.capacity,
        fuel_type: selectedVehicle.fuel_type,
      });

      setIsEditVehicleDialogOpen(false);
      setSelectedVehicle(null);

      toast({
        title: "Sucesso",
        description: "Veículo atualizado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar veículo",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDriver = async (id: string) => {
    try {
      await deleteDriver(id);
      toast({
        title: "Sucesso",
        description: "Motorista removido com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover motorista",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      await deleteVehicle(id);
      toast({
        title: "Sucesso",
        description: "Veículo removido com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover veículo",
        variant: "destructive",
      });
    }
  };

  if (driversError || vehiclesError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">
          Erro ao carregar dados: {driversError || vehiclesError}
        </p>
      </div>
    );
  }

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
                      <ImageUpload
                        label="Foto do Motorista"
                        value={
                          newDriverImage
                            ? URL.createObjectURL(newDriverImage)
                            : null
                        }
                        onChange={(file) => setNewDriverImage(file)}
                        disabled={isSubmitting}
                      />
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
                            value={newDriver.cnh_category}
                            onValueChange={(value: "D" | "E") =>
                              setNewDriver({
                                ...newDriver,
                                cnh_category: value,
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
                          <Label htmlFor="cnhExpiry">Vencimento CNH *</Label>
                          <Input
                            id="cnhExpiry"
                            type="date"
                            value={newDriver.cnh_expiry}
                            onChange={(e) =>
                              setNewDriver({
                                ...newDriver,
                                cnh_expiry: e.target.value,
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
                        disabled={isSubmitting}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleAddDriver} disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Cadastrando...
                          </>
                        ) : (
                          "Cadastrar"
                        )}
                      </Button>
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
              {driversLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Carregando motoristas...
                  </p>
                </div>
              ) : (
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
                            <div className="flex items-center gap-3">
                              <AvatarImage
                                src={driver.image_url}
                                fallback={getInitials(driver.name)}
                                alt={driver.name}
                                size="md"
                              />
                              <div>
                                <div className="font-medium">{driver.name}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  <CreditCard className="h-3 w-3" />
                                  {driver.cpf}
                                </div>
                              </div>
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
                                {driver.cnh_category}
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                Vence:{" "}
                                {new Date(driver.cnh_expiry).toLocaleDateString(
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
                                onClick={() => handleDeleteDriver(driver.id)}
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

              {!driversLoading && filteredDrivers.length === 0 && (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum motorista encontrado
                  </p>
                </div>
              )}
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
                      <ImageUpload
                        label="Foto do Veículo"
                        value={
                          newVehicleImage
                            ? URL.createObjectURL(newVehicleImage)
                            : null
                        }
                        onChange={(file) => setNewVehicleImage(file)}
                        disabled={isSubmitting}
                      />
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
                            value={newVehicle.fuel_type}
                            onValueChange={(
                              value: "diesel" | "gasoline" | "ethanol",
                            ) =>
                              setNewVehicle({ ...newVehicle, fuel_type: value })
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
                        disabled={isSubmitting}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleAddVehicle}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Cadastrando...
                          </>
                        ) : (
                          "Cadastrar"
                        )}
                      </Button>
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
              {vehiclesLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Carregando veículos...
                  </p>
                </div>
              ) : (
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
                            <div className="flex items-center gap-3">
                              <AvatarImage
                                src={vehicle.image_url}
                                fallback={vehicle.plate.slice(0, 2)}
                                alt={`${vehicle.brand} ${vehicle.model}`}
                                size="md"
                                className="rounded-lg"
                              />
                              <div>
                                <div className="font-medium">
                                  {vehicle.plate}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {vehicle.brand} {vehicle.model}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">Ano: {vehicle.year}</div>
                              <div className="text-sm text-muted-foreground">
                                {vehicle.capacity && `${vehicle.capacity} • `}
                                {vehicle.fuel_type === "diesel"
                                  ? "Diesel"
                                  : vehicle.fuel_type === "gasoline"
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
                                onClick={() => handleDeleteVehicle(vehicle.id)}
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

              {!vehiclesLoading && filteredVehicles.length === 0 && (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum veículo encontrado
                  </p>
                </div>
              )}
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
                    value={selectedDriver.cnh_category}
                    onValueChange={(value: "D" | "E") =>
                      setSelectedDriver({
                        ...selectedDriver,
                        cnh_category: value,
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
                    value={selectedDriver.cnh_expiry}
                    onChange={(e) =>
                      setSelectedDriver({
                        ...selectedDriver,
                        cnh_expiry: e.target.value,
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
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateDriver} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Atualizando...
                </>
              ) : (
                "Atualizar"
              )}
            </Button>
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
                    value={selectedVehicle.capacity || ""}
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
                    value={selectedVehicle.fuel_type}
                    onValueChange={(value: "diesel" | "gasoline" | "ethanol") =>
                      setSelectedVehicle({
                        ...selectedVehicle,
                        fuel_type: value,
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
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateVehicle} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Atualizando...
                </>
              ) : (
                "Atualizar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
