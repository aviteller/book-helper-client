<script>
  import { createEventDispatcher } from "svelte";
  import { customFetch } from "../../utils/helpers";
  import CInput from "../../UI/Input.svelte";
  import Table from "../../UI/Table.svelte";

  export let notes = [];
  export let model = {};
  const dispatch = createEventDispatcher();
  let text = "";

  const deleteNote = id =>
    customFetch(`notes/${id}`, { method: "DELETE" }).then(
      async res => await dispatch("removenote", id)
    );

  const addNote = () => {
    const newNote = {
      model: model.name,
      model_id: model.id,
      text
    };

    customFetch("notes", { body: newNote }).then(async res => {
      await dispatch("newnote", res.data);
      text = "";
    });
  };
</script>

<h3>Notes for {model.name}#: {model.id}</h3>
<CInput
  label="text"
  id="text"
  value={text}
  on:input={e => (text = e.target.value)} />

<button on:click={addNote}>Submit</button>
<br />
{#if notes}
  <Table headers={['id', 'username', 'text', 'action']}>
    <tbody slot="body">

      {#each notes as note}
        <tr>
          <td>{note.id}</td>
          <td>{note.username}</td>
          <td>{note.text}</td>
          <td>
            <button on:click={deleteNote(note.id)}>X</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </Table>
{:else}Add notes{/if}
