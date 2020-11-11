<script>
  export let params;
  import { onMount } from "svelte";
  import { customFetch } from "../../utils/helpers";
  import CInput from "../../UI/Input.svelte";
  import Notes from "../notes/index.svelte";
  import Chapters from "../chapters/index.svelte";
  import Error from "../../UI/Error.svelte";
  import { pop } from "svelte-spa-router";
  let error;
  let book = {};
  let chapters = [];
  let notes = [];
  let permisson;

  const genres = [
    { id: "none", label: "none" },
    { id: "fiction", label: "fiction" },
    { id: "real", label: "real" },
    { id: "cheese", label: "cheese" }
  ];

  const loadBook = () => {
    customFetch(`books/${params.id}`).then(res => {
      if (res.success) {
        book = res.data.book;
        chapters = res.data.chapters;
        notes = res.data.notes;
        permisson = res.data.permisson;
      } else {
        error = res;
      }
    });
  };

  const updateBook = () => {
    const updatedBook = {
      name: book.name,
      description: book.description,
      genre: book.genre,
      public: book.public,
      public_read_only: book.public_read_only
    };

    customFetch(`books/${params.id}`, {
      body: updatedBook,
      method: "PUT"
    }).then(res => {
      if (res.success === false) {
        error = res;
      }
    });
  };
  const addBook = () => {
    const newBook = {
      name: book.name,
      description: book.description,
      genre: book.genre,
      public: book.public,
      public_read_only: book.public_read_only
    };

    customFetch(`books`, {
      body: newBook
    }).then(res => {
      if (res.success === false) {
        error = res;
      } else {
        pop();
      }
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

  const addChapter = e => {
    if (chapters && chapters.length > 0) {
      chapters = [...chapters, e.detail];
    } else {
      chapters = [e.detail];
    }
  };

  const removeChapter = e =>
    (chapters = chapters.filter(c => c.id !== e.detail));
  const clearError = () => (error = null);

  onMount(async () => {
    if (params.id !== "new") {
      loadBook();
    } else {
      book = {
        name: "",
        description: "",
        genre: "none",
        public: true,
        public_read_only: true
      };
    }
  });
</script>

<style>
  .container {
    width: 70%;
    margin-left: 15%;
  }
</style>

{#if error}
  <Error message={error.msg} on:cancel={clearError} goBack="1" />
{/if}
{#if book.id}
  {#if permisson !== 'no-access'}
    <div class="container">

      {#if permisson === 'admin' || permisson === 'owner' || permisson === 'editable'}
        <CInput
          label="name"
          id="name"
          value={book.name}
          on:input={e => (book.name = e.target.value)} />
        <CInput
          label="description"
          id="description"
          type="textarea"
          bind:value={book.description} />
        <select value={book.gerne} on:blur={e => (book.genre = e.target.value)}>
          {#each genres as genre}
            <option value={genre.id} selected={genre.id === book.genre && true}>
              {genre.label}
            </option>
          {/each}
        </select>
        <label for="public">public</label>
        <input id="public" bind:checked={book.public} type="checkbox" />
        <label for="public_read_only">public_read_only</label>
        <input
          id="public_read_only"
          bind:checked={book.public_read_only}
          type="checkbox" />
        <br />
        <button on:click={updateBook}>Submit</button>
      {:else if permisson === 'read-only'}
        <h3>{book.name} - {book.genre}</h3>
        {book.descripton ? `<p>${book.descripton}</p>` : ''}
      {/if}

      <hr />
      <Chapters
        {chapters}
        {book}
        on:newchapter={addChapter}
        on:removechapter={removeChapter} />
      <hr />

      <Notes
        {notes}
        model={{ name: 'books', id: params.id }}
        on:newnote={addNote}
        on:removenote={removeNote} />

    </div>
  {:else}
    <h3>Sorry no access</h3>
  {/if}
{:else}
  <h1>NEW BOOK</h1>
  <CInput
    label="name"
    id="name"
    value={book.name}
    on:input={e => (book.name = e.target.value)} />
  <CInput
    label="description"
    id="description"
    type="textarea"
    bind:value={book.description} />
  <select value={book.gerne} on:blur={e => (book.genre = e.target.value)}>
    {#each genres as genre}
      <option value={genre.id} selected={genre.id === book.genre && true}>
        {genre.label}
      </option>
    {/each}
  </select>
  <label for="public">public</label>
  <input id="public" bind:checked={book.public} type="checkbox" />
  <label for="public_read_only">public_read_only</label>
  <input
    id="public_read_only"
    bind:checked={book.public_read_only}
    type="checkbox" />
  <br />
  <button on:click={addBook}>Submit</button>
{/if}
