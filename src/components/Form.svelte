<script>
  // @ts-ignore
  import WiCloudUp from "svelte-icons/wi/WiCloudUp.svelte";
  import "@egjs/svelte-flicking/dist/flicking.css";
  import Flicking, { FlickingPanel } from "@egjs/svelte-flicking";
  import { Arrow } from "@egjs/flicking-plugins";
  import galaLogo from "../assets/img/logo.png";
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

  // @ts-ignore
  const plugins = [new Arrow()];

  let fileName = "No File Selected";
  async function submitForm(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("paymentSlip", file);
    formData.append("rollNo", rollNo);
    formData.append("email", `${email.trim()}@westcliff.edu`);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("faculty", faculty);
    formData.append("phoneNumber", phoneNumber);

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
    const response = await fetch("/register", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log("File uploaded successfully");
    } else {
      console.error("File upload failed");
    }
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
</script>

<svelte:head>
  <title
    >Register | Unforgettable Evening at the Gala - Elegance, Entertainment &
    Auctions</title
  >
</svelte:head>

<div class="item-center flex justify-center sm:my-8 md:my-12">
  <div
    class="w-[32rem] rounded-2xl px-6 py-4 shadow-[0_0_2rem_0.5rem_rgba(0,0,0,0.05)] max-sm:w-full"
  >
    <div>
      <h1 class="mb-8 mt-2 text-center text-3xl font-bold">
        Registration Form
      </h1>
    </div>
    <form
      enctype="multipart/form-data"
      on:submit={submitForm}
      class="flex flex-col gap-y-6"
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
          <div class="flex flex-col gap-y-4">
            <label for="paymentOptions" class="flex flex-col gap-2">
              <p>Choose Your Payment Options</p>
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
              <div>
                <label
                  for="payment"
                  class=" relative flex h-36 flex-auto cursor-pointer items-center justify-center rounded-2xl border border-dashed border-orange-400 bg-slate-50"
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
                  <div class="h-8 w-8">
                    <WiCloudUp />
                  </div>
                  Upload Payment Screenshot
                </label>
                <div><h6>{fileName}</h6></div>
              </div>
            {:else}
              <div>
                <img src={galaLogo} alt="Logo" class="w-full" />
              </div>
            {/if}
          </div>
        </FlickingPanel>
        <FlickingPanel>
          <div class="flex h-full flex-col justify-end gap-y-4">
            <div class="flex flex-row justify-between gap-4 max-md:flex-col">
              <!-- Roll no -->
              <div
                class="flex flex-auto flex-row items-center rounded-xl border border-slate-300 px-1 py-1 focus-within:border-transparent focus-within:outline focus-within:outline-2 focus-within:outline-orange-200"
              >
                <div
                  class=" mr-1 h-auto w-auto rounded-lg border border-slate-300 px-4 py-2"
                >
                  BN
                </div>

                <input
                  type="number"
                  name="rollNo"
                  id="rollNo"
                  bind:value={rollNo}
                  placeholder="Roll No"
                  class="scroll-remove flex-auto rounded-xl px-2 py-2 focus-visible:outline-transparent"
                />
              </div>
              <!-- Roll No -->
              <select
                name="faculty"
                id="faculty"
                bind:value={faculty}
                class="flex-auto rounded-xl border border-slate-300 px-3 py-3 focus-within:outline-orange-200"
              >
                <option value="BSc.IT">BSc.IT</option>
                <option value="BBA">BBA</option>
                <option value="MSc.IT">MSc.IT</option>
                <option value="MBA">MBA</option>
              </select>
            </div>

            <div class="flex flex-row justify-between gap-4 max-md:flex-col">
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="First Name"
                bind:value={firstName}
                class="flex-auto rounded-xl border border-slate-300 px-3 py-3 focus-within:outline-orange-200"
              />
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Last Name"
                bind:value={lastName}
                class="flex-auto rounded-xl border border-slate-300 px-3 py-3 focus-within:outline-orange-200"
              />
            </div>
            <div
              class="flex flex-row items-center rounded-xl border border-slate-300 px-1 py-1 focus-within:border-transparent focus-within:outline focus-within:outline-2 focus-within:outline-orange-200"
            >
              <input
                type="text"
                name="email"
                bind:value={email}
                placeholder="Email"
                class="flex-auto rounded-xl px-2 py-2 focus-visible:outline-transparent"
              />
              <div
                class=" h-auto w-auto rounded-lg border border-slate-300 px-4 py-2"
              >
                @westcliff.edu
              </div>
            </div>
            <div
              class="flex flex-row items-center rounded-xl border border-slate-300 px-1 py-1 focus-within:border-transparent focus-within:outline focus-within:outline-2 focus-within:outline-orange-200"
            >
              <div
                class=" mr-1 h-auto w-auto rounded-lg border border-slate-300 px-4 py-2"
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
          class="w-full rounded-lg bg-orange-400 px-4 py-2 text-white hover:bg-orange-500 {paymentOptions ===
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
          class="w-full rounded-lg bg-orange-400 px-4 py-2 text-white hover:bg-orange-500"
          >Register Now</button
        >
      {/if}
    </form>
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
