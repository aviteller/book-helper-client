
<script>
  import { createEventDispatcher } from "svelte";
  import { customFetch } from "../../utils/helpers";
  import CInput from "../../UI/Input.svelte";
  import Table from "../../UI/Table.svelte";
  import SortableList from "../../UI/SortableList.svelte";
  export let chapters = [];
  export let book = {};
  const dispatch = createEventDispatcher();
  let title = "";
  const sortList = ev => (chapters = ev.detail);

  const deleteChapter = id =>
    customFetch(`chapters/${id}`, { method: "DELETE" }).then(
      async res => await dispatch("removechapter", id)
    );

  const saveSort = ({detail}) => {
    customFetch(`chapters/swap/${detail[0]}/${detail[1]}`).then(res => console.log(res))
  }

  const addChapter = () => {
    if (title !== "") {
      const newChapter = {
        book_id: book.id,
        title
      };

      customFetch("chapters", { body: newChapter }).then(async res => {
        await dispatch("newchapter", res.data);
        title = "";
      });
    }
  };
</script>

<style>
  #chapters {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }
  #meetup-controls {
    margin: 1rem;
    display: flex;
    justify-content: space-between;
  }
  #no-meetups {
    margin: 1rem;
  }
  @media (min-width: 768px) {
    #chapters {
      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>

<h3>Chapters for {book.name}</h3>
<CInput
  label="title"
  id="title"
  value={title}
  on:input={e => (title = e.target.value)} />

<button on:click={addChapter}>Submit</button>
{#if chapters}
  <div id="chapters">

    <SortableList list={chapters} key="id" on:sort={sortList} let:item on:savesort={saveSort}>
      <div style="border:1px solid black">
        <b>{item.position}</b>
        <p>{item.id}</p>
        <p>{item.title}</p>
        <p>
          <a href={`/#/chapters/${item.id}`}>edit</a>
        </p>
        <p>
          <button on:click={deleteChapter(item.id)}>X</button>
        </p>
      </div>
    </SortableList>
  </div>
  <!-- <Table headers={['id', 'title', { name: 'actions', col: 2 }]}>
    <tbody slot="body">

      {#each chapters as chapter}
        <tr>
          <td>{chapter.id}</td>
          <td>{chapter.title}</td>
          <td>
            <a href={`/#/chapters/${chapter.id}`}>edit</a>
          </td>
          <td>
            <button on:click={deleteChapter(chapter.id)}>X</button>
          </td>
        </tr>
      {/each}
    </tbody>

  </Table> -->
{:else}add chapter{/if}
