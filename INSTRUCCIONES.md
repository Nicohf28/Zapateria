Lo primero que se realizó fue la descompresión del .zip que contenía el proyecto.
Y se abrió el proyecto en el editor de código, en este caso, Visual Studio Code:
<img width="1275" height="520" alt="image" src="https://github.com/user-attachments/assets/c9fa1fe6-5ebd-4d18-ae2a-b0ece1e50963" />

Luego de eso, accediendo a la raíz del proyecto desde el cmd, instalamos las dependencias. En este caso, con ‘npm install’.
<img width="959" height="436" alt="image" src="https://github.com/user-attachments/assets/3c96b69b-afc0-4bd9-91ff-bffbfe4f61c4" />

Al intentar ejecutar ‘npm run dev’ para correr el servidor del proyecto, se obtuvo el siguiente error:
<img width="570" height="477" alt="image" src="https://github.com/user-attachments/assets/e2248ced-afef-4942-8b3f-02ec1da45fd9" />

Este error nos indicó que no se estaba encontrando el módulo ‘product.js’ al importarlo desde ‘server.ts’. 

Revisamos, y encontramos que, ‘server.ts’ estaba importando ‘products.js’ y ‘cart.js’ en vez de las mismas con extensión .ts que es como realmente están existiendo en el proyecto:
<img width="717" height="57" alt="image" src="https://github.com/user-attachments/assets/f00b3991-1ea6-4d63-bb06-18f69590d594" />
<img width="458" height="150" alt="image" src="https://github.com/user-attachments/assets/57c77b6b-6792-463a-9d92-df723caab1f1" />

Para solucionar esto, cambiamos la extensión de ‘.js’ a ‘.ts’ en las importaciones de ‘server.ts’.
Pero, para que el compilador de TypeScript pueda resolver esta extensión, debimos modificar también ‘tsconfig.json’ de la siguiente manera:
<img width="502" height="473" alt="image" src="https://github.com/user-attachments/assets/47f6da79-6ca3-45d5-9f0a-11f51ad3cab9" />

Agregando, en las “compilerOptions”, las configuraciones de: 
“allowImportingTsExtension: true”
y “noEmit: true” (que es requerida para poder usar la anterior).

Por último, al encontrarnos el error que nos indicaba la falta de instalación de la dependencia ‘Cors’, la instalamos con el siguiente comando:

<img width="654" height="198" alt="image" src="https://github.com/user-attachments/assets/c90a5aca-1095-4177-b99f-593bd1e72977" />

Y ejecutamos, ahora sin problemas, el servidor del proyecto con ‘npm run dev’:
<img width="616" height="138" alt="image" src="https://github.com/user-attachments/assets/51c774ad-3eea-4b6c-8e2a-fd3f1f451000" />

Verificando el funcionamiento en http://localhost:3000, sin errores de consola y con los ‘features’ correctamente funcionando.
