export class AdminDashboardActions {
  static adminDashboard: () => void = async () => {
    const closeButton = document.getElementById(
      "closeButton"
    ) as HTMLButtonElement;
    const hamburgerMenu = document.getElementById(
      "hamburgerMenu"
    ) as HTMLButtonElement;

    closeButton.onclick = () => toggleSidebar();
    hamburgerMenu.onclick = () => toggleSidebar();

    function toggleSidebar() {
      const sidebar = document.getElementById("sidebar") as HTMLElement;
      sidebar.classList.toggle("-translate-x-full");
    }

    const users = document.getElementById("users") as HTMLParagraphElement;
    console.log("users", users);

    users.onclick = () => {
      window.location.href = "#/admin/dashboard/users/";
    };
    const verifyCompanies = document.getElementById(
      "verifyCompanies"
    ) as HTMLButtonElement;

    verifyCompanies.onclick = () => {
      window.location.href = "#/admin/companies/pending/";
    };

    const logout = document.getElementById("logout") as HTMLParagraphElement;
    logout.onclick = () => {
      window.location.href = "#";
      localStorage.clear();
    };
  };
}
