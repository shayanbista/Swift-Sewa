import { adminApi } from "../../api/admin";
import { Company } from "../../interface/company";

export class AdminPendingCompanies {
  static pendingCompanies: () => void = async () => {
    const users = document.getElementById("users") as HTMLParagraphElement;
    users.onclick = () => {
      window.location.href = "#/admin/dashboard/users/";
    };

    const logout = document.getElementById("logout") as HTMLParagraphElement;
    logout.onclick = () => {
      window.location.href = "#";
      localStorage.clear();
    };
    try {
      async function init() {
        const pendingCompanies = await adminApi.getPendingCompanies();
        await renderPendingCompanies(pendingCompanies);
      }
      init();

      function renderPendingCompanies(pendingCompanies: Company[]) {
        const companiesList = document.getElementById(
          "companies-list"
        ) as HTMLDivElement;

        const companiesHTML = pendingCompanies
          .map((company) => {
            return `
          <div class="company-card flex items-center bg-white p-4 rounded-lg shadow hover:bg-[#FFEEC3] transition" data-id="${company.id}">
            <img src="${company.photo}" alt="${company.name} Logo" class="w-16 h-16 rounded-lg" />
            <div class="ml-4">
              <h2 class="text-lg font-bold">${company.name}</h2>
              <div class="flex items-center text-gray-500 text-sm">
                <i class="fa-solid fa-map-marker-alt mr-1"></i>
                <span>${company.location}</span>
              </div>
            </div>
          </div>
        `;
          })
          .join("");

        companiesList.innerHTML = companiesHTML;

        document.querySelectorAll(".company-card").forEach((card) => {
          card.addEventListener("click", (event) => {
            const target = event.target as Element;
            const div = target.closest(".company-card");
            const selectedId = div?.getAttribute("data-id");
            window.location.href = `#/admin/companies/verification/:${selectedId}`;
          });
        });
      }
    } catch (err) {
      console.log("err", err);
    }
  };
}
