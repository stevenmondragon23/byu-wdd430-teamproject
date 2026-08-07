import Image from "next/image";
import styles from "@/app/landing.module.css";

export default function Page() {
  return (
    <>
      <div className={styles.HeroSection}>
        <Image
          src="/landing.jpg"
          loading="eager"
          alt="Hero Image"
          width={1200}
          height={600}
          style={{
            padding: 0,
            margin: 0,
          }}
        />
        <div className={styles.Overlay}>
          <h1>Handcrafted Haven</h1>
        </div>
      </div>

      <div className={styles.describeSection}>
        <section className={styles.left}>
          <Image
            src="/handcrafter.jpg"
            alt="HandCrafter Picture"
            width={1200}
            height={1000}
            style={{
              width: "500px",
              height: "auto",
              borderRadius: "10px",
              border: "solid 2px black",
            }}
          />

          <section
            className={styles.description}
            style={{
              textAlign: "right",
            }}
          >
            <h2>Who We Are?</h2>
            <p>
              Handcrafted Haven is a community dedicated to connecting artisans
              with people who value the authenticity and quality of handmade
              products. We believe that every handcrafted creation tells a
              unique story, and we strive to provide a space where creativity,
              craftsmanship, and passion can reach a wider audience.
            </p>
          </section>
        </section>

        <section className={styles.left}>
          <section
            className={styles.description}
            style={{
              textAlign: "left",
            }}
          >
            <h2>What We Do?</h2>
            <p>
              At Handcrafted Haven, we help artisans showcase and sell their
              handcrafted products while providing customers with a place to
              discover unique, high-quality items made with care. Our mission is
              to support small creators, celebrate craftsmanship, and foster a
              community that values handmade goods and responsible consumption.
            </p>
          </section>

          <Image
            src="/handcraft.jpg"
            alt="HandCraft Picture"
            width={1200}
            height={1000}
            style={{
              width: "500px",
              height: "auto",
              borderRadius: "10px",
              border: "solid 2px black",
            }}
          />
        </section>
      </div>
    </>
  );
}
