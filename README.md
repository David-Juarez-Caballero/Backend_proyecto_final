Integrantes del equipo: Fernanda Avalos Bermudez Alan Coyote Musito Carlos Gabriel Grados Huerta David Aaron Juarez Caballero Juan Manuel Pulido Moreno

Para correr el código se necesita npm i -Para instalar las dependencias necesarias npm install @auth0/auth0-react npm start
npm start
Runs the app in the development mode.
Open http://localhost:3000 to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.



•	signUpAcount(post)
En este endpoint es necesario que el usuario meta un email y una contraseña ya que con eso creará una cuenta dentro de nuestra base de datos, para esto se tiene que verificar que no le falte información de lo que se le pide.
Si la información es correcta nos regresará lo siguiente:
 res.send({
                status: 200,
                Message: "Succesfully signed up",
                id,
                email: body.email,
                password: body.password,
                products: products,
                money: money
            })

De lo contrario nos mandará los siguiente:
} else {
            res.send("Warning: Missing info")
        }







•	signInAcount(get)
Este endpoint se encarga de verificar si un usuario ya está registrado en la base de datos para poder ingresar, para esto primero se verifica que el usuario mande un email y una contraseña, posteriormente se busca el email en la base de datos, si existe dentro de la base entonces buscará que la contraseña ingresada coincida con la contraseña que pertenece a ese email.
Si la información proporcionada es correcta nos arrojará lo siguiente:
res.send({
                        status: 200,
                        Message: "Succesfully loged in",
                        email: emailFound.body.email,
                        password: emailFound.body.password,
                        products: products,
                        money: emailFound.money
                    })

De lo contrario nos mandará esto:
res.send("Warning: Missmatch password")











•	addfundsAcount(put)
Para este endpoint lo primero que tenemos que hacer es pedirle al usuario el ID de su cuenta, cuando la cuenta es localizada en la base de datos, entonces se le pregunta al usuario cuanto dinero desea agregar, posteriormente se verifica que el usuario meta un número válido, si es así entonces después se verifica si el usuario ya tenía dinero anteriormente para sumar la cantidad anterior.
Si el usuario agrega dinero de forma correcta nos arrojará lo siguiente:
res.send({
                    status: 200,
                    Message: "Funds Added succesfully",
                    email: _fieldsProto.body.mapValue.fields.email.stringValue,
                    password: _fieldsProto.body.mapValue.fields.password.stringValue,
                    money: newMoney

Si el usuario no mete un número válido o no se agrega de manera correcta nos devolverá lo siguiente:
else {
                res.send({
                    status: 404,
                    Message: "Money not found",

                })
            }
        }
        //if the user inputed an invalid number or character
        else {
            res.send({
                //send warning
                status: 505,
                Error: "Warning: You entered a negative number or a invalid character"
            })

•	addingProductsToCart(post)
Este endpoint nos ayudará con la tarea de agregar algún artículo a nuestro carrito, para esto se requiere el ID de la cuenta del usuario, y cuando se agregue un articulo al carrito tiene que pasar los siguientes datos: Nombre del producto, precio, imagen del producto, cantidad y precio total.
Si el producto existe en el carrito solo se cambia la cantidad y el precio total, si no existe entonces se agrega el producto y se va la información a la base de datos y nos arroja lo siguiente:
res.send({
                    status: 200,
                    Message: "Succesfully updated the product",
                    User_Money: money,
                    products
                })
De lo contario marca el siguiente error:
res.send({
                status: 505,
                Warning: "Missing Information",

            })






•	addDataAcount
Este endpoint lo que realiza es pedir la información del producto que queremos agregar al carrito (Nombre del producto, precio, imagen del producto, cantidad y precio total), luego comprueba si la información esta correcta y completa el producto es agregado a la base de datos.
Si funciona entonces el programa nos devuelve lo siguiente:
res.send({
                status: 200,
                Message: "Succesfully uploaded data",
                id,
                email,
                money: money
            })

En caso de que la información esté incompleta entonces arroja esto:
res.send({
                status: 505,
                Warning: "Missing Information"})
