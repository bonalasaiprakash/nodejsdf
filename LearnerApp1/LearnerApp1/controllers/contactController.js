const asyncHandler = require("express-async-handler");
const  mongoose = require("mongoose");
const Contact = require("../models/contactModel")

/** Creating the CRUD function logics and methods and exporting to routes file */

//@desc GET all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req,res)=>{
    const conts = await Contact.find({createdUserId:req.user.id});
    // res.status(200).json({response:"You are on GET request in route[/contacts]"})
    res.status(200).json(conts)
    // res.status(200).json({message:"Contact Found Successfully.","Resource Details":conts})
})

//@desc GET a specific contact by ID
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req,res)=>{
    const singleContactObj = await Contact.findById(req.params.id)
    if(!singleContactObj){
        res.status(404);
        throw new Error("Contact Not Found")
    }

    res.status(200).json({message:"Contact Found Successfully.","Resource Details":singleContactObj})
    // res.status(200).json({response:`You are on GET request in route[/contacts] with the params received is ${req.params.id}`})
})

//@desc POST a contact to existing list means create functionality
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req,res)=>{
        const {name,email,phone} = req.body;              
        //console.log("Name : "+name+" Email : "+email+" Phone : "+phone);
        if(!name || !email || !phone){
            res.status(400);
            throw new Error("All fields are necessary dude!")
        }

        //console.log("The id of logged in user: ",req.user.id)

        if(!req.user.id){
            res.status(400)
            throw new Error("You must be logged In before you add a contact in your list.");
        }

        const singleContact = await Contact.create({
            name,
            email,
            phone,
            createdUserId:req.user.id
        })

        res.status(201).json({message:"Contact Created Successfully.","Created Resource":singleContact})
        //res.status(201).json({message:"You're POST request is served successfully.",response:`Contents of Body in POST request is ${req.body.name} with ${req.body.email} and ${req.body.phone}`})    
})

//@desc POST request to bulk add contacts to existing list means bulk create functionality
//@route POST /api/contacts/bulkCreate
//@access private
const bulkCreateContacts = asyncHandler(async (req,res)=>{
    const count = Object.keys(req.body).length;
    console.log("Total count of objects in json body : ",count)
    // res.status(200).json({message:"Count of objects extracted",countOfObjects:count})
    // res.status(200).json({message:"Count of objects extracted",specificObjectDetail:req.body[3].name})

    const createdContacts = new Array();

    for (let i = 0; i < count; i++) {
        const {name,email,phone} = req.body[i];     
        
        //console.log("Name : "+name+" Email : "+email+" Phone : "+phone);
        if(!name || !email || !phone){
            res.status(400);
            throw new Error("All fields are necessary dude!")
        }

        if(!req.user.id){
            res.status(400)
            throw new Error("You must be logged In before you add a contact in your list.");
        }

        const singleContact = await Contact.create({
            name,
            email,
            phone,
            createdUserId:req.user.id
        })

        
        createdContacts.push(singleContact)
        
    }

    res.status(201).json({message:"Contact(s) Created Successfully.","Created Resource(s)":createdContacts})
})

//@desc PUT or PATCH to a specific contact by ID means update functionality to existing contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req,res)=>{
    const singleContactObj = await Contact.findById(req.params.id)
    if(!singleContactObj){
        res.status(404);
        throw new Error("Contact Not Found")
    }

    if(singleContactObj.createdUserId.toString() !== req.user.id){
        res.status(403)
        throw new Error("No User have rights to Update or Delete contacts created by other users.")
    }

    const updatedSingleContactObj = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    res.status(201).json({message:"Contact Updated Successfully.","Updated Resource":updatedSingleContactObj})
    // res.status(202).json({message:"You're PUT request is FIRED.",response:`ID Content in params from your PUT request is ${req.params.id}`})
})

//@desc DELETE a specific contact by ID
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req,res)=>{
    const singleContactObj = await Contact.findById(req.params.id)
    if(!singleContactObj){
        res.status(404);
        throw new Error("Contact Not Found")
    }

    if(singleContactObj.createdUserId.toString() !== req.user.id){
        res.status(403)
        throw new Error("No User have rights to Update or Delete contacts created by other users.")
    }

    await Contact.deleteOne({_id:req.params.id});
    res.status(200).json({message:"Contact Deleted Successfully.","Deleted Resource":singleContactObj})
    // res.status(202).json({response:`You're DELETE request is done for the ID ${req.params.id}`,message:"You're delted successfully due to your DELETE request."})
})

module.exports = {getContact,getContacts,createContact,updateContact,deleteContact,bulkCreateContacts}