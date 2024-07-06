<script>
  import { beforeUpdate, onMount } from "svelte";
  import { Router, Link, Route } from "svelte-routing";
  import galaLogo from "../assets/img/logo.png";
  import Form from "./Form.svelte";

  // let eventId;

  // onMount(() => {
  //   queryParams = new URLSearchParams(window.location.search);
  // });

  // function setQueryParam(param, value) {
  //   const url = new URL(window.location);
  //   url.searchParams.set(param, value);
  //   window.history.pushState({}, "", url);
  //   queryParams = new URLSearchParams(url.search);
  // }
  // beforeUpdate(() => {
  //   setQueryParam("eventId", "1");
  // });

  // function log() {
  //   alert("Hello");
  // }
</script>

<header
  class="mx-16 my-3 rounded-full border border-slate-200 px-2 py-2 max-md:mx-4 max-md:px-1 max-md:py-2 fixed top-0"
>
  <Router>
    <nav class="flex items-center justify-between gap-8 max-md:gap-4">
      <div>
        <a href="/">
          <img
            src={galaLogo}
            alt="PGS Gala Logo"
            class="ml-4 w-36 max-md:ml-1 max-md:w-24"
          />
        </a>
      </div>
      <div>
        <ul class="flex items-center gap-8 max-md:gap-2 max-md:text-sm">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <!-- <a
            href="/register"
            class="rounded-full bg-orange-400 px-6 py-3 font-bold text-white max-md:text-nowrap max-md:px-4 max-md:py-2"
            on:click={() => setQueryParam("eventId", "1")}>Register Now</a
          > -->

            <Link
              to="/register"
              class="rounded-full bg-orange-400 px-6 py-3 font-bold text-white max-md:text-nowrap max-md:px-4 max-md:py-2"
              >Register Now
            </Link>

            <Route path="/register"><Form></Form></Route>
          </li>
        </ul>
      </div>
    </nav>
  </Router>
</header>

<!-- <h1>Event Details</h1>
<p>Event ID: {eventId || "No Event ID Provided"}</p>

<button on:click={() => setQueryParam("eventId", "123")}
  >Set Event ID to 123</button
> -->
