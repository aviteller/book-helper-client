<script>
  export let params;
  import { onMount } from "svelte";
  import { customFetch } from "../../utils/helpers";
  import CInput from "../../UI/Input.svelte";
  import TextEditor from "../../UI/TextEditor.svelte";
  import Notes from "../notes/index.svelte";

  let chapter = {};
  let notes = [];
  let permisson;

  const loadChapter = () => {
    customFetch(`chapters/${params.id}`).then(res => {
      chapter = res.data.chapter;
      notes = res.data.notes;
      permisson = res.data.permisson || res.data.msg;
    });
  };

  const updateText = ({detail}) => {
    chapter.text = detail
  }

  const updateChapter = () => {
    const updatedChapter = {
      title: chapter.title,
      text: chapter.text,
      public: chapter.public,
      public_read_only: chapter.public_read_only
    };

    customFetch(`chapters/${params.id}`, {
      body: updatedChapter,
      method: "PUT"
    }).then(res => {
      console.log(res);
    });
  };
  const addNote = e => {
    if (notes && notes.length > 0) {
      notes = [...notes, e.detail];
    } else {
      notes = [e.detail];
    }
  };


  const removeNote = e => (notes = notes.filter(n => n.id !== e.detail));

  onMount(() => loadChapter());
</script>

{#if permisson !== 'no-access'}
  <div class="container">

    {#if permisson === 'admin' || permisson === 'owner' || permisson === 'editable'}
      <CInput
        label="title"
        id="title"
        value={chapter.title}
        on:input={e => (chapter.title = e.target.value)} />
        <TextEditor value={chapter.text} on:returnvalue={updateText}/>
      <!-- <CInput
        label="text"
        id="text"
        type="textarea"
        rows="7"
        bind:value={chapter.text} /> -->

      <label for="public">public</label>
      <input id="public" bind:checked={chapter.public} type="checkbox" />
      <label for="public_read_only">public_read_only</label>
      <input
        id="public_read_only"
        bind:checked={chapter.public_read_only}
        type="checkbox" />
      <br />
      <button on:click={updateChapter}>Submit</button>
    {:else if permisson === 'read-only'}
      <h3>{chapter.title} </h3>
      {chapter.text ? `<p>${chapter.text}</p>` : ''}
    {/if}

    <hr />

    <Notes
      {notes}
      model={{ name: 'chapters', id: params.id }}
      on:newnote={addNote}
      on:removenote={removeNote} />

  </div>
{:else}
  <h3>Sorry no access</h3>
{/if}
