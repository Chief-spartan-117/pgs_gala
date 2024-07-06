<script>
  // @ts-ignore
  import WiCloudUp from "svelte-icons/wi/WiCloudUp.svelte";
  import MdError from "svelte-icons/md/MdError.svelte";
  import MdCheckCircle from "svelte-icons/md/MdCheckCircle.svelte";
  import background from "../assets/gala_background.png";

  import "@egjs/svelte-flicking/dist/flicking.css";
  import Flicking, { FlickingPanel } from "@egjs/svelte-flicking";
  import { Arrow } from "@egjs/flicking-plugins";
  import galaLogo from "../assets/img/logo.png";
  import asip from "../assets/asip.png";
  import axios from "axios";
  // import axios from "axios";
  let file;
  let rollNo;
  let email;
  let firstName;
  let lastName;
  let faculty;
  let phoneNumber;
  let root;
  let base64String = "";
  let paymentOptions;
  let flicking;
  let slideNumber = 0;
  let emailDomain;
  let timeout_val = 0;
  let responseMessage = {};
  let showResponseMessage = false;

  // @ts-ignore
  const plugins = [new Arrow()];

  let fileName = "No File Selected";

  async function getUserInfo() {
    if (timeout_val == 0) {
      timeout_val = 1;
      setTimeout(async () => {
        const formData = new FormData();
        formData.append("rollNo", `BN${rollNo}`);
        try {
          const response = await axios.post(
            "https://gala.presidential.edu.np/user-details",
            formData,
          );
          const user_data = response.data;
          firstName = user_data.firstName;
          lastName = user_data.lastName;
          faculty = user_data.faculty;
        } catch (error) {
          console.log(error);
        }

        timeout_val = 0;
      }, 500);
    }
  }

  async function submitForm(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("paymentSlip", file);
    formData.append("rollNo", `BN${rollNo}`);
    formData.append("email", `${email.trim()}${emailDomain}`);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("faculty", faculty);
    formData.append("phoneNumber", phoneNumber);
    formData.append("paymentMethod", paymentOptions);

    // const response = await axios.post(
    //   "http://localhost:3000/register?eventId=1",
    //   formData,
    //   {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   },
    // );
    // console.log(response.data);
    try {
      const response = await fetch("http://localhost:3000/register?eventId=1", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        responseMessage = responseData;
        console.log("User Registered Successfully", responseMessage);
      } else {
        const errorData = await response.json();
        responseMessage = errorData;
        console.error("File upload failed", responseMessage);
      }
      // console.log(responseMessage);
    } catch (error) {
      console.error(error);
      responseMessage = "An unexpected error occurred.";
    }
    // finally {
    //   showResponseMessage = true;
    //   setTimeout(() => {
    //     showResponseMessage = false;
    //   }, 2000);
    // }
    console.log(responseMessage);
  }

  function fileUpload(event) {
    file = event.target.files[0];
    if (!file) {
      return;
    }
    if (
      file.type.split("/")[0] === "image" ||
      file.type === "application/pdf"
    ) {
      fileName = file.name;
      const reader = new FileReader();
      reader.onload = function (e) {
        // @ts-ignore
        base64String = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      console.log("Invalid File type");
    }
  }
  function change_payment() {
    console.log(paymentOptions);
  }

  function showMessage() {
    showResponseMessage = true;
    setTimeout(() => {
      showResponseMessage = false;
    }, 5000);
  }
</script>

<svelte:head>
  <title
    >Register | Unforgettable Evening at the Gala - Elegance, Entertainment &
    Auctions</title
  >
</svelte:head>

{#if responseMessage}
  {#if responseMessage.status === "Fail" || responseMessage.status === "Error"}
    <!-- {showMessage()} -->
    <div
      class="absolute left-1/2 top-10 z-10 flex -translate-x-1/2 flex-row items-center gap-x-2 rounded-md border-b-4 border-red-800 bg-red-300 px-4 py-2"
    >
      <div class="w-6 text-red-600">
        <MdError></MdError>
      </div>
      <p class="text-red-800">
        {responseMessage.message}
      </p>
    </div>
  {:else if responseMessage.status === "success"}
    <!-- {showMessage()} -->
    <div
      class="absolute left-1/2 top-10 z-10 flex -translate-x-1/2 flex-row items-center gap-x-2 rounded-md border-b-4 border-green-800 bg-green-300 px-4 py-2"
    >
      <div class="w-6 text-green-600">
        <MdCheckCircle></MdCheckCircle>
      </div>
      <p class="text-green-800">
        {responseMessage.message}
      </p>
    </div>
  {/if}
{/if}

<div
  class="h-screen w-screen"
  style="background-color: #05103A; overflow: hidden;"
>
  <div
    class="flex h-full w-full items-center justify-center"
    style="background: url({background}); background-size: cover; background-position: center; display: flex; flex-direction: column;"
  >
    <div
      class="max-md:2 w-[32rem] rounded-2xl bg-blue-950 px-8 py-6 shadow-[0_0_2rem_0.5rem_rgba(0,0,0,0.05)] max-sm:w-full max-sm:px-3"
    >
        <h1 class="mb-8 mt-2 text-center text-3xl font-bold text-white">
          Registration Form
        </h1>
      <form
        enctype="multipart/form-data"
        on:submit={submitForm}
        class="flex flex-col gap-y-6 "
      >
        <Flicking
          bind:this={flicking}
          options={{
            panelsPerView: 1,
            circular: false,
            align: "next",
            inputType: [],
          }}
        >
          <FlickingPanel>
            <div class="flex flex-col gap-y-4 text-center">
              <label for="paymentOptions" class="flex flex-col gap-2">
                <p class="text-white">Choose Your Payment Options</p>
                <select
                  class="rounded-lg border border-slate-200 px-2 py-2"
                  bind:value={paymentOptions}
                  on:change={() => {
                    change_payment();
                  }}
                >
                  <option value="Esewa">Pay With Esewa</option>
                  <option value="Cash">Pay With Cash</option>
                </select>
              </label>
              {#if paymentOptions == "Esewa"}
                <div class="flex justify-center">
                  <img src={asip} class="w-full sm:w-72" alt="" srcset="" />
                </div>
                <div>
                  <label
                    for="payment"
                    class=" relative flex h-36 flex-auto cursor-pointer items-center justify-center rounded-2xl border border-dashed border-orange-400 bg-slate-50/15"
                    on:dragover|preventDefault
                    on:drop|preventDefault={(e) => fileUpload(e)}
                  >
                    <div
                      class=" absolute h-36 w-full rounded-xl opacity-60"
                      style="background-image: url({base64String}); background-position: center; background-size: cover; background-repeat: no-repeat;"
                    ></div>
                    <input
                      class="payment absolute top-0 cursor-pointer"
                      type="file"
                      name="file"
                      id="payment"
                      accept="image/*,.pdf"
                      on:change={fileUpload}
                      hidden
                      bind:this={root}
                    />
                    <div class="h-8 w-8 text-white">
                      <WiCloudUp />
                    </div>
                    <p class="text-white">Upload Payment Screenshot</p>
                  </label>
                  <div><h6 class="text-white">{fileName}</h6></div>
                </div>
              {:else}
                <div>
                  <img src={galaLogo} alt="Logo" class="w-full" />
                </div>
              {/if}
            </div>
          </FlickingPanel>
          <FlickingPanel>
            <div class="flex h-full flex-col justify-center gap-y-4 px-2 py-2">
              <div class="flex flex-row justify-between gap-4 max-md:flex-col">
                <!-- Roll no -->
                <div
                  class="flex flex-auto flex-row items-center rounded-xl border border-slate-300 bg-slate-50 px-1 py-1 focus-within:border-transparent focus-within:outline focus-within:outline-2 focus-within:outline-orange-200"
                >
                  <div
                    class=" mr-1 h-auto w-auto rounded-lg border-2 border-slate-300 px-4 py-2"
                  >
                    BN
                  </div>

                  <input
                    type="number"
                    name="rollNo"
                    id="rollNo"
                    bind:value={rollNo}
                    on:input={() => getUserInfo()}
                    placeholder="Roll No"
                    class="scroll-remove flex-auto rounded-xl px-2 py-2 focus-visible:outline-transparent"
                  />
                </div>
                <!-- Roll No -->
                <select
                  name="faculty"
                  id="faculty"
                  bind:value={faculty}
                  disabled
                  class="flex-auto rounded-xl border border-slate-300 px-3 py-3 focus-within:outline-orange-200"
                >
                  <option value="BSIT" selected>BSIT</option>
                  <option value="BBA">BBA</option>
                  <option value="MSIT">MSIT</option>
                  <option value="MBA">MBA</option>
                </select>
              </div>

              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="First Name"
                bind:value={firstName}
                disabled
                class="rounded-xl border border-slate-300 px-3 py-3 focus-within:outline-orange-200"
              />
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Last Name"
                bind:value={lastName}
                disabled
                class="rounded-xl border border-slate-300 px-3 py-3 focus-within:outline-orange-200"
              />
              <div
                class="flex flex-row items-center rounded-xl border border-slate-300 bg-slate-50 px-1 py-1 focus-within:border-transparent focus-within:outline focus-within:outline-2 focus-within:outline-orange-200 max-sm:flex-col"
              >
                <input
                  type="text"
                  name="email"
                  bind:value={email}
                  placeholder="Email"
                  class="flex-auto rounded-xl px-2 py-2 focus-visible:outline-transparent max-sm:w-full"
                />
                <!-- <div
                class=" h-auto w-auto rounded-lg border border-slate-300 px-4 py-2"
              > -->
                <select
                  name="faculty"
                  id="faculty"
                  bind:value={emailDomain}
                  class="flex-auto rounded-lg border-2 border-slate-300 px-3 py-2 focus-within:outline-orange-200 max-sm:w-full"
                >
                  <option value="@westcliff.edu">@westcliff.edu</option>
                  <option value="@gmail.com">@gmail.com</option>
                </select>
                <!-- </div> -->
              </div>
              <div
                class="flex flex-row items-center rounded-xl border border-slate-300 bg-slate-50 px-1 py-1 focus-within:border-transparent focus-within:outline focus-within:outline-2 focus-within:outline-orange-200"
              >
                <div
                  class="mr-1 h-auto w-auto rounded-lg border-2 border-slate-300 px-4 py-2"
                >
                  +977
                </div>
                <input
                  type="number"
                  name="phoneNumber"
                  id="phoneNumber"
                  placeholder="Phone Number"
                  bind:value={phoneNumber}
                  class=" scroll-remove flex-auto rounded-xl px-2 py-2 focus-visible:outline-transparent"
                />
              </div>
            </div>
          </FlickingPanel>
        </Flicking>

        {#if slideNumber === 0}
          <button
            disabled={paymentOptions === "Esewa" && base64String == ""}
            class="w-full rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-500 {paymentOptions ===
              'Esewa' && base64String == ''
              ? 'cursor-not-allowed'
              : ''}"
            on:click={() => {
              flicking.next();
              slideNumber = 1;
            }}
            >{paymentOptions === "Esewa" && base64String == ""
              ? "Upload Screenshot to Unlock"
              : "Next"}</button
          >
        {:else}
          <button
            type="submit"
            class="w-full rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-500"
            >Register Now</button
          >
        {/if}
      </form>
    </div>
  </div>
</div>

<style>
  .scroll-remove::-webkit-outer-spin-button,
  .scroll-remove::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }
  .scroll-remove {
    appearance: none;
  }
</style>
