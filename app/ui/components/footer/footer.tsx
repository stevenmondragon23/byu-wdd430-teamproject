import Link from "next/link";
import styles from '@/app/ui/components/footer/footer.module.css'
import { FaInstagram , FaGithubSquare} from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";

export default function Footer(){
    return(
        <div className={styles.footPart}>
            <section className={styles.footerInfo}>
                <div className={styles.brand}> 
                    <p>"Connecting artisans with people who value unique handmade creations"
                    </p>

                    <p>
                     © 2026 Handcrafted Haven. All rights reserved.
                    </p>
                </div> 
            </section>

            <section className={styles.IconsBar}>
                <Link
                href="https://www.instagram.com/"
                >
                    <div className={styles.social}>    
                    <FaInstagram color="black" size={40} className={styles.icon} href="https://www.instagram.com/"/>
                    </div>
                </Link>
                    
                <Link
                href="https://github.com/"
                >
                    <div className={styles.social}>
                    <FaGithubSquare color="black" size={40} className={styles.icon}/>
                    </div>
                </Link>

                <Link
                href="https://www.facebook.com/"
                >
                    <div className={styles.social}>
                    <FaSquareFacebook color="black" size={40} className={styles.icon}/>
                    </div>
                </Link>
            </section>
        </div>
)}
