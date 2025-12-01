import useGoogleLogin from "../../hooks/Google/useGoogleLogin";
import GoogleLogo from "../../assets/googleIcon.jpg";
import styles from "./GoogleLogin.module.css"

export default function GoogleLogin() {
  const { login } = useGoogleLogin();
  return (
    <div className={styles.container}>
      <img src={GoogleLogo} alt="" />
      <button className={styles.btnGoogle} onClick={() => login()}>Login com o google</button>
    </div>
  );
}
 