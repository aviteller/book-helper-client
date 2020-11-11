<script>
  import { push } from "svelte-spa-router";
  import config from "../../config/config";
  import { customFetch } from "../../utils/helpers";
  import Cookies from "../../utils/Cookies";
  import Error from "../../UI/Error.svelte";

  let c = new Cookies();
  let user = {
    email: "",
    password: ""
  };

  let errors = "";

  const loginUser = async user => {
    let data = await customFetch(`auth/login`, {
      body: user
    });

    // console.log(data);
    return data;
  };

  const submitLoginForm = () => {
    if (user.email == "" || user.password == "") {
      errors = "Please enter all fields";
    } else {
      errors = "";
      loginUser(user)
        .then(res => {
          c.setCookie("user-jwt", JSON.stringify(res.data), 1);
        })
        .then(res => location.assign("/"));
    }
  };

  const apiTest = () => {
    customFetch(`${config.apiUrl}auth/test`, {
      method: "PUT",

      body: { updates: "heer" }
    });
  };
</script>

{#if errors}
  <Error message={errors} on:cancel={() => (errors = null)} />
{/if}
<h1>Login</h1>

<form class="auth-from" on:submit|preventDefault>
  <!-- <div style="color:red">{errors}</div> -->
  <label for="email">email</label>
  <input type="email" name="email" id="email" bind:value={user.email} />
  <label for="password">Password</label>
  <input
    type="password"
    name="password"
    id="password"
    bind:value={user.password} />
  <button on:click={submitLoginForm}>Submit</button>
</form>
