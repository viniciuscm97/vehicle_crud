import { PrismaClient } from '@prisma/client'
import type { veiculos, foto_veiculo } from '@prisma/client';

interface IVehicleWithPhotos extends veiculos{
    fotos: foto_veiculo[]
}

class VehicleService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient()

    }

    async createVehicle({ placa, rastreado, comprimento, largura, altura, cubagem }: veiculos) {
        const vehicle = await this.prisma.veiculos.create({
            data: {
                placa, 
                rastreado, 
                comprimento: Number(comprimento), 
                largura: Number(largura), 
                altura: Number(altura), 
                cubagem: Number(cubagem)
            },
          })

        return vehicle;
    }

    async createVehiclePhotos(fotos: string[]|Buffer[], vehicle_id: number) {
        const createData = await Promise.all(fotos.map(async f => {
            const blob = Buffer.from(f, 'base64');
            
            return ({foto: blob, veiculo_id: vehicle_id })
        }));
        
        await this.prisma.foto_veiculo.createMany({
            data: createData,
          })
    }

    async updateVehiclePhoto(foto: Buffer, id: number) {
        await this.prisma.foto_veiculo.update({
            where: { id },
            data: { foto }
        })
        
    }

    async deleteVehiclePhoto(photos: foto_veiculo[]) {
        await this.prisma.foto_veiculo.deleteMany({
            where: {
                id: {
                    in: photos.map(ph => ph.id),
                }
            }
        })
    }

    async fetchAllVehicles() {
        const vehicles = await this.prisma.veiculos.findMany();

        const vehicleWithPhotos:IVehicleWithPhotos[] = [];

        for (const v of vehicles) {
            const vehiclePhotos = await this.fetchVehicleFotos(v.id);

            vehicleWithPhotos.push({
                ...v,
                fotos: vehiclePhotos?.length ? vehiclePhotos : [],
            })
        }
        await this.prisma.$disconnect();

        return vehicleWithPhotos;
    }

    async fetchVehicleFotos(vehicle_id:number) {
        const vehiclePhotos = await this.prisma.foto_veiculo.findMany({
            where: {
                veiculo_id: vehicle_id,
            }
        });

        return vehiclePhotos
    }

    async fetchVehicleById(veiculo_id: number) {
        const foundedVehicle = await this.prisma.veiculos.findUnique({
            where: {
                id: veiculo_id,
            }
        });

        return foundedVehicle;
    }

    async deleteVehicleById(veiculo_id: number) {
        const foundedVehicle = await this.prisma.veiculos.delete({
            where: {
                id: veiculo_id,
            }
        });

        return foundedVehicle;
    }

    async deleteVehiclePhotosByVehicleId(veiculo_id: number) {
        await this.prisma.foto_veiculo.deleteMany({
            where: {
                veiculo_id,
            }
        });
    }

    async updateVehicle({ id, placa, rastreado, comprimento, largura, altura, cubagem }: veiculos) {
        const vehicle = await this.fetchVehicleById(id);

        await this.prisma.veiculos.update({
            where: { id },
            data: {
              placa: placa || vehicle?.placa, 
              rastreado: rastreado || vehicle?.rastreado, 
              comprimento: comprimento || vehicle?.comprimento, 
              largura: largura || vehicle?.largura, 
              altura: altura || vehicle?.altura, 
              cubagem: cubagem || vehicle?.cubagem,
            },
          })
    }
}

export { VehicleService }