import styles from "./Login.module.css"
import GoogleLogin from "../../components/Google/GoogleLogin";

export default function Login() {
    return (
        <div className={styles.loginCard}>
            <img src="" alt="" />
            <div className={styles.btnGoogle}>
            <GoogleLogin />
            </div>
        </div>
    );
}
