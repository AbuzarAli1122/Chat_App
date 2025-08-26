import { userSocketIDS } from "../app.js";


export const getOtherMember = (members,userId)=>{
    return members.find((member)=>member._id.toString()!==userId.toString())

};

export const getSockets = (users = []) => {
  const sockets = users.flatMap((user) => userSocketIDS.get(user.toString()) || []);
  console.log("✅ Final socket list:", sockets);
  return sockets;
};


export const getBase64 = (file) => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
