import Image from "next/image";
import styles from "@/app/landing.module.css";

export default function Page() {
  return (
    <>
      <section className={styles.heroSection}>
        <Image
          src="/landing.jpg"
          alt="Handcrafted Haven marketplace"
          width={1200}
          height={600}
          sizes="100vw"
          className={styles.heroImage}
        />

        <div className={styles.overlay}>
          <h1>Handcrafted Haven</h1>
        </div>
      </section>

      <section className={styles.describeSection}>
        <section className={styles.left}>
          <Image
            src="/handcrafter.jpg"
            alt="Artisan working on a handcrafted product"
            width={1200}
            height={1000}
            sizes="(max-width: 768px) 100vw, 500px"
            priority
            className={styles.sectionImage}
          />

          <div
            className={`${styles.description} ${styles.descriptionRight}`}
          >
            <h2>Who We Are?</h2>

            <p>
              Handcrafted Haven is a community dedicated to connecting
              artisans with people who value the authenticity and quality of
              handmade products. We believe that every handcrafted creation
              tells a unique story, and we strive to provide a space where
              creativity, craftsmanship, and passion can reach a wider
              audience.
            </p>
          </div>
        </section>

        <section className={styles.left}>
          <div
            className={`${styles.description} ${styles.descriptionLeft}`}
          >
            <h2>What We Do?</h2>

            <p>
              At Handcrafted Haven, we help artisans showcase and sell their
              handcrafted products while providing customers with a place to
              discover unique, high-quality items made with care. Our mission
              is to support small creators, celebrate craftsmanship, and foster
              a community that values handmade goods and responsible
              consumption.
            </p>
          </div>

          <Image
            src="/handcraft.jpg"
            alt="Handcrafted products"
            width={1200}
            height={1000}
            sizes="(max-width: 768px) 100vw, 500px"
            className={styles.sectionImage}
          />
        </section>
      </section>
    </>
  );
}