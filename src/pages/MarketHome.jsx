import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useEffect } from "react";
import { db, requestPermission } from "../firebase_messaging";
import { setDoc, doc, getDocs, collection } from "firebase/firestore";
import { useState } from "react";

function MarketHome() {
  const [restaurantBasketList, setRestaurantBasketList] = useState([]);
  const [userId, setUserId] = useState("");
  const [courierToken, setCourierToken] = useState("");

  const getUserMarketBasket = async () => {
    const querySnapshot = await getDocs(
      collection(db, userId + ".CurrentMarketBasket")
    );

    var list = [];

    querySnapshot.forEach((doc) => {
      let food = {
        name: doc.data().name,
        price: doc.data().price,
        quantitiy: doc.data().quantitiy,
        text: doc.data().text,
      };

      list.push(food);
    });

    setRestaurantBasketList(list);

    console.log(restaurantBasketList);
  };

  useEffect(() => {
    var web_token = requestPermission();
    console.log(web_token);

    sendToFireStore(web_token);
    getUserId();
    getUserMarketBasket();
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
      /*let User = {
        device_token:doc.data().device_token,
        user_id:doc.data().user_id,
      }*/
      user_id = doc.data().user_id;
    });

    setUserId(user_id);
  };

  const getCourierToken = async () => {
    var courier_token = "";
    const querySnapshot = await getDocs(collection(db, "CurrentCourier"));
    querySnapshot.forEach((doc) => {
      /*let User = {
        device_token:doc.data().device_token,
        user_id:doc.data().user_id,
      }*/
      courier_token = doc.data().device_token;
    });

    setCourierToken(courier_token);
  };

  const callOnFcmApiSendPushNotificaitons = async (title, body) => {

    console.log(courierToken);

    fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "key=AAAA83fQ5ws:APA91bFTKvfHiHcfPYe-MNnO5bjLJFgptWOL88NiTJ7VdjDdsC868mLNWVqI4Txvbqj6ylOd6Bxa_yI9NR8FqI-QM8kPYYfEI-v0vk7L7tKvFExQsTc9DgpKSPYrq-vz8x--LfdS3Gmk",
      },
      body: JSON.stringify({
        to: courierToken,
        notification: {
          title: title,
          body: body,
        },
        data: {
          type: "Market",
          id: "28",
          click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
      }),
    });
  };

  const handleButtonClick = () => {
    console.log("Kurye Çağrıldı!");
    console.log("Kuryeye bildirim yollanıyor...");

    callOnFcmApiSendPushNotificaitons("Teslimat Hazır!", 'Teslimat için hedef konuma gidiniz!');
  };

  return (
    <div>
      <Card style={{ width: "25rem", height: "25rem", marginTop: "20px" }}>
        <Card.Body>
          <Card.Title>Sipariş Kutusu</Card.Title>
          <Card.Text>
            {restaurantBasketList.map((item, index) => {
              return (
                <div key={index}>
                  ₺{item.price} - {item.quantitiy} adet - {item.name} (
                  {item.text})
                </div>
              );
            })}
          </Card.Text>
          {
            restaurantBasketList.length > 0 ? <Button onClick={handleButtonClick}variant="success" >Kuryeyi Çağır</Button> : <div>Sepet Boş</div>
          }
        </Card.Body>
      </Card>
    </div>
  );
}

export default MarketHome;
