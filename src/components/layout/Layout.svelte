<script>
  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";
</script>

<style>
  section {
    text-align: center;
    /* padding: 2em; */
    width: 90%;
    margin-left: 5%;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <Header />
  <section>
    <slot />
  </section>
  <Footer />
</main>
