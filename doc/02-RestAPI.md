# API REST

## Controladores

Los controladores son uno de los bloques de construcción más importantes de las aplicaciones NestJS, ya que manejan las solicitudes.

Si queremos crear un controlador nuevo:

```
nest generate controller <controlador>
```

Abreviado: `nest g co <controlador>`

Si no queremos generar el fichero de test, podemos simplemente pasar el argumento `--no-spec` así:

```
nest g co <> --no-spec
```

Si queremos generar el controlador en un ruta específica, solo hay que poner la ruta antes del nombre del controlador:

```
nest g co modules/abc
```

Creará el módulo en la ruta `src/modules/abc`. 

Los controlador se encargan de peticiones en nuestra aplicación. La aplicación sabe qué controlador se encarga de qué url utilizando los decoradores. Si añadimos un decorador a un controlador (`coffees`) y un decorador a un método de este (`flavors`) tendremos una ruta `/coffees/flavors`.

```
@Controller('coffees')
export class CoffeesController {
    @Get('flavors')
    findAll() {
        return "This returns all coffee flavors avalaible";
    }
}
```

Las rutas con rutas estáticas no funcionarán cuando necesites aceptar datos dinámicos como parte de tu petición. Digamos que hacemos una petición GET a /coffees/123, donde 123 es dinámico y se refiere a un ID. Para definir rutas con parámetros, podemos añadir tokens de parámetros raíz a la ruta de la ruta. Esto nos permite capturar estos valores dinámicos en esa posición de la URL de la petición y los pasa al método como un parámetro.

Si queremos pasarle parámetros a nuestro método GET, utilizamos el decorador `@Param()` en los arguments de la función, podemos pasarlos todos (`params`) o sólo uno, en este último caso hay que indicar la naturaleza de una variable.

```
@Get(':id')
findOne(@Param('id') id: string) {
    return `This action returns #${id} coffee`;
}
```

Podemos trabajar con peticiones POST y recuperar las cargas útiles que normalmente se pasan junto a ellas. Al igual que el decorador @Param() que acabamos de conocer, Nest también tiene un decorador útil para obtener todas las partes o partes específicas del cuerpo de la solicitud, conocido como decorador `@Body()`.

Si queremos un método POST que reciba parametros hay que usar el decorador `@Post` para la función y el decorador `@Body` como parámetro de la función.

```
@Post()
create(@Body() body) {
    return body
}
```

Podemos especificar el código HTTP que queremos que nos devuelva la función sin queremos hacerlo estático usando el decorador `@HttpCode`.

```
@Post()
@HttpCode(HttpStatus.GONE)
create(@Body() body) {
    return body
}
```

## Paginación

Con la paginación, podemos dividir una respuesta masiva de datos en trozos o páginas manejables, devolviendo sólo lo que realmente se necesita para cada respuesta específica. Ya sean 10, 50, 100 o el número de resultados que queramos, con cada una de esas respuestas.

Como buena práctica... Queremos usar parámetros de ruta: para identificar un recurso específico. Mientras que el uso de parámetros de consulta: para filtrar u ordenar ese recurso.

Nest tiene un útil decorador para obtener todos o una parte específica de los parámetros de consulta llamado @Query(). Que funciona de forma similar a `@Param()` y `@Body()`, que ya hemos visto.

```
@Get()
findAll(@Query() paginationQuery) {
    const { limit, offfset } = paginationQuery;
    return `This action returns all coffees. Limit: ${limit}, offset: ${offset}.`;
}
```

## Services

Los services nos permite separa la lógica de nuestros controladores, además de reutilizar la lógica en múltiples partes de nuestra aplicación.

Podemos crear un service con el comando

```
nest generate service
```

Alternativa: `nest g s`.

En NestJS cada service es un provider. Los providers pueden inyectar dependencias, esto quiere decir que los objetos pueden crear varias relaciones entre ellos. La conexión de instancias de objetos entre sí puede ser manejada por el sistema de ejecución Nest. En vez de gestionar tú mismo este tipo de inyección de dependencias. Los provider son simples clases anotadas con el decorador `@Injectable()`.

El servicio que acabamos de crear es el encargado del almacenamiento y devolución de los datos, y esta diseñado para ser utilizado por el controlador o cualquier oto que necesite esta funcionalidad.

¿Cómo utilizamos la inyección de depenencias en Nest? Podemos simplemente utilizar los contructores en el controlador.

```
@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeeService: CoffeesService) {}
}
```


Para trabajar con datos (entidades de la base de datos) vamos a utilizar entities.

```
    export class Coffee {
        id: number;
        name: string;
        brand: string;
        flavors: string[];
    }
```

De vuelta a nuestro service, definimos todos los métodos para hacer operaciones CRUD sobre los datos en nuestra clase.


# Mensajes de Error

Hasta ahora, hemos visto cuando todo va bien en nuestra aplicación... ¿Pero qué pasa cuando tenemos errores en la aplicación? ¿Qué pasa si una solicitud de la API falla o se agota el tiempo de espera? ¿Y si la base de datos no encuentra el recurso que buscamos? Muchas cosas pueden ir mal en aplicaciones complejas.

Pero por suerte para nosotros, Nest puede ayudarnos a enviar fácilmente cualquier tipo de mensaje de error amigable que queramos.

Con Nest tenemos unas varias opciones para elegir: lanzar una excepción, utilizar objetos de respuesta específicos de la biblioteca, incluso podemos crear "Interceptores" y aprovechar los "filtros de excepción".

Veamos una Excepción HTTP en acción abriendo nuestro CoffeesService y aplicándolo dentro de nuestro método findOne: Lanzar un código de estado diferente para un escenario muy común. En este escenario, digamos que queremos lanzar un Error cada vez que el usuario intente buscar un café, que NO existe en nuestra fuente de datos.

```
  findOne(id: number) {
    const coffee = this.coffees.find(coffee => coffee.id === id);
    if (!coffee) {
      throw new HttpException(`Coffee #${id} not found`, HttpStatus.NOT_FOUND);
    }
    return coffee;
  }
```


HttpException aquí toma dos parámetros: uno es: una cadena para el mensaje de respuesta de error. Y el otro es: el Código de Estado que queremos devolver.

Tenga en cuenta que Nest también tiene métodos de ayuda para todas las respuestas de error comunes. Estos son útiles y usted sabe exactamente lo que podría enviar de vuelta y prefiere un enfoque más simple y más legible. Estos incluyen clases de ayuda como: NotFoundException, InternalServerErrorException, BadRequestException, y muchas más.

Podemos cambiar la excepción que lanzamos por uno de los que hemos comentado:

```
throw new NotFoundException(`Coffee #${id} not found`);
```

Pero qué pasa con los escenarios en los que nos olvidamos de manejar una excepción en el código de nuestras aplicaciones, digamos una excepción que no es una HttpException. Bueno, por suerte, Nest atrapa automáticamente estas excepciones por nosotros con una capa de excepciones incorporada. Esta capa incluso nos devuelve una respuesta apropiada para el usuario.

# Modulos

Una buena forma de organizar un proyecto NestJS es usando módulo, cada uno agrupando funcionalidades similares.

En NestJS, los módulos se recomiendan encarecidamente como una forma eficaz de organizar los componentes de sus aplicaciones. Para la mayoría de las aplicaciones Nest: una arquitectura ideal debería emplear múltiples módulos, cada uno encapsulando un conjunto de capacidades estrechamente relacionadas.

Para ilustrar esto con un ejemplo, imaginemos que estamos creando una funcionalidad en torno a un carrito de la compra. Si nuestra aplicación tiene un controlador de carrito de la compra y un servicio de carrito de la compra. Ambos pertenecen al mismo dominio de aplicación ya que están muy relacionados. Este sería un ejemplo perfecto de cuándo podría tener sentido agrupar partes de nuestra aplicación y moverlas a su propio módulo de funcionalidad.

Para crear un módulo en Nest:

```
nest generate module
```

El decorador de módulos toma un único objeto cuyas propiedades describen el módulo y todo su contexto.

Los módulos contienen **CUATRO** cosas principales:.
 * Primero, son los Controladores: que puedes pensar que son nuestras raíces de la API que queremos que este módulo instancie.

 * A continuación, son las Exportaciones: aquí, podemos enumerar los Proveedores dentro de este módulo actual que deben estar disponibles en cualquier lugar, ESTE módulo es "importado".

 * Lo siguiente, son las Importaciones. Tal como vimos en AppModule... El Array de importaciones nos da la capacidad de listar -otros- módulos que ESTE módulo *requiere*. Todos los proveedores exportados de estos módulos importados están ahora -totalmente disponibles- AQUÍ dentro de este módulo también.

 * Por último está nuestro Array de proveedores. Aquí vamos a listar nuestros servicios que necesitan ser instanciados por el inyector Nest. Cualquier proveedor aquí estará disponible sólo dentro de ESTE módulo... A no ser que se añadan a la matriz de "Exportaciones" que vimos anteriormente.

# DTO

Un "Data Transfer Object", también conocido como DTO. Es un objeto que se utiliza para encapsular datos y enviarlos de una aplicación a otra. Los DTO's nos ayudan a definir las interfaces o entradas y salidas dentro de nuestro sistema.

Por ejemplo, imaginemos que tenemos una petición POST y con los DTO's... Podemos definir la forma o interfaz de lo que esperamos recibir para nuestro cuerpo.

Hasta ahora en este curso, hemos utilizado el decorador @Body() en nuestros puntos finales POST y PATCH, pero no tenemos ni idea de lo que esperamos que sea la carga útil. Aquí es exactamente donde entran los DTO. Para generar un DTO, podemos utilizar la CLI de Nest para generar simplemente una clase básica para nosotros a través de: `nest generate class [ seguido del nombre ]`.

```
nest generate class coffees/dto/create-coffee.dto --no-spec
```

Mirando este archivo recién creado, vamos a utilizar este CreateCoffeeDto como una forma de objeto de entrada esperada para la solicitud POST de nuestro CoffeesController. Este DTO, nos ayudará a ser capaces de hacer cosas como asegurarse de que la carga útil de la solicitud tiene todo lo que requerimos antes de ejecutar más código.

Sólo estamos tratando de crear la forma o la interfaz de objeto de lo que es nuestro objeto de transferencia de datos. Otra buena práctica con los DTO es marcar todas las propiedades como de sólo lectura para ayudar a mantener la inmutabilidad.


Los Data Transfer Object(DTO) son útiles para crear un tipo de seguridad dentro de nuestra aplicación.

Los DTO's nos permiten crear una definición de la forma de los datos que entran en el cuerpo de una petición de la API.

Pero no sabemos quién o qué está llamando a estas peticiones. ¿Cómo podemos asegurarnos de que los datos que llegan tienen la forma correcta? ¿O si faltan campos obligatorios? Es una buena práctica común para cualquier back end. validar la corrección de los datos que se envían a nuestras aplicaciones, y es aún más ideal si podemos validar automáticamente estas solicitudes entrantes.

NestJS proporciona el ValidationPipe para resolver exactamente este problema. El ValidationPipe proporciona una forma conveniente de hacer cumplir las reglas de validación para todas las cargas útiles entrantes del cliente. Puedes especificar estas reglas usando una simple anotación en tu DTO.

Abramos nuestro archivo main.ts y añadamos la siguiente línea `app.useGlobalPipes()`. 

```
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
```

A continuación, vamos a tener que instalar dos paquetes. Así que vamos a encender nuestro terminal y entrar en:

```
npm i class-validator class-transformer
```

Con todo instalado y nuestro ValidationPipe en su sitio, ya podemos empezar a añadir reglas de validación a nuestro DTO.

Abramos nuestro CreateCoffeeDto. Como la mayoría de los elementos aquí son String's Empecemos por importar IsString de class-validator.

Ahora, añadamos un decorador @IsString() antes de las propiedades nombre y marca, haciéndolas necesarias. Para darle sabor... utilicemos @IsString() con un objeto \ {} de cada establecido en true. "each: true" indica que el valor esperado es un Array de String's.

```
import { IsString } from 'class-validator';

export class CreateCoffeeDto {
    @IsString()
    readonly name: string;

    @IsString()
    readonly brand: string;

    @IsString({ each: true })
    readonly flavors: string[];
}
```

Bien, podemos ver que con la ayuda de class-validator hemos dado instrucciones para nuestro DTO y hemos establecido reglas, para cosas como: qué se requiere, y qué tipo esperamos que sean ciertas propiedades.

Ahora que tenemos estas reglas de validación, si una petición llega a nuestro punto final con una propiedad inválida en el cuerpo de la petición, la aplicación responderá automáticamente con un código 400 BadRequest, dándonos una respuesta automática y una forma de probar nuestras cargas útiles sin esfuerzo.


NestJS proporciona varias funciones de utilidad como parte del paquete `@nestjs/mapped-types`. Estas funciones nos ayudan a realizar transformaciones rápidamente.

De vuelta a nuestro terminal, instalemos el paquete @nestjs/mapped-types y veamos cómo podemos utilizarlo en nuestro código.

```
npm i @nestjs/mapped-types
```

PartialType espera que se le pase un tipo, así que pasemos CreateCoffeeDto. Esta función PartialType es realmente útil porque lo que hace por nosotros es devolver el Tipo de la clase que le pasamos, con todas las propiedades establecidas como opcionales. Y así, ¡no más código duplicado!

Asi tenemos nuestro UpdateCoffeeDto:

```
export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}
```

PartialType no sólo marca, todos los campos es opcional, sino que también hereda todas las reglas de validación aplicadas a través de decoradores, así como añade una única regla de validación adicional a cada campo la regla @IsOptional() sobre la marcha.




18 Handling Maliciuos Request Data






# Recursos

Podemos generar un nuevo m´dulo, con la funcionalidad mínima de un CRUD (un esqueleto de un módulo) utilizando el comando:

```
nest generate resource
```

