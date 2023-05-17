

import { Router } from "express";
import { VehicleController } from './controllers/VehicleController';

const routes = Router()

const vehicleController = new VehicleController()

routes.get("/vehicles", vehicleController.fetchAllVehicles);
routes.get("/vehicles/:id", vehicleController.fetchVehicleById);
routes.post("/vehicles/create", vehicleController.createVehicle);
routes.put("/vehicles/update/:id", vehicleController.updateVehicle);
routes.delete("/vehicles/delete/:id", vehicleController.deleteVehicleById);

export { routes };