import styles from "../styles/Home.module.css";

export default function Home() {
  const handlerLogin = async () => {
    const data = await popup()
    console.log(data)
  };

  const popup = () => {
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
      <button onClick={handlerLogin}>Clickme</button>
    </div>
  );
}
