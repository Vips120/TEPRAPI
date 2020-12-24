import {Router} from "express";
const router = Router();
import {users,userbyId, createuser, updateuser, removeuser} from "../controllers/user";

router.get('/users', users);
router.get('/user/:id', userbyId);
router.post('/newuser', createuser);
router.put('/updateuser/:id', updateuser);
router.delete('/removeuser/:id', removeuser);
export default router;