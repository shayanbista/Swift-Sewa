import { bookApi } from "../../api/booking";
import { showToast } from "../../constants/toastify";
import { Booking } from "../../interface/booking";

export class SupplierBookingActions {
  static supplierBooking: () => void = async () => {
    const init = async () => {
      try {
        const response = await bookApi.get();
        console.log("reponse", response);

        await renderContent(response);
      } catch (err) {
        console.log("err", err);
      }
    };

    init();

    function renderContent(data: { bookings: Booking[] }) {
      const container = document.getElementById(
        "dynamic-content"
      ) as HTMLDivElement;

      container.innerHTML = "";

      data.bookings.forEach((item) => {
        const content = `
      <div class="bg-[white] mx-auto text-left w-[20rem] shad rounded-md p-6">
        <h1 class="font-semibold text-2xl">${item.contactName}</h1>
        <div class="flex justify-between">
          <div class="mt-2 text-sm">
            <span class="text-gray-400">${item.contactAddress}</span>
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

      // Add event listeners after rendering the content
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
        showToast("somethinn went wrong", 2000, "red");
        return;
      } else {
        try {
          const acceptBook = await bookApi.updateStatus(Number(id), {
            isApproved: true,
          });
          showToast(
            "booking confirmed please contact the client now!",
            3000,
            "green"
          );
          window.location.href = `#/supplier/bookings/`;
        } catch (err) {
          console.log("error", err);
        }
      }
    }

    async function handleReject(id: string | null) {
      if (id == null) {
        showToast("something went wrong", 2000, "red");
        return;
      } else {
        const rejectBook = await bookApi.updateStatus(Number(id), {
          isApproved: false,
        });
        window.location.href = `#/supplier/bookings/`;
        showToast("rejected succesfully", 3000, "green");
      }
    }
  };
}
