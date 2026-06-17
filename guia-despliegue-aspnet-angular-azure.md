# Guía paso a paso: ASP.NET Core + Angular en Azure, gratis

Arquitectura que vamos a montar:

- **Backend**: ASP.NET Core Web API → Azure App Service, plan **F1 (Free)**
- **Frontend**: Angular → Azure Static Web Apps, plan **Free**
- **Base de datos** (fase opcional más adelante): Azure SQL Database, _free offer_

Entorno: Windows + Visual Studio Code.

---

## 0. Antes de empezar: herramientas a instalar

| Herramienta          | Para qué                                             | Cómo instalar                                                                         |
| -------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------- |
| .NET SDK (8 o 9 LTS) | Backend                                              | `winget install Microsoft.DotNet.SDK.9` o desde https://dotnet.microsoft.com/download |
| Node.js LTS          | Angular CLI necesita Node                            | `winget install OpenJS.NodeJS.LTS`                                                    |
| Angular CLI          | Crear/compilar el frontend                           | `npm install -g @angular/cli` (tras instalar Node)                                    |
| Git                  | Control de versiones, necesario para Static Web Apps | `winget install Git.Git`                                                              |
| Azure CLI            | Crear recursos desde terminal                        | `winget install Microsoft.AzureCLI`                                                   |
| Visual Studio Code   | Editor                                               | ya lo tienes                                                                          |

Extensiones de VS Code (búscalas en el icono de extensiones, Ctrl+Shift+X):

- **C# Dev Kit** (`ms-dotnettools.csdevkit`)
- **Azure App Service** (`ms-azuretools.vscode-azureappservice`)
- **Azure Static Web Apps** (`ms-azuretools.vscode-azurestaticwebapps`)
- **Azure Resources** (`ms-azuretools.vscode-azureresourcegroups`) — se instala junto a las anteriores

Verifica que todo está instalado abriendo una terminal (Ctrl+`) en VS Code:

```powershell
dotnet --version
node -v
ng version
git --version
az version
```

---

## 1. Crear la cuenta de Azure

1. Ve a https://azure.microsoft.com/free (o a la oferta "Azure for Students" si eres estudiante universitario, que no pide tarjeta).
2. Regístrate con una cuenta Microsoft (puedes crear una nueva si no quieres usar tu correo personal).
3. Si no eres estudiante, te pedirá una tarjeta solo para verificar identidad — no te cobrará nada mientras no actives "pago por uso" voluntariamente.
4. Una vez creada, inicia sesión desde la terminal:

```powershell
az login
```

Se abrirá el navegador para autenticarte. Cuando vuelva a la terminal y veas tu suscripción listada, ya estás dentro.

---

## 2. Crear el backend (ASP.NET Core Web API)

```powershell
mkdir oposicion-tai
cd oposicion-tai
dotnet new webapi -n Backend -o backend
cd backend
dotnet run
```

Abre la URL que te indique la terminal para comprobar que la API de ejemplo funciona. Detén el servidor con Ctrl+C.

### Habilitar CORS (imprescindible para que Angular pueda llamar a la API)

Abre `Program.cs` y añade, **antes** de `var app = builder.Build();`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200",          // Angular en local
                "https://CAMBIAR-TRAS-DESPLEGAR.azurestaticapps.net" // lo rellenamos en el paso 8
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

Y justo después de `var app = builder.Build();`, antes de `app.MapControllers();`:

```csharp
app.UseCors("FrontendPolicy");
```

Deja, de momento, el controlador de ejemplo `WeatherForecastController` — nos sirve para probar la conexión end-to-end antes de complicar nada.

---

## 3. Crear el frontend (Angular)

Vuelve a la carpeta raíz del proyecto:

```powershell
cd ..
ng new frontend --routing --style=scss
cd frontend
ng serve
```

Abre `http://localhost:4200` y deberías ver la página de bienvenida de Angular.

## 4. Subir el código a GitHub

Azure Static Web Apps se despliega de forma nativa conectando un repositorio de GitHub (es la vía gratuita más cómoda).

```powershell
cd ..
git init
git add .
git commit -m "Primer commit: backend + frontend"
```

Crea un repositorio nuevo y vacío en https://github.com/new (puedes llamarlo `oposicion-tai`), y luego:

```powershell
git remote add origin https://github.com/TU-USUARIO/oposicion-tai.git
git branch -M main
git push -u origin main
```

---

## 5. Crear y desplegar el backend en Azure App Service

Desde VS Code, con la extensión **Azure App Service** instalada:

1. Abre la pestaña de Azure (icono en la barra lateral).
2. Click derecho en "App Service" → **Create New Web App... (Advanced)**.
3. Sigue el asistente:
   - Nombre único (ej. `api-oposicion-tai-jorgegl`) api-oposicion-tai-jorgegl
   - Grupo de recursos: crea uno nuevo, ej. `rg-oposicion-tai`
   - Runtime stack: **.NET 9 (o la versión que uses)**
   - Sistema operativo: Windows o Linux (cualquiera funciona)
   - Plan de hospedaje: **elige "Free" / F1 explícitamente** — este es el paso más importante para no pagar nada
   - Región: West Europe o North Europe (más cercanas)
4. Cuando termine de crear el recurso, click derecho en la carpeta `backend` desde el explorador de archivos de VS Code → **Deploy to Web App...** → selecciona la app que acabas de crear.
5. Confirma "Deploy" cuando te avise de que sobrescribirá el contenido.
6. Al terminar, te dará la opción de "Browse Website" — pruébala con `/swagger` al final de la URL.

Apunta la URL final (algo como `https://api-oposicion-tai-jorgegl.azurewebsites.net`) — la necesitas para el siguiente paso.

Fue necesario hacer dotnet publish -c Release -o publish
dentro de backend antes de subir
y luego
Ahora, en el explorador de archivos de VS Code, busca esa nueva carpeta backend/publish, haz click derecho sobre ella (no sobre backend) → Deploy to Web App... → selecciona tu app api-oposicion-tai-jorgegl → confirma sobrescribir.

---

## 6. Crear y desplegar el frontend en Azure Static Web Apps

1. Compila el proyecto de producción primero, para ver dónde deja los archivos:

```powershell
cd frontend
ng build
```

Comprueba la ruta de salida (normalmente `dist/frontend/browser` en versiones recientes de Angular; en versiones más antiguas puede ser solo `dist/frontend`). La necesitarás en el asistente.

2. Desde VS Code, con la extensión **Azure Static Web Apps**:
   - Click derecho en "Static Web Apps" → **Create Static Web App... (Advanced)**.
   - Nombre del recurso, región, y elige plan **Free**.
   - Te pedirá autenticarte con GitHub y seleccionar el repositorio y rama (`main`) que subiste antes.
   - Framework preset: **Angular**.
   - App location: `/frontend`
   - Output location: la ruta que comprobaste en el paso anterior (ej. `dist/frontend/browser`)
3. La extensión crea automáticamente un _GitHub Action_ (un archivo `.github/workflows/...yml`) en tu repositorio que compila y despliega cada vez que haces `git push`.
4. Ve a tu repositorio en GitHub → pestaña **Actions** → espera a que el workflow termine (icono verde).
5. La extensión te dará la URL final (algo como `https://nombre-aleatorio.azurestaticapps.net`).

---

## 7. Conectar todo: actualizar CORS y la URL de producción

1. En `frontend/src/environments/environment.prod.ts`, sustituye `CAMBIAR-TRAS-DESPLEGAR` por la URL real del backend del paso 5.
2. En `backend/Program.cs`, sustituye `CAMBIAR-TRAS-DESPLEGAR.azurestaticapps.net` por la URL real del frontend del paso 6.
3. Vuelve a desplegar el backend (repite "Deploy to Web App" desde VS Code) y haz commit + push del frontend:

```powershell
git add .
git commit -m "Actualizar URLs de produccion"
git push
```

El push relanzará automáticamente el GitHub Action y desplegará la nueva versión.

4. Abre la URL del frontend en el navegador, comprueba que carga los datos de la API y revisa la consola del navegador (F12) por si hay errores de CORS.

---

## 8. Que nunca te cobren nada (checklist de seguridad)

- En el [portal de Azure](https://portal.azure.com) → **Cost Management + Billing** → **Budgets**, crea un presupuesto de 0€ o 1€ con alerta por email al 80-100%. Así te enteras al instante si algo empieza a generar coste.
- Revisa que el plan de App Service siga marcado como **F1** (Resource Group → tu App Service Plan → Overview).
- Si más adelante añades Azure SQL Database, elige siempre **"Auto-pausar hasta el mes siguiente"**, nunca "continuar con cargos adicionales".
- Cuando termines de practicar, si quieres asegurarte del todo, borra el grupo de recursos completo (`rg-oposicion-tai`) desde el portal — esto borra todo de golpe sin dejar nada huérfano facturando.

---

## 9. Próximos pasos

- Añadir una base de datos real con Azure SQL Database (free offer) + Entity Framework Core.
- Configurar un dominio personalizado gratuito en Static Web Apps (incluye SSL).
- Seguir con los módulos de Microsoft Learn de App Service, Functions y Storage que comentamos, usando este mismo proyecto como laboratorio práctico.
