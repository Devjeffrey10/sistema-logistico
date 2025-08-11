import { useState } from "react";
import { useVehicles } from "@/contexts/VehicleContext";
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
  Truck,
  Plus,
  Search,
  Filter,
  Camera,
  Calendar,
  MapPin,
  User,
  DollarSign,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function FuelManagement() {
  const { drivers, vehicles } = useVehicles();
  const [activeTab, setActiveTab] = useState("register");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDriver, setFilterDriver] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Trip state
  const [trips, setTrips] = useState<any[]>([]);
  const [tripForm, setTripForm] = useState({
    date: "",
    destination: "",
    driver: "",
    plate: "",
    fuelCost: "",
    observations: "",
  });

  // Get active drivers and vehicles
  const activeDrivers = drivers.filter((d) => d.status === "active");
  const activeVehicles = vehicles.filter((v) => v.status === "active");

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.plate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDriver =
      !filterDriver || filterDriver === "all" || trip.driver === filterDriver;
    const matchesDate = !filterDate || trip.date === filterDate;
    return matchesSearch && matchesDriver && matchesDate;
  });

  const handleSubmitTrip = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !tripForm.date ||
      !tripForm.destination ||
      !tripForm.driver ||
      !tripForm.plate ||
      !tripForm.fuelCost
    ) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const driver = activeDrivers.find((d) => d.id === tripForm.driver);
    const vehicle = activeVehicles.find((v) => v.id === tripForm.plate);

    const newTrip = {
      id: trips.length + 1,
      date: tripForm.date,
      destination: tripForm.destination,
      driver: tripForm.driver,
      driverName: driver?.name || "",
      plate: vehicle?.plate || "",
      fuelCost: parseFloat(tripForm.fuelCost),
      observations: tripForm.observations,
      status: "completed",
      hasImage: true, // Assume image was uploaded
      createdAt: new Date().toISOString(),
    };

    setTrips([...trips, newTrip]);
    setTripForm({
      date: "",
      destination: "",
      driver: "",
      plate: "",
      fuelCost: "",
      observations: "",
    });

    toast({
      title: "Sucesso",
      description: "Viagem registrada com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Truck className="h-8 w-8" />
            Gestão de Combustível
          </h1>
          <p className="text-muted-foreground">
            Controle de viagens e custos de combustível
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
            Registrar Viagem
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Ver Registros
          </TabsTrigger>
        </TabsList>

        {/* Register Trip Tab */}
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Nova Viagem</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTrip} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Data da Viagem *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={tripForm.date}
                      onChange={(e) =>
                        setTripForm({ ...tripForm, date: e.target.value })
                      }
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination">Destino *</Label>
                    <Input
                      id="destination"
                      placeholder="Ex: São Paulo, SP"
                      value={tripForm.destination}
                      onChange={(e) =>
                        setTripForm({
                          ...tripForm,
                          destination: e.target.value,
                        })
                      }
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="driver">Motorista *</Label>
                    <Select
                      value={tripForm.driver}
                      onValueChange={(value) =>
                        setTripForm({ ...tripForm, driver: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o motorista" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeDrivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name} - CNH: {driver.cnhCategory}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plate">Placa do Caminhão *</Label>
                    <Select
                      value={tripForm.plate}
                      onValueChange={(value) =>
                        setTripForm({ ...tripForm, plate: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a placa" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeVehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.plate} - {vehicle.brand} {vehicle.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fuelCost">
                      Custo do Combustível (R$) *
                    </Label>
                    <Input
                      id="fuelCost"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={tripForm.fuelCost}
                      onChange={(e) =>
                        setTripForm({ ...tripForm, fuelCost: e.target.value })
                      }
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Foto do Caminhão *</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        required
                        className="w-full"
                      />
                      <Button type="button" variant="outline" size="icon">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Foto obrigatória na chegada da viagem
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observations">Observações Gerais</Label>
                  <Textarea
                    id="observations"
                    placeholder="Adicione observações sobre a viagem..."
                    value={tripForm.observations}
                    onChange={(e) =>
                      setTripForm({ ...tripForm, observations: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Registrar Viagem
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setTripForm({
                        date: "",
                        destination: "",
                        driver: "",
                        plate: "",
                        fuelCost: "",
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

        {/* List Trips Tab */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Registros de Viagens</CardTitle>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por destino, motorista ou placa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterDriver} onValueChange={setFilterDriver}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filtrar por motorista" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os motoristas</SelectItem>
                    {activeDrivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full sm:w-[200px]"
                />
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {filteredTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            trip.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {trip.status === "completed"
                            ? "Concluída"
                            : "Pendente"}
                        </Badge>
                        {trip.hasImage && (
                          <Badge variant="outline" className="text-green-600">
                            <Camera className="h-3 w-3 mr-1" />
                            Com Foto
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ID: #{trip.id}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Data</p>
                          <p className="font-medium">
                            {new Date(trip.date).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Destino
                          </p>
                          <p className="font-medium">{trip.destination}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Motorista
                          </p>
                          <p className="font-medium">{trip.driverName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Placa</p>
                          <p className="font-medium">{trip.plate}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-lg">
                          R${" "}
                          {trip.fuelCost.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      {trip.observations && (
                        <p className="text-sm text-muted-foreground italic max-w-xs truncate">
                          {trip.observations}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredTrips.length === 0 && (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhuma viagem encontrada
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
