import {Request,Response} from "express";
import {QueryResult} from 'pg';
import {promisify} from "util";
import {pool } from "../db";
import {client} from "../redis/index";


const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.setex).bind(client);


export const users = async(req:Request,res:Response):Promise<Response> => {
   try {
       const reply = await GET_ASYNC('users');
       if(reply){
         console.log('cached using');   
        return res.status(200).json(reply)};

    let fetchallusers:QueryResult =  await pool.query('SELECT * FROM users');
    //   console.log(fetchallusers);
    let response = await SET_ASYNC('users', 35, JSON.stringify(fetchallusers.rows));
    console.log('new data cached', response);

        return res.status(200).json(fetchallusers.rows);
   }
   catch(error){
       return res.status(500).json(error.message);
   }
  // res.send(fetchallusers);
};

export const userbyId = async(req:Request,res: Response):Promise<Response> => {
    try {
        console.log(req.params.id);
    let user = await pool.query(`SELECT * FROM users WHERE id=$1`, [req.params.id]);
   if(user.rowCount === 0){return res.status(404).send({message:'Invalid user id'})};
   return res.status(200).json(user.rows);    
}
    catch(error){
        return res.status(500).json(error.message);
    }
};

export const createuser = async(req:Request,res: Response):Promise<Response>  => {
try {
    const {name,email} = req.body;
    console.log(name);
    console.log(email);
let user = await pool.query(`INSERT INTO users(name,email) VALUES($1,$2)`, [name,email]);
return res.status(200).send({message: 'user inserted'});
}

catch(error){
    return res.status(500).json(error.message);
}

};

export const updateuser = async(req:Request,res:Response):Promise<Response> => {
    try{
        console.log(req.params.id);
        let user = await pool.query(`SELECT * FROM users WHERE id=$1`, [req.params.id]);
        // console.log(user);
        if(user.rowCount === 0){return res.status(404).send({message:'Invalid user id'})};
        let newuser = await pool.query('UPDATE users SET name=$1, email=$2 WHERE id=$3', [req.body.name,req.body.email,req.params.id]);
        return res.status(200).send({message:'user updated'});
    }
catch(error){
    return res.status(500).send(error.message);
}

};


export const removeuser = async(req:Request,res:Response):Promise<Response> => {
 try {
    let user = await pool.query(`SELECT * FROM users WHERE id=$1`, [req.params.id]);
    if(user.rowCount === 0) {return res.status(404).send({message:"Invalid userid"})};
    let  removeuser = await pool.query(`DELETE FROM users where id=$1`, [req.params.id]);
    return res.status(200).send({message:`${req.params.id} is removed`});
 }
 catch(error){
     return res.status(500).send(error.mesage);
 }
};