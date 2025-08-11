import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Driver {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  cnh: string;
  cnhCategory: string;
  cnhExpiry: string;
  status: "active" | "inactive";
  createdAt: string;
}

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: string;
  capacity: string;
  fuelType: "diesel" | "gasoline" | "ethanol";
  status: "active" | "inactive" | "maintenance";
  createdAt: string;
}

interface VehicleContextType {
  drivers: Driver[];
  vehicles: Vehicle[];
  addDriver: (driverData: Omit<Driver, "id" | "createdAt">) => void;
  updateDriver: (id: string, driverData: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;
  toggleDriverStatus: (id: string) => void;
  addVehicle: (vehicleData: Omit<Vehicle, "id" | "createdAt">) => void;
  updateVehicle: (id: string, vehicleData: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  toggleVehicleStatus: (id: string) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

// Default data
const defaultDrivers: Driver[] = [
  {
    id: "1",
    name: "João Silva",
    cpf: "123.456.789-10",
    phone: "(11) 99999-9999",
    cnh: "12345678901",
    cnhCategory: "D",
    cnhExpiry: "2025-12-31",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Maria Santos",
    cpf: "987.654.321-00",
    phone: "(11) 88888-8888",
    cnh: "10987654321",
    cnhCategory: "E",
    cnhExpiry: "2026-06-15",
    status: "active",
    createdAt: "2024-01-02",
  },
];

const defaultVehicles: Vehicle[] = [
  {
    id: "1",
    plate: "ABC-1234",
    model: "Scania R440",
    brand: "Scania",
    year: "2020",
    capacity: "15 toneladas",
    fuelType: "diesel",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    plate: "XYZ-5678",
    model: "Volvo FH",
    brand: "Volvo",
    year: "2019",
    capacity: "20 toneladas",
    fuelType: "diesel",
    status: "active",
    createdAt: "2024-01-02",
  },
];

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Initialize drivers from localStorage or use defaults
  useEffect(() => {
    const storedDrivers = localStorage.getItem("app_drivers");
    if (storedDrivers) {
      try {
        setDrivers(JSON.parse(storedDrivers));
      } catch (error) {
        setDrivers(defaultDrivers);
        localStorage.setItem("app_drivers", JSON.stringify(defaultDrivers));
      }
    } else {
      setDrivers(defaultDrivers);
      localStorage.setItem("app_drivers", JSON.stringify(defaultDrivers));
    }
  }, []);

  // Initialize vehicles from localStorage or use defaults
  useEffect(() => {
    const storedVehicles = localStorage.getItem("app_vehicles");
    if (storedVehicles) {
      try {
        setVehicles(JSON.parse(storedVehicles));
      } catch (error) {
        setVehicles(defaultVehicles);
        localStorage.setItem("app_vehicles", JSON.stringify(defaultVehicles));
      }
    } else {
      setVehicles(defaultVehicles);
      localStorage.setItem("app_vehicles", JSON.stringify(defaultVehicles));
    }
  }, []);

  // Driver management functions
  const addDriver = (driverData: Omit<Driver, "id" | "createdAt">) => {
    const newDriver: Driver = {
      ...driverData,
      id: (Math.max(...drivers.map((d) => parseInt(d.id)), 0) + 1).toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updatedDrivers = [...drivers, newDriver];
    setDrivers(updatedDrivers);
    localStorage.setItem("app_drivers", JSON.stringify(updatedDrivers));
  };

  const updateDriver = (id: string, driverData: Partial<Driver>) => {
    const updatedDrivers = drivers.map((d) =>
      d.id === id ? { ...d, ...driverData } : d,
    );
    setDrivers(updatedDrivers);
    localStorage.setItem("app_drivers", JSON.stringify(updatedDrivers));
  };

  const deleteDriver = (id: string) => {
    const updatedDrivers = drivers.filter((d) => d.id !== id);
    setDrivers(updatedDrivers);
    localStorage.setItem("app_drivers", JSON.stringify(updatedDrivers));
  };

  const toggleDriverStatus = (id: string) => {
    const updatedDrivers = drivers.map((d) =>
      d.id === id
        ? {
            ...d,
            status: d.status === "active" ? "inactive" : ("active" as const),
          }
        : d,
    );
    setDrivers(updatedDrivers);
    localStorage.setItem("app_drivers", JSON.stringify(updatedDrivers));
  };

  // Vehicle management functions
  const addVehicle = (vehicleData: Omit<Vehicle, "id" | "createdAt">) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: (Math.max(...vehicles.map((v) => parseInt(v.id)), 0) + 1).toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    localStorage.setItem("app_vehicles", JSON.stringify(updatedVehicles));
  };

  const updateVehicle = (id: string, vehicleData: Partial<Vehicle>) => {
    const updatedVehicles = vehicles.map((v) =>
      v.id === id ? { ...v, ...vehicleData } : v,
    );
    setVehicles(updatedVehicles);
    localStorage.setItem("app_vehicles", JSON.stringify(updatedVehicles));
  };

  const deleteVehicle = (id: string) => {
    const updatedVehicles = vehicles.filter((v) => v.id !== id);
    setVehicles(updatedVehicles);
    localStorage.setItem("app_vehicles", JSON.stringify(updatedVehicles));
  };

  const toggleVehicleStatus = (id: string) => {
    const updatedVehicles = vehicles.map((v) =>
      v.id === id
        ? {
            ...v,
            status: v.status === "active" ? "inactive" : ("active" as const),
          }
        : v,
    );
    setVehicles(updatedVehicles);
    localStorage.setItem("app_vehicles", JSON.stringify(updatedVehicles));
  };

  return (
    <VehicleContext.Provider
      value={{
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
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicles() {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error("useVehicles must be used within a VehicleProvider");
  }
  return context;
}
