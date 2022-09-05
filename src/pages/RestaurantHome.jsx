import React from "react";
import Card from "react-bootstrap/Card";
import { useEffect } from "react";
import { db, requestPermission } from "../firebase_messaging";
import { setDoc, doc, getDocs, collection } from "firebase/firestore";
import { useState } from "react";

function RestaurantHome() {
  const [restaurantBasketList, setRestaurantBasketList] = useState([]);
  const [userId, setUserId] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [courierToken, setCourierToken] = useState("");

  const getUserRestaurantBasket = async () => {
    const querySnapshot = await getDocs(
      collection(db, userId + ".CurrentRestaurantBasket")
    );

    var list = [];

    querySnapshot.forEach((doc) => {
      let food = {
        name: doc.data().name,
        price: doc.data().price,
        quantitiy: doc.data().quantitiy,
        restaurant_name: doc.data().restaurant_name,
        text: doc.data().text,
      };

      list.push(food);
    });

    setRestaurantName(list[0].restaurant_name.toString());

    setRestaurantBasketList(list);

    console.log(restaurantBasketList);
  };

  useEffect(() => {
    var web_token = requestPermission();
    console.log(web_token);

    sendToFireStore(web_token);
    getUserId();
    getUserRestaurantBasket();
    getCourierToken();
  },);

  const sendToFireStore = async (web_token) => {
    await setDoc(doc(db, "CurrentRestaurant", "CurrentRestaurantDoc"), {
      web_token: web_token,
    });
  };

  const getUserId = async () => {
    var user_id = "";
    const querySnapshot = await getDocs(collection(db, "CurrentUser"));
    querySnapshot.forEach((doc) => {
      user_id = doc.data().user_id;
    });

    setUserId(user_id);
  };

  const getCourierToken = async () => {
    var courier_token = "";
    const querySnapshot = await getDocs(collection(db, "CurrentCourier"));
    querySnapshot.forEach((doc) => {
      courier_token = doc.data().user_id;
    });

    setCourierToken(courier_token);
  };



  return (
    <div>
      <h1>{restaurantName}</h1>
      <Card style={{ width: "25rem", height: "25rem", marginTop: "20px" }}>
        <Card.Body>
          <Card.Title>Sipariş Kutusu</Card.Title>
          <Card.Text>
             
            {  restaurantBasketList.map((item, index) => {
              return (
                <div key={index}>
                  ₺{item.price} - {item.quantitiy} adet - {item.name} (
                  {item.text})
                </div>
              );
            })}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default RestaurantHome;
