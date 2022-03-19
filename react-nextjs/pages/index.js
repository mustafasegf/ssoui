import styles from "../styles/Home.module.css";
import { useState } from 'react';

export default function Home() {
  const [nama, setNama] = useState(null);


  const loginHandler = async () => {
    const data = await popUpLogin()
    setNama(data.nama)
    localStorage.setItem("ssoui", JSON.stringify(data));
  };

  const popUpLogin = () => {
    const SSOWindow = window.open(
      new URL(
        "https://sso.ui.ac.id/cas2/login?service=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Flogin%2F"
      ).toString(),
      "SSO UI Login",
      "left=50, top=50, width=480, height=480"
    );

    return new Promise(function (resolve, reject) {
      window.addEventListener(
        "message",
        (e) => {
          if (SSOWindow) {
            SSOWindow.close();
          }
          const data = e.data;
          resolve(data);
        },
        { once: true }
      );
    });
  };
  return (
    <div className={styles.container}>
      <h1>ini test</h1>
      <button onClick={loginHandler}>Clickme</button>
      { nama ?<p>Hi {nama}</p>: <></> } 
    </div>
  );
}
