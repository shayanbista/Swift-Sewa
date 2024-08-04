import { adminApi } from "../../api/admin";
import { userApi } from "../../api/user";
import { showToast } from "../../constants/toastify";
import { User } from "../../interface/user";

export class AdminDashboardUsers {
  static adminDashboardUsers: () => void = async () => {
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
      async function init() {
        const users = await userApi.getAll();
        await renderTable(users);
      }

      init();

      function renderTable(users: { message: User[] }) {
        const usersTableData = document.getElementById(
          "userTableBody"
        ) as HTMLTableElement;

        usersTableData.innerHTML = "";

        users.message.forEach((user) => {
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
