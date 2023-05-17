import type { foto_veiculo } from "@prisma/client";
import { VehicleService } from "../services/VehicleService";
import { Request, Response } from 'express'

class VehicleController {
    // private vehicleService!: VehicleService;

    // constructor() {
    //   this.vehicleService = new VehicleService();
    // }

    async fetchAllVehicles(req: Request, res: Response) {
      try {
        const vehicleService = new VehicleService();

        const vehicles = await vehicleService.fetchAllVehicles();

        return res.status(200).json({ vehicles: vehicles?.length ? vehicles : [] })      
      } catch (error) {
        console.log(error)
        return res.status(500).json({ 
          message: "Erro ao buscar veículos!", 
          route: "fetchAllVehicles",
          erro: error.message
        })
        
      }
    }

    async fetchVehicleById(req: Request, res: Response) {
      try {
        const vehicleService = new VehicleService();

        const { id } = req.params;

        const idToNumber = Number(id);

        if (!idToNumber) {
          return res.status(400).send('id do Veículo deve conter apenas números!')
        }

        const vehicle = await vehicleService.fetchVehicleById(idToNumber);

        if (!vehicle) {
          return res.sendStatus(204)
        }

        const photos = await vehicleService.fetchVehicleFotos(idToNumber);

        return res.status(200).json({...vehicle, fotos: photos})      
      } catch (error) {
        console.log(error)
        return res.status(500).json({ 
          message: "Erro ao buscar veículo!", 
          route: "fetchVehicleById",
          erro: error.message
        })
        
      }
    }

    async createVehicle(req: Request, res: Response) {
      try {
        const vehicleService = new VehicleService();

        const bodyValidationResponse = validateBodyCreateVehicle({ ...req.body });

        if (bodyValidationResponse.error) {
          return res.status(422).json({
            message: "Erro ao cadastrar veículo, campo(s) inválido(s) ou não informado(s)!",
            fields: bodyValidationResponse.fields
          })
        }
        
        // const createdVehicle = await vehicleService.createVehicle({...req.body});
        const createdVehicle = {id: 4};

        const { fotos } = req.body;
        if (fotos?.length) {
          await vehicleService.createVehiclePhotos(fotos.splice(0,5), createdVehicle.id);
        }

        return res.status(201).json(createdVehicle);     
      } catch (error) {
        console.log(error)
        return res.status(500).json({ 
          message: "Erro ao cadastrar veículo!", 
          route: "createVehicle",
          erro: error.message
        })
        
      }
    }

    async deleteVehicleById(req: Request, res: Response) {
      try {
        const vehicleService = new VehicleService();

        const { id } = req.params;

        const idToNumber = Number(id);

        if (!idToNumber) {
          return res.status(400).send('id do Veículo deve conter apenas números!')
        }
        await vehicleService.deleteVehiclePhotosByVehicleId(idToNumber);

        await vehicleService.deleteVehicleById(idToNumber);

        return res.sendStatus(200);      
      } catch (error) {
        console.log(error)
        return res.status(500).json({ 
          message: "Erro ao deletar veículo!", 
          route: "deleteVehicleById",
          erro: error.message
        })
        
      }
    }

    async updateVehicle(req: Request, res: Response) {
      try {
        const vehicleService = new VehicleService();

        const { id } = req.params;

        const idToNumber = Number(id);

        if (!idToNumber) {
          return res.status(400).send('id do Veículo deve conter apenas números!')
        }
        
        await vehicleService.updateVehicle({ ...req.body, id: idToNumber });

        const { fotos } = req.body;
        if (fotos?.length) {
          await updateVehiclePhotos(fotos, vehicleService, idToNumber);
        }

        return res.sendStatus(200); 
      } catch (error) {
        console.log(error)
        return res.status(500).json({ 
          message: "Erro ao atualizar veículo!", 
          route: "updateVehicle",
          erro: error.message
        })
        
      }
    }
}


const validateBodyCreateVehicle = ({ placa, rastreado, comprimento, largura, altura, cubagem }) => {
  const fields: string[] = [];

  if(!placa) {
    fields.push(Object.keys({placa})[0]);
  }
  if(!rastreado || typeof rastreado != "boolean") {
    fields.push(Object.keys({rastreado})[0]);
  }
  if(!cubagem || !Number(cubagem)) {
    fields.push(Object.keys({cubagem})[0]);
  }
  if(!comprimento || !Number(comprimento)) {
    fields.push(Object.keys({comprimento})[0]);
  }
  if(!largura || !Number(largura)) {
    fields.push(Object.keys({largura})[0]);
  }
  if(!altura || !Number(altura)) {
    fields.push(Object.keys({altura})[0]);
  }

  return ({
    error: !!fields.length,
    fields
  })
}

const updateVehiclePhotos = async (photos: foto_veiculo[], vehicleService: VehicleService, vehicle_id: number) => {
  const vehiclePhotos = await vehicleService.fetchVehicleFotos(vehicle_id);
  
  const photosToDelete = vehiclePhotos.filter(vp => !photos.some(ph => ph.id == vp.id));
  
  await vehicleService.deleteVehiclePhoto(photosToDelete);

  for (const fv of photos) {
    if (!fv.id) {
        const vehiclePhotos = await vehicleService.fetchVehicleFotos(vehicle_id);

        if(!vehiclePhotos || vehiclePhotos.length < 5) {
          await vehicleService.createVehiclePhotos([fv.foto], vehicle_id)
        }
    } else {
      await vehicleService.updateVehiclePhoto(fv.foto, Number(fv.id));
    }
  }
}
export {VehicleController}