import { bookApi } from "../../api/booking";
import { roleAuthApi } from "../../api/me";
import { showToast } from "../../constants/toastify";
import { Booking } from "../../interface/booking";

export class SupplierBookingActions {
  static supplierBooking: () => void = async () => {
    const role = await roleAuthApi.getMe();

    if (role.role[0] != "supplier") {
      showToast("access denied", 2000, "red");
      window.location.href = "";
    }

    let currentPage = 1;
    const limit = 6;
    let currentBookings: Booking[] = [];
    let totalPages = 1;

    const init = async (page = 1) => {
      try {
        currentPage = page;
        const data = {
          page: currentPage,
          limit,
        };
        const response = await bookApi.get(data);
        console.log("response", response);

        totalPages = response.bookings.totalPages;
        currentBookings = response.bookings.data;

        await renderContent(currentBookings);
        updatePagination(totalPages);
      } catch (err) {
        console.log("err", err);
      }
    };

    function renderContent(bookings: Booking[]) {
      const container = document.getElementById(
        "dynamic-content"
      ) as HTMLDivElement;
      container.innerHTML = "";

      console.log("bookings", bookings);

      if (bookings.length === 0) {
        container.innerHTML = "<p>No bookings found</p>";
        window.location.href = "#/supplier/dashboard/";
        showToast("No bookings found", 2000, "red");
        return;
      }

      bookings.forEach((item) => {
        const content = `
          <div class="bg-orange-50 mx-auto text-left w-[20rem] shad rounded-md p-6">
            <h1 class="font-semibold text-2xl text-orange-800">${item.contactName}</h1>
            <div class="flex justify-between">
              <div class="mt-2 text-sm">
                <span class="text-gray-400 ">${item.contactAddress}</span>
                <span class="text-gray-400">${item.bookedDate}</span>
                <p class="text-gray-400">${item.phoneNumber}</p>
              </div>
              <div>
                <h1 class="border border-blue-800 rounded-lg text-[white] bg-[#13344C] inline-block mx-2 my-2 py-2 px-3">
                  ${item.serviceToCompany.service.name}
                </h1>
              </div>
            </div>
            <p class="py-2 h-16">${item.specialInstructions}</p>
            <div class="flex justify-between">
              <button
                class="accept-btn px-4 my-4 lg:my-0 rounded-full bg-blue-400 text-white py-3 border border-[blue] hover:ring-2 hover:ring-blue-500 hover:border-transparent transition duration-300"
                data-id="${item.id}"
              >
                Accept
              </button>
              <button
                class="reject-btn px-4 my-4 lg:my-0 rounded-full py-3 border border-[red] bg-[#FEEDF0] text-[red] hover:ring-2 hover:ring-red-500 hover:border-transparent transition duration-300"
                data-id="${item.id}"
              >
                Reject
              </button>
            </div>
          </div>
        `;
        container.insertAdjacentHTML("beforeend", content);
      });

      document.querySelectorAll(".accept-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
          const target = event.target as HTMLButtonElement;
          const id = target.getAttribute("data-id");
          handleAccept(id);
        });
      });

      document.querySelectorAll(".reject-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
          const target = event.target as HTMLButtonElement;
          const id = target.getAttribute("data-id");
          handleReject(id);
        });
      });
    }

    async function handleAccept(id: string | null) {
      if (id == null) {
        showToast("Something went wrong", 2000, "red");
        return;
      } else {
        try {
          await bookApi.updateStatus(Number(id), { isApproved: true });
          showToast(
            "Booking confirmed. Please contact the client now!",
            3000,
            "green"
          );
          // Update the currentBookings and re-render without re-fetching
          currentBookings = currentBookings.filter(
            (booking) => booking.id !== Number(id)
          );
          renderContent(currentBookings);
        } catch (err) {
          console.log("error", err);
        }
      }
    }

    async function handleReject(id: string | null) {
      if (id == null) {
        showToast("Something went wrong", 2000, "red");
        return;
      } else {
        try {
          await bookApi.updateStatus(Number(id), { isApproved: false });
          showToast("Booking rejected successfully", 3000, "green");
          // Update the currentBookings and re-render without re-fetching
          currentBookings = currentBookings.filter(
            (booking) => booking.id !== Number(id)
          );
          renderContent(currentBookings);
        } catch (err) {
          console.log("error", err);
        }
      }
    }

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

    init();
  };
}
