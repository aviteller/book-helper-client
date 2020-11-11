<script>
  import { onMount } from "svelte";
  import { customFetch } from "../../utils/helpers";

  import Table from "../../UI/Table.svelte";
  import Error from "../../UI/Error.svelte";
  import Pagination from "../../UI/Pagination.svelte";
  import LoadingSpinner from "../../UI/LoadingSpinner.svelte";

  let loaded = false;
  let error;
  let books = [];
  let pagination = {};
  let sortBy;
  let showPagination = true;
  let showDeleted = false;

  const getAllBooksPagination = e => getAllBooks({ page: e.detail });

  const getAllBooksSort = e => getAllBooks({ sort: e.detail });

  const getAllBooks = async (action = {}) => {
    loaded = false;
    let res;
    if (action.page) {
      res = await customFetch(
        `books${action.page !== null ? `?page=${action.page}` : ""}${
          sortBy ? `&sort=${sortBy}` : ""
        }${showDeleted ? "&deleted=true" : ""}`
      );
    } else if (action.sort) {
      res = await customFetch(
        `books?sort=${action.sort.dir == "desc" ? "-" : ""}${action.sort.name}${
          showDeleted ? "&deleted=true" : ""
        }`
      );
    } else {
      res = await customFetch(`books${showDeleted ? "?deleted=true" : ""}`);
    }

    books = res.data.rows;

    pagination = res.data.pagination;
    sortBy = res.data.sortBy || "created_at";

    if (pagination.total > 1) showPagination = true;
    loaded = true;
  };

  const deleteBook = async id => {
    if (window.confirm(`Are you sure you want to delete Book with id:${id}`)) {
      customFetch(`books/${id}`, {
        method: "DELETE"
      }).then(res => {
        books = books.filter(b => b.id !== id);
      });

      // getAllBooks();
    }
  };
  const restoreBook = async id => {
    try {
      
      await customFetch(`books/${id}`, {
        method: "PUT",
        body: { restore: true }
      });
      getAllBooks();
    } catch (err) {
      error = err
    }

  };

  const toggleDeleted = () => {
    showDeleted = !showDeleted;
    getAllBooks();
  };
  const clearError = () => (error = null);

  onMount(() => getAllBooks());
</script>

{#if error}
  <Error message={error.msg} on:cancel={clearError} />
{/if}

{#if loaded}
  <button on:click={toggleDeleted}>toggle deleted</button>
  <a href="/#/books/new">Add new</a>
  <Table
    headers={[{ name: 'id', sortable: true }, 'owner', { name: 'name', sortable: true }, { name: 'genre', sortable: true }, { name: 'created_at', sortable: true }, { name: 'actions', col: 2 }]}
    pagination={showPagination}
    {sortBy}
    on:changesort={getAllBooksSort}>
    <tbody slot="body">

      {#each books as book}
        <tr>
          <td>{book.id}</td>
          <td>{book.owner.name}</td>
          <td>{book.name}</td>
          <td>{book.genre}</td>
          <td>{book.created_at}</td>
          <td>
            {#if book.deleted_at}
              <button
                on:click={() => {
                  restoreBook(book.id);
                }}>
                restore
              </button>
            {:else}
              <a href={`/#/books/${book.id}`}>edit</a>
            {/if}
          </td>
          <td>
            <button
              on:click={() => {
                deleteBook(book.id);
              }}>
              delete
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
    <tfoot slot="pagination">
      <tr>
        <Pagination {pagination} on:switchpage={getAllBooksPagination} />
      </tr>
    </tfoot>
  </Table>
{:else}
  <LoadingSpinner />
{/if}
