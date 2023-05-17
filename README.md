# Veículo CRUD

Projeto criado utilizando Node JS, express, Prisma, API REST e TypeScript.
As endpoints foram testadas utilizando a plataforma Postman, utilizando raw como JSON.



# Como iniciar
- Instalar módulos

    ```bash
    npm install
    ```

- Executar projeto

    ```bash
    npm run dev
    ```

# Rotas
Enviar dados por BODY da requisição, como Content-Type: application/json.

## Cadastrar Veículo 
Nesta requisição apenas campo fotos está como opcional.

Exemplo de requisicão: https://imgur.com/a/8Dmuimn
```bash
 /vehicles - POST
```

### Atualizar Veículo
Envio dos campos que serão atualizados, no campo fotos, enviar todas as fotos que permanecerão no veículo em caso de atualização informar o id da foto.

Exemplo de requisicão: https://imgur.com/a/RdkObyg
```bash
 /vehicles/:id/update - PUT
```

### Busca de todos Veículos
Exemplo de requisicão: https://imgur.com/hPqQDhH
```bash
 /vehicles - GET
```

### Busca Veículo por ID
Exemplo de requisicão: https://imgur.com/skV80AR
```bash
 /vehicles/:id - GET
```

### Deletar Veículo por ID
Exemplo de requisicão: https://imgur.com/5cu44p7
```bash
 /vehicles/delete/:id - DELETE
```

Exportei a collection que criei no postman também, esta nos arquivos do projeto GitHub (veiculos.postman_collection.json)
