import "./table.css"
import { useDispatch} from 'react-redux';
import { getAppointments, deleteOrder, UpdateOrder} from '../../actions/orders';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


const TableAppoinment = () => {
    const dispatch = useDispatch();
    

    const [worker] = useState(JSON.parse(localStorage.getItem('profile2')));

    useEffect(() => {
          dispatch(getAppointments(worker.result._id));
      }, [dispatch]);
  
    const orders = useSelector((state) => state.orders);

    const [postData, setPostData] = useState({
      status: "Completed"
  
  });

  const [text, setText] = useState({
    stat: "Complete"

});

    return (
      <div>
        {
            orders.map((order) => (                            
                <div key={order._id}>
                    <h3>Service : {order.work}</h3>
                    <h3 >{order.userName}</h3>
                    <p >Schedule: {order.date.slice(0, 10)} {order.time}</p>
                    <p >Mob: {order.userContact}</p>
                    <p >Order No: {order._id}</p>
                    <p >Status: {order.status}</p>
               
                    <button onClick={() => {
                      dispatch(deleteOrder(order._id))
                      window.location.reload();
                      }}>Cancel Order</button>

                    <button onClick={() => {
                    //  setText( {stat: "Completed"})
                  
                    dispatch(UpdateOrder(order._id, postData))
                    window.location.reload();
                    
                    }}>{text.stat}</button>
                    <br></br>
                </div>
            ))
        }
      </div>
    )
  }

export default TableAppoinment;
