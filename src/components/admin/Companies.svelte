<script>
  import { onMount } from "svelte";
  import { customFetch } from "../../utils/helpers";
  // import config from "../../config";
  import Table from "../../UI/Table.svelte";
  import Pagination from "../../UI/Pagination.svelte";
  import LoadingSpinner from "../../UI/LoadingSpinner.svelte";
  // import EditCompany from "./EditCompany.svelte";
  let loaded = false;
  let errors = "";
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
        `books?sort=${action.sort.dir == "desc" ? "-" : ""}${
          action.sort.name
        }${showDeleted ? "&deleted=true" : ""}`
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

  const deleteCompany = async id => {
    if (
      window.confirm(`Are you sure you want to delete company with id:${id}`)
    ) {
      await customFetch(`books/${id}`, {
        method: "DELETE"
      });

      getAllBooks();
    }
  };
  const restoreCompany = async id => {
    await customFetch(`books/${id}`, {
      method: "PUT",
      body: { deleted: false }
    });

    getAllBooks();
  };

  const toggleDeleted = () => {
    showDeleted = !showDeleted;
    getAllBooks();
  };

  onMount(() => getAllBooks());
</script>

{#if loaded}
  <button on:click={toggleDeleted}>toggle deleted</button>
  <Table
    headers={["owner",{ name: 'name', sortable: true }, { name: 'email', sortable: true }, { name: 'created_at', sortable: true }, { name: 'actions', col: 2 }]}
    pagination={showPagination}
    {sortBy}
    on:changesort={getAllBooksSort}>
    <tbody slot="body">

      {#each books as company}
        <tr>
          <!-- <td>
            <img
              src={`${config.imageUrl}${company.photo}`}
              alt=""
              height="50"
              width="50" />
          </td> -->
          <td>{company.owner.name}</td>
          <td>{company.name}</td>
          <td>{company.email}</td>
          <!-- <td>{company.location.formattedAddress}</td> -->
          <!-- <td>{company.jobs.length}</td> -->
          <td>{company.created_at}</td>
          <td>
            {#if company.deleted}
              <button
                on:click={() => {
                  restoreCompany(company._id);
                }}>
                restore
              </button>
            {:else}
              <a href={`/#/admin/books/${company._id}`}>edit</a>
            {/if}
          </td>
          <td>
            <button
              on:click={() => {
                deleteCompany(company._id);
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
