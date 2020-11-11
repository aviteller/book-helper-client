<script>
  import Cookies from "../../utils/Cookies.js";
  import Button from "../../UI/Button.svelte";
  import { pop } from "svelte-spa-router";
  const c = new Cookies();

  const cookieUser = JSON.parse(c.getCookie("user-jwt"));

  const logout = async () => {
    await c.eraseCookie("user-jwt");
    window.location.reload();
  };
</script>

<style>
  /* nav {
    display: flex;
    justify-content: space-around;
  } */

  header {
    padding-top: 1em;
    display: flex;
    justify-content: space-around;
    border-bottom: 4px solid rgba(79, 62, 122, 0.575);
    margin-bottom: 1em;
    padding-bottom: 1em;
  }
</style>

<header>
  {#if cookieUser}
    <span>Hello {cookieUser.name}, Role: {cookieUser.role}</span>
    <Button on:click={logout}>Logout</Button>
    <Button on:click={pop}>Go back</Button>
  {:else}
    <nav>
      <Button href="/#/login">Login</Button>
      <Button href="/#/register">register</Button>
    </nav>
  {/if}
</header>
