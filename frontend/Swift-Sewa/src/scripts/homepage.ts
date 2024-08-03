export class HomePageActions {
  static homepage: () => void = () => {
    const navbarMenu: HTMLButtonElement =
      document.querySelector(".navbar-burger")!;

    navbarMenu.onclick = () => {
      let dropdowns = document.querySelector(".dropdown-menu") as any;

      console.log("dropdowm", dropdowns);

      if (dropdowns.classList.contains("hidden")) {
        dropdowns.classList.remove("hidden");
      } else {
        dropdowns.classList.add("hidden");
      }
    };
  };
}
