import { showToast } from "../../constants/toastify";

export class SupplierDashboardActions {
  static supplierDashboard: () => void = async () => {
    const userProfile: HTMLButtonElement = document.getElementById(
      "user-button"
    ) as HTMLButtonElement;

    const logout = document.getElementById("logout") as HTMLButtonElement;

    logout.onclick = () => {
      window.location.href = "#/";
      localStorage.clear();
      showToast("logged out successfully", 2000, "green");
    };

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
  };
}
