import { adminApi } from "../../api/admin";
import { showToast } from "../../constants/toastify";
import { User } from "../../interface/user";

export class AdminDashboardUsers {
  static adminDashboardUsers: () => void = async () => {
    let currentPage = 1;
    const limit = 5;

    const verifyCompanies = document.getElementById(
      "verifyCompanies"
    ) as HTMLButtonElement;
    const logout = document.getElementById("logout") as HTMLParagraphElement;

    logout.onclick = () => {
      window.location.href = "#";
      localStorage.clear();
    };

    verifyCompanies.onclick = () => {
      window.location.href = "#/admin/companies/pending/";
    };

    try {
      async function init(page = 1) {
        currentPage = page;
        const data = {
          page: currentPage,
          limit,
        };

        const response = await adminApi.getAllUsers(data);
        const {
          message: {
            data: users,
            totalPages,
            currentPage: current,
            pageSize,
            totalItems,
          },
        } = response;

        await renderTable(users);
        updatePagination(totalPages);
      }

      init();

      function updatePagination(totalPages: number) {
        const paginationElement = document.getElementById(
          "pagination"
        ) as HTMLDivElement;
        if (paginationElement) {
          const pagination = paginationElement.querySelector(
            "ul"
          ) as HTMLUListElement;
          pagination.innerHTML = `
            <li>
              <p onclick="previousPage()" class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                <span class="sr-only">Previous</span>
                <svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
                </svg>
              </p>
            </li>
          `;

          for (let i = 1; i <= totalPages; i++) {
            pagination.innerHTML += `
              <li>
                <p onclick="gotoPage(${i})" class="flex items-center justify-center px-3 h-8 leading-tight ${
              i === currentPage
                ? "text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            } dark:border-gray-700 ${
              i === currentPage
                ? "dark:bg-gray-700 dark:text-white"
                : "dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            }">${i}</p>
              </li>
            `;
          }

          pagination.innerHTML += `
            <li>
              <p onclick="nextPage()" class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                <span class="sr-only">Next</span>
                <svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                </svg>
              </p>
            </li>
          `;
        }
      }

      function previousPage() {
        if (currentPage > 1) {
          currentPage--;
          init(currentPage);
        }
      }

      function nextPage() {
        const totalPages =
          document.querySelectorAll("#pagination ul li").length - 2;
        if (currentPage < totalPages) {
          currentPage++;
          init(currentPage);
        }
      }

      function gotoPage(page: number) {
        currentPage = page;
        init(currentPage);
      }

      window.previousPage = previousPage;
      window.nextPage = nextPage;
      window.gotoPage = gotoPage;

      async function renderTable(users: User[]) {
        const usersTableData = document.getElementById(
          "userTableBody"
        ) as HTMLTableElement;

        console.log("users", users);

        usersTableData.innerHTML = "";

        users.forEach((user) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="border px-4 py-2 text-center">${user.id}</td>
            <td class="border px-4 py-2 text-center">${user.profile.name}</td>
            <td class="border px-4 py-2 text-center">${user.email}</td>
            <td class="border px-4 py-2 text-center">
              <button class="delete-button text-red-500" data-user-id="${user.id}">Delete</button>
            </td>
          `;
          usersTableData.appendChild(row);
        });

        usersTableData.addEventListener("click", async (event) => {
          const target = event.target as HTMLElement;
          const deleteButton = target.closest(".delete-button");
          if (deleteButton) {
            const userId = deleteButton.getAttribute("data-user-id");
            if (userId) {
              const deletedStatus = await adminApi.deleteUser(Number(userId));
              if (deletedStatus === 204) {
                showToast("User deleted successfully", 3000, "green");
                removeTableRow(userId);
              } else {
                showToast("User deletion failed", 3000, "red");
              }
            }
          }
        });
      }

      function removeTableRow(userId: string) {
        const row = document
          .querySelector(`button[data-user-id="${userId}"]`)
          ?.closest("tr");
        if (row) {
          row.remove();
        }
      }
    } catch (err) {
      console.log("err", err);
    }
  };
}
