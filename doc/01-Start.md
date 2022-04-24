## ¿Qué es NestJS?

Demos un paso atrás y miremos al ecosistema de Node.js como un todo.

**Node.js** no hace ninguna suposición y no incluye casi nada por defecto, ya que está pensado a propósito para ser muy básico. ¡Node.js por diseño tiene una configuración minimalista y los desarrolladores se encargan de configurar *todo* lo que quieren usar para su aplicación! Esto se aplica a todo, desde cómo se maneja el enrutamiento, las llamadas a la API, la configuración de los sockets web, hasta incluso cosas rudimentarias como la organización del código, la estructura de los archivos y las convenciones de nomenclatura. Como Node.js ha existido durante muchos años, hay un montón de frameworks que han ayudado a hacer algunos de estos requisitos comunes más simples, sobre todo Express.js. Pero todos ellos *aún* requieren MUCHA configuración y esfuerzo por parte del desarrollador. Esta flexibilidad final puede ser un arma de doble filo. Creando problemas potenciales cuando las aplicaciones o los equipos crecen mucho.

**NestJS** intenta abordar algunos de estos problemas creando una abstracción o un Framework *alrededor* de Node.js. Permitiendo que te centres en el problema de la aplicación en lugar de en los pequeños detalles de implementación como la configuración de TypeScript, el enrutamiento de la API, el manejo de errores, la configuración del middleware y mucho más. NestJS proporciona una arquitectura de aplicación lista para usar que permite a los desarrolladores y equipos crear aplicaciones altamente comprobables, escalables, poco acopladas y fáciles de mantener. ¿Pero cómo se consigue esto?

Piense en NestJS como una **capa *sobre* Node.js** en sí misma, que abstrae las tareas difíciles, las herramientas y el código repetitivo, al tiempo que añade un conjunto de herramientas completo para el desarrollo de su aplicación. El uso de NestJS no le encierra en otro marco de trabajo, sino que aprovecha las opciones y los módulos fácilmente disponibles y destacados en la comunidad, como los disponibles en las aplicaciones Express.js.

Una cosa interesante a tener en cuenta es que Nest puede incluso cambiarse para utilizar "Fastify" bajo el capó en lugar de Express.js (que se utiliza por defecto). Sólo hay que tener en cuenta que, si se hace esto, puede ser necesario utilizar diferentes bibliotecas compatibles con Fastify en la aplicación.

La flexibilidad que proporciona Nest aquí nos da la posibilidad de crear módulos que son agnósticos a la plataforma, no sólo a los marcos HTTP como Express.js o Fastify, sino incluso agnósticos a través de diferentes tipos de aplicaciones.

Con NestJS, puedes construir API's Rest, aplicaciones MVC, micro servicios, aplicaciones GraphQL, web sockets, e incluso CLI's y cron jobs.

Con la ayuda del sistema de inyección de dependencias de NestJS. Tenemos la capacidad de intercambiar los mecanismos subyacentes sin esfuerzo.

## Instalar NestJS

Instalar Nest JS

```
npm -i -g @nestjs/cli
```

¿What version we have installed?

```
nest --version
```

## Crear proyecto

Crear proyecto nuevo

```
nest new
```

Lanzar proyecto ([localhost:3000](http://localhost:3000)):

```
npm run start
```

Lanzar proyecto, con recompilaciones en tiempo real:

```
npm run start:dev
```

## ¿Qué hay en nuestro proyecto?

El corazón de la aplicación está en la capeta `src`:
 * **main.ts**: Toda la aplicación Nest empieza con el fichero principal `main.ts`. Aquí podemos ver que nuestra aplicación Nest se crea utilizando la factoría `NestFactory`, concretamente su método `create` pasandole un `AppModule`. Con esto podemos escuchar y lanzar nuestra aplicación en el puerto que queramos `3000`. El módulo AppModule es el módulo raíz de nuestra aplicación que contiene todo lo que nuestra aoplicación necesita ejecutar. Este módulo raíz puede contener otros módulos que son funcionalidades en sí mismos.
    
 * **app.module.ts**: Aquí tenemos una clase normal, con un decorador de NestJS `@Module()` de TypeScript. Los decoradores son simples funciones que aplican lógica. En este decorador encapsulamos todo lo imporatnte para el contexto de este módulo. Tenemos unos controladores y proveedores incluidos en nuestra aplicación.
 
 * **app.controller.ts**: Como el módulo, un controlador de Nest es una simple clase con un decorador `@Controller()`. Los controladores son peticiones especificas de las que se encarga nuestra aplicación. Este controlador utiliza el proveedor AppService para separar la lógica de negocio del mismo controlador. Nuestra aplicación de inicio utiliza una petición `Get`, este petición utiliza el método del appService.
 
 * **app.service.ts**: Hace la funcionalidad que hemos visto al lanzar la aplicación, aquí es donde está la implementación del método que se termina llamando.



