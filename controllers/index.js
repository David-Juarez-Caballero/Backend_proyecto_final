
const FS = require('../firebase');
const { db } = FS;
const products = []

//Primer Endpoint: Crear la cuenta
const signUpAcount = async (req, res) => {
    try {
        //It is necesarry that the user enter an email and a password
        const { body } = req;
        const { email: userEmail, password: userPassword } = body;
        //Default values money to all the new accounts
        const money = 0

        //Verifiying that the user doesnt send empty info
        if (userEmail && userPassword) {
            //Entering the database
            const acountDB = db.collection('acounts');
            //creating an account with the inputed data, and with a field that is money with
            // a default values of 0
            const { _path: { segments } } = await acountDB.add({ body, money });

            const id = segments[1];
            //It returns the user data
            res.send({
                status: 200,
                Message: "Succesfully signed up",
                id,
                email: body.email,
                password: body.password,
                products: products,
                money: money
            })
        } else {
            res.send("Warning: Missing info")
        }
    } catch (error) {
        res.send("An error ocurred")
    }
}

//second endpoint for siging in
const signInAcount = async (req, res) => {
    try {
        //The user needs to send an email and a password for looking it up in the database
        const { body } = req;

        //asking the email as a parameter

        const { email: userEmail, password: userPassword } = body;

        //Verifiying that the user isnt sending empy info
        if (userEmail && userPassword) {

            //Entering the database and obtaining all the info
            const acountDB = await db.collection('acounts').get();

            //filtering all the unnecessary info from the database
            const resp = acountDB.docs.map(doc => doc.data());

            //Searching the user emain in the emails of the database
            const emailFound = resp.find(x => x.body.email == userEmail);


            //If the email exist then
            if (emailFound) {

                //verifying that the passwords match
                if (userPassword === emailFound.body.password) {
                    //Sending info succesfully
                    res.send({
                        status: 200,
                        id: "",
                        Message: "Succesfully loged in",
                        email: emailFound.body.email,
                        password: emailFound.body.password,
                        products: products,
                        money: emailFound.money
                    })

                    //if the passwords mismatch send warning
                } else {
                    res.send("Warning: Missmatch password")
                }
            }
            //if the email isnt found send warning
            else {
                res.send("Warning: Email not found")
            }
            //If the user didnt send complete info send a warning
        } else {
            res.send("Warning: Missing info")
        }
    } catch (error) {
        res.send("An error ocurred")
    }
}


//third endopint for adding funds to an account
const addfundsAcount = async (req, res) => {
    try {
        //asking the user id
        const { params: { id } } = req
        //asking the user the quantity of funds to add
        const { body } = req
        const { money: newFunds } = body

        //verify that the entes a valid number
        if ((newFunds > 0 && typeof newFunds === 'number')) {

            //entering the databse and retrieving the user data
            const acountDB = db.collection('acounts').doc(id)
            const { _fieldsProto } = await acountDB.get()

            //Serach if the user has money

            const moneyFound = _fieldsProto.money;


            //if the user the field of money
            if (moneyFound) {

                // Obtaining the ustored money of the account
                const savedMoney = parseInt(_fieldsProto.money.integerValue)
                //add up the new quantity anl the saved one
                const newMoney = newFunds + savedMoney
                //uploading the new info to the database
                const resp = await acountDB.update({
                    money: newMoney
                })


                //send tthe user info
                res.send({
                    status: 200,
                    Message: "Funds Added succesfully",
                    email: _fieldsProto.body.mapValue.fields.email.stringValue,
                    password: _fieldsProto.body.mapValue.fields.password.stringValue,
                    money: newMoney

                })
            }
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
        }
    } catch (error) {
        res.send("An error ocurred")
    }
}

const addingProductsToCart = async (req, res) => {
    try {
        //asking the user id
        const { params: { id } } = req
        //asking the user iformation of the products 
        const { body } = req
        const { operation, productName, productPrice, productImg, amount, totalPrice } = body
        //validating the informaition inputted
        console.log(body)
        if (productName && productImg && productPrice && amount && operation && totalPrice) {
            //if the infoprmation is complete, then acces to the databese and retrieve user info
            const acountDB = db.collection('acounts').doc(id)
            const userData = await acountDB.get()
            
            //Retrieving the user money
            const { money } = userData.data()
            //Retrieving the user products
            const { products } = userData.data()
            //search if the product exist
            const product = products.find(x => x.productName === productName)
            if (operation === "add") { //if the opertaion is add
                if (product) { //if found
                    //add up the amount and the total_prize
                    product.amount += amount;
                    product.totalPrice += totalPrice;
                }
                else {  //if not found, add the new product info to the database
                 
                    products.push({ productName, productImg, productPrice, amount, totalPrice })

                }
                res.send({
                    status: 200,
                    Message: "Succesfully updated the product",
                    User_Money: money,
                    products

                })
                await acountDB.update({ products })
            } else { //if the user is reducing the amount
                if (product && product.amount > 0) { //if found
                    //add up the amount and the total_prize
                    product.amount -= amount;
                    product.totalPrice -= totalPrice;
                    res.send({
                        status: 200,
                        Message: "Succesfully updated the product",
                        User_Money: money,
                        products

                    })
                    await acountDB.update({ products })
                }
                else {  //if not found, send warning
                    res.send({
                        status: 200,
                        waning: "This product isnt in the cart ",
                        User_Money: money,
                        products

                    })
                }
            }

        } else {  // if the information isnt complete send warning
            res.send({
                status: 505,
                Warning: "Missing Information",

            })
        }

    } catch (error) {
        res.send(`An error ocurred`)
    }
}

//unico endpoint
const addDataAcount = async (req, res) => {
    try {
        //asking the product info
        const { body } = req
        const {  title, description, thumbnail, price } = body
        const amount = 1
        //Verifiying that
       
        if (title && description && thumbnail &&  price ) {
            const acountDB = db.collection('acounts');
            const { _path: { segments } } = await acountDB.add({ body, amount });
            const id = segments[1];
            res.send({
                status: 200,
                Message: "Succesfully uploaded data",
                id,
                
            })
        } else {  // if the information isnt complete send warning
            res.send({
                status: 505,
                Warning: "Missing Information sdadasdasdsad",

            })
        }
    }
    catch(error) {console.log(error) }
}

module.exports = {
    signUpAcount,
    signInAcount,
    addfundsAcount,
    addingProductsToCart,
    addDataAcount
}