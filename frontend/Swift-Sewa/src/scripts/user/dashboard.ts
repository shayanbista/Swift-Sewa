import { AxiosError } from "axios";
import { categoryApi } from "../../api/categories";
import { serviceApi } from "../../api/services";
import { Category } from "../../interface/category";
import { showToast } from "../../constants/toastify";

export class UserDashboardActions {
  static userDashboard: () => void = async () => {
    const categories: string[] = [];
    const init = async () => {
      try {
        const categoryResponse = await categoryApi.get();

        const serviceResponse = await serviceApi.get();

        categories.push(
          ...categoryResponse.message.map((item: Category) => item.id)
        );
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log("Axios error:", err.response?.data.message);
        } else {
          console.log("err", err);
        }
      }
    };

    await init();

    const currentYear = document.getElementById("year")!;
    currentYear.textContent = new Date().getFullYear().toString();

    const logout = document.getElementById("logout") as HTMLButtonElement;
    console.log(logout);

    const userProfile: HTMLButtonElement = document.getElementById(
      "user-button"
    ) as HTMLButtonElement;

    const userName = document.getElementById("profile-name") as HTMLSpanElement;

    const selectedLocation = document.getElementById(
      "location"
    ) as HTMLSelectElement;

    const searchButton = document.getElementById(
      "search-button"
    ) as HTMLButtonElement;

    const query = document.getElementById("query-input") as HTMLInputElement;

    const category1 = document.getElementById("category1") as HTMLAnchorElement;
    category1.setAttribute("data-categoryId", categories[0]);

    const category2 = document.getElementById("category2") as HTMLAnchorElement;
    category2.setAttribute("data-categoryId", categories[1]);

    const category3 = document.getElementById("category3") as HTMLAnchorElement;
    category3.setAttribute("data-categoryId", categories[2]);

    const category4 = document.getElementById("category4") as HTMLAnchorElement;
    category4.setAttribute("data-categoryId", categories[3]);
    category1.onclick = handleCategoryClick;
    category2.onclick = handleCategoryClick;
    category3.onclick = handleCategoryClick;
    category4.onclick = handleCategoryClick;

    const service1 = document.getElementById("first-service") as HTMLDivElement;

    const service2 = document.getElementById(
      "second-service"
    ) as HTMLDivElement;

    const service3 = document.getElementById("third-service") as HTMLDivElement;

    const service4 = document.getElementById(
      "fourth-service"
    ) as HTMLDivElement;

    service1.onclick = () => {
      console.log("im clicked");
    };

    function handleCategoryClick(event: Event) {
      const target = event.currentTarget as HTMLAnchorElement;
      const categoryId = target.getAttribute("data-categoryId");
      target.href = `#/categories/:${categoryId}`;
      let location = localStorage.getItem("location");
      location = "Kathmandu";
    }

    const location = localStorage.getItem("location");
    if (location) {
      selectedLocation.value = location;
    } else {
      selectedLocation.value = "Kathmandu";
    }

    selectedLocation.addEventListener("change", function () {
      const selectedValue = selectedLocation.value;
      const location = localStorage.setItem("location", `${selectedValue}`);
    });

    searchButton.addEventListener("click", handleSearch);

    userProfile.onclick = () => {
      let dropdowns = document.querySelector(
        ".dropdown-menu"
      ) as HTMLDivElement;

      if (dropdowns.classList.contains("hidden")) {
        dropdowns.classList.remove("hidden");
      } else {
        dropdowns.classList.add("hidden");
      }
    };

    logout.onclick = () => {
      window.location.href = "#/";
      localStorage.clear();
      showToast("logged out successfully", 2000, "green");
    };

    async function handleSearch() {
      if (query.value.length < 0) {
        throw new Error("query is empty");
      }

      const searchedData = await serviceApi.getSearchedQuery(
        query.value,
        1,
        10
      );

      window.location.href = `/#/user/search?${query.value}`;
    }
  };
}
