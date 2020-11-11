<script>
  import Router from "svelte-spa-router";
  import { routes } from "./routes";
  import Layout from "./components/layout/Layout.svelte";
</script>

<Layout>
  <Router {routes} />
</Layout>
