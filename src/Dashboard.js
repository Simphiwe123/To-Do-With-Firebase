import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where, orderBy } from "firebase/firestore";
import Todo from './Todo';
import { serverTimestamp, addDoc } from 'firebase/firestore';
import './App.css';
import './todo.css';


import { onSnapshot } from 'firebase/firestore';

//New
import {TextField , Button } from '@mui/material';
import './App.css';
//New
const q=query(collection(db,'todos'),orderBy('timestamp','desc'));

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);

  //New
  const [todos,setTodos]=useState([]);
const [input, setInput]=useState('');
useEffect(() => {
onSnapshot(q,(snapshot)=>{
setTodos(snapshot.docs.map(doc=>({
id: doc.id,
item: doc.data()
})))
})
},[input]);
const addTodo=(e)=>{
e.preventDefault();
addDoc(collection(db,'todos'),{
todo:input,
timestamp: serverTimestamp()
})
setInput('')
};
  return (
    
    <div className="dashboard">
      
       <div className="dashboard__container">
        Logged in as
         <div>{name}</div>
         <div>{user?.email}</div>
         <button className="dashboard__btn" onClick={logout}>
          Logout
         </button>
         <div className="App">

          

         <h2> TODO List App</h2>
<form>
<TextField id="outlined-basic" label="Make Todo" variant="outlined" style={{margin:"0px 5px"}} size="small" value={input}
onChange={e=>setInput(e.target.value)} />
<Button variant="contained" color="primary" onClick={addTodo}  >Add Todo</Button>
</form>
<ul>
{todos.map(item=> <Todo key={item.id} arr={item} />)}
</ul>
</div>

       </div>
     </div>
  );
}
export default Dashboard;